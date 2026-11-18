import React, { useState } from 'react';
import {
  AlertTriangle,
  Copy,
  Download,
  Edit2,
  ExternalLink,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AutomationRule, WhatsAppConnectionMode, WhatsAppTemplate } from '../../types/derico';
import { StatusBadge, StatusTicks } from '../common/StatusBadge';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const MessagingInboxAdmin: React.FC = () => {
  const {
    conversations,
    setConversations,
    waSettings,
    setAdminPage,
    openComposer,
    addToast,
  } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'needs_reply'>('all');
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  if (waSettings.mode === 'click_to_chat') {
    return (
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-10 text-center space-y-3">
        <WhatsAppIcon className="w-10 h-10 text-[#F59E0B] mx-auto" />
        <h2 className="font-display font-bold text-lg text-[#040401]">
          Inbox requires the WhatsApp API or BSP Provider
        </h2>
        <p className="text-sm text-[#616161] max-w-md mx-auto">
          You are currently in Click-to-chat mode. Use the Message Log or &ldquo;To send today&rdquo; queue, or switch to Meta Cloud API in Connection Settings.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setAdminPage('messaging-queue')}
            className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] text-white text-xs font-semibold cursor-pointer hover:bg-[#E03000]"
          >
            Open To send today
          </button>
          <button
            type="button"
            onClick={() => setAdminPage('messaging-connection')}
            className="clay-btn-white h-10 px-5 rounded-xl border border-[#ECECEC] text-[#040401] text-xs font-semibold cursor-pointer hover:bg-[#FFF8F6]"
          >
            Connection settings
          </button>
        </div>
      </div>
    );
  }

  const filtered = conversations.filter((c) => {
    if (filter === 'unread') return c.unread;
    if (filter === 'needs_reply') return c.needsReply;
    return true;
  });

  const active = conversations.find((c) => c.id === selectedId) || filtered[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !replyText.trim() || active.windowMinutesRemaining <= 0) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              unread: false,
              needsReply: false,
              messages: [
                ...c.messages,
                {
                  id: `cm-${Date.now()}`,
                  direction: 'out',
                  text: replyText.trim(),
                  timestamp: 'Just now',
                  status: 'delivered',
                },
              ],
            }
          : c
      )
    );
    setReplyText('');
    addToast({ type: 'success', title: `Replied to ${active.clientName}` });
  };

  return (
    <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
      {/* Left Conversation List */}
      <div className="lg:col-span-4 border-r border-[#ECECEC] flex flex-col">
        <div className="p-3.5 border-b border-[#ECECEC] flex gap-1.5 bg-[#FAF9F5]/40">
          {[
            { id: 'all' as const, label: 'All' },
            { id: 'unread' as const, label: 'Unread' },
            { id: 'needs_reply' as const, label: 'Needs reply' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                filter === f.id
                  ? 'bg-[#FF3600] text-white shadow-sm'
                  : 'text-[#616161] hover:bg-[#FFF8F6]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[#ECECEC] overflow-y-auto flex-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left p-4 hover:bg-[#FFF8F6] cursor-pointer transition-colors ${
                active?.id === c.id ? 'bg-[#FFF3EE]' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-xs text-[#040401]">{c.clientName}</span>
                {c.unread && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FF3600] text-white text-[10px] font-bold">
                    New
                  </span>
                )}
              </div>
              <div className="text-[11px] font-medium text-[#FF3600] mt-0.5">{c.linkedTag}</div>
              <div className="text-xs text-[#616161] line-clamp-1 mt-1">
                {c.messages[c.messages.length - 1]?.text}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center Chat Thread */}
      <div className="lg:col-span-5 border-r border-[#ECECEC] flex flex-col">
        {active ? (
          <>
            <div className="p-4 border-b border-[#ECECEC] flex items-center justify-between bg-white">
              <div>
                <div className="font-display font-bold text-sm text-[#040401]">
                  {active.clientName}
                </div>
                <div className="font-mono-num text-[11px] text-[#616161]">
                  {active.clientPhone}
                </div>
              </div>
              {active.windowMinutesRemaining > 0 ? (
                <span className="clay-pill px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#15803D] text-[11px] font-semibold">
                  24h window: {Math.floor(active.windowMinutesRemaining / 60)}h{' '}
                  {active.windowMinutesRemaining % 60}m
                </span>
              ) : (
                <span className="clay-pill px-2.5 py-1 rounded-full bg-[#F59E0B]/12 text-[#92400E] text-[11px] font-semibold">
                  Template only
                </span>
              )}
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#FAF9F5]">
              {active.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1 ${
                    m.direction === 'out'
                      ? 'ml-auto bg-[#FFF3EE] border border-[#FF3600]/20 text-[#040401] shadow-sm'
                      : 'bg-white border border-[#ECECEC] text-[#040401] shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-end gap-2 text-[10px] text-[#8290A3]">
                    <span>{m.timestamp}</span>
                    {m.status && <StatusTicks status={m.status} />}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="p-3.5 border-t border-[#ECECEC] flex gap-2 bg-white">
              {active.windowMinutesRemaining > 0 ? (
                <>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type WhatsApp reply..."
                    className="flex-1 h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs focus:outline-none focus:border-[#FF3600]"
                  />
                  <button
                    type="submit"
                    className="clay-btn h-10 px-4 rounded-xl bg-[#25D366] text-white text-xs font-semibold cursor-pointer hover:bg-[#20bd5a] flex items-center gap-1.5"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    openComposer({
                      recipientName: active.clientName,
                      recipientPhone: active.clientPhone,
                      linkedRecord: active.linkedTag,
                      windowMinutesRemaining: 0,
                    })
                  }
                  className="clay-btn w-full h-10 rounded-xl bg-[#040401] text-white text-xs font-semibold cursor-pointer hover:bg-[#1a1a16]"
                >
                  Outside 24h window — Send Approved Template
                </button>
              )}
            </form>
          </>
        ) : (
          <div className="p-8 text-center text-xs text-[#616161]">Select a conversation</div>
        )}
      </div>

      {/* Right Context Panel */}
      <div className="lg:col-span-3 p-5 space-y-4 bg-white">
        {active && (
          <>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8290A3]">
                Linked Context
              </div>
              <div className="text-xs font-semibold text-[#040401] mt-1">{active.linkedTag}</div>
            </div>
            <div className="space-y-2 pt-3 border-t border-[#ECECEC]">
              <button
                type="button"
                onClick={() => setAdminPage('rental-bookings')}
                className="clay-btn-white w-full h-9 rounded-xl border border-[#ECECEC] text-xs font-semibold text-[#040401] hover:bg-[#FFF8F6] cursor-pointer"
              >
                Open Bookings
              </button>
              <button
                type="button"
                onClick={() => setAdminPage('billing-invoices')}
                className="clay-btn w-full h-9 rounded-xl bg-[#FF3600] text-white text-xs font-semibold cursor-pointer hover:bg-[#E03000]"
              >
                Create Invoice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const MessagingTemplatesAdmin: React.FC = () => {
  const { templates, setTemplates, addToast } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [tName, setTName] = useState('custom_followup');
  const [tCat, setTCat] = useState<'Utility' | 'Marketing'>('Utility');
  const [tLang, setTLang] = useState<'EN' | 'FR'>('EN');
  const [tBody, setTBody] = useState(
    'Hello {{client_name}}, your Derico Motors update for {{car}} on {{date}} is ready.'
  );

  const handleSubmitTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const nt: WhatsAppTemplate = {
      id: `tpl-${Date.now()}`,
      name: tName.toLowerCase().replace(/\s+/g, '_'),
      category: tCat,
      language: tLang,
      status: 'Submitted',
      lastUsed: 'Never',
      body: tBody,
    };
    setTemplates((prev) => [nt, ...prev]);
    setCreateOpen(false);
    addToast({ type: 'success', title: `Template "${nt.name}" submitted for Meta approval` });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#E03000]"
        >
          <Plus className="w-4 h-4" />
          <span>Create template</span>
        </button>
      </div>

      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b border-[#ECECEC] bg-[#FAF9F5] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                <th className="py-3.5 px-4">Template Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Lang</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Preview / Rejection Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {templates.map((tpl) => (
                <tr key={tpl.id} className="hover:bg-[#FFF8F6] transition-colors">
                  <td className="py-3.5 px-4 font-mono-num font-semibold text-[#040401]">
                    {tpl.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#616161]">{tpl.category}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#040401]">{tpl.language}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={tpl.status} />
                  </td>
                  <td className="py-3.5 px-4 text-[#616161] max-w-md">
                    <div className="line-clamp-1">{tpl.body}</div>
                    {tpl.rejectionReason && (
                      <div className="text-[11px] text-[#DC2626] mt-0.5">
                        Reason: {tpl.rejectionReason}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitTemplate}
            className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 max-w-xl w-full space-y-4 shadow-2xl"
          >
            <h3 className="font-display font-bold text-base text-[#040401]">
              Create WhatsApp Template
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                placeholder="template_name"
                className="h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num focus:outline-none focus:border-[#FF3600]"
              />
              <select
                value={tCat}
                onChange={(e) => setTCat(e.target.value as 'Utility' | 'Marketing')}
                className="h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs focus:outline-none focus:border-[#FF3600]"
              >
                <option value="Utility">Utility</option>
                <option value="Marketing">Marketing</option>
              </select>
              <select
                value={tLang}
                onChange={(e) => setTLang(e.target.value as 'EN' | 'FR')}
                className="h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs focus:outline-none focus:border-[#FF3600]"
              >
                <option value="EN">EN</option>
                <option value="FR">FR</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['{{client_name}}', '{{car}}', '{{date}}', '{{amount}}'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTBody((p) => `${p} ${v}`)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFF3EE] text-[#FF3600] text-[11px] font-mono-num cursor-pointer hover:bg-[#FFE6DC]"
                >
                  + {v}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={tBody}
              onChange={(e) => setTBody(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#ECECEC] text-xs focus:outline-none focus:border-[#FF3600]"
            />
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#ECECEC] text-xs">
              <div className="font-semibold text-[#040401] mb-1">WhatsApp Bubble Preview</div>
              <div className="bg-white p-3.5 rounded-xl border border-[#ECECEC] text-[#040401]">
                {tBody
                  .replace('{{client_name}}', 'Marie Ngo Bassa')
                  .replace('{{car}}', '2019 Toyota Corolla')
                  .replace('{{date}}', '14 Nov 2026')
                  .replace('{{amount}}', '9 500 000 XAF')}
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="clay-btn-white h-9 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold cursor-pointer hover:bg-[#FFF8F6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clay-btn h-9 px-5 rounded-xl bg-[#FF3600] text-white text-xs font-semibold cursor-pointer hover:bg-[#E03000]"
              >
                Submit for approval
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const MessagingAutomationsAdmin: React.FC = () => {
  const { automations, setAutomations, templates, waSettings, setWaSettings, addToast } = useApp();
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  const toggleRule = (id: string) => {
    setAutomations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    addToast({ type: 'info', title: 'Automation rule updated' });
  };

  return (
    <div className="space-y-4">
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#040401]">Automation Dispatch Mode</div>
          <div className="text-xs text-[#616161]">
            Choose whether triggered WhatsApp templates send immediately or queue for admin approval.
          </div>
        </div>
        <div className="clay-dock flex items-center p-1 rounded-xl bg-[#FAF9F5] border border-[#ECECEC]">
          {(['Automatic', 'Manual approval first'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setWaSettings((prev) => ({ ...prev, automationMode: m }));
                addToast({ type: 'info', title: `Automation mode: ${m}` });
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                waSettings.automationMode === m
                  ? 'bg-[#040401] text-white shadow-sm'
                  : 'text-[#616161] hover:text-[#040401]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] divide-y divide-[#ECECEC] overflow-hidden">
        {automations.map((rule) => {
          const tpl = templates.find((t) => t.id === rule.templateId);
          return (
            <div
              key={rule.id}
              className="p-4.5 flex flex-wrap items-center justify-between gap-4 hover:bg-[#FFF8F6] transition-colors"
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[#040401]">{rule.name}</div>
                <div className="text-xs text-[#616161]">
                  <strong>{rule.trigger}</strong> → {rule.timing} → Template:{' '}
                  <span className="font-mono-num text-[#FF3600] font-medium">{tpl?.name}</span> → To:{' '}
                  <strong>{rule.recipient}</strong>
                </div>
                <div className="text-[11px] text-[#8290A3]">
                  Quiet hours: {rule.quietHoursStart}–{rule.quietHoursEnd} · {rule.languageRule}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRule(rule)}
                  className="p-2 rounded-lg hover:bg-white text-[#616161] hover:text-[#040401] cursor-pointer transition-colors"
                  title="Edit rule"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    rule.enabled ? 'bg-[#16A34A]' : 'bg-[#CBD5E1]'
                  }`}
                  aria-label={`Toggle ${rule.name}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingRule && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 space-y-4 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <h3 className="font-display font-bold text-base text-[#040401]">
                Edit Automation Rule
              </h3>
              <button type="button" onClick={() => setEditingRule(null)} className="cursor-pointer text-[#616161] hover:text-[#040401]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#040401] mb-1">Rule Name</label>
                <input
                  type="text"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] focus:outline-none focus:border-[#FF3600]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#040401] mb-1">Timing Offset</label>
                <input
                  type="text"
                  value={editingRule.timing}
                  onChange={(e) => setEditingRule({ ...editingRule, timing: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] focus:outline-none focus:border-[#FF3600]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#040401] mb-1">Language Rule</label>
                <select
                  value={editingRule.languageRule}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      languageRule: e.target.value as AutomationRule['languageRule'],
                    })
                  }
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white focus:outline-none focus:border-[#FF3600]"
                >
                  <option>Client preference</option>
                  <option>Default EN</option>
                  <option>Default FR</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAutomations((prev) =>
                    prev.map((r) => (r.id === editingRule.id ? editingRule : r))
                  );
                  setEditingRule(null);
                  addToast({ type: 'success', title: 'Automation rule saved' });
                }}
                className="clay-btn w-full h-10 rounded-xl bg-[#FF3600] text-white font-semibold cursor-pointer hover:bg-[#E03000] mt-4"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MessagingLogAdmin: React.FC = () => {
  const { messageLog, setMessageLog, addToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('');

  const failedCount = messageLog.filter((m) => m.status === 'failed').length;
  const filtered = messageLog.filter((m) => !statusFilter || m.status === statusFilter);

  const resendOne = (id: string) => {
    setMessageLog((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'sent', error: undefined } : m))
    );
    addToast({ type: 'success', title: 'Resent message via WhatsApp API' });
  };

  const retryAll = () => {
    setMessageLog((prev) =>
      prev.map((m) => (m.status === 'failed' ? { ...m, status: 'sent', error: undefined } : m))
    );
    addToast({ type: 'success', title: `Retried ${failedCount} failed message(s)` });
  };

  const exportCsv = () => {
    const csv = [
      'Timestamp,Recipient,Phone,Template,Record,Channel,Status',
      ...filtered.map(
        (m) =>
          `"${m.timestamp}","${m.recipientName}","${m.recipientPhone}",${m.templateName},${m.linkedRecord},"${m.channel}",${m.status}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'derico-whatsapp-log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {failedCount > 0 && (
        <div className="rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/25 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#B91C1C]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{failedCount} failed WhatsApp message(s) require attention.</span>
          </div>
          <button
            type="button"
            onClick={retryAll}
            className="clay-btn h-9 px-4 rounded-xl bg-[#DC2626] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#b91c1c]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry all</span>
          </button>
        </div>
      )}

      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['', 'sent', 'delivered', 'read', 'failed'].map((st) => (
            <button
              key={st || 'all'}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-[#040401] text-white shadow-sm'
                  : 'bg-[#FAF9F5] text-[#616161] hover:bg-[#FFF8F6]'
              }`}
            >
              {st || 'All statuses'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="clay-btn-white h-9 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-semibold text-[#040401] inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#FFF8F6]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#ECECEC] bg-[#FAF9F5] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                <th className="py-3.5 px-4">Time (WAT)</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Template</th>
                <th className="py-3.5 px-4">Record</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[#FFF8F6] transition-colors">
                  <td className="py-3.5 px-4 font-mono-num text-[#616161]">{m.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#040401]">{m.recipientName}</div>
                    <div className="font-mono-num text-[11px] text-[#616161]">{m.recipientPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono-num text-[#040401]">{m.templateName}</td>
                  <td className="py-3.5 px-4 font-mono-num text-[#FF3600] font-semibold">{m.linkedRecord}</td>
                  <td className="py-3.5 px-4 text-[#616161]">{m.channel}</td>
                  <td className="py-3.5 px-4">
                    <StatusTicks status={m.status} onResend={() => resendOne(m.id)} />
                    {m.error && (
                      <div className="text-[11px] text-[#DC2626] mt-0.5">{m.error}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ToSendTodayQueueAdmin: React.FC = () => {
  const { toSendQueue, setToSendQueue, addToast } = useApp();
  const remaining = toSendQueue.filter((q) => !q.sent).length;

  return (
    <div className="space-y-4">
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-5 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-base text-[#040401]">
            Click-to-Chat Queue: To Send Today
          </h2>
          <p className="text-xs text-[#616161]">
            Tap Open WhatsApp to launch prefilled messages directly from your phone or WhatsApp Web.
          </p>
        </div>
        <StatusBadge
          status={`${remaining} remaining`}
          toneOverride={remaining > 0 ? 'warning' : 'success'}
        />
      </div>

      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] divide-y divide-[#ECECEC] overflow-hidden">
        {toSendQueue.map((item) => (
          <div key={item.id} className="p-4.5 flex flex-wrap items-center justify-between gap-4 hover:bg-[#FFF8F6] transition-colors">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#040401]">{item.recipientName}</span>
                <span className="font-mono-num text-[#FF3600] font-semibold">{item.linkedRef}</span>
                <span className="text-[#8290A3]">· {item.dueTime}</span>
              </div>
              <p className="text-xs text-[#616161]">{item.messageText}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {item.sent ? (
                <StatusBadge status="Sent" toneOverride="success" />
              ) : (
                <>
                  <a
                    href={`https://wa.me/${item.recipientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      item.messageText
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn h-9 px-4 rounded-xl bg-[#25D366] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#20bd5a]"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setToSendQueue((prev) =>
                        prev.map((x) => (x.id === item.id ? { ...x, sent: true } : x))
                      );
                      addToast({ type: 'success', title: `Marked sent for ${item.recipientName}` });
                    }}
                    className="clay-btn-white h-9 px-3 rounded-xl border border-[#ECECEC] text-xs font-semibold text-[#040401] cursor-pointer hover:bg-[#FFF8F6]"
                  >
                    Mark as sent
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MessagingConnectionAdmin: React.FC = () => {
  const { waSettings, setWaSettings, sendWhatsAppLogEntry, addToast } = useApp();
  const [testNumber, setTestNumber] = useState('+237 6 90 12 45 00');

  const selectMode = (mode: WhatsAppConnectionMode) => {
    const nextStatus =
      mode === 'meta_api' || mode === 'bsp'
        ? 'Connected'
        : mode === 'click_to_chat'
        ? 'Limited'
        : 'Disconnected';
    setWaSettings((prev) => ({ ...prev, mode, connectionStatus: nextStatus }));
    addToast({ type: 'info', title: `Switched WhatsApp mode to ${mode.replace(/_/g, ' ')}` });
  };

  const toggleChecklist = (id: string) => {
    setWaSettings((prev) => ({
      ...prev,
      checklist: prev.checklist.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Verified' ? 'Pending' : 'Verified' }
          : c
      ),
    }));
  };

  const usagePct = Math.round((waSettings.dailyUsed / waSettings.dailyLimit) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Status Card */}
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge status={waSettings.connectionStatus} />
            <StatusBadge
              status={`Quality: ${waSettings.qualityRating}`}
              toneOverride={
                waSettings.qualityRating === 'High'
                  ? 'success'
                  : waSettings.qualityRating === 'Medium'
                  ? 'warning'
                  : 'error'
              }
            />
            <StatusBadge
              status={waSettings.verifiedBadge ? 'Verified Business' : 'Unverified'}
              toneOverride={waSettings.verifiedBadge ? 'info' : 'neutral'}
            />
          </div>
          <h2 className="font-display font-bold text-lg text-[#040401]">
            {waSettings.displayName} · <span className="font-mono-num">{waSettings.businessNumber}</span>
          </h2>
          <p className="text-xs text-[#616161]">
            Active channel: <strong className="text-[#040401]">{waSettings.mode.replace(/_/g, ' ').toUpperCase()}</strong>
          </p>
        </div>

        <div className="md:col-span-5 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#040401]">
            <span>Daily unique contacts meter</span>
            <span className="font-mono-num">
              {waSettings.dailyUsed} of {waSettings.dailyLimit} today
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#ECECEC] overflow-hidden">
            <div
              className="h-full bg-[#FF3600] rounded-full transition-all"
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Connection Method Radio Cards */}
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 space-y-5">
        <h3 className="font-display font-bold text-base text-[#040401]">
          Connection Method
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'meta_api' as const,
              title: 'A. Official WhatsApp API (Meta Cloud API)',
              desc: 'Direct Meta Cloud integration with webhook delivery ticks, 24h inbox, and automated templates.',
            },
            {
              id: 'bsp' as const,
              title: 'B. Through a Provider (BSP)',
              desc: 'Connect via 360dialog, Twilio, or Gupshup managed WhatsApp Business API.',
            },
            {
              id: 'click_to_chat' as const,
              title: 'C. Click-to-chat Mode (No Registration)',
              desc: 'Zero API setup required. Enables the "To send today" queue using wa.me links.',
            },
            {
              id: 'email_sms' as const,
              title: 'D. Email / SMS Backup',
              desc: 'Fallback notifications via Cameroon SMS gateway and SMTP email.',
            },
          ].map((opt) => {
            const active = waSettings.mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectMode(opt.id)}
                className={`text-left p-4.5 rounded-2xl border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#FFF3EE] border-[#FF3600] shadow-sm'
                    : 'bg-white border-[#ECECEC] hover:border-[#FF3600]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-sm text-[#040401]">
                    {opt.title}
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full border-2 ${
                      active ? 'border-[#FF3600] bg-[#FF3600]' : 'border-[#CBD5E1]'
                    }`}
                  />
                </div>
                <p className="text-xs text-[#616161] mt-1.5 leading-relaxed">{opt.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Mode-specific fields */}
        {waSettings.mode === 'meta_api' && (
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECECEC] grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-[#040401] mb-1">Business Account ID</label>
              <input
                type="text"
                value={waSettings.metaBusinessAccountId}
                onChange={(e) =>
                  setWaSettings((p) => ({ ...p, metaBusinessAccountId: e.target.value }))
                }
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white font-mono-num focus:outline-none focus:border-[#FF3600]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#040401] mb-1">Phone Number ID</label>
              <input
                type="text"
                value={waSettings.metaPhoneNumberId}
                onChange={(e) =>
                  setWaSettings((p) => ({ ...p, metaPhoneNumberId: e.target.value }))
                }
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white font-mono-num focus:outline-none focus:border-[#FF3600]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#040401] mb-1">Permanent Access Token</label>
              <input
                type="password"
                value={waSettings.metaAccessToken}
                onChange={(e) =>
                  setWaSettings((p) => ({ ...p, metaAccessToken: e.target.value }))
                }
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white font-mono-num focus:outline-none focus:border-[#FF3600]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#040401] mb-1">Webhook URL &amp; Verify Token</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={waSettings.webhookUrl}
                  className="flex-1 h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white font-mono-num"
                />
                <button
                  type="button"
                  onClick={() => addToast({ type: 'info', title: 'Copied Webhook URL' })}
                  className="clay-btn-white h-10 px-3 rounded-xl border border-[#ECECEC] bg-white cursor-pointer hover:bg-[#FFF8F6]"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="sm:col-span-2 flex justify-end pt-1">
              <button
                type="button"
                onClick={() =>
                  addToast({
                    type: 'success',
                    title: 'Meta Cloud API connection verified',
                    description: 'Webhook active · Graph v21.0',
                  })
                }
                className="clay-btn h-9 px-5 rounded-xl bg-[#040401] text-white font-semibold cursor-pointer hover:bg-[#1a1a16]"
              >
                Test connection
              </button>
            </div>
          </div>
        )}

        {waSettings.mode === 'bsp' && (
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECECEC] grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-[#040401] mb-1">BSP Provider</label>
              <select
                value={waSettings.bspProvider}
                onChange={(e) => setWaSettings((p) => ({ ...p, bspProvider: e.target.value }))}
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white focus:outline-none focus:border-[#FF3600]"
              >
                <option>360dialog</option>
                <option>Twilio</option>
                <option>Gupshup</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#040401] mb-1">Provider API Key</label>
              <input
                type="password"
                value={waSettings.bspApiKey}
                onChange={(e) => setWaSettings((p) => ({ ...p, bspApiKey: e.target.value }))}
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white font-mono-num focus:outline-none focus:border-[#FF3600]"
              />
            </div>
          </div>
        )}

        {waSettings.mode === 'email_sms' && (
          <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#ECECEC] grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-[#040401] mb-1">SMTP Host</label>
              <input
                type="text"
                value={waSettings.smtpHost}
                onChange={(e) => setWaSettings((p) => ({ ...p, smtpHost: e.target.value }))}
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white focus:outline-none focus:border-[#FF3600]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#040401] mb-1">SMS Provider</label>
              <input
                type="text"
                value={waSettings.smsProvider}
                onChange={(e) => setWaSettings((p) => ({ ...p, smsProvider: e.target.value }))}
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white focus:outline-none focus:border-[#FF3600]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Verification Checklist & 4. Fallback Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF3600]" />
            <h3 className="font-display font-bold text-base text-[#040401]">
              Meta Business Verification Checklist
            </h3>
          </div>
          <div className="divide-y divide-[#ECECEC]">
            {waSettings.checklist.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-[#040401]">{item.label}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={item.status} />
                  <button
                    type="button"
                    onClick={() => toggleChecklist(item.id)}
                    className="text-[#FF3600] font-semibold hover:underline cursor-pointer"
                  >
                    {item.status === 'Verified' ? 'Reset' : 'Mark done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 space-y-3">
            <h3 className="font-display font-bold text-base text-[#040401]">
              Fallback &amp; Compliance
            </h3>
            <p className="text-xs text-[#616161]">{waSettings.fallbackRule}</p>
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">
                Public Opt-in Consent Text (EN)
              </label>
              <textarea
                rows={2}
                value={waSettings.consentTextEn}
                onChange={(e) =>
                  setWaSettings((p) => ({ ...p, consentTextEn: e.target.value }))
                }
                className="w-full p-3 rounded-xl border border-[#ECECEC] text-xs focus:outline-none focus:border-[#FF3600]"
              />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-[#040401] mb-1">Opted-out Clients</div>
              {waSettings.optedOutClients.map((oc) => (
                <div key={oc.phone} className="text-[#616161] font-mono-num">
                  {oc.name} ({oc.phone}) — {oc.date}
                </div>
              ))}
            </div>
          </div>

          <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 space-y-3">
            <h3 className="font-display font-bold text-base text-[#040401]">
              Send Test Message
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                className="flex-1 h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num focus:outline-none focus:border-[#FF3600]"
              />
              <button
                type="button"
                onClick={() => {
                  sendWhatsAppLogEntry({
                    recipientName: 'Admin Test',
                    recipientPhone: testNumber,
                    templateName: 'hello_world_test',
                    linkedRecord: 'TEST',
                    channel: waSettings.mode === 'click_to_chat' ? 'Click-to-chat' : 'WhatsApp API',
                    status: 'delivered',
                    previewText: 'Derico Motors WhatsApp API test message delivered.',
                  });
                  addToast({
                    type: 'success',
                    title: 'Test message sent',
                    description: `Delivered to ${testNumber}`,
                  });
                }}
                className="clay-btn h-10 px-4 rounded-xl bg-[#25D366] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#20bd5a]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send test</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
