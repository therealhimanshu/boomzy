import { lazy, Suspense, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import ServicesBento from "./components/ServicesBento";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

const LaunchBoom = lazy(() => import("./components/LaunchBoom"));
const BlackHoleBackground = lazy(() => import("./components/BlackHoleBackground"));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInitialLaunchState() {
  if (typeof window === "undefined") return true;
  return prefersReducedMotion();
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

  useEffect(() => {
    if (!launchComplete || typeof window === "undefined") return;

    let frame = 0;
    let timer = 0;
    const scrollToCurrentHash = () => {
      const rawHash = window.location.hash.slice(1);
      if (!rawHash) return;

      let targetId = rawHash;
      try {
        targetId = decodeURIComponent(rawHash);
      } catch {
        targetId = rawHash;
      }

      const target = document.getElementById(targetId);
      if (!target) return;

      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      frame = window.requestAnimationFrame(() => {
        const reducedMotion = prefersReducedMotion();
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
        timer = window.setTimeout(() => {
          target.scrollIntoView({ behavior: "auto", block: "start" });
        }, 120);
      });
    };

    scrollToCurrentHash();
    window.addEventListener("hashchange", scrollToCurrentHash);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToCurrentHash);
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

  const [abVariant, setAbVariant] = useState<"A" | "B">("A");

  // Assign a random variant on mount
  useEffect(() => {
    setAbVariant(Math.random() < 0.5 ? "A" : "B");
  }, []);

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
              <Hero scrolled={scrolled} launchComplete={launchComplete} abVariant={abVariant} />

              {/* Bento Grid services representing the Growth Arsenal */}
              <ServicesBento />

              {/* Track records, metrics, and trust indicators */}
              {/* <ProofSection /> */}

              {/* Persona strategies, SMART Goals, and Tech Stacks */}
              {/* <StrategySection /> */}

              {/* Thought leadership resource library */}
              {/* <ResourcesSection /> */}

              {/* Direct strategy scheduling action station */}
              <ContactForm />
            </main>

            {/* Global agency footer */}
            <Footer />
          </div>
      </motion.div>
    </div>
    </LayoutGroup>
  );
}
