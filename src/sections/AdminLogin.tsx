import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../services/api';

interface AdminLoginProps {
  onLogin: (token: string) => void;
  onNavigateHome: () => void;
}

export default function AdminLogin({ onLogin, onNavigateHome }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await loginAdmin(username, password);
      if (result.token) {
        localStorage.setItem('kiraimports_admin_token', result.token);
        onLogin(result.token);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div ref={formRef} className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#E91E8C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#E91E8C]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0a1f3d]">
              <span className="text-[#E91E8C]">KIRA</span>{' '}
              <span className="text-[#F5C518]">IMPORTS</span>
            </h1>
            <p className="text-[#5a6a7a] mt-1">Admin Panel Login</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5a6a7a] mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a6a7a]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-[#0a1f3d] focus:outline-none focus:border-[#E91E8C]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5a6a7a] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a6a7a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-[#0a1f3d] focus:outline-none focus:border-[#E91E8C]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6a7a] hover:text-[#0a1f3d]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E91E8C] text-white rounded-lg font-semibold hover:bg-[#C41675] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
