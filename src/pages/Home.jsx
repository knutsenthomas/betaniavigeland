import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import CmsText from '@/components/CmsText';
import facebookPosts from '@/data/facebook_posts.json';

export default function Home() {
  const navigate = useNavigate();
  const { events, siteSettings } = useContent();
  const vipps = siteSettings?.platform_links?.vipps || '106111';
  const [copied, setCopied] = useState(false);

  // Filter the events that are featured
  const featuredEvents = events.filter(event => event.featured).slice(0, 3);

  const handleCopyVipps = () => {
    navigator.clipboard.writeText(vipps);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [posts, setPosts] = useState(facebookPosts);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    // To make this fully automatic, you can insert a free Facebook RSS feed URL here 
    // (for example, from rss.app or fetchrss.com for the page 'betaniavigeland')
    // Example: const FEED_URL = "https://rss.app/feeds/v1/your-feed-id.xml";
    const FEED_URL = "https://rss.app/feeds/1t2MgxCaSa6Vcrtc.xml"; 

    if (!FEED_URL) return;

    const fetchFacebookFeed = async () => {
      setLoadingPosts(true);
      try {
        const response = await fetch(FEED_URL);
        if (!response.ok) throw new Error("RSS fetch failed");
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const items = xml.querySelectorAll("item");
        
        const parsed = Array.from(items).slice(0, 3).map((item, idx) => {
          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "https://www.facebook.com/betaniavigeland";
          const pubDate = item.querySelector("pubDate")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";
          
          // Try to extract an image from the description HTML content
          let image = "";
          const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            image = imgMatch[1];
          } else {
            // Default image fallback if no image is attached to the post
            const fallbacks = [
              "https://images.unsplash.com/photo-1438032005730-c779502df39b?fit=crop&w=600&h=400&q=80",
              "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?fit=crop&w=600&h=400&q=80",
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fit=crop&w=600&h=400&q=80"
            ];
            image = fallbacks[idx % 3];
          }
          
          // Shave HTML tags from description to get raw post text
          const cleanText = description.replace(/<[^>]*>/g, '').trim();

          // Calculate a friendly relative date (e.g. '3 dager siden')
          let friendlyDate = "Nylig";
          if (pubDate) {
            const date = new Date(pubDate);
            const diffTime = Math.abs(new Date() - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) friendlyDate = "I går";
            else if (diffDays <= 7) friendlyDate = `${diffDays} dager siden`;
            else friendlyDate = date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
          }

          return {
            id: idx + 1,
            date: friendlyDate,
            text: cleanText || title,
            image: image,
            likes: Math.floor(Math.random() * 20) + 15, // Mock counters as RSS feeds omit engagement data
            comments: Math.floor(Math.random() * 5) + 1,
            url: link
          };
        });

        if (parsed.length > 0) {
          setPosts(parsed);
        }
      } catch (err) {
        console.error("Facebook RSS feed failed, using fallback database:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchFacebookFeed();
  }, []);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <div className="overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('/hero-bg.png')` 
            }}
            data-alt="Betania Vigeland kirke bygning"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/65 via-slate-900/45 to-slate-900/25" />
        </div>
        
        <div className="relative z-10 w-full px-gutter max-w-container-max mx-auto py-section-gap-sm">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <CmsText 
              slug="hero_title" 
              fallback="Et fellesskap for hele livet" 
              as="h1" 
              className="font-headline-xl text-headline-xl text-white mb-6 leading-tight" 
            />
            <CmsText 
              slug="hero_desc" 
              fallback="Velkommen til Betania Vigeland – et varmt og inkluderende fellesskap for alle generasjoner. Her er det rom for tro, vennskap og livets små og store øyeblikk." 
              as="p" 
              className="font-body-lg text-body-lg text-blue-100/90 mb-10 max-w-lg" 
            />
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/about')}
                className="bg-white text-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:shadow-lg hover:bg-surface-cream transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Ny her?
              </button>
              <button 
                onClick={() => navigate('/calendar')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-white hover:text-primary transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Hva skjer?
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* "Hva skjer?" Section */}
      <section className="bg-surface-bright py-section-gap-lg border-t border-surface-container">
        <div className="px-gutter max-w-container-max mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
          >
            <div>
              <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
                <CmsText slug="home_cal_badge" fallback="Kalender" />
              </div>
              <CmsText 
                slug="home_cal_title" 
                fallback="Hva skjer?" 
                as="h2" 
                className="font-headline-lg text-headline-lg text-primary mt-2 font-bold" 
              />
            </div>
            <Link to="/calendar" className="text-primary font-label-md text-label-md flex items-center gap-2 group hover:text-secondary transition-colors duration-300">
              Se hele kalenderen 
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.15 } }
                }}
                className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 ${
                  idx === 0 ? 'border-primary' : idx === 1 ? 'border-secondary' : 'border-meadow-green'
                }`}
              >
                <div className="h-48 relative overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                    style={{ backgroundImage: `url('${event.image}')` }}
                    data-alt={event.title}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-center shadow-sm">
                    <span className="block font-bold text-primary text-lg leading-tight">{event.day}</span>
                    <span className="block text-[10px] uppercase tracking-tighter text-on-surface-variant">{event.month}</span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-secondary font-label-md text-label-md uppercase tracking-wider text-[12px]">{event.category}</span>
                  <h3 className="font-headline-md text-headline-md text-primary mt-2">{event.title}</h3>
                  <p className="text-on-surface-variant font-body-md mt-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-surface-container flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[18px]">schedule</span> {event.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "For barna og de unge" Section */}
      <section className="bg-surface-container-low py-section-gap-lg">
        <div className="px-gutter max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl relative z-10">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBA5-ISPF9EgsZkTBcseHNCuiJ7G6x1-BclCZBPx9L1J11nl5dkGN6iu214ofMRcEjKpk6m-8ZHIyjhA_B5_m_eQXpr96g_By043kq6ofvH7ZkItnl-NHB02xoTPUbmHuR3k-2aJ-KFsIkc02S0O4kegH-w35AZVfmraCWM6RhlIxZjSwfn794UIR-s6KVjCj99ujDw1ISoQihbjOxaptItDb3epna5Q0lwgprb3FWVSn9OSc7YDgBV8dU_7Kn5Dpg7uXLFKkjB2ms')` }}
                  data-alt="A young person being mentored or encouraged by an older community leader."
                />
              </div>
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-secondary-fixed opacity-30 rounded-full blur-3xl z-0" />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary-fixed opacity-30 rounded-full blur-3xl z-0" />
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
                <CmsText slug="home_youth_badge" fallback="Vårt hjertebarn" />
              </div>
              <CmsText 
                slug="home_youth_title" 
                fallback="Vi satser på neste generasjon" 
                as="h2" 
                className="font-headline-xl text-headline-xl text-primary leading-tight font-bold" 
              />
              <div className="w-20 h-1 bg-secondary" />
              <CmsText 
                slug="home_youth_desc" 
                fallback="I Betania Vigeland brenner vi for at barn og unge skal oppleve et trygt miljø der de blir sett, hørt og verdsatt. Vi ønsker å legge til rette for vekst, mestring og gode vennskap som varer livet ut." 
                as="p" 
                className="font-body-lg text-body-lg text-on-surface-variant" 
              />
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span className="font-body-md"><CmsText slug="home_youth_bullet1" fallback="Trygge voksne og inkluderende ledere" /></span>
                </li>
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span className="font-body-md"><CmsText slug="home_youth_bullet2" fallback="Aktiviteter tilpasset alle aldersgrupper" /></span>
                </li>
                <li className="flex items-start gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span className="font-body-md"><CmsText slug="home_youth_bullet3" fallback="Et fundament bygget på kristne verdier" /></span>
                </li>
              </ul>
              <button 
                onClick={() => navigate('/kids-youth')}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-primary-container transition-all shadow-md active:scale-98"
              >
                Les mer om barne- og ungdomsarbeidet
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="bg-surface-cream py-section-gap-sm">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpVariants}
          className="px-gutter max-w-2xl mx-auto text-center space-y-6"
        >
          <div className="w-12 h-px bg-secondary mx-auto" />
          <CmsText 
            slug="home_quote" 
            fallback='"La de små barna komme til meg, og hindre dem ikke; for Guds rike tilhører slike som dem."' 
            as="blockquote" 
            className="font-quote text-quote text-primary italic leading-relaxed font-bold" 
          />
          <div className="w-12 h-px bg-secondary mx-auto" />
        </motion.div>
      </section>

      {/* Facebook Feed Section */}
      <section className="bg-surface-container-low py-section-gap-lg border-y border-surface-container">
        <div className="px-gutter max-w-container-max mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
          >
            <div>
              <div className="text-secondary font-label-md text-label-md tracking-widest uppercase">
                <CmsText slug="home_fb_badge" fallback="Sosiale medier" />
              </div>
              <CmsText 
                slug="home_fb_title" 
                fallback="Siste fra Facebook" 
                as="h2" 
                className="font-headline-lg text-headline-lg text-primary mt-2 font-bold" 
              />
            </div>
            <a 
              href="https://www.facebook.com/betaniavigeland" 
              target="_blank" 
              rel="noreferrer"
              className="text-primary font-label-md text-label-md flex items-center gap-2 group hover:text-secondary transition-colors duration-300"
            >
              Følg siden vår 
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.15 } }
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-surface-container transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Post Header */}
                  <div className="p-5 flex items-center gap-3">
                    <img 
                      src="/logo-icon.png?v=2" 
                      alt="Betania Vigeland" 
                      className="w-10 h-10 object-contain rounded-full bg-surface-cream p-1 border border-surface-container"
                    />
                    <div>
                      <span className="block font-bold text-primary text-sm">Betania Vigeland</span>
                      <span className="text-on-surface-variant text-[11px] flex items-center gap-1">
                        {post.date} • <span className="material-symbols-outlined text-[12px]">public</span>
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-5 pb-4">
                    <p className="text-on-surface-variant font-body-md leading-relaxed whitespace-pre-line line-clamp-4">
                      {post.text}
                    </p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="h-48 overflow-hidden relative border-y border-surface-container">
                      <img 
                        src={post.image} 
                        alt="Facebook post" 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>

                {/* Post Footer/Actions */}
                <div className="p-4 bg-surface-cream/50 border-t border-surface-container flex justify-start items-center">
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-secondary hover:text-primary transition-colors text-[13px] font-bold flex items-center gap-1"
                  >
                    Se på Facebook
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "Bli en del av oss" Section */}
      <section className="bg-white py-section-gap-lg">
        <div className="px-gutter max-w-container-max mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            className="bg-primary rounded-[32px] p-8 md:p-20 text-white relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
              <span className="material-symbols-outlined text-[400px]">diversity_3</span>
            </div>
            <div className="relative z-10 max-w-2xl">
              <CmsText 
                slug="home_join_title" 
                fallback="Bli en del av oss" 
                as="h2" 
                className="font-headline-xl text-headline-xl mb-6 font-bold" 
              />
              <CmsText 
                slug="home_join_desc" 
                fallback="Betania Vigeland er mer enn bare et bygg – det er menneskene. Vi er en menighet som ønsker å være relevante i dagens samfunn, samtidig som vi tar vare på de nære relasjonene. Enten du er nysgjerrig på troen eller leter etter et nytt kirkefellesskap, er du hjertelig velkommen." 
                as="p" 
                className="font-body-lg text-body-lg opacity-90 mb-10 leading-relaxed" 
              />
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/about" className="inline-flex items-center gap-2 font-label-md text-label-md group hover:text-secondary-fixed-dim transition-colors">
                  Les mer om oss 
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">east</span>
                </Link>
                <a href="mailto:post@betania-vigeland.no" className="inline-flex items-center gap-2 font-label-md text-label-md group hover:text-secondary-fixed-dim transition-colors">
                  Kontakt oss 
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">mail</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* "Støtt oss" / Practical Info Section */}
      <section className="bg-surface-container-low py-section-gap-sm border-t border-surface-container">
        <div className="px-gutter max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="space-y-4"
            >
              <CmsText slug="home_footer_support_title" fallback="Støtt arbeidet" as="h4" className="font-headline-md text-headline-md text-primary font-bold" />
              <CmsText slug="home_footer_support_desc" fallback="Ditt bidrag gjør det mulig for oss å fortsette arbeidet for barn, unge og eldre i Vigeland." as="p" className="font-body-md text-on-surface-variant" />
              <div className="bg-white h-16 px-4 rounded-xl flex items-center justify-between border border-surface-container shadow-sm">
                <div className="flex items-center gap-3">
                  <img 
                    src="/vipps-logo.svg" 
                    alt="Vipps" 
                    className="h-8 object-contain"
                  />
                  <span className="font-bold text-wood-bark">{vipps}</span>
                </div>
                <button 
                  onClick={handleCopyVipps} 
                  className={`hover:text-secondary transition-colors material-symbols-outlined ${
                    copied ? 'text-meadow-green' : 'text-primary'
                  }`}
                  title="Kopier Vipps-nummer"
                >
                  {copied ? 'check' : 'content_copy'}
                </button>
              </div>
              {copied && (
                <p className="text-[12px] text-meadow-green font-semibold animate-fade-in">Vipps-nummer kopiert til utklippstavlen!</p>
              )}
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="space-y-4"
            >
              <CmsText slug="home_footer_follow_title" fallback="Følg oss" as="h4" className="font-headline-md text-headline-md text-primary font-bold" />
              <CmsText slug="home_footer_follow_desc" fallback="Få med deg siste nytt og se glimt fra hverdagen i fellesskapet vårt." as="p" className="font-body-md text-on-surface-variant" />
              <div className="flex gap-4">
                <a 
                  className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" 
                  href="https://www.facebook.com/betaniavigeland" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Følg oss på Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.9.2-1.2 1-1.2h2.5V2H13c-3 0-4 1.5-4 3.5V8z"/>
                  </svg>
                </a>
                <a 
                  className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Følg oss på Instagram"
                >
                  <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a 
                  className="w-12 h-12 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Følg oss på YouTube"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              className="space-y-4"
            >
              <CmsText slug="home_footer_rental_title" fallback="Utleie" as="h4" className="font-headline-md text-headline-md text-primary font-bold" />
              <CmsText slug="home_footer_rental_desc" fallback="Trenger du lokaler til konfirmasjon, selskap eller møter? Vi leier ut våre lyse og moderne lokaler." as="p" className="font-body-md text-on-surface-variant" />
              <Link className="text-secondary font-label-md text-label-md border-b border-secondary hover:text-primary hover:border-primary transition-all" to="/rental">
                Sjekk priser og tilgjengelighet
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
