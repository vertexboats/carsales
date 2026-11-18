import React, { useState } from 'react';
import { Eye, FileText, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CtaTrioProps {
  prefilledMessage: string;
  onOpenForm: () => void;
  formLabel?: string;
  compact?: boolean;
}

export const CtaTrio: React.FC<CtaTrioProps> = ({
  prefilledMessage,
  onOpenForm,
  formLabel,
}) => {
  const { dealership, lang, addToast } = useApp();
  const t = translations[lang];
  const [showPreview, setShowPreview] = useState(false);

  const waHref = `https://wa.me/${dealership.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    prefilledMessage
  )}`;

  const handleCall = () => {
    addToast({
      type: 'info',
      title: `Calling ${dealership.phonePrimary}`,
      description: 'Tap-to-call dialer triggered on mobile devices.',
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow whitespace-nowrap clay-pill"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span>{t.common.whatsapp}</span>
        </a>

        <button
          type="button"
          onClick={onOpenForm}
          className="h-11 px-4 rounded-full clay-btn text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>{formLabel || t.common.requestForm}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <a
          href={`tel:${dealership.phonePrimary.replace(/\s+/g, '')}`}
          onClick={handleCall}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#040401] hover:text-[#FF3600] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#FF3600]" />
          <span>{t.common.call}: {dealership.phonePrimary}</span>
        </a>

        <button
          type="button"
          onClick={() => setShowPreview((p) => !p)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#616161] hover:text-[#FF3600] cursor-pointer transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showPreview ? 'Hide WA preview' : 'Preview WhatsApp text'}</span>
        </button>
      </div>

      {showPreview && (
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#14213D]">
          <div className="font-semibold mb-1 text-[#2563EB]">Prefilled WhatsApp text</div>
          <p className="leading-relaxed text-[#475569]">&ldquo;{prefilledMessage}&rdquo;</p>
        </div>
      )}
    </div>
  );
};
