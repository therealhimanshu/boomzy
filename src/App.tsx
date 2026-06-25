import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, BarChart3, X, Eye, Check } from "lucide-react";

import LaunchBoom from "./components/LaunchBoom";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import ServicesBento from "./components/ServicesBento";
import ProofSection from "./components/ProofSection";
import StrategySection from "./components/StrategySection";
import ResourcesSection from "./components/ResourcesSection";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import BlackHoleBackground from "./components/BlackHoleBackground";
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function App() {
  // Check system preferences or storage for light/dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme-mode");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [launchComplete, setLaunchComplete] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  // Sync scroll positioning to trigger header logo capture
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 110) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update HTML document theme prefix
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme-mode", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme-mode", "light");
    }
  }, [isDark]);

  // Lock body scroll during launching explosion phase for pristine visual focus
  useEffect(() => {
    if (!launchComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [launchComplete]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const handleRelaunch = () => {
    setLaunchComplete(false);
  };

  const [scrollDepth, setScrollDepth] = useState<number>(0);
  const [abVariant, setAbVariant] = useState<"A" | "B">("A");
  const [leadCount, setLeadCount] = useState<number>(0);
  const [heatmapActive, setHeatmapActive] = useState<boolean>(false);
  const [croPanelOpen, setCroPanelOpen] = useState<boolean>(false);

  // Admin route state
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.pathname === '/admin');
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAdminLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Assign a random variant on mount
  useEffect(() => {
    setAbVariant(Math.random() < 0.5 ? "A" : "B");
  }, []);

  // Track scroll depth and update max depth achieved
  useEffect(() => {
    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      if (documentHeight <= 0) return;
      const currentScroll = window.scrollY;
      const depth = Math.round((currentScroll / documentHeight) * 100);
      setScrollDepth((prev) => Math.max(prev, Math.min(depth, 100)));
    };
    window.addEventListener("scroll", trackScroll, { passive: true });
    return () => window.removeEventListener("scroll", trackScroll);
  }, []);

  const handleLeadSubmit = () => {
    setLeadCount((prev) => prev + 1);
  };

  // Analytics tracking
  useEffect(() => {
    if (isAdminRoute) return;
    const sessionId = Math.random().toString(36).substring(2);

    // Track page view
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'page_view', sessionId }),
    }).catch(() => {});

    // Track A/B variant
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'ab_variant_view', data: { variant: abVariant }, sessionId }),
    }).catch(() => {});

    // Track scroll depth milestones
    const milestones = new Set<number>();
    const trackScrollMilestone = () => {
      const depth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      [25, 50, 75, 100].forEach(m => {
        if (depth >= m && !milestones.has(m)) {
          milestones.add(m);
          fetch('/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType: 'scroll_depth', data: { depth: m }, sessionId }),
          }).catch(() => {});
        }
      });
    };
    window.addEventListener('scroll', trackScrollMilestone, { passive: true });
    return () => window.removeEventListener('scroll', trackScrollMilestone);
  }, [isAdminRoute, abVariant]);

  // Admin route rendering
  if (isAdminRoute) {
    if (adminLoading) {
      return (
        <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (!adminUser) {
      return <AdminLogin onLoginSuccess={(user) => setAdminUser(user)} />;
    }
    return <AdminDashboard user={adminUser} onLogout={async () => { await signOut(auth); setAdminUser(null); }} />;
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 dark:bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden selection:bg-brand-primary selection:text-white">
      {/* 1. INITIAL EYE-SAFE EXPLOSION BOOM ANIMATION OVERLAY */}
      <AnimatePresence>
        {!launchComplete && (
          <LaunchBoom 
            key="boom-landing-overlay"
            isDark={isDark} 
            onComplete={() => setLaunchComplete(true)} 
          />
        )}
      </AnimatePresence>

      {/* 2. REVEALED ACCESSIBLE WEBSITE SECTIONS (Maintaining Theme) */}
      {launchComplete && (
        <motion.div
          key="website-structural-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* 3D Black Hole Background (Endless loops in dark mode backdrop) */}
          <BlackHoleBackground />
          {/* Header Navigation with logo layout controller */}
          <NavBar 
            isDark={isDark} 
            toggleDarkMode={toggleDarkMode} 
            scrolled={scrolled}
            onRelaunch={handleRelaunch}
          />

          {/* Interactive Sections */}
          <main>
            {/* Hero Banner introducing initial layout name positioning */}
            <Hero scrolled={scrolled} abVariant={abVariant} heatmapActive={heatmapActive} />

            {/* Bento Grid services representing the Growth Arsenal */}
            <ServicesBento heatmapActive={heatmapActive} />

            {/* Track records, metrics, and trust indicators */}
            {/* <ProofSection /> */}

            {/* Persona strategies, SMART Goals, and Tech Stacks */}
            {/* <StrategySection /> */}

            {/* Thought leadership resource library & newsletters */}
            {/* <ResourcesSection /> */}

            {/* Direct strategy scheduling action station */}
            <ContactForm onLeadSubmit={handleLeadSubmit} heatmapActive={heatmapActive} />
          </main>

          {/* Global agency footer */}
          <Footer />

          {/* CRO FLOATING DASHBOARD TOOL (Phase 5 - Growth & Optimization) */}
          {adminUser && (
            <div className="fixed bottom-6 left-6 z-50">
              {/* Float Badge */}
              {!croPanelOpen ? (
                <motion.button
                  onClick={() => setCroPanelOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full ignite-gradient text-white flex items-center justify-center shadow-lg cursor-pointer relative"
                  aria-label="Toggle CRO Insights"
                >
                  <Activity className="w-5 h-5 animate-pulse" />
                  {leadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 border-2 border-white dark:border-[#0b0f19] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {leadCount}
                    </span>
                  )}
                </motion.button>
              ) : (
                // Glassmorphism Panel
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white/95 dark:bg-[#0b101c]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-lg w-80 text-slate-800 dark:text-slate-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-brand-primary" />
                      <span className="font-extrabold text-sm tracking-wide uppercase text-slate-900 dark:text-white">CRO Insights Engine</span>
                    </div>
                    <button 
                      onClick={() => setCroPanelOpen(false)}
                      className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 border-t border-slate-100 dark:border-slate-900 pt-4">
                    {/* Metric Row 1 */}
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">A/B Testing Variant:</span>
                      <span className="bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-lg font-bold">
                        Variant {abVariant}
                      </span>
                    </div>

                    {/* Metric Row 2 */}
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Scroll Depth Tracking:</span>
                      <span className="text-slate-900 dark:text-white font-bold">{scrollDepth}% Max</span>
                    </div>

                    {/* Metric Row 3 */}
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Leads Captured (Session):</span>
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        {leadCount > 0 ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{leadCount} Submissions</span>
                          </>
                        ) : (
                          "0 Submissions"
                        )}
                      </span>
                    </div>

                    {/* Interactive Controls */}
                    <div className="border-t border-slate-100 dark:border-slate-900 pt-4 space-y-3">
                      {/* Toggle A/B variant */}
                      <button
                        onClick={() => setAbVariant((prev) => (prev === "A" ? "B" : "A"))}
                        className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-primary" />
                        <span>Switch A/B CTA Copy</span>
                      </button>

                      {/* Toggle Heatmap */}
                      <button
                        onClick={() => setHeatmapActive((prev) => !prev)}
                        className={`w-full h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          heatmapActive 
                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" 
                            : "border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>{heatmapActive ? "Disable GA4 Heatmap" : "View GA4 Heatmap"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
