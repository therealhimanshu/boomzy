import { useState, FormEvent } from "react";
import { Send, Github, Linkedin, Instagram, Sparkles } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      // Silently fail for footer newsletter
      console.error('Newsletter subscription failed:', err);
    }
  };

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

        {/* Newsletter updated subscription channel */}
        <div className="md:col-span-1">
          <h4 className="text-[#ff8c00] text-xs font-black tracking-widest uppercase mb-6">Stay Updated</h4>
          <p className="text-slate-500 dark:text-slate-300 text-sm mb-4 leading-relaxed">
            Subscribe to receive our latest high-information-gain performance playbooks and database marketing blueprints.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex relative mt-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                required
                className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 rounded-l-xl px-4 text-xs dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
              <button 
                type="submit" 
                className="h-12 px-4.5 ignite-gradient text-white rounded-r-xl font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-pulse mt-2">
              <Sparkles className="w-4 h-4" />
              <span>Signed up! Welcome to Boomzy insights.</span>
            </div>
          )}
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
