import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MapPin, Rocket, CheckCircle, Flame, IndianRupee, ArrowRight } from "lucide-react";

interface ContactFormProps {
  onLeadSubmit?: () => void;
  heatmapActive?: boolean;
}

export default function ContactForm({ onLeadSubmit, heatmapActive = false }: ContactFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("Select Range");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid work email";
    }
    if (budget === "Select Range") {
      newErrors.budget = "Please choose a matching media budget";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, budget }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          const serverErrors: { [key: string]: string } = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            serverErrors[err.field] = err.message;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ form: data.message || 'Something went wrong. Please try again.' });
        }
        setLoading(false);
        return;
      }
      setLoading(false);
      setIsSubmitted(true);
      if (onLeadSubmit) onLeadSubmit();
    } catch (err) {
      setLoading(false);
      setErrors({ form: 'Network error. Please check your connection and try again.' });
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setBudget("Select Range");
    setIsSubmitted(false);
  };

  return (
    <section 
      id="contact" 
      className="py-24 bg-slate-900 dark:bg-transparent text-slate-100 transition-colors duration-500 relative overflow-hidden"
    >
      {/* Absolute floating gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-700/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Status Pulse Badge */}
            <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/5 border border-white/10 mb-8 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff8c00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff8c00]"></span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ffb77d]">
                Accepting New Partners
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight text-white mb-6 leading-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Ignite</span> <br />
              Your Growth?
            </h2>

            <p className="text-slate-300 text-base md:text-lg mb-12 max-w-md leading-relaxed">
              Let's audit your funnel performance and identify pipeline friction. Schedule a customized digital growth strategy session directly with our engineering team.
            </p>

            {/* Direct Channels */}
            <div className="space-y-6">
              <a 
                href="mailto:boomzydotin@gmail.com" 
                className="flex items-center gap-4 text-slate-300 group hover:text-white transition-colors w-fit"
              >
                <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold tracking-wide">boomzydotin@gmail.com</span>
              </a>

              <div className="flex items-center gap-4 text-slate-300 group">
                <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-brand-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold tracking-wide">Global Remote | HQ: Delhi, India</span>
              </div>
            </div>
          </motion.div>

          {/* Right Sleek Form Block */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-950/80 rounded-[32px] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                >
                  {/* Neon Top Accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1.5 ignite-gradient" />

                  <h3 className="text-2xl font-black font-display text-white mb-6">
                    Schedule a Strategy Session
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className={`w-full h-12 bg-slate-900 border ${
                            errors.firstName ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
                          } rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all`}
                        />
                        {errors.firstName && (
                          <span className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.firstName}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className={`w-full h-12 bg-slate-900 border ${
                            errors.lastName ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
                          } rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all`}
                        />
                        {errors.lastName && (
                          <span className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.lastName}</span>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className={`w-full h-12 bg-slate-900 border ${
                          errors.email ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
                        } rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all`}
                      />
                      {errors.email && (
                        <span className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.email}</span>
                      )}
                    </div>

                    {/* Budget Dropdown */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                        Monthly Budget
                      </label>
                      <div className="relative">
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className={`w-full h-12 bg-slate-900 border ${
                            errors.budget ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
                          } rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all appearance-none cursor-pointer`}
                        >
                          <option value="Select Range">Select Range</option>
                          <option value="₹5k - ₹10k">₹5k - ₹10k</option>
                          <option value="₹10k - ₹25k">₹10k - ₹25k</option>
                          <option value="₹25k - ₹50k">₹25k - ₹50k</option>
                          <option value="₹50k+">₹50k+</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                          <IndianRupee className="w-4 h-4 text-brand-primary" />
                        </div>
                      </div>
                      {errors.budget && (
                        <span className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.budget}</span>
                      )}
                    </div>

                    {errors.form && (
                      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-400 text-xs font-semibold">
                        {errors.form}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide uppercase ignite-gradient shadow-lg hover:shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer relative ${
                        heatmapActive ? "ring-4 ring-rose-500/80 ring-offset-2 ring-offset-slate-900" : ""
                      }`}
                    >
                      {heatmapActive && (
                        <span className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-pulse shadow-md z-20">
                          92%
                        </span>
                      )}
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Ignite Growth</span>
                          <Rocket className="w-4 h-4 animate-bounce" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* Success Card overlay */
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-950/90 rounded-[32px] p-10 md:p-12 border-2 border-emerald-500/30 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col items-center justify-center"
                >
                  {/* Decorative particles/glow inside success */}
                  <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full filter blur-xl" />
                  
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-3xl font-black font-display text-white mb-4">
                    Engine Ignited!
                  </h3>

                  <p className="text-slate-300 text-sm max-w-sm mb-8 leading-relaxed">
                    Thank you for reaching out, <strong className="text-brand-accent">{firstName}</strong>. We've recorded your strategy session request and will analyze your brand metrics. We will contact you at <strong className="text-white">{email}</strong> to align calendar availability.
                  </p>

                  <button
                    onClick={handleReset}
                    className="px-6 h-11 rounded-full border border-slate-700 hover:border-white text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Submit New Brand</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
