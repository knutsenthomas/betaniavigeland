import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import SearchModal from '@/components/SearchModal';

export default function Layout() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
      <main className="flex-grow">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />

      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
