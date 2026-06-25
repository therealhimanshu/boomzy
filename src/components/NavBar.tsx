import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Menu, X, Rocket, Sparkles } from "lucide-react";

interface NavBarProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  scrolled: boolean;
  onRelaunch: () => void;
}

export default function NavBar({ isDark, toggleDarkMode, scrolled, onRelaunch }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      id="main-app-header"
      className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${
        scrolled
          ? "h-16 shadow-md backdrop-blur-md bg-white/85 dark:bg-brand-dark-bg/85 border-slate-200/55 dark:border-slate-800/60"
          : "h-20 bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        {/* LOGO ZONE: Host of the shared layout name "Boomzy" when scrolled */}
        <div id="header-logo-anchor" className="flex items-center md:w-32">
          {scrolled ? (
            <motion.a
              href="#"
              layoutId="boomzy-logo"
              className="text-2xl md:text-3xl font-black tracking-tighter uppercase cursor-pointer"
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                Boomzy
              </span>
            </motion.a>
          ) : (
            // Tiny invisible placeholder to maintain alignment logic
            <div className="w-1" />
          )}
        </div>

        {/* Navigation Items (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-200"
          >
            Services
          </a>
          {/* Commented out hidden sections
          <a
            href="#proof"
            className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-200"
          >
            Results
          </a>
          <a
            href="#strategy"
            className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-200"
          >
            Strategy
          </a>
          <a
            href="#resources"
            className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-200"
          >
            Intel
          </a>
          */}
          <a
            href="#contact"
            className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-200"
          >
            Schedule Call
          </a>
          <button
            onClick={onRelaunch}
            id="relaunch-boom-btn"
            className="text-xs font-semibold uppercase tracking-widest text-[#ff8c00] flex items-center gap-1 cursor-pointer hover:underline"
            title="Re-launch explosion effect"
          >
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>Re-launch Boom</span>
          </button>
        </nav>

        {/* Right Controls Area */}
        <div className="flex items-center gap-3 md:w-32 justify-end">
          {/* Dark Mode Toggle with custom visual feedback */}
          <button
            onClick={toggleDarkMode}
            id="theme-toggle"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle Night Mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-900 fill-indigo-950" />
            )}
          </button>



          {/* Hamburger Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full overflow-hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-lg block md:hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
              >
                <span>Growth Services</span>
                <span className="text-brand-primary text-xs font-bold font-mono">01</span>
              </a>
              {/* Commented out hidden sections
              <a
                href="#proof"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
              >
                <span>Proven Results</span>
                <span className="text-brand-primary text-xs font-bold font-mono">02</span>
              </a>
              <a
                href="#strategy"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
              >
                <span>Growth Strategy</span>
                <span className="text-brand-primary text-xs font-bold font-mono">03</span>
              </a>
              <a
                href="#resources"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
              >
                <span>Intel & Resources</span>
                <span className="text-brand-primary text-xs font-bold font-mono">04</span>
              </a>
              */}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
              >
                <span>Schedule Call</span>
                <span className="text-brand-primary text-xs font-bold font-mono">05</span>
              </a>
              
              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onRelaunch();
                  }}
                  id="mobile-relaunch-btn"
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 border border-brand-primary/30 text-brand-primary font-bold text-sm"
                >
                  <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
                  <span>Re-launch Boom Blast</span>
                </button>

                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 ignite-gradient text-white font-bold text-sm tracking-wide uppercase shadow"
                >
                  <span>Ignite Growth Session</span>
                  <Rocket className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
