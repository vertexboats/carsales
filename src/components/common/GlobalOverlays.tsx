import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLangText } from '../../i18n/translations';

export const GlobalOverlays: React.FC = () => {
  const {
    toasts,
    dismissToast,
    confirmDialog,
    closeConfirm,
    policyModalSlug,
    setPolicyModalSlug,
    policies,
    lang,
  } = useApp();

  const activePolicy = policyModalSlug
    ? policies.find((p) => p.slug === policyModalSlug)
    : null;

  return (
    <>
      {/* Toast Notifications */}
      <div
        className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const Icon =
            toast.type === 'success'
              ? CheckCircle2
              : toast.type === 'warning'
              ? AlertTriangle
              : toast.type === 'error'
              ? XCircle
              : Info;
          const colors =
            toast.type === 'success'
              ? 'border-[#16A34A]/30 bg-white text-[#040401]'
              : toast.type === 'warning'
              ? 'border-[#F59E0B]/40 bg-white text-[#040401]'
              : toast.type === 'error'
              ? 'border-[#DC2626]/30 bg-white text-[#040401]'
              : 'border-[#FF3600]/30 bg-white text-[#040401]';
          const iconColor =
            toast.type === 'success'
              ? 'text-[#16A34A]'
              : toast.type === 'warning'
              ? 'text-[#F59E0B]'
              : toast.type === 'error'
              ? 'text-[#DC2626]'
              : 'text-[#FF3600]';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border p-3.5 clay-card flex items-start gap-3 ${colors}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#040401]">{toast.title}</div>
                {toast.description && (
                  <div className="text-xs text-[#616161] mt-0.5">{toast.description}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-[#8290A3] hover:text-[#040401] p-1 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm Delete / Blocking Modal */}
      {confirmDialog && confirmDialog.open && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card w-full max-w-md p-6">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  confirmDialog.destructive
                    ? 'bg-[#DC2626]/10 text-[#DC2626]'
                    : 'bg-[#FFF3EE] text-[#FF3600]'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#040401]">
                  {confirmDialog.title}
                </h3>
                <p className="text-sm text-[#616161] mt-1.5 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={closeConfirm}
                className="clay-pill h-10 px-4 text-sm font-semibold text-[#616161] hover:text-[#040401] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  closeConfirm();
                }}
                className={`h-10 px-5 rounded-full text-sm font-semibold text-white cursor-pointer shadow-xs ${
                  confirmDialog.destructive
                    ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                    : 'clay-btn'
                }`}
              >
                {confirmDialog.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Reader Modal (linked from Rental & Pick-up booking forms) */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-[#ECECEC] flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[#040401]">
                  {getLangText(lang, activePolicy.titleEn, activePolicy.titleFr)}
                </h3>
                <p className="text-xs text-[#8290A3]">
                  Version {activePolicy.version} · Last updated {activePolicy.lastUpdated}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPolicyModalSlug(null)}
                className="w-9 h-9 rounded-full hover:bg-[#FFF3EE] flex items-center justify-center text-[#040401] cursor-pointer"
                aria-label="Close policy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              {activePolicy.sections.map((sec) => (
                <section key={sec.id}>
                  <h4 className="font-display font-semibold text-sm text-[#040401] mb-1.5">
                    {getLangText(lang, sec.headingEn, sec.headingFr)}
                  </h4>
                  <p className="text-sm text-[#616161] leading-relaxed">
                    {getLangText(lang, sec.bodyEn, sec.bodyFr)}
                  </p>
                </section>
              ))}
            </div>
            <div className="px-5 py-3.5 border-t border-[#ECECEC] bg-[#FFF8F6] flex justify-end">
              <button
                type="button"
                onClick={() => setPolicyModalSlug(null)}
                className="clay-btn h-10 px-6 text-sm font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
