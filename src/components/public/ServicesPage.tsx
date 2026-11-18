import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLangText } from '../../i18n/translations';
import { CtaTrio } from '../common/CtaTrio';

export const ServicesPage: React.FC<{ serviceSlug?: string }> = ({ serviceSlug }) => {
  const { lang, services, navigatePublic, addToast } = useApp();
  const visible = services.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  const active = serviceSlug ? visible.find((s) => s.slug === serviceSlug) || visible[0] : visible[0];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#040401]">
          Automotive Services
        </h1>
        <p className="text-sm sm:text-base text-[#616161] mt-1.5">
          Sourcing, technical inspections, and corporate fleet management across Cameroon.
        </p>
      </div>

      {/* Service Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {visible.map((srv) => {
          const isCurrent = active?.id === srv.id;
          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => navigatePublic({ page: 'services', serviceSlug: srv.slug })}
              className={`text-left rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between gap-4 clay-card ${
                isCurrent
                  ? 'border-2 border-[#FF3600] bg-[#FFF8F6]'
                  : 'hover:border-[#FF3600]/40'
              }`}
            >
              <div>
                <h2 className="font-display font-bold text-base text-[#040401]">
                  {getLangText(lang, srv.titleEn, srv.titleFr)}
                </h2>
                <p className="text-xs text-[#616161] mt-2 leading-relaxed">
                  {getLangText(lang, srv.summaryEn, srv.summaryFr)}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF3600]">
                <span>View details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Service Detail */}
      {active && (
        <div className="clay-card overflow-hidden">
          <div className="bg-[#040401] text-white p-7 sm:p-10 relative">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {getLangText(lang, active.titleEn, active.titleFr)}
            </h2>
            <p className="text-sm sm:text-base text-[#ECECEC] mt-2.5 max-w-2xl leading-relaxed">
              {getLangText(lang, active.descriptionEn, active.descriptionFr)}
            </p>
          </div>

          <div className="p-7 sm:p-10 space-y-10">
            <div>
              <h3 className="font-display font-bold text-lg text-[#040401] mb-5">
                Why choose Derico Motors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {active.whyChooseUs.map((pt) => (
                  <div
                    key={pt.titleEn}
                    className="p-5 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] space-y-2"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#ECECEC] flex items-center justify-center text-[#FF3600] shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="font-display font-bold text-sm text-[#040401]">
                      {getLangText(lang, pt.titleEn, pt.titleFr)}
                    </div>
                    <p className="text-xs text-[#616161] leading-relaxed">
                      {getLangText(lang, pt.textEn, pt.textFr)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {active.faqs.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-lg text-[#040401] mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="divide-y divide-[#ECECEC] border border-[#ECECEC] rounded-2xl overflow-hidden">
                  {active.faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={faq.qEn} className="bg-white">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FFF8F6]"
                        >
                          <span className="font-semibold text-sm text-[#040401]">
                            {getLangText(lang, faq.qEn, faq.qFr)}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#FF3600] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#8290A3] shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-sm text-[#616161] leading-relaxed">
                            {getLangText(lang, faq.aEn, faq.aFr)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 max-w-xl">
              <CtaTrio
                prefilledMessage={`Hello Derico Motors, I would like to inquire about: ${active.titleEn}.`}
                onOpenForm={() => {
                  addToast({
                    type: 'info',
                    title: 'Opening Contact & Quote form',
                  });
                  navigatePublic({ page: 'contact' });
                }}
                formLabel={getLangText(lang, active.ctaLabelEn, active.ctaLabelFr)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
