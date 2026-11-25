import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DERICO_LOGO_SRC } from '../common/DericoLogo';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setMode, addToast } = useApp();
  const [email, setEmail] = useState('admin@dericomotors.cm');
  const [password, setPassword] = useState('Derico2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast({ type: 'error', title: 'Please enter both email and password' });
      return;
    }
    loginAdmin(email.trim());
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-5">
        <button
          type="button"
          onClick={() => setMode('public')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#616161] hover:text-[#040401] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to public website</span>
        </button>

        <div className="clay-card p-7 sm:p-8 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#ECECEC] p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              <img
                src={DERICO_LOGO_SRC}
                alt="Derico Motors Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-[#040401]">
                Derico Motors Admin
              </h1>
              <p className="text-xs text-[#8290A3]">
                Staff &amp; Operations Portal · Douala / Yaoundé
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                Work email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8290A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dm-input pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#040401]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-xs font-semibold text-[#FF3600] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8290A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dm-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#8290A3] hover:text-[#040401] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#FF3600]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="clay-btn w-full h-11 text-sm font-semibold cursor-pointer"
            >
              Sign in to Dashboard
            </button>
          </form>

          <p className="text-[11px] text-[#8290A3] text-center">
            Admin-only access. Customer accounts are not required on the public website.
          </p>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card p-6 max-w-sm w-full space-y-4">
            <h2 className="font-display font-bold text-base text-[#040401]">
              Reset Admin Password
            </h2>
            <p className="text-xs text-[#616161]">
              Enter your Derico Motors staff email to receive reset instructions.
            </p>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="staff@dericomotors.cm"
              className="dm-input"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="clay-pill h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotOpen(false);
                  addToast({
                    type: 'success',
                    title: 'Password reset link sent',
                    description: resetEmail || email,
                  });
                }}
                className="clay-btn h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Send reset link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
