import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const Login = () => {
  const { user, loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isSignup) {
        const { data, error: signupError } = await signupWithEmail(email, password, username);
        if (signupError) throw signupError;
        if (data.user && !data.session) {
          setMessage('Please check your email to confirm your account.');
          setIsLoading(false);
          return;
        }
      } else {
        const { error: loginError } = await loginWithEmail(email, password);
        if (loginError) throw loginError;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#131314]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-black text-white tracking-tighter mb-2">
            Comp<span className="text-primary">Wordle</span>
          </h1>
          <p className="text-slate-400 text-sm italic">The most competitive word game on the planet.</p>
        </div>

        <div className="bg-[#1c1b1c] p-8 rounded-xl border border-white/5 shadow-none">
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-xs font-bold mb-4">{error}</div>}
          {message && <div className="bg-primary/10 text-primary p-3 rounded-lg text-xs font-bold mb-4">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">Username</label>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#2a292a] border-none rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all mt-1"
                  placeholder="username"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2a292a] border-none rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all mt-1"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2a292a] border-none rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all mt-1"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-[#131314] font-headline font-black py-4 rounded-xl text-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-none"
            >
              {isLoading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500"><span className="bg-[#1c1b1c] px-2 tracking-widest">or</span></div>
          </div>

          <button 
            type="button"
            onClick={loginWithGoogle}
            className="w-full bg-white text-black font-headline font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-[0.98] shadow-none"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="mt-8 text-center text-xs font-bold uppercase tracking-widest">
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline">
              {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
