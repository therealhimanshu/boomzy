import { useEffect, useRef, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MapPin, Rocket, CheckCircle, IndianRupee, ArrowRight } from "lucide-react";

interface ContactFormProps {
  onLeadSubmit?: () => void;
  heatmapActive?: boolean;
}

export default function ContactForm({ onLeadSubmit, heatmapActive = false }: ContactFormProps) {
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const websiteRef = useRef<HTMLInputElement | null>(null);
  const budgetRef = useRef<HTMLSelectElement | null>(null);
  const formErrorRef = useRef<HTMLDivElement | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [budget, setBudget] = useState("Select Range");
  const [message, setMessage] = useState("");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = location.trim();
    if (query.length < 2) {
      setLocationOptions([]);
      setLocationLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLocationLoading(true);
      try {
        const response = await fetch(`/api/locations?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setLocationOptions([]);
          return;
        }
        const data = await response.json();
        setLocationOptions(Array.isArray(data.locations) ? data.locations : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLocationOptions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLocationLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [location]);

  const focusFirstError = (fieldErrors: { [key: string]: string }) => {
    window.requestAnimationFrame(() => {
      const fieldOrder = [
        { key: "firstName", ref: firstNameRef },
        { key: "lastName", ref: lastNameRef },
        { key: "email", ref: emailRef },
        { key: "companyWebsite", ref: websiteRef },
        { key: "budget", ref: budgetRef },
      ];
      const target = fieldOrder.find((field) => fieldErrors[field.key])?.ref.current ?? formErrorRef.current;
      if (!target) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const botField = String(formData.get("botField") ?? "");
    const newErrors: { [key: string]: string } = {};
    const trimmedWebsite = companyWebsite.trim();

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
    if (trimmedWebsite && !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i.test(trimmedWebsite)) {
      newErrors.companyWebsite = "Please enter a valid website URL";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      focusFirstError(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          companyWebsite,
          location,
          budget,
          message,
          botField,
          source: "contact",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          const serverErrors: { [key: string]: string } = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            serverErrors[err.field] = err.message;
          });
          setErrors(serverErrors);
          focusFirstError(serverErrors);
        } else {
          const formError = { form: data.message || 'Something went wrong. Please try again.' };
          setErrors(formError);
          focusFirstError(formError);
        }
        setLoading(false);
        return;
      }
      setLoading(false);
      setIsSubmitted(true);
      if (onLeadSubmit) onLeadSubmit();
    } catch (err) {
      setLoading(false);
      const formError = { form: 'Network error. Please check your connection and try again.' };
      setErrors(formError);
      focusFirstError(formError);
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setCompanyWebsite("");
    setLocation("");
    setLocationOptions([]);
    setBudget("Select Range");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section 
      id="contact" 
      className="py-24 bg-slate-900 dark:bg-transparent text-slate-100 transition-colors duration-500 relative overflow-hidden"
    >
      {/* Absolute floating gradient orbs */}
      <div className="hidden sm:block absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-700/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
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
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Grow</span> <br />
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
          <div className="relative order-1 lg:order-2">
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
	                    <input
	                      type="text"
	                      name="botField"
	                      tabIndex={-1}
	                      autoComplete="off"
	                      className="hidden"
	                      aria-hidden="true"
	                    />
	                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="first-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                          First Name
                        </label>
                        <input
                          ref={firstNameRef}
                          id="first-name"
                          name="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          autoComplete="given-name"
                          aria-invalid={Boolean(errors.firstName)}
                          aria-describedby={errors.firstName ? "first-name-error" : undefined}
                          className={`w-full h-12 bg-slate-900 border ${
                            errors.firstName ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
                          } rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all`}
                        />
                        {errors.firstName && (
                          <span id="first-name-error" role="alert" className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.firstName}</span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="last-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                          Last Name
                        </label>
                        <input
                          ref={lastNameRef}
                          id="last-name"
                          name="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          autoComplete="family-name"
                          aria-invalid={Boolean(errors.lastName)}
                          aria-describedby={errors.lastName ? "last-name-error" : undefined}
                          className={`w-full h-12 bg-slate-900 border ${
                            errors.lastName ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
                          } rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all`}
                        />
                        {errors.lastName && (
                          <span id="last-name-error" role="alert" className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.lastName}</span>
                        )}
                      </div>
	                    </div>

	                    {/* Email */}
	                    <div>
                      <label htmlFor="work-email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                        Work Email
                      </label>
                      <input
                        ref={emailRef}
                        id="work-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "work-email-error" : undefined}
                        className={`w-full h-12 bg-slate-900 border ${
                          errors.email ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
                        } rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all`}
                      />
                      {errors.email && (
                        <span id="work-email-error" role="alert" className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.email}</span>
	                      )}
	                    </div>

	                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
	                      <div>
	                        <label htmlFor="company-website" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
	                          Website <span className="text-slate-600 normal-case tracking-normal">(optional)</span>
	                        </label>
	                        <input
	                          ref={websiteRef}
	                          id="company-website"
	                          name="companyWebsite"
	                          type="text"
	                          inputMode="url"
	                          value={companyWebsite}
	                          onChange={(e) => setCompanyWebsite(e.target.value)}
	                          placeholder="https://company.com"
	                          autoComplete="url"
	                          aria-invalid={Boolean(errors.companyWebsite)}
	                          aria-describedby={errors.companyWebsite ? "company-website-error" : undefined}
	                          className={`w-full h-12 bg-slate-900 border ${
	                            errors.companyWebsite ? "border-rose-500" : "border-slate-800 focus:border-brand-primary"
	                          } rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all`}
	                        />
	                        {errors.companyWebsite && (
	                          <span id="company-website-error" role="alert" className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.companyWebsite}</span>
	                        )}
	                      </div>

	                      <div className="relative">
	                        <label htmlFor="city-region" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
	                          City / Region <span className="text-slate-600 normal-case tracking-normal">(optional)</span>
	                        </label>
	                        <input
	                          id="city-region"
	                          name="location"
	                          type="text"
	                          value={location}
	                          onChange={(e) => {
	                            setLocation(e.target.value);
	                            setLocationOpen(true);
	                          }}
	                          onFocus={() => setLocationOpen(true)}
	                          onBlur={() => window.setTimeout(() => setLocationOpen(false), 120)}
	                          placeholder="Start typing a city"
	                          autoComplete="address-level2"
	                          className="w-full h-12 bg-slate-900 border border-slate-800 focus:border-brand-primary rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
	                        />
	                        {locationOpen && location.trim().length >= 2 && (
	                          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
	                            {locationLoading ? (
	                              <div className="px-4 py-3 text-xs text-slate-400">Searching locations...</div>
	                            ) : locationOptions.length > 0 ? (
	                              locationOptions.map((option) => (
	                                <button
	                                  key={option}
	                                  type="button"
	                                  onMouseDown={(event) => event.preventDefault()}
	                                  onClick={() => {
	                                    setLocation(option);
	                                    setLocationOpen(false);
	                                  }}
	                                  className="block w-full px-4 py-3 text-left text-xs text-slate-200 hover:bg-slate-900 focus:bg-slate-900 focus:outline-none"
	                                >
	                                  {option}
	                                </button>
	                              ))
	                            ) : (
	                              <div className="px-4 py-3 text-xs text-slate-500">Keep typing or enter it manually.</div>
	                            )}
	                          </div>
	                        )}
	                      </div>
	                    </div>

	                    {/* Budget Dropdown */}
	                    <div>
                      <label htmlFor="monthly-budget" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                        Monthly Budget
                      </label>
                      <div className="relative">
                        <select
                          ref={budgetRef}
                          id="monthly-budget"
                          name="budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          aria-invalid={Boolean(errors.budget)}
                          aria-describedby={errors.budget ? "monthly-budget-error" : undefined}
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
                        <span id="monthly-budget-error" role="alert" className="text-[11px] text-rose-500 mt-1 block ml-1">{errors.budget}</span>
	                      )}
	                    </div>

	                    <div>
	                      <label htmlFor="enquiry-message" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">
	                        Enquiry Message <span className="text-slate-600 normal-case tracking-normal">(optional)</span>
	                      </label>
	                      <textarea
	                        id="enquiry-message"
	                        name="message"
	                        value={message}
	                        onChange={(e) => setMessage(e.target.value)}
	                        rows={4}
	                        maxLength={1000}
	                        placeholder="Tell us what you want help with"
	                        className="w-full min-h-28 resize-y bg-slate-900 border border-slate-800 focus:border-brand-primary rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
	                      />
	                    </div>

	                    {errors.form && (
                      <div
                        ref={formErrorRef}
                        role="alert"
                        tabIndex={-1}
                        className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-rose-400 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                      >
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
                          <span>Start Growth</span>
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
                    Growth Engine Ready!
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
