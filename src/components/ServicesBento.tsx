import { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, Code, Search, Target, Megaphone, 
  FileText, Camera, BarChart3, Cpu, Users, ArrowUpRight 
} from "lucide-react";
import IgniteHoverEffect from "./IgniteHoverEffect";

interface ServicesBentoProps {
  heatmapActive?: boolean;
}

export default function ServicesBento({ heatmapActive = false }: ServicesBentoProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: "Performance Marketing",
      description: "Accelerate enterprise revenue with paid acquisition channels (Google, Meta, LinkedIn) managed by quantitative analysts. We optimize for closed-loop pipeline metrics, not vanity impressions.",
      icon: TrendingUp,
      color: "from-[#ff8c00] to-[#fcd400]",
      accentBg: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
      featured: true
    },
    {
      id: 2,
      title: "Website Development",
      description: "Deploy high-performance web applications built with modern stacks (Vite, React, Node). Engineered for speed, responsive design, and frictionless interactive experiences.",
      icon: Code,
      accentBg: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400"
    },
    {
      id: 3,
      title: "SEO Services",
      description: "Maximize visibility in Google Search, AI Overviews, and conversational engines. We design semantic hub-and-spoke content structures aligned with user search intent.",
      icon: Search,
      accentBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
    },
    {
      id: 4,
      title: "CRO Services",
      description: "Turn anonymous web traffic into qualified leads. We deploy A/B split-testing, custom scroll-depth heatmapping, and checkout funnel optimization to double conversion rates.",
      icon: Target,
      accentBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
    },
    {
      id: 5,
      title: "Social Media Marketing",
      description: "Build organic authority and brand recall. We design high-engagement creative campaigns tailored to capture the attention of modern business decision-makers.",
      icon: Megaphone,
      accentBg: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
    },
    {
      id: 8,
      title: "Reporting & Automation",
      description: "Get dashboard-ready ROI reports. We integrate data streams from ad networks, CRM pipelines, and analytical nodes into unified reporting hubs.",
      icon: BarChart3,
      accentBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
    },
    {
      id: 9,
      title: "3rd Party Integrations",
      description: "Eliminate operations friction. We build bidirectional integrations connecting HubSpot, Salesforce, analytics tools, and internal communication pipelines.",
      icon: Cpu,
      accentBg: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
    },
    {
      id: 10,
      title: "Community Marketing",
      description: "Cultivate direct relationships with prospects and brand advocates. We manage specialized communities, events, and nurture campaigns to maximize long-term client retention.",
      icon: Users,
      accentBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
    }
  ];

  return (
    <section 
      id="services" 
      className="py-24 bg-white dark:bg-transparent transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary mb-3"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Our Growth Arsenal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-650 dark:text-slate-100 text-base md:text-lg"
          >
            Deploy a full-funnel strategy. We combine high-impact creative campaigns, semantic search visibility, and conversion-optimized websites with robust analytics and integrations.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* FEATURED SERVICE 1: Performance Marketing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[0].accentBg} flex items-center justify-center mb-6`}>
                <TrendingUp className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {services[0].title}
              </h3>
              
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">
                {services[0].description}
              </p>
            </div>
          </motion.div>

          {/* Standard Service 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[1].accentBg} flex items-center justify-center mb-6`}>
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{services[1].title}</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">{services[1].description}</p>
            </div>
          </motion.div>

          {/* Standard Service 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[2].accentBg} flex items-center justify-center mb-6`}>
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{services[2].title}</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">{services[2].description}</p>
            </div>
          </motion.div>

          {/* Standard Service 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[3].accentBg} flex items-center justify-center mb-6`}>
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{services[3].title}</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">{services[3].description}</p>
            </div>
          </motion.div>

          {/* Standard Service 5 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[4].accentBg} flex items-center justify-center mb-6`}>
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{services[4].title}</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">{services[4].description}</p>
            </div>
          </motion.div>

          {/* SEPARATE SUB-SECTION: CONTENT MARKETING */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Content Marketing</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">
                Publish high-information-gain resources, custom guides, and targeted industry playbooks that educate your buyers and rank on search engines.
              </p>
            </div>
          </motion.div>

          {/* Standard Service 8 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[5].accentBg} flex items-center justify-center mb-6`}>
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{services[5].title}</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">{services[5].description}</p>
            </div>
          </motion.div>

          {/* Standard Service 9 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[6].accentBg} flex items-center justify-center mb-6`}>
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{services[6].title}</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">{services[6].description}</p>
            </div>
          </motion.div>

          {/* Standard Service 10 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-[#050811]/55 backdrop-blur-md hover:bg-slate-100/90 hover:dark:bg-[#0b101d]/75 p-8 flex flex-col justify-between group cursor-pointer hover:border-brand-primary/30 transition-all duration-300"
          >
            {/* Ignite sparks on hover */}
            <IgniteHoverEffect />

            <div>
              <div className={`w-12 h-12 rounded-2xl ${services[7].accentBg} flex items-center justify-center mb-6`}>
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{services[7].title}</h3>
              <p className="text-slate-650 dark:text-slate-100 text-sm leading-relaxed">{services[7].description}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
