import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, ShieldCheck, Landmark, Globe, Sparkles, 
  ArrowUpRight, ChevronRight, MessageSquare, Quote 
} from "lucide-react";
import IgniteHoverEffect from "./IgniteHoverEffect";

export default function ProofSection() {
  const [activeCase, setActiveCase] = useState<number | null>(null);

  const stats = [
    { value: "3.2x", label: "AVG ROAS INCREASE", desc: "Across all performance client portfolios managed in the last 12 months." },
    { value: "$50M+", label: "AD SPEND MANAGED", desc: "Sourced across HubSpot-linked advertising channels and platforms." }
  ];

  const clients = [
    { name: "ZENNER", style: "font-black tracking-tighter text-2xl" },
    { name: "billcut", style: "font-semibold italic font-serif text-2xl tracking-normal text-amber-500" },
    { name: "ADVIATA", style: "font-light tracking-[0.3em] text-xl" },
    { name: "KRISHNA", style: "font-bold tracking-wide font-sans text-2xl text-cyan-600" },
    { name: "DB", style: "font-extrabold tracking-tight text-3xl" }
  ];

  const caseStudies = [
    {
      id: 1,
      client: "Zenner Corp",
      metric: "+142% ROAS",
      title: "How Zenner Scaled B2B Pipeline Value Using HubSpot Pipeline Syncing",
      challenge: "Zenner's sales team suffered from low-quality leads and disconnected conversion loops, wasting 40% of their ad spend on unqualified clicks.",
      solution: "We integrated a Salesforce-HubSpot closed-loop sync. Using GA4 custom conversion values, we retargeted ads based on pipeline MQL status rather than raw form completions.",
      quote: "Boomzy didn't just bring us leads; they aligned our ad spend with actual revenue closed in our CRM.",
      author: "Marcus Vance, VP of Growth at Zenner"
    },
    {
      id: 2,
      client: "billcut",
      metric: "4.8% Funnel CR",
      title: "Optimizing Checkout Friction to Double E-commerce Conversion Efficiency",
      challenge: "billcut suffered from a high shopping cart abandonment rate (74%) due to bloated checkout scripts and load delays on mobile devices.",
      solution: "We deployed image compression, minified checkout script payloads, and ran A/B tests on CTA alignment based on user scroll-depth heatmaps.",
      quote: "Our mobile conversion rate literally doubled in three weeks after the code optimization sprint.",
      author: "Sarah Lin, Director of E-comm at billcut"
    }
  ];

  return (
    <section
      id="proof"
      className="py-24 bg-slate-100 dark:bg-transparent transition-colors duration-500 relative overflow-hidden"
    >
      {/* Decorative vector dots background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#ff8c00 1.2px, transparent 1.2px)", backgroundColor: "transparent", backgroundSize: "24px 24px" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Statistics and Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ff8c00] mb-4">
              <Sparkles className="w-4 h-4 animate-pulse text-brand-primary" />
              <span>Track Record</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 dark:text-white leading-tight mb-6">
              Global Impact.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                Your Proven Results.
              </span>
            </h2>
            
            <p className="text-slate-650 dark:text-slate-100 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              We focus entirely on metrics that grow your enterprise. We track customer benefits, pipelines, and revenue return—never vanity impressions.
            </p>

            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#050811]/45 dark:backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-150">
                <Globe className="w-3.5 h-3.5 text-brand-primary" /> Global Reach
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#050811]/45 dark:backdrop-blur-sm border border-slate-200/40 dark:border-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-150">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SEC Compliant Pipelines
              </span>
            </div>
          </motion.div>

          {/* Right Metrics Cards Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-8 rounded-3xl bg-white/80 dark:bg-[#050811]/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between hover:scale-[1.03] hover:shadow-md transition-all duration-300 relative overflow-hidden group"
              >
                <IgniteHoverEffect />
                <div>
                  <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary tracking-tight mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs font-extrabold tracking-widest text-[#ff8c00] leading-none mb-4">
                    {stat.label}
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-200 text-xs sm:text-sm">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Case Studies Segment (CMS-driven layout style) */}
        <div className="mb-24">
          <h3 className="text-xs font-extrabold tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-8 uppercase text-center sm:text-left">
            CMS Case Studies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((cs, idx) => (
              <motion.div
                key={cs.client}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setActiveCase(activeCase === idx ? null : idx)}
                className="p-8 rounded-3xl bg-white/80 dark:bg-[#050811]/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 hover:border-brand-primary/30 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[300px] relative overflow-hidden group shadow-sm"
              >
                <IgniteHoverEffect />
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-xs font-extrabold text-brand-primary tracking-wider uppercase">{cs.client}</div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-brand-primary transition-colors">{cs.title}</h4>
                    </div>
                    <span className="px-4 py-2 rounded-2xl bg-brand-primary/10 text-brand-primary font-black text-sm whitespace-nowrap">
                      {cs.metric}
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-150 leading-relaxed mb-6 line-clamp-3">
                    {cs.challenge}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary mt-4 select-none">
                  <span>{activeCase === idx ? "Hide Details" : "Explore Case Study"}</span>
                  <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${activeCase === idx ? "rotate-45" : ""}`} />
                </div>

                {/* Interactive slide-down panel */}
                <AnimatePresence>
                  {activeCase === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-slate-100 dark:border-slate-800/80 mt-6 pt-6"
                      onClick={(e) => e.stopPropagation()} // prevent toggle on inner click
                    >
                      <div className="mb-6">
                        <h5 className="text-xs font-extrabold tracking-wide uppercase text-slate-600 dark:text-slate-400 mb-2">The Action Strategy</h5>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-200 leading-relaxed">
                          {cs.solution}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#050811]/60 border border-slate-200/40 dark:border-slate-800/40 relative">
                        <Quote className="w-8 h-8 text-brand-primary/10 absolute top-2 left-2" />
                        <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 relative z-10 pl-6 leading-relaxed">
                          &ldquo;{cs.quote}&rdquo;
                        </p>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 pl-6 uppercase tracking-wider">
                          &mdash; {cs.author}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Client Grayscale Trust Segment */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-16">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600 mb-8">
            TRUSTED BY AMBITIOUS BRANDS WORLDWIDE
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-65 grayscale hover:grayscale-0 dark:brightness-125 hover:opacity-100 transition-all duration-500">
            {clients.map((client) => (
              <div 
                key={client.name} 
                className={`${client.style} font-display select-none cursor-pointer transition-transform hover:scale-110 duration-300 text-slate-700 dark:text-slate-300`}
              >
                {client.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
