import React from 'react';
import { useApp } from '../../context/AppContext';
import { getLangText } from '../../i18n/translations';

export const PoliciesPage: React.FC<{ policySlug?: string }> = ({ policySlug }) => {
  const { lang, policies, navigatePublic } = useApp();
  const active = policySlug
    ? policies.find((p) => p.slug === policySlug) || policies[0]
    : policies[0];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 space-y-4">
          <div className="clay-card p-4 space-y-1">
            <div className="px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#8290A3]">
              Legal &amp; Policies
            </div>
            {policies.map((pol) => {
              const isCurrent = pol.id === active.id;
              return (
                <button
                  key={pol.id}
                  type="button"
                  onClick={() => navigatePublic({ page: 'policies', policySlug: pol.slug })}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-medium cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-[#FFF3EE] text-[#FF3600] font-semibold'
                      : 'text-[#616161] hover:bg-[#FFF8F6] hover:text-[#040401]'
                  }`}
                >
                  {getLangText(lang, pol.titleEn, pol.titleFr)}
                </button>
              );
            })}
          </div>

          {active.sections.length > 0 && (
            <div className="clay-card p-4 space-y-2 sticky top-24">
              <div className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#8290A3]">
                Table of Contents
              </div>
              <nav className="space-y-1">
                {active.sections.map((sec, idx) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block px-3.5 py-1.5 rounded-xl text-xs text-[#616161] hover:bg-[#FFF8F6] hover:text-[#FF3600] transition-colors"
                  >
                    {idx + 1}. {getLangText(lang, sec.headingEn, sec.headingFr)}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>

        <article className="lg:col-span-8 clay-card p-7 sm:p-9 space-y-6">
          <div className="pb-5 border-b border-[#ECECEC]">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#040401]">
              {getLangText(lang, active.titleEn, active.titleFr)}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-xs text-[#8290A3]">
              <span>Version {active.version}</span>
              <span>·</span>
              <span>Last updated: {active.lastUpdated}</span>
            </div>
          </div>

          <div className="space-y-6">
            {active.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="space-y-2">
                <h2 className="font-display font-bold text-lg text-[#040401]">
                  {getLangText(lang, sec.headingEn, sec.headingFr)}
                </h2>
                <p className="text-sm text-[#616161] leading-relaxed">
                  {getLangText(lang, sec.bodyEn, sec.bodyFr)}
                </p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};
