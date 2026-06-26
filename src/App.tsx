import { lazy, Suspense, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Activity, BarChart3, X, Eye, Check } from "lucide-react";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import ServicesBento from "./components/ServicesBento";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

const LaunchBoom = lazy(() => import("./components/LaunchBoom"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const BlackHoleBackground = lazy(() => import("./components/BlackHoleBackground"));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInitialLaunchState() {
  if (typeof window === "undefined") return true;
  return prefersReducedMotion();
}

function postAnalyticsEvent(eventType: string, sessionId: string, data?: Record<string, unknown>) {
  return fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, data, sessionId }),
  }).catch(() => {});
}

function AppLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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

  const [launchComplete, setLaunchComplete] = useState<boolean>(getInitialLaunchState);
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

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const completeLaunch = useCallback(() => {
    setLaunchComplete(true);
  }, []);

  const handleRelaunch = useCallback(() => {
    if (prefersReducedMotion()) {
      completeLaunch();
      return;
    }
    setLaunchComplete(false);
  }, [completeLaunch]);

  const [scrollDepth, setScrollDepth] = useState<number>(0);
  const [abVariant, setAbVariant] = useState<"A" | "B">("A");
  const [sessionId] = useState(() => Math.random().toString(36).substring(2));
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

  const analyticsEnabled =
    !isAdminRoute && (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_ANALYTICS === "true");

  // Analytics tracking: disabled by default in frontend-only dev to avoid proxy noise.
  useEffect(() => {
    if (!analyticsEnabled) return;
    postAnalyticsEvent('page_view', sessionId);
  }, [analyticsEnabled, sessionId]);

  useEffect(() => {
    if (!analyticsEnabled) return;
    postAnalyticsEvent('ab_variant_view', sessionId, { variant: abVariant });
  }, [analyticsEnabled, abVariant, sessionId]);

  useEffect(() => {
    if (!analyticsEnabled) return;
    const milestones = new Set<number>();
    const trackScrollMilestone = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const depth = Math.round((window.scrollY / scrollableHeight) * 100);
      [25, 50, 75, 100].forEach(m => {
        if (depth >= m && !milestones.has(m)) {
          milestones.add(m);
          postAnalyticsEvent('scroll_depth', sessionId, { depth: m });
        }
      });
    };
    window.addEventListener('scroll', trackScrollMilestone, { passive: true });
    return () => window.removeEventListener('scroll', trackScrollMilestone);
  }, [analyticsEnabled, sessionId]);

  // Admin route rendering
  if (isAdminRoute) {
    if (adminLoading) {
      return <AppLoadingFallback />;
    }
    if (!adminUser) {
      return (
        <Suspense fallback={<AppLoadingFallback />}>
          <AdminLogin onLoginSuccess={(user) => setAdminUser(user)} />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<AppLoadingFallback />}>
        <AdminDashboard user={adminUser} onLogout={async () => { await signOut(auth); setAdminUser(null); }} />
      </Suspense>
    );
  }

  return (
    <LayoutGroup id="boomzy-logo-transition">
    <div id="app-root-container" className="relative isolate min-h-screen bg-slate-50 dark:bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden selection:bg-brand-primary selection:text-white">
      {/* 1. INITIAL EYE-SAFE EXPLOSION BOOM ANIMATION OVERLAY */}
      <AnimatePresence>
        {!launchComplete && (
          <Suspense fallback={null}>
            <LaunchBoom 
              key="boom-landing-overlay"
              isDark={isDark} 
              onComplete={completeLaunch} 
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* 2. ACCESSIBLE WEBSITE SECTIONS RENDER IMMEDIATELY BEHIND OPTIONAL INTRO */}
      <motion.div
        key="website-structural-content"
        initial={false}
        animate={{ opacity: launchComplete ? 1 : 0.72 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative isolate"
        aria-hidden={!launchComplete ? true : undefined}
      >
          {/* 3D Black Hole Background (Endless loops in dark mode backdrop) */}
          <Suspense fallback={null}>
            <BlackHoleBackground />
          </Suspense>
          <div className="relative z-10">
            {/* Header Navigation with logo layout controller */}
            <NavBar
              isDark={isDark}
              toggleDarkMode={toggleDarkMode}
              scrolled={scrolled}
              onRelaunch={handleRelaunch}
              launchComplete={launchComplete}
            />

            {/* Interactive Sections */}
            <main>
              {/* Hero Banner introducing initial layout name positioning */}
              <Hero scrolled={scrolled} launchComplete={launchComplete} abVariant={abVariant} heatmapActive={heatmapActive} />

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
          </div>
      </motion.div>
    </div>
    </LayoutGroup>
  );
}
