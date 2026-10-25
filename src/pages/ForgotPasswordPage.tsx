import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please supply a valid registered email address.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center justify-center bg-[#070d14]">
      <div className="max-w-md w-full bg-[#0a111a] border border-[#c5a880]/40 rounded-sm p-8 sm:p-10 shadow-2xl relative text-[#ded6cc]">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#c5a880] mx-auto bg-[#070d14] mb-3">
            <KeyRound className="w-5 h-5 text-[#c5a880]" />
          </Link>
          <h1 className="font-cinzel text-2xl font-bold tracking-[0.2em] text-[#f8f5f0] uppercase">
            PASSWORD RECOVERY
          </h1>
          <p className="text-[11px] tracking-widest uppercase text-[#c5a880] font-medium mt-1">
            Re-establish Your Security Passphrase
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="font-cinzel text-lg font-bold text-emerald-300">
              RECOVERY MISSIVE TRANSMITTED
            </h3>
            <p className="text-xs text-[#ded6cc] leading-relaxed">
              We have dispatched cryptographic reset credentials to <strong className="text-[#f5efeb]">{email}</strong>.
            </p>
            <div className="p-3 bg-[#070d14] rounded border border-emerald-500/20 text-[11px] text-[#a89b8d] font-mono">
              Token ID: BRS-KEY-{Math.floor(100000 + Math.random() * 900000)} (Valid for 15 mins)
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c5a880] text-[#070d14] font-cinzel text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#b89b74]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#a89b8d] leading-relaxed mb-6">
              Enter the email address registered with your dining profile. We will forward a verified one-time link to authorize a new security passphrase.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-sm text-xs text-rose-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
                  Your Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer mt-2"
              >
                Transmit Reset Link
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-[#c5a880] hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
