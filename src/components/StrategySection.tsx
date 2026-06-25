import { useState } from "react";
import { motion } from "motion/react";
import { 
  Target, Users, Cpu, CheckCircle2, 
  BarChart3, Database, Workflow, Shield, ArrowRight
} from "lucide-react";
import IgniteHoverEffect from "./IgniteHoverEffect";

export default function StrategySection() {
  const [activeTab, setActiveTab] = useState<"personas" | "goals" | "tech">("personas");
  const [activePersona, setActivePersona] = useState<number>(0);

  // SMART Goal slider values (interactive simulation)
  const [trafficTarget, setTrafficTarget] = useState<number>(45);
  const [conversionTarget, setConversionTarget] = useState<number>(4.2);

  const personas = [
    {
      role: "Chief Marketing Officer (CMO)",
      target: "Enterprise & Mid-Market",
      needs: "Predictable pipeline growth, board-ready ROI reports, and elevated brand authority.",
      attention: "Quantifiable case studies with exact numbers and data-backed industry benchmarks.",
      trigger: "A free, highly detailed customized Growth Roadmap Audit, not a generic pitch deck.",
      icon: "👔",
      badge: "Decision Maker"
    },
    {
      role: "VP of Growth",
      target: "High-Growth SaaS & E-commerce",
      needs: "Rapid customer acquisition, lower CAC, high LTV, and conversion rate optimization (CRO).",
      attention: "Innovative growth-hacks, script minification, and page load speed improvements.",
      trigger: "Interactive diagnostic analysis showing exact leakages in their current checkout funnel.",
      icon: "📈",
      badge: "Influencer"
    },
    {
      role: "Founder / CEO",
      target: "Ambitious Scale-ups",
      needs: "Scaling operations, market dominance, and transition from founder-led sales to automatic funnel marketing.",
      attention: "Full-funnel agency partnerships that act as an extension of their internal team.",
      trigger: "An introductory strategy call mapped directly to their 12-month capital deployment goals.",
      icon: "🚀",
      badge: "Visionary"
    }
  ];

  const techStack = [
    { name: "HubSpot CRM", category: "CRM & Pipeline Sync", desc: "Real-time bidirectional lead and client lifecycle data routing.", icon: Database },
    { name: "Google Analytics 4 (GA4)", category: "Behavioral Analytics", desc: "Custom event tags tracking scroll depth, form friction, and CRO metrics.", icon: BarChart3 },
    { name: "Vite + React", category: "Core Frontend Framework", desc: "Lightning-fast static builds with mobile-first responsive architecture.", icon: Cpu },
    { name: "Salesforce Cloud", category: "Enterprise Alignment", desc: "Advanced lead scoring integrations and marketing automation pipelines.", icon: Workflow },
    { name: "Cloudflare CDN", category: "Global Performance Edge", desc: "Automated image compression, web caching, and DDOS mitigation.", icon: Shield }
  ];

  return (
    <section 
      id="strategy" 
      className="py-24 bg-slate-50 dark:bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-500 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary mb-3"
          >
            Discovery & Foundation
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Turning Strategy Into Market Dominance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-650 dark:text-slate-100 text-base md:text-lg"
          >
            Before deploying campaigns, we build a solid foundation mapping out your ideal customers, defining technical integrations, and establishing SMART goals.
          </motion.p>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-slate-200/60 dark:bg-[#050811]/60 p-1.5 border border-slate-300/40 dark:border-slate-800/40 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("personas")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "personas" 
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Target Personas</span>
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "goals" 
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Target className="w-4 h-4" />
              <span>SMART Goals</span>
            </button>
            <button
              onClick={() => setActiveTab("tech")}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "tech" 
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Tech Integrations</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[420px]">
          
          {/* TAB 1: PERSONAS */}
          {activeTab === "personas" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sidebar Selector */}
              <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
                {personas.map((persona, idx) => (
                  <button
                    key={persona.role}
                    onClick={() => setActivePersona(idx)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer shrink-0 sm:shrink ${
                      activePersona === idx 
                        ? "bg-white dark:bg-[#050811]/85 dark:backdrop-blur-md border-brand-primary/40 shadow-lg dark:shadow-black/40" 
                        : "bg-transparent border-slate-200 dark:border-slate-800/80 hover:bg-slate-100/50 dark:hover:bg-[#050811]/45"
                    }`}
                  >
                    <span className="text-3xl select-none">{persona.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-brand-primary tracking-wider uppercase mb-1">{persona.badge}</div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">{persona.role}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Detail Panel */}
              <div className="lg:col-span-8">
                <motion.div
                  key={activePersona}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-[#050811]/55 dark:backdrop-blur-md overflow-hidden"
                >
                  <IgniteHoverEffect />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none -z-10" />

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    {personas[activePersona].role}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest mb-8">
                    Target Segment: {personas[activePersona].target}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-[#050811]/60 dark:backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40">
                      <div className="text-xs font-extrabold tracking-widest text-[#ff8c00] mb-3 uppercase">Information Needs</div>
                      <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-100 leading-relaxed">
                        {personas[activePersona].needs}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-[#050811]/60 dark:backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40">
                      <div className="text-xs font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400 mb-3 uppercase">Attention Grabber</div>
                      <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-100 leading-relaxed">
                        {personas[activePersona].attention}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-[#050811]/60 dark:backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40">
                      <div className="text-xs font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 uppercase">Conversion Trigger</div>
                      <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-100 leading-relaxed">
                        {personas[activePersona].trigger}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* TAB 2: SMART GOALS */}
          {activeTab === "goals" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Input Goal Controls */}
              <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#050811]/55 dark:backdrop-blur-md shadow-sm relative overflow-hidden">
                <IgniteHoverEffect />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Configure Your Target Objectives</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-350 mb-8 leading-relaxed">
                    Set your desired marketing targets below to see the estimated lead acquisition impact mapped to our performance strategy.
                  </p>

                  {/* Slider 1 */}
                  <div className="mb-8">
                    <div className="flex justify-between text-xs font-extrabold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-2">
                      <span>Organic Traffic Target</span>
                      <span className="text-brand-primary">+{trafficTarget}% Growth</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={trafficTarget} 
                      onChange={(e) => setTrafficTarget(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-primary" 
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-extrabold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-2">
                      <span>Funnel Conversion Target</span>
                      <span className="text-brand-primary">{conversionTarget}% Rate</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="80" 
                      step="1"
                      value={conversionTarget * 10} 
                      onChange={(e) => setConversionTarget(parseInt(e.target.value) / 10)}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-primary" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aligned to standard Q3 SMART criteria.</span>
                </div>
              </div>

              {/* Dynamic KPI Outputs */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Metric 1 */}
                <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#050811]/55 dark:backdrop-blur-md shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-extrabold tracking-widest text-[#ff8c00] mb-2 uppercase">SMART Objective</div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3">Double Conversion Rates</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-200 leading-relaxed">
                      Optimize call-to-actions, page load speeds, and friction-less forms to shift baseline performance from 1.8% to <span className="font-bold text-slate-950 dark:text-white">{conversionTarget}%</span>.
                    </p>
                  </div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary tracking-tight mt-6">
                    {Math.round(conversionTarget / 1.8 * 10) / 10}x Conversion Lift
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#050811]/55 dark:backdrop-blur-md shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400 mb-2 uppercase">Qualified Leads</div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3">Generate 150+ Monthly MQLs</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-200 leading-relaxed">
                      Capture organic traffic via highly-targeted 2026 SEO content loops, routing leads directly into your HubSpot pipeline.
                    </p>
                  </div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary tracking-tight mt-6">
                    {Math.round((trafficTarget * conversionTarget * 5))} Est. Monthly Leads
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: TECH REQUIREMENTS */}
          {activeTab === "tech" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, idx) => {
                const IconComponent = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-[#050811]/55 dark:backdrop-blur-md flex flex-col justify-between group hover:border-brand-primary/30 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#050811]/60 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors duration-300">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">{tech.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest leading-none mt-1">{tech.category}</div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-200 leading-relaxed">
                        {tech.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
