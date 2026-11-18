import React, { useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLangText } from '../../i18n/translations';
import { HERO_SHOWROOM_IMAGE } from '../common/VehicleVisual';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const ContactPage: React.FC = () => {
  const { dealership, lang, waSettings, addToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Vehicle Purchase Inquiry');
  const [message, setMessage] = useState('');
  const [waConsent, setWaConsent] = useState(true);
  const [sent, setSent] = useState(false);

  const waHref = `https://wa.me/${dealership.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hello Derico Motors, I would like to request a quote.'
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast({
      type: 'success',
      title: 'Message sent to Derico Motors',
      description: 'Our advisor will reply shortly on WhatsApp or email.',
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#040401]">
          Contact Derico Motors
        </h1>
        <p className="text-sm sm:text-base text-[#616161] mt-1.5">
          Visit our showrooms in Douala or Yaoundé, or reach our sales and rental desk directly on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-5">
          <div className="clay-card p-6 sm:p-7 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F6] border border-[#ECECEC] flex items-center justify-center text-[#FF3600] shrink-0 mt-0.5 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#040401]">Douala Showroom (HQ)</div>
                <div className="text-[#616161]">{dealership.addressDouala}</div>
                <div className="font-semibold text-[#040401] mt-2.5">Yaoundé Office</div>
                <div className="text-[#616161]">{dealership.addressYaounde}</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F6] border border-[#ECECEC] flex items-center justify-center text-[#FF3600] shrink-0 mt-0.5 shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#040401]">Telephone</div>
                <div className="font-mono-num text-[#616161]">{dealership.phonePrimary}</div>
                <div className="font-mono-num text-[#616161]">{dealership.phoneSecondary}</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F6] border border-[#ECECEC] flex items-center justify-center text-[#FF3600] shrink-0 mt-0.5 shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#040401]">Email</div>
                <div className="text-[#616161]">{dealership.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F6] border border-[#ECECEC] flex items-center justify-center text-[#FF3600] shrink-0 mt-0.5 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#040401]">Opening Hours</div>
                <div className="text-[#616161]">{dealership.openingHours}</div>
              </div>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-pill w-full h-12 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat directly on WhatsApp</span>
            </a>
          </div>

          <div className="clay-card overflow-hidden p-2">
            <div className="aspect-[16/9] relative rounded-2xl overflow-hidden">
              <img
                src={HERO_SHOWROOM_IMAGE}
                alt="Bonapriso Showroom Douala"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040401]/85 via-[#040401]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-display font-bold text-sm">
                  Bonapriso Showroom · Douala
                </div>
                <div className="text-xs text-slate-200 mt-0.5">
                  4.0285° N, 9.6966° E · Opposite Hydrocarbures Junction
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 clay-card p-7 sm:p-8 space-y-6">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#040401]">
                Inquiry Received
              </h2>
              <p className="text-sm text-[#616161]">
                Thank you, {name}. Our Douala desk will respond within 30 minutes during business hours.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="clay-btn h-10 px-6 text-sm font-semibold cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-display font-bold text-xl text-[#040401]">
                Send us a message or request a quote
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">Full name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="dm-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">WhatsApp phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="dm-input font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dm-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="dm-input"
                  >
                    <option>Vehicle Purchase Inquiry</option>
                    <option>Car Rental / Corporate Fleet</option>
                    <option>Airport / Intercity Pick-up</option>
                    <option>Vehicle Sourcing &amp; Importation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us the model, dates, or service you need..."
                  className="w-full p-3.5 rounded-2xl border border-[#ECECEC] bg-white text-sm focus:outline-none focus:border-[#FF3600]"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#8290A3] cursor-pointer">
                <input
                  type="checkbox"
                  checked={waConsent}
                  onChange={(e) => setWaConsent(e.target.checked)}
                  className="mt-0.5 rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                />
                <span>{getLangText(lang, waSettings.consentTextEn, waSettings.consentTextFr)}</span>
              </label>

              <button
                type="submit"
                className="clay-btn h-12 px-7 text-sm font-semibold cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
