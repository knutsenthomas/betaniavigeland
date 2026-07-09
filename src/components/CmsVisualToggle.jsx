import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CmsVisualToggle() {
  const { user } = useAuth();
  const { isAdminEditing, setIsAdminEditing } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem('betania-cms-minimized') === 'true';
  });

  // Only show for logged in admin users
  const isAdminUser = user && user.role === 'admin';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (!isAdminUser || isAdminPage) {
    return null;
  }

  const handleToggle = () => {
    setIsAdminEditing(!isAdminEditing);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] font-sans pointer-events-auto">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              setIsMinimized(false);
              localStorage.setItem('betania-cms-minimized', 'false');
            }}
            className="relative flex items-center justify-center h-12 w-12 rounded-full bg-primary hover:bg-primary-container text-white shadow-xl hover:shadow-2xl transition-all active:scale-[0.94] group border border-white/10"
            title="Vis CMS Editor"
          >
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">edit</span>
            {isAdminEditing && (
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-secondary border border-white"></span>
              </span>
            )}
          </motion.button>
        ) : (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="flex items-center gap-3 bg-white/95 dark:bg-surface-container p-2.5 rounded-2xl shadow-xl hover:shadow-2xl border border-surface-container-highest transition-all"
          >
            {/* State indicator dot */}
            <div className="relative flex h-3 w-3 pl-1">
              {isAdminEditing ? (
                <>
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-surface-container-highest"></span>
              )}
            </div>

            <div className="flex flex-col text-left pr-1 min-w-[110px]">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">CMS Editor</span>
              <span className="text-xs font-bold text-primary leading-tight mt-0.5">
                {isAdminEditing ? 'Redigering: PÅ' : 'Redigering: AV'}
              </span>
            </div>

            {/* Toggle switch button */}
            <button
              onClick={handleToggle}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-[0.96] text-white ${
                isAdminEditing
                  ? 'bg-secondary hover:bg-secondary/90'
                  : 'bg-primary hover:bg-primary-container'
              }`}
            >
              {isAdminEditing ? (
                <>
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Fullfør</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>Rediger</span>
                </>
              )}
            </button>

            {/* Shortcut to full CMS dashboard */}
            <button
              onClick={() => navigate('/admin')}
              className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded-xl transition-all"
              title="Åpne Admin Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>

            {/* Minimize button */}
            <button
              onClick={() => {
                setIsMinimized(true);
                localStorage.setItem('betania-cms-minimized', 'true');
              }}
              className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest rounded-xl transition-all"
              title="Minimer CMS-panelet"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
