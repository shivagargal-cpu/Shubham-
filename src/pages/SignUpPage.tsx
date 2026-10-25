import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Phone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { storage } from '../services/storage';
import { useRestaurant } from '../context/RestaurantContext';
import { supabase, isSupabaseLive } from '../lib/supabase';

export const SignUpPage: React.FC = () => {
  const { setCurrentUser, isLiveSupabase } = useRestaurant();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Security passphrase must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('The confirmation passphrase does not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must accept the dining terms & privacy protocol.');
      return;
    }

    // If Supabase is live, attempt Supabase Auth registration
    if (isLiveSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: name.trim(),
              phone: phone.trim(),
            },
          },
        });

        if (!error && data.user) {
          const user = {
            id: data.user.id,
            name: name.trim(),
            email: email.trim(),
            role: 'customer' as const,
            phone: phone.trim(),
            createdAt: data.user.created_at || new Date().toISOString(),
          };
          storage.setCurrentUser(user);
          setCurrentUser(user);
          setVerifiedSuccess(true);
          setTimeout(() => {
            navigate('/account');
          }, 2000);
          return;
        }
      } catch (err) {
        console.warn('Supabase Auth signUp error, falling back to local registration:', err);
      }
    }

    const res = storage.register(name.trim(), email.trim(), password, phone.trim());
    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed.');
      return;
    }

    if (res.user) {
      setCurrentUser(res.user);
      setVerifiedSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex items-center justify-center bg-[#070d14]">
      <div className="max-w-md w-full bg-[#0a111a] border border-[#c5a880]/40 rounded-sm p-8 sm:p-10 shadow-2xl relative text-[#ded6cc]">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#c5a880] mx-auto bg-[#070d14] mb-3">
            <span className="font-cinzel text-base font-semibold tracking-widest text-[#c5a880]">B</span>
          </Link>
          <h1 className="font-cinzel text-2xl font-bold tracking-[0.2em] text-[#f8f5f0] uppercase">
            ROYALE REGISTRATION
          </h1>
          <p className="text-[11px] tracking-widest uppercase text-[#c5a880] font-medium mt-1">
            Create Your Fine Dining Profile
          </p>
        </div>

        {verifiedSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="font-cinzel text-lg font-bold text-emerald-300">
              MEMBERSHIP CONFIRMED
            </h3>
            <p className="text-xs text-[#ded6cc]">
              Your account has been verified. Directing to your personal dining portal...
            </p>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-sm text-xs text-rose-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lady Vivienne Westwood"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@royale.com"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                  Concierge Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Passphrase *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                    Confirm *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat phrase"
                      className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>
              </div>

              {/* Show passwords toggle */}
              <div className="flex items-center justify-between text-[11px] text-[#8e8275] pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                  />
                  <span>Show characters</span>
                </label>
              </div>

              {/* Terms agreement */}
              <label className="flex items-start gap-2 text-[11px] text-[#a89b8d] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                />
                <span>I accept the dining guidelines, privacy protocol, and email verification.</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer mt-2"
              >
                Inscribe Account
              </button>
            </form>

            <p className="text-center text-xs text-[#8e8275] mt-6">
              Already registered with Broso?{' '}
              <Link to="/login" className="text-[#c5a880] font-semibold hover:underline">
                Sign In Instead
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
};
