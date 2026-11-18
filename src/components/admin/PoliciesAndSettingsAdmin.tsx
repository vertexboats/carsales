import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PoliciesAdmin: React.FC = () => {
  const { policies, setPolicies, addToast } = useApp();
  const [selectedId, setSelectedId] = useState(policies[0]?.id || '');
  const active = policies.find((p) => p.id === selectedId) || policies[0];

  const updateSectionBody = (secId: string, bodyEn: string) => {
    setPolicies((prev) =>
      prev.map((pol) =>
        pol.id === active.id
          ? {
              ...pol,
              lastUpdated: '2026-11-13',
              sections: pol.sections.map((s) => (s.id === secId ? { ...s, bodyEn } : s)),
            }
          : pol
      )
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 clay-card bg-white rounded-2xl border border-[#ECECEC] p-3.5 space-y-1.5">
        {policies.map((pol) => (
          <button
            key={pol.id}
            type="button"
            onClick={() => setSelectedId(pol.id)}
            className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              pol.id === active.id
                ? 'bg-[#FFF3EE] text-[#FF3600] shadow-xs'
                : 'text-[#616161] hover:bg-[#FAF9F5] hover:text-[#040401]'
            }`}
          >
            <div>{pol.titleEn}</div>
            <div className="text-[11px] font-normal text-[#8290A3] mt-0.5">
              {pol.version} · Updated {pol.lastUpdated}
            </div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-8 clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#ECECEC] pb-4">
          <h2 className="font-display font-bold text-base text-[#040401]">
            {active.titleEn} ({active.version})
          </h2>
          <button
            type="button"
            onClick={() => addToast({ type: 'success', title: `Saved ${active.titleEn}` })}
            className="clay-btn h-9 px-4 rounded-xl bg-[#FF3600] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#E03000]"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save changes</span>
          </button>
        </div>

        {active.sections.map((sec) => (
          <div key={sec.id} className="space-y-1.5">
            <label className="block text-xs font-bold text-[#040401]">{sec.headingEn}</label>
            <textarea
              rows={3}
              value={sec.bodyEn}
              onChange={(e) => updateSectionBody(sec.id, e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#616161] focus:outline-none focus:border-[#FF3600]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DealershipSettingsAdmin: React.FC = () => {
  const { dealership, setDealership, addToast } = useApp();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', title: 'Dealership settings saved' });
  };

  return (
    <form
      onSubmit={handleSave}
      className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 max-w-2xl space-y-5 text-xs"
    >
      <h2 className="font-display font-bold text-base text-[#040401]">
        Dealership Profile &amp; Regional Settings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-[#040401] mb-1.5">Dealership Name</label>
          <input
            type="text"
            value={dealership.name}
            onChange={(e) => setDealership({ ...dealership, name: e.target.value })}
            className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#040401] mb-1.5">Primary WhatsApp Number</label>
          <input
            type="text"
            value={dealership.whatsappNumber}
            onChange={(e) => setDealership({ ...dealership, whatsappNumber: e.target.value })}
            className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#040401] mb-1.5">Douala Address</label>
          <input
            type="text"
            value={dealership.addressDouala}
            onChange={(e) => setDealership({ ...dealership, addressDouala: e.target.value })}
            className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#040401] mb-1.5">Yaoundé Address</label>
          <input
            type="text"
            value={dealership.addressYaounde}
            onChange={(e) => setDealership({ ...dealership, addressYaounde: e.target.value })}
            className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#040401] mb-1.5">Currency</label>
          <input
            type="text"
            readOnly
            value={dealership.currency}
            className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] text-xs text-[#616161]"
          />
        </div>
        <div>
          <label className="block font-semibold text-[#040401] mb-1.5">Time Zone</label>
          <input
            type="text"
            readOnly
            value={dealership.timezone}
            className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] text-xs text-[#616161]"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="clay-btn h-10 px-6 rounded-xl bg-[#FF3600] hover:bg-[#E03000] text-white font-semibold cursor-pointer text-xs"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
};
