import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const { login, user } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to admin
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Vennligst skriv inn passord');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login('admin@betania.no', password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Feil passord. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Decorative Blur Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl border border-surface-container p-8 md:p-10 shadow-xl relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/5 flex items-center justify-center text-primary mb-2">
            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
          </div>
          <h1 className="font-headline-md text-headline-sm text-primary font-bold">Betania Vigeland</h1>
          <p className="text-sm text-on-surface-variant">Logg inn for å administrere nettstedet</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-primary">
              Admin Passord
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Skriv inn passord..."
                disabled={loading}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-secondary bg-secondary/5 p-3 rounded-xl border border-secondary/15 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary hover:bg-[#153a51] active:scale-[0.98] text-white text-sm font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Logg inn</span>
                <span className="material-symbols-outlined text-[16px]">login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 mx-auto"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Tilbake til forsiden</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
