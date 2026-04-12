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
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">
            COMP-W
          </h1>
          <p className="text-[#818384] text-[10px] font-bold uppercase tracking-[0.2em]">Analytical Lexical Arena</p>
        </div>

        <div className="bg-[#1c1c1d] p-10 border border-[#3a3a3c]">
          {error && <div className="bg-red-500/10 text-red-500 p-4 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest mb-6">{error}</div>}
          {message && <div className="bg-primary/10 text-primary p-4 border border-primary/20 text-[10px] font-bold uppercase tracking-widest mb-6">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <label className="text-[10px] text-[#818384] font-bold uppercase tracking-[0.2em] mb-2 block">Username</label>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#131314] border border-[#3a3a3c] px-4 py-3 text-sm text-white focus:border-primary/50 transition-all outline-none"
                  placeholder="USERNAME"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] text-[#818384] font-bold uppercase tracking-[0.2em] mb-2 block">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131314] border border-[#3a3a3c] px-4 py-3 text-sm text-white focus:border-primary/50 transition-all outline-none"
                placeholder="EMAIL@EXAMPLE.COM"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#818384] font-bold uppercase tracking-[0.2em] mb-2 block">Access Code</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131314] border border-[#3a3a3c] px-4 py-3 text-sm text-white focus:border-primary/50 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-[#131314] font-black py-4 text-[10px] uppercase tracking-[0.3em] hover:brightness-110 active:brightness-90 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isSignup ? 'Initialize Account' : 'Authenticate Session'}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#3a3a3c]"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#818384]"><span className="bg-[#1c1c1d] px-4 tracking-widest">or</span></div>
          </div>

          <button 
            type="button"
            onClick={loginWithGoogle}
            className="w-full bg-white text-black font-bold py-4 flex items-center justify-center gap-3 hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4" />
            Sign in with Google
          </button>

          <div className="mt-10 text-center">
            <button onClick={() => setIsSignup(!isSignup)} className="text-[10px] font-bold uppercase tracking-widest text-[#818384] hover:text-primary transition-colors">
              {isSignup ? "Terminating? Log In" : "New operative? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
