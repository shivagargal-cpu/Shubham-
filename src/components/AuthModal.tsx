import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User as UserIcon, 
  Mail, 
  Lock, 
  Phone, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { storage } from '../services/storage';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onAuthSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Status & error messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = storage.login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed.');
      return;
    }

    if (res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the dining terms & privacy protocol.');
      return;
    }

    const res = storage.register(signupName.trim(), signupEmail.trim(), signupPassword, signupPhone.trim());
    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed.');
      return;
    }

    if (res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    const profile = {
      name: 'Julian Vance',
      email: 'julian.vance@gmail.com'
    };
    const user = storage.loginGoogle(profile);
    onAuthSuccess(user);
    onClose();
  };

  const handleFillDemo = (type: 'admin' | 'guest') => {
    if (type === 'admin') {
      setLoginEmail('admin@broso.com');
      setLoginPassword('admin123');
    } else {
      setLoginEmail('guest@broso.com');
      setLoginPassword('guest123');
    }
    setActiveTab('login');
    setErrorMsg('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setForgotSent(true);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a111a] border border-[#c5a880]/40 rounded-sm max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-[#ded6cc]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8e8275] hover:text-[#f8f5f0]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full border border-[#c5a880] mx-auto flex items-center justify-center bg-[#070d14] mb-2">
            <span className="font-cinzel text-sm font-semibold tracking-widest text-[#c5a880]">B</span>
          </div>
          <h3 className="font-cinzel text-xl font-bold tracking-[0.2em] text-[#f8f5f0]">
            BROSO
          </h3>
          <p className="text-[10px] tracking-widest uppercase text-[#c5a880] font-medium">
            Royale Dining Membership
          </p>
        </div>

        {/* Quick Demo Pre-fill Pills for Testing */}
        <div className="mb-6 p-2.5 bg-[#070d14] border border-[#c5a880]/20 rounded-sm text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#8e8275] mb-1.5">
            Quick 1-Click Demo Accounts:
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="px-2.5 py-1 bg-[#c5a880]/15 hover:bg-[#c5a880]/30 border border-[#c5a880]/40 text-[#c5a880] text-[10px] font-semibold rounded-sm transition-all"
            >
              Demo Admin (Chef)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('guest')}
              className="px-2.5 py-1 bg-[#ded6cc]/10 hover:bg-[#ded6cc]/20 border border-[#ded6cc]/30 text-[#ded6cc] text-[10px] font-semibold rounded-sm transition-all"
            >
              Demo Guest (Patron)
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#c5a880]/20 mb-6">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 pb-2.5 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative ${
              activeTab === 'login' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            Sign In
            {activeTab === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 pb-2.5 text-xs font-cinzel font-bold tracking-widest uppercase transition-colors relative ${
              activeTab === 'signup' ? 'text-[#c5a880]' : 'text-[#8e8275] hover:text-[#ded6cc]'
            }`}
          >
            Register
            {activeTab === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
            )}
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-sm text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@broso.com or your email"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setErrorMsg('');
                  }}
                  className="text-[10px] text-[#c5a880] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-10 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8275] hover:text-[#f8f5f0]"
                >
                  {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md mt-2"
            >
              Sign In to Broso
            </button>

            {/* Google OAuth Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 bg-[#070d14] border border-[#c5a880]/30 hover:border-[#c5a880] text-xs text-[#ded6cc] font-medium rounded-sm flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIGNUP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Lady Vivienne Westwood"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="patron@royale.com"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                  Confirm *
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center justify-between text-[11px] text-[#8e8275]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSignupPassword}
                  onChange={(e) => setShowSignupPassword(e.target.checked)}
                  className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
                />
                <span>Show passwords</span>
              </label>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 text-[11px] text-[#a89b8d] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
              />
              <span>I accept the Broso dining guidelines and privacy protocol.</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              Create Royal Account
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {activeTab === 'forgot' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-cinzel text-sm font-bold text-[#f5efeb] uppercase tracking-wider">
              Recover Credentials
            </h4>
            <p className="text-xs text-[#8e8275] leading-relaxed">
              Enter the email address registered with your Broso membership. We will transmit instructions for resetting your security passkey.
            </p>

            {forgotSent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">Recovery Instructions Sent</p>
                <p className="text-[11px] text-[#ded6cc]">
                  Please inspect your inbox for verification instructions.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setForgotSent(false);
                  }}
                  className="mt-2 text-xs text-[#c5a880] underline"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm px-3.5 py-2 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs text-[#8e8275] hover:text-[#f8f5f0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#c5a880] hover:bg-[#b59870] text-[#070d14] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm"
                  >
                    Transmit Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
