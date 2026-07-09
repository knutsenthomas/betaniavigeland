import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import CmsText from '@/components/CmsText';

export default function Footer() {
  const { siteSettings } = useContent();
  const vipps = siteSettings?.platform_links?.vipps || '106111';

  return (
    <footer className="bg-surface-container-lowest dark:bg-surface-dim pt-20 border-t border-surface-container">
      <div className="px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-gutter mb-20">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-3 font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
              <img 
                src="/logo-icon.png?v=2" 
                alt="Betania Vigeland Logo" 
                className="w-10 h-10 object-contain"
              />
              Betania Vigeland
            </div>
            <CmsText 
              slug="footer_description" 
              fallback={siteSettings?.platform_links?.footer_description || "En lokal menighet tilknyttet Pinsebevegelsen i Norge. Vi er et fellesskap som ønsker å peke på Jesus og utgjøre en forskjell i lokalmiljøet."} 
              as="p" 
              className="font-body-md text-on-surface-variant leading-relaxed" 
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {/* Column 1: Menigheten */}
            <div className="space-y-4">
              <h5 className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">Menigheten</h5>
              <div className="flex flex-col gap-3">
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/about">
                  Om oss
                </Link>
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/virkegrener">
                  Våre virkegrener
                </Link>
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/calendar">
                  Kalender
                </Link>
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/misjon">
                  Misjon
                </Link>
              </div>
            </div>

            {/* Column 2: Ressurser */}
            <div className="space-y-4">
              <h5 className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">Ressurser</h5>
              <div className="flex flex-col gap-3">
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/podcast">
                  Podcast
                </Link>
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/rental">
                  Utleie
                </Link>
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/medlem">
                  Medlemskap
                </Link>
                <Link className="font-body-md text-on-surface-variant hover:text-secondary transition-colors duration-200" to="/gave">
                  Gi en gave
                </Link>
              </div>
            </div>

            {/* Column 3: Besøk og kontakt */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h5 className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">Besøk og kontakt</h5>
              <div className="space-y-3 font-body-md text-on-surface-variant leading-relaxed">
                <div>
                  <CmsText slug="footer_address_line1" fallback={siteSettings?.platform_links?.address_line1 || "Elveveien 6"} as="span" className="block" />
                  <CmsText slug="footer_address_line2" fallback={siteSettings?.platform_links?.address_line2 || "4520 Lindesnes"} as="span" className="block" />
                </div>
                <div>
                  <span className="font-bold text-primary block text-xs uppercase tracking-wider">Epost</span>
                  <a href={`mailto:${siteSettings?.platform_links?.email || 'post@betania-vigeland.no'}`} className="hover:text-secondary transition-colors">
                    <CmsText slug="footer_email" fallback={siteSettings?.platform_links?.email || "post@betania-vigeland.no"} as="span" />
                  </a>
                </div>
                <div>
                  <span className="font-bold text-primary block text-xs uppercase tracking-wider">Bidrag</span>
                  Vipps: {vipps}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-10 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-6 text-center">
          <p className="font-body-md text-[14px] text-on-surface-variant/80">
            © {new Date().getFullYear()} Betania Vigeland
          </p>
          <a 
            href="https://tk-design.no" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 text-on-surface-variant/60 hover:text-primary transition-colors duration-300 group"
          >
            <span className="material-symbols-outlined text-[18px] select-none translate-y-[-0.5px] group-hover:scale-110 transition-transform">design_services</span>
            <span className="text-[12px] uppercase tracking-widest font-label-md font-bold">
              Designet av tk-design.no
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

