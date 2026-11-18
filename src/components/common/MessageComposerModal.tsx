import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  ExternalLink,
  FileText,
  Lock,
  Paperclip,
  Send,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusTicks } from './StatusBadge';
import { WhatsAppIcon } from './WhatsAppIcon';

export const MessageComposerModal: React.FC = () => {
  const {
    composer,
    closeComposer,
    templates,
    sendWhatsAppLogEntry,
    addToast,
    waSettings,
  } = useApp();

  const approvedTemplates = useMemo(
    () => templates.filter((t) => t.status === 'Approved'),
    [templates]
  );

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [freeText, setFreeText] = useState('');
  const [attachPdf, setAttachPdf] = useState(false);
  const [attachPhoto, setAttachPhoto] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('2026-11-14T09:00');
  const [sentPreview, setSentPreview] = useState<{ text: string; status: 'queued' | 'sent' | 'delivered' | 'read' } | null>(null);

  useEffect(() => {
    if (composer) {
      setRecipientName(composer.recipientName);
      setRecipientPhone(composer.recipientPhone);
      const firstId = composer.defaultTemplateId || approvedTemplates[0]?.id || '';
      setSelectedTemplateId(firstId);
      setFreeText('');
      setAttachPdf(Boolean(composer.attachmentLabel));
      setAttachPhoto(false);
      setScheduleMode(false);
      setSentPreview(null);
    }
  }, [composer, approvedTemplates]);

  if (!composer) return null;

  const windowMins = composer.windowMinutesRemaining ?? 0;
  const inside24hWindow = windowMins > 0;
  const windowLabel = inside24hWindow
    ? `Free text window: ${Math.floor(windowMins / 60)}h ${String(windowMins % 60).padStart(2, '0')}m left`
    : 'Outside 24-hour window: use an approved template';

  const activeTemplate = approvedTemplates.find((t) => t.id === selectedTemplateId);

  const resolveVariables = (raw: string): string => {
    const vars: Record<string, string> = {
      client_name: recipientName || 'Client',
      car: composer.variables?.car || 'Vehicle',
      date: composer.variables?.date || '2026-11-14',
      time: composer.variables?.time || '10:30',
      driver_name: composer.variables?.driver_name || 'Paul Mbarga',
      driver_phone: composer.variables?.driver_phone || '+237 677 45 10 21',
      amount: composer.variables?.amount || '95 000 XAF',
      invoice_link: composer.variables?.invoice_link || 'https://dericomotors.cm/inv/0001',
      ...composer.variables,
    };
    return raw.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] || `{{${k}}}`);
  };

  const composedMessage =
    inside24hWindow && freeText.trim().length > 0
      ? freeText.trim()
      : activeTemplate
      ? resolveVariables(activeTemplate.body)
      : freeText.trim();

  const waAppHref = `https://wa.me/${recipientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    composedMessage
  )}`;

  const handleSend = (scheduled: boolean) => {
    if (!composedMessage) return;
    const isClickToChat = waSettings.mode === 'click_to_chat';
    const nextStatus = scheduled ? 'queued' : isClickToChat ? 'sent' : 'delivered';
    sendWhatsAppLogEntry({
      recipientName,
      recipientPhone,
      templateName: inside24hWindow && freeText.trim() ? 'free_text_reply' : activeTemplate?.name || 'custom',
      linkedRecord: composer.linkedRecord,
      channel: isClickToChat ? 'Click-to-chat' : 'WhatsApp API',
      status: nextStatus,
      previewText: composedMessage,
    });
    setSentPreview({ text: composedMessage, status: nextStatus });
    addToast({
      type: 'success',
      title: scheduled ? 'WhatsApp message scheduled' : 'WhatsApp message sent',
      description: `${recipientName} (${recipientPhone})`,
    });
  };

  const variableChips = [
    '{{client_name}}',
    '{{car}}',
    '{{date}}',
    '{{time}}',
    '{{driver_name}}',
    '{{driver_phone}}',
    '{{amount}}',
    '{{invoice_link}}',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden clay-card">
        <div className="px-5 py-4 border-b border-[#ECECEC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/15 text-[#16A34A] flex items-center justify-center shadow-xs">
              <WhatsAppIcon className="w-5 h-5" color="#25D366" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#040401]">
                WhatsApp Message Composer
              </h2>
              <p className="text-xs text-[#616161]">
                Linked record: <span className="font-mono-num font-medium text-[#FF3600]">{composer.linkedRecord}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeComposer}
            className="w-9 h-9 rounded-full hover:bg-[#FFF3EE] flex items-center justify-center text-[#040401] cursor-pointer"
            aria-label="Close composer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">Recipient name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="dm-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">WhatsApp number</label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="dm-input font-mono-num"
              />
            </div>
          </div>

          {/* 24h Window indicator */}
          <div
            className={`px-3.5 py-2 rounded-2xl border text-xs font-medium flex items-center justify-between gap-2 ${
              inside24hWindow
                ? 'bg-[#16A34A]/10 border-[#16A34A]/20 text-[#16A34A]'
                : 'bg-[#F59E0B]/12 border-[#F59E0B]/25 text-[#92400E]'
            }`}
          >
            <span className="flex items-center gap-1.5 font-semibold">
              {!inside24hWindow && <Lock className="w-3.5 h-3.5 shrink-0" />}
              {windowLabel}
            </span>
            <span className="text-[11px] opacity-80">Meta 24h Rule</span>
          </div>

          {/* Template picker */}
          <div>
            <label className="block text-xs font-semibold text-[#040401] mb-1">
              Approved WhatsApp Template
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="dm-input"
            >
              {approvedTemplates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.language} · {tpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Auto-filled variable chips */}
          <div>
            <div className="text-xs font-semibold text-[#616161] mb-1.5">
              Auto-filled variable tokens (click to insert into free text if active)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {variableChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={!inside24hWindow}
                  onClick={() => setFreeText((prev) => `${prev}${prev ? ' ' : ''}${chip}`)}
                  className="clay-pill px-2.5 py-1 text-[#FF3600] text-[11px] font-mono-num hover:bg-[#FF3600] hover:text-white disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Free text area */}
          <div>
            <label className="block text-xs font-semibold text-[#040401] mb-1">
              Free text message {!inside24hWindow && '(Locked outside 24h customer window)'}
            </label>
            <textarea
              rows={3}
              disabled={!inside24hWindow}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder={
                inside24hWindow
                  ? 'Type a custom reply or leave empty to send the selected template...'
                  : 'Outside 24-hour window: use an approved template above.'
              }
              title={!inside24hWindow ? 'Outside 24-hour window: use a template.' : undefined}
              className="w-full p-3 rounded-2xl border border-[#ECECEC] text-sm text-[#040401] disabled:bg-[#FFF8F6] disabled:text-[#8290A3] focus:outline-none focus:border-[#FF3600]"
            />
          </div>

          {/* Live WhatsApp Bubble Preview */}
          <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC]">
            <div className="text-xs font-semibold text-[#040401] mb-2">Live Message Preview</div>
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-3.5 text-sm text-[#040401] leading-relaxed shadow-xs">
              {composedMessage}
              {attachPdf && (
                <div className="mt-2 pt-2 border-t border-[#ECECEC] flex items-center gap-1.5 text-xs text-[#FF3600] font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{composer.attachmentLabel || 'Document_Derico_Motors.pdf'}</span>
                </div>
              )}
              {attachPhoto && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#616161]">
                  <Paperclip className="w-3.5 h-3.5 text-[#FF3600]" />
                  <span>Vehicle_Showroom_Photo.jpg</span>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#616161]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attachPdf}
                onChange={(e) => setAttachPdf(e.target.checked)}
                className="rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
              />
              <span>Attach Invoice / Receipt PDF</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attachPhoto}
                onChange={(e) => setAttachPhoto(e.target.checked)}
                className="rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
              />
              <span>Attach Car Photo</span>
            </label>
          </div>

          {scheduleMode && (
            <div className="p-3.5 rounded-2xl bg-[#FFF3EE] border border-[#FF3600]/20 flex flex-wrap items-center gap-3">
              <label className="text-xs font-semibold text-[#040401]">Schedule send time (WAT):</label>
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-[#ECECEC] bg-white text-xs"
              />
              <button
                type="button"
                onClick={() => handleSend(true)}
                className="clay-btn h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          )}

          {sentPreview && (
            <div className="p-3.5 rounded-2xl bg-[#16A34A]/10 border border-[#16A34A]/20 flex items-center justify-between gap-3">
              <div className="text-xs text-[#040401]">
                <span className="font-semibold">Recorded in thread:</span> {sentPreview.text.slice(0, 72)}...
              </div>
              <StatusTicks status={sentPreview.status} />
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-[#ECECEC] bg-[#FFF8F6] flex flex-wrap items-center justify-between gap-2">
          <a
            href={waAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="clay-pill h-10 px-4 text-[#040401] text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Send via WhatsApp app</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScheduleMode((s) => !s)}
              className="clay-pill h-10 px-4 text-[#040401] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarClock className="w-3.5 h-3.5 text-[#FF3600]" />
              <span>Schedule</span>
            </button>
            <button
              type="button"
              onClick={() => handleSend(false)}
              className="clay-pill h-10 px-5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
