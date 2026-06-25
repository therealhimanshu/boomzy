import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Calendar, Clock, Download, 
  Mail, Send, Sparkles, CheckCircle2 
} from "lucide-react";
import IgniteHoverEffect from "./IgniteHoverEffect";

export default function ResourcesSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const articles = [
    {
      title: "2026 SEO Blueprint: Optimizing for AI-Driven Conversational Search",
      category: "SEO Strategy",
      readTime: "6 Min Read",
      date: "June 18, 2026",
      desc: "Traditional keyword stuffing is obsolete. Learn how search algorithms analyze semantic intent and how you can optimize for voice and conversational AI search assistants.",
      link: "#"
    },
    {
      title: "Conversion Rate Optimization (CRO) Secrets for B2B Landing Pages",
      category: "CRO & Optimization",
      readTime: "8 Min Read",
      date: "June 12, 2026",
      desc: "Vanity metrics like total page views won't grow your business. We break down standard B2B patterns, scroll depth analysis, and how A/B testing can double your MQL volume.",
      link: "#"
    },
    {
      title: "Why Retention Marketing is the New Performance Engine",
      category: "Growth Arsenal",
      readTime: "5 Min Read",
      date: "May 28, 2026",
      desc: "With client acquisition costs (CAC) climbing, smart agencies are pivoting. Discover how syncing post-purchase journeys via Salesforce can maximize LTV.",
      link: "#"
    }
  ];

  const downloads = [
    {
      title: "Full-Funnel Audit Checklist",
      format: "PDF Guide",
      size: "2.4 MB",
      downloads: "1,200+ Downloads"
    },
    {
      title: "2026 SEO Content Roadmap",
      format: "CSV Template",
      size: "820 KB",
      downloads: "850+ Downloads"
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    setErrorMsg('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'resources' }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
        return;
      }
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <section 
      id="resources" 
      className="py-24 bg-white dark:bg-transparent transition-colors duration-500 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#ff8c00] mb-4">
              <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
              <span>Thought Leadership</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 dark:text-white leading-tight">
              Intel & Insights. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                Igniting Your Growth.
              </span>
            </h2>
          </div>
          <p className="text-slate-655 dark:text-slate-100 text-base md:text-lg max-w-lg leading-relaxed">
            Stay ahead of the curve with our team of marketing scale experts. We share actionable, metrics-backed playbooks to accelerate your revenue streams.
          </p>
        </div>

        {/* Resources Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Left Column: Blog Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {articles.map((article, idx) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050811]/55 dark:backdrop-blur-md hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  idx === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-350 uppercase tracking-widest mb-4">
                    <span className="text-brand-primary font-extrabold">{article.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                  </div>
                  
                  <h3 className={`font-black text-slate-900 dark:text-white leading-snug group-hover:text-brand-primary transition-colors duration-200 mb-3 ${
                    idx === 0 ? "text-xl sm:text-2xl" : "text-lg"
                  }`}>
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-200 leading-relaxed mb-6">
                    {article.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs font-bold text-slate-400 dark:text-slate-300">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                  <span className="text-brand-primary font-extrabold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                    Read playbook &rarr;
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Right Column: Downloads & Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            
            {/* Download Card */}
            <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050811]/55 dark:backdrop-blur-md">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-primary" />
                <span>Growth Handbooks</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mb-6">
                Download our technical toolkits to run audit evaluations in your agency.
              </p>

              <div className="flex flex-col gap-3">
                {downloads.map((dl) => (
                  <div 
                    key={dl.title}
                    className="p-4 rounded-2xl bg-white dark:bg-[#050811]/85 dark:backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between group hover:border-brand-primary/20 transition-colors duration-300 cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">{dl.title}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-300 mt-1">{dl.format} &bull; {dl.size}</div>
                    </div>
                    <button className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all duration-300">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-slate-950 dark:bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <IgniteHoverEffect />
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-primary/20 to-transparent rounded-bl-full pointer-events-none -z-10" />

              <div>
                <h3 className="text-lg font-black text-white mb-1 flex items-center gap-1.5">
                  <Mail className="w-5 h-5 text-brand-primary" />
                  <span>The Ignite Newsletter</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Subscribe to receive our latest 2026 performance playbooks directly in your inbox.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!subscribed ? (
                  <motion.form 
                    key="sub-form"
                    onSubmit={handleSubscribe} 
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="business@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 bg-white/10 border border-white/10 rounded-xl px-4 text-xs focus:outline-none focus:border-brand-primary transition-colors text-white placeholder-slate-500 pr-10"
                      />
                      <button 
                        type="submit"
                        className="absolute right-1 top-1 w-9 h-9 rounded-lg bg-brand-primary hover:bg-brand-primary/90 flex items-center justify-center text-white transition-colors cursor-pointer"
                        aria-label="Submit email"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    {errorMsg && <div className="text-[10px] text-rose-400 font-medium px-1">{errorMsg}</div>}
                  </motion.form>
                ) : (
                  <motion.div 
                    key="sub-success"
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-emerald-400 text-xs font-bold"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Welcome! Check your inbox for the Q3 SEO Guide.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
