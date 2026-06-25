import { motion } from "motion/react";
import { ArrowRight, Bolt, Calendar, Sparkles } from "lucide-react";

interface HeroProps {
  scrolled: boolean;
  abVariant?: "A" | "B";
  heatmapActive?: boolean;
}

export default function Hero({ scrolled, abVariant = "A", heatmapActive = false }: HeroProps) {
  return (
    <section 
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden bg-slate-50 dark:bg-transparent transition-colors duration-500"
    >
      {/* Immersive radial glowing background blobs (Safe, slow, eye-pleasing movement) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[18%] left-[10%] w-72 h-72 bg-brand-primary/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float"></div>
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 mb-8 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <Bolt className="w-4 h-4 text-brand-primary fill-brand-primary/20 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-slate-700 dark:text-slate-150">
            Your Partner in Growth
          </span>
        </motion.div>

        {/* LOGO ANCHOR: Centered and magnificent when NOT scrolled */}
        <div className="h-20 md:h-32 flex items-center justify-center mb-6">
          {!scrolled ? (
            <motion.div
              layoutId="boomzy-logo"
              className="text-5xl md:text-8xl font-black tracking-tighter uppercase select-none cursor-pointer"
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                Boomzy
              </span>
            </motion.div>
          ) : (
            // Layout placeholder to keep spacing stable
            <div className="h-1" />
          )}
        </div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black font-display text-slate-900 dark:text-white max-w-4xl tracking-tight leading-tight mb-8"
        >
          Turning Ambition into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c00] to-[#fcd400]">
            Market Dominance.
          </span>
        </motion.h1>

        {/* Hero Summary */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-slate-650 dark:text-slate-100 max-w-3xl leading-relaxed mb-12"
        >
          Boomzy Ignite is a full-service performance marketing and conversion engineering agency. We connect paid media campaigns directly to your HubSpot or Salesforce pipeline, minimizing acquisition costs while driving qualified B2B pipeline growth and customer retention.
        </motion.p>

        {/* Primary Call To Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#services"
            className={`w-full sm:w-auto px-8 h-14 rounded-full text-white font-bold text-sm tracking-wide uppercase ignite-gradient shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 relative ${
              heatmapActive ? "ring-4 ring-rose-500/80 ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#0b0f19]" : ""
            }`}
          >
            {heatmapActive && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-pulse shadow-md z-20">
                84%
              </span>
            )}
            <span>{abVariant === "A" ? "Explore Our Arsenal" : "Scale Your Pipeline"}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className={`w-full sm:w-auto px-8 h-14 rounded-full border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:scale-105 active:scale-95 text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 relative ${
              heatmapActive ? "ring-4 ring-amber-500/80 ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#0b0f19]" : ""
            }`}
          >
            {heatmapActive && (
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-pulse shadow-md z-20">
                62%
              </span>
            )}
            <Calendar className="w-4 h-4 text-brand-primary" />
            <span>Book a Strategy Call</span>
          </a>
        </motion.div>
      </div>

    </section>
  );
}
