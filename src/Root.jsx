import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteProvider } from '@/contexts/SiteContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import Calendar from '@/pages/Calendar';
import CalendarMonth from '@/pages/CalendarMonth';
import KidsYouth from '@/pages/KidsYouth';
import About from '@/pages/About';
import Rental from '@/pages/Rental';
import Membership from '@/pages/Membership';
import Mission from '@/pages/Mission';
import Virkegrener from '@/pages/Virkegrener';
import Podcast from '@/pages/Podcast';
import Gave from '@/pages/Gave';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';

export default function Root() {
  return (
    <SiteProvider>
      <AuthProvider>
        <ContentProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="hva-skjer" element={<Calendar />} />
                <Route path="kalender-mnd" element={<CalendarMonth />} />
                <Route path="aktivitetskalender" element={<CalendarMonth />} />
                <Route path="kids-youth" element={<KidsYouth />} />
                <Route path="about" element={<About />} />
                <Route path="om-oss" element={<About />} />
                <Route path="rental" element={<Rental />} />
                <Route path="utleie" element={<Rental />} />
                <Route path="medlem" element={<Membership />} />
                <Route path="medlemskap" element={<Membership />} />
                <Route path="misjon" element={<Mission />} />
                <Route path="virkegrener" element={<Virkegrener />} />
                <Route path="våre-virkegrener" element={<Virkegrener />} />
                <Route path="podcast" element={<Podcast />} />
                <Route path="gave" element={<Gave />} />
                <Route path="gi" element={<Gave />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </AuthProvider>
    </SiteProvider>
  );
}
