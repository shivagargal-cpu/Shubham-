import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { storage } from '../services/storage';
import { useRestaurant } from '../context/RestaurantContext';
import { supabase, isSupabaseLive } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const { setCurrentUser, isLiveSupabase } = useRestaurant();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect state if came from a protected route
  const from = (location.state as any)?.from?.pathname || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please supply both your email address and password.');
      return;
    }

    setIsLoading(true);

    // If Supabase is live, attempt Supabase Auth
    if (isLiveSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (!error && data.user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .maybeSingle();

          const role = roleData?.role === 'admin' || email.includes('admin') ? 'admin' : 'customer';
          const user = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            role: role as 'admin' | 'customer',
            createdAt: data.user.created_at || new Date().toISOString(),
          };
          storage.setCurrentUser(user);
          setCurrentUser(user);
          setIsLoading(false);
          navigate(from, { replace: true });
          return;
        }
      } catch (err) {
        console.warn('Supabase Auth error, falling back to local credentials:', err);
      }
    }

    setIsLoading(false);

    const res = storage.login(email.trim(), password);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      return;
    }

    if (res.user) {
      setCurrentUser(res.user);
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = (type: 'admin' | 'guest') => {
    if (type === 'admin') {
      setEmail('admin@broso.com');
      setPassword('admin123');
    } else {
      setEmail('guest@broso.com');
      setPassword('guest123');
    }
    setErrorMsg('');
  };

  const handleGoogleLogin = () => {
    const profile = {
      name: 'Julian Vance',
      email: 'julian.vance@gmail.com'
    };
    const user = storage.loginGoogle(profile);
    setCurrentUser(user);
    navigate(from, { replace: true });
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center justify-center bg-[#070d14]">
      <div className="max-w-md w-full bg-[#0a111a] border border-[#c5a880]/40 rounded-sm p-8 sm:p-10 shadow-2xl relative text-[#ded6cc]">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#c5a880] mx-auto bg-[#070d14] mb-3 group">
            <span className="font-cinzel text-base font-semibold tracking-widest text-[#c5a880]">B</span>
          </Link>
          <h1 className="font-cinzel text-2xl font-bold tracking-[0.2em] text-[#f8f5f0] uppercase">
            PATRON SIGN IN
          </h1>
          <p className="text-[11px] tracking-widest uppercase text-[#c5a880] font-medium mt-1">
            Access Your Royal Dining Account
          </p>
        </div>

        {/* 1-Click Demo Accounts Banner */}
        <div className="mb-6 p-3 bg-[#070d14] border border-[#c5a880]/20 rounded-sm text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#8e8275] mb-2">
            Instant 1-Click Demo Testing:
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="px-3 py-1 bg-[#c5a880]/15 hover:bg-[#c5a880]/30 border border-[#c5a880]/40 text-[#c5a880] text-[11px] font-semibold rounded-sm transition-all cursor-pointer"
            >
              Demo Admin (Chef)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('guest')}
              className="px-3 py-1 bg-[#ded6cc]/10 hover:bg-[#ded6cc]/20 border border-[#ded6cc]/30 text-[#ded6cc] text-[11px] font-semibold rounded-sm transition-all cursor-pointer"
            >
              Demo Guest (Patron)
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-sm text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@broso.com or your email"
                className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-3.5 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#ded6cc]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-[#c5a880] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8e8275] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070d14] border border-[#c5a880]/30 rounded-sm pl-9 pr-10 py-2.5 text-xs text-[#f8f5f0] focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8275] hover:text-[#f8f5f0] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#a89b8d]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#c5a880]/40 bg-[#070d14] text-[#c5a880]"
              />
              <span>Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#c5a880] to-[#b39369] text-[#070d14] font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer mt-2"
          >
            Sign In to Broso
          </button>
        </form>

        {/* Google OAuth Option */}
        <div className="mt-4 pt-4 border-t border-[#c5a880]/15">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 bg-[#070d14] border border-[#c5a880]/30 hover:border-[#c5a880] text-xs text-[#ded6cc] font-medium rounded-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
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

        {/* Link to Register */}
        <p className="text-center text-xs text-[#8e8275] mt-6">
          Do not possess a membership?{' '}
          <Link to="/signup" className="text-[#c5a880] font-semibold hover:underline">
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
};
