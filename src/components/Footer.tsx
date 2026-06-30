import { ArrowRight, Github, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-transparent border-t border-slate-200/60 dark:border-slate-900 transition-colors duration-500 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Corner */}
        <div className="md:col-span-1">
          <a href="#hero" className="min-h-11 text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary inline-flex items-center mb-4">
            Boomzy
          </a>
          <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed mb-6">
            Boomzy is an agile growth-partner performance agency. We engineer conversion-optimized funnels and integrate pipeline data architectures for ambitious enterprises globally.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-3">
            <a 
              href="#" 
              className="w-11 min-w-11 h-11 shrink-0 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-300/30 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary transition-all duration-300"
              aria-label="Linkedin"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-11 min-w-11 h-11 shrink-0 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-300/30 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-11 min-w-11 h-11 shrink-0 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-300/30 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary transition-all duration-300"
              aria-label="Github"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Sitemap Block */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-[#ff8c00] text-xs font-black tracking-widest uppercase mb-6">Expertise</h4>
            <ul className="space-y-3.5">
              <li>
                <a href="#services" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  SEO &amp; Organic Growth
                </a>
              </li>
              <li>
                <a href="#services" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  Performance Marketing
                </a>
              </li>
              <li>
                <a href="#services" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  Content Strategy Systems
                </a>
              </li>
              <li>
                <a href="#services" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  Social Media Marketing
                </a>
              </li>
              <li>
                <a href="#services" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  Brand Identity Auditing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#ff8c00] text-xs font-black tracking-widest uppercase mb-6">Company</h4>
            <ul className="space-y-3.5">
              <li>
                <a href="#contact" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  Case Studies &amp; Audits
                </a>
              </li>
              <li>
                <a href="#contact" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#contact" className="min-h-11 text-slate-500 dark:text-slate-300 hover:text-brand-primary text-sm hover:translate-x-1.5 inline-flex items-center transition-transform duration-300">
                  Careers (Hiring!)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Direct conversion channel */}
        <div className="md:col-span-1">
          <h4 className="text-[#ff8c00] text-xs font-black tracking-widest uppercase mb-6">Start Growing</h4>
          <p className="text-slate-500 dark:text-slate-300 text-sm mb-4 leading-relaxed">
            Share your funnel goals and we will map the fastest route toward better pipeline quality.
          </p>
          <a
            href="#contact"
            className="min-h-11 inline-flex items-center gap-2 rounded-full ignite-gradient px-5 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-brand-primary/15 transition-transform hover:scale-105 active:scale-95"
          >
            <span>Book a Strategy Call</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Copyright/Privacy Panel */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200/65 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          © 2026 Boomzy Performance Agency. All rights reserved. Registered HQ: Delhi, India.
        </p>
        <div className="flex gap-6">
          <a href="#" className="min-h-11 inline-flex items-center text-xs text-slate-400 dark:text-slate-500 hover:text-brand-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="min-h-11 inline-flex items-center text-xs text-slate-400 dark:text-slate-500 hover:text-brand-primary transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
