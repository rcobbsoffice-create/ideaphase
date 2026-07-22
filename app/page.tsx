"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */

function useCounter(end: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const NAV_LINKS = ["Services", "How It Works", "About", "Testimonials", "Contact"];

const SERVICES = [
  { icon: "⬡", color: "#00C9A7", title: "Custom Software Development", desc: "Bespoke applications engineered from the ground up — scalable architectures built for your exact workflow and growth trajectory.", tags: ["Web Apps", "APIs", "Automation"] },
  { icon: "◈", color: "#60A5FA", title: "Web Systems & Platforms", desc: "End-to-end digital platforms, SaaS products, and client portals that turn complex operations into elegant, intuitive experiences.", tags: ["SaaS", "Portals", "E-Commerce"] },
  { icon: "◎", color: "#A78BFA", title: "Idea → Product Strategy", desc: "We take your raw concept through discovery, wireframing, and MVP scoping — so you launch faster with less waste and more confidence.", tags: ["MVP", "Discovery", "Roadmap"] },
  { icon: "⬟", color: "#F59E0B", title: "Growth Engineering", desc: "Conversion-optimized funnels, analytics pipelines, and performance infrastructure that turn traffic into measurable business growth.", tags: ["Analytics", "CRO", "Performance"] },
  { icon: "◇", color: "#F472B6", title: "UI/UX Design Systems", desc: "Pixel-perfect interfaces backed by a coherent design system — built to delight users, reduce churn, and reinforce your brand.", tags: ["Figma", "Design Systems", "Prototyping"] },
  { icon: "⬢", color: "#34D399", title: "Ongoing Support & Scale", desc: "Dedicated retainer partnerships — we stay in your corner for maintenance, feature rollouts, and as your technology co-pilot.", tags: ["Retainer", "DevOps", "Scale"] },
];

const AUDIENCE = [
  { label: "Startups", emoji: "🚀", color: "#00C9A7", desc: "From pre-seed idea to launch-ready product. We help founders ship fast, validate quickly, and build for scale from day one.", points: ["MVP in weeks, not months", "Investor-ready architecture", "Technical co-founder support"] },
  { label: "Small & Midsize Businesses", emoji: "🏢", color: "#60A5FA", desc: "Replace manual processes and duct-tape software with systems that actually fit how your business works — and grows.", points: ["Process automation", "Custom internal tools", "Legacy system modernization"] },
  { label: "Entrepreneurs", emoji: "💡", color: "#A78BFA", desc: "You have the vision. We build the vehicle. Our team translates bold ideas into functional, beautiful digital products.", points: ["Idea-to-spec workshops", "Rapid prototyping", "Full-stack delivery"] },
];

const STEPS = [
  { num: "01", title: "Discovery Call", desc: "We dive deep into your goals, challenges, and vision to define the exact scope and opportunity." },
  { num: "02", title: "Blueprint & Estimate", desc: "A detailed technical blueprint and phased roadmap with transparent, fixed-scope pricing." },
  { num: "03", title: "Build & Iterate", desc: "Agile sprints with weekly demos. You see progress, give feedback, and stay in full control." },
  { num: "04", title: "Launch & Grow", desc: "Deployment, handoff, and ongoing partnership to continuously scale your product." },
];

const STATS = [
  { value: 120, suffix: "+", label: "Projects Shipped" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 3, suffix: "×", label: "Avg. Revenue Growth" },
  { value: 48, suffix: "h", label: "Avg. First Prototype" },
];

const TESTIMONIALS = [
  { quote: "IdeaPhase took our idea from a napkin sketch to a live SaaS product in under 8 weeks. The team's clarity and execution is unmatched.", author: "Marcus T.", role: "Founder, TrackFlow SaaS", avatar: "MT", color: "#00C9A7" },
  { quote: "They rebuilt our entire client management system and automated hours of manual work daily. ROI was felt within the first month.", author: "Sandra R.", role: "CEO, Crescendo Media", avatar: "SR", color: "#60A5FA" },
  { quote: "As a non-technical founder, I needed a team I could trust. IdeaPhase became my technical backbone — and my product shows it.", author: "Jerome A.", role: "Entrepreneur, LaunchPad Labs", avatar: "JA", color: "#A78BFA" },
  { quote: "The team shipped a full e-commerce platform with custom inventory management in 6 weeks. Absolutely outstanding performance.", author: "Priya K.", role: "CEO, Verdant Market", avatar: "PK", color: "#F59E0B" },
  { quote: "Working with IdeaPhase felt like having a senior CTO in our corner. Strategic, communicative, and technically brilliant.", author: "Devon W.", role: "Co-Founder, NexusAI", avatar: "DW", color: "#F472B6" },
];

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════ */

function StatCard({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCounter(value, 2200, start);
  return (
    <div className="text-center">
      <div className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2 leading-none"
        style={{ background: "linear-gradient(135deg, #00C9A7 0%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {count}{suffix}
      </div>
      <p className="text-[#6B6B85] text-sm font-medium uppercase tracking-widest">{label}</p>
    </div>
  );
}

/* 3-D tilt card wrapper */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    el.style.boxShadow = `${-x * 20}px ${y * 20}px 60px rgba(0,201,167,0.08)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.boxShadow = "";
  }, []);
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className={className} style={{ ...style, transition: "transform 0.15s ease, box-shadow 0.15s ease" }}>
      {children}
    </div>
  );
}

/* Scroll-reveal wrapper */
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView(0.15);
  return (
    <div ref={ref} className={className}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* Testimonial Carousel */
function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("right");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number, direction: "left" | "right") => {
    if (animating) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => {
      setActive((next + TESTIMONIALS.length) % TESTIMONIALS.length);
      setAnimating(false);
    }, 320);
  }, [animating]);

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => go(active + 1, "right"), 5000);
  }, [active, go]);

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAuto]);

  const t = TESTIMONIALS[active];
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Card */}
      <div className="relative overflow-hidden">
        <div style={{ opacity: animating ? 0 : 1, transform: animating ? `translateX(${dir === "right" ? "-40px" : "40px"})` : "translateX(0)", transition: "opacity 0.32s ease, transform 0.32s ease" }}
          className="rounded-3xl p-10 md:p-14 border border-[#1E1E2E] bg-[#0A0A0F] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top right, ${t.color}0A 0%, transparent 60%)` }} />
          <div className="text-8xl font-serif leading-none mb-4 opacity-10" style={{ color: t.color }}>&ldquo;</div>
          <p className="text-[#D0D0EE] leading-relaxed text-lg md:text-xl mb-10 -mt-6 font-light">&ldquo;{t.quote}&rdquo;</p>
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
              {t.avatar}
            </div>
            <div>
              <p className="font-semibold text-[#F0F0FF]">{t.author}</p>
              <p className="text-xs text-[#6B6B85] mt-0.5">{t.role}</p>
            </div>
            {/* Stars */}
            <div className="ml-auto flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" fill="#F59E0B" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button id="testimonial-prev" onClick={() => { go(active - 1, "left"); startAuto(); }}
          className="w-11 h-11 rounded-full border border-[#1E1E2E] flex items-center justify-center text-[#6B6B85] hover:border-[#00C9A7] hover:text-[#00C9A7] transition-all duration-200 hover:scale-110">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} id={`testimonial-dot-${i}`} onClick={() => { go(i, i > active ? "right" : "left"); startAuto(); }}
              className="rounded-full transition-all duration-300"
              style={{ width: i === active ? 24 : 8, height: 8, background: i === active ? "#00C9A7" : "#1E1E2E" }} />
          ))}
        </div>

        <button id="testimonial-next" onClick={() => { go(active + 1, "right"); startAuto(); }}
          className="w-11 h-11 rounded-full border border-[#1E1E2E] flex items-center justify-center text-[#6B6B85] hover:border-[#00C9A7] hover:text-[#00C9A7] transition-all duration-200 hover:scale-110">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

/* Inline Contact Form */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1800);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    background: focused === field ? "rgba(0,201,167,0.04)" : "#0D0D16",
    border: `1px solid ${focused === field ? "rgba(0,201,167,0.4)" : "#1E1E2E"}`,
    borderRadius: 12,
    color: "#F0F0FF",
    padding: "14px 16px",
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  });

  if (status === "sent") {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(0,201,167,0.2), rgba(0,201,167,0.05))", border: "2px solid rgba(0,201,167,0.4)" }}>
          <svg className="w-8 h-8 text-[#00C9A7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#F0F0FF] mb-3">Message Received!</h3>
        <p className="text-[#6B6B85]">We&apos;ll be in touch within 24 hours to schedule your discovery call.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-[#6B6B85] uppercase tracking-widest mb-2">Name</label>
        <input id="form-name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
          style={inputStyle("name")} placeholder="Your full name" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#6B6B85] uppercase tracking-widest mb-2">Email</label>
        <input id="form-email" required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
          style={inputStyle("email")} placeholder="you@company.com" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-[#6B6B85] uppercase tracking-widest mb-2">I am a...</label>
        <div className="grid grid-cols-3 gap-3">
          {["Startup", "Business", "Entrepreneur"].map((t) => (
            <button type="button" key={t} id={`form-type-${t.toLowerCase()}`}
              onClick={() => setForm({ ...form, type: t })}
              className="py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
              style={{
                borderColor: form.type === t ? "rgba(0,201,167,0.6)" : "#1E1E2E",
                background: form.type === t ? "rgba(0,201,167,0.08)" : "#0D0D16",
                color: form.type === t ? "#00C9A7" : "#6B6B85",
              }}>
              {t === "Startup" ? "🚀" : t === "Business" ? "🏢" : "💡"} {t}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-[#6B6B85] uppercase tracking-widest mb-2">Tell Us About Your Idea</label>
        <textarea id="form-message" required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
          style={{ ...inputStyle("message"), resize: "none" }} placeholder="Describe your project, goals, or the problem you're trying to solve..." />
      </div>
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center">
        <button id="form-submit" type="submit" disabled={status === "sending"}
          className="relative w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white text-base overflow-hidden transition-all duration-300 hover:scale-[1.03] disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #00C9A7 0%, #00A37D 100%)", boxShadow: "0 0 40px rgba(0,201,167,0.25)" }}>
          {status === "sending" ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              Book My Free Discovery Call
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          )}
        </button>
        <p className="text-xs text-[#3B3B55] text-center sm:text-left">No spam. No obligation. Just a real conversation.</p>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeStep, setActiveStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorExpanded, setCursorExpanded] = useState(false);
  const statsSection = useInView(0.3);
  const stepsSection = useInView(0.3);
  const heroRef = useRef<HTMLElement>(null);

  /* Scroll + section tracking */
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(sy > 20);
      setScrollPct(max > 0 ? (sy / max) * 100 : 0);

      const sections = ["hero", "services", "how-it-works", "about", "testimonials", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Hero parallax on mouse */
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  /* Auto-step animation */
  useEffect(() => {
    if (!stepsSection.inView) return;
    let i = 0;
    const id = setInterval(() => {
      setActiveStep(i % STEPS.length);
      i++;
    }, 900);
    setTimeout(() => { clearInterval(id); setActiveStep(-1); }, 900 * STEPS.length + 400);
    return () => clearInterval(id);
  }, [stepsSection.inView]);

  /* Smooth scroll */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] overflow-x-hidden font-[family-name:var(--font-jakarta)]"
      onMouseEnter={() => setCursorExpanded(false)}>

      {/* ── CUSTOM CURSOR SPOTLIGHT ── */}
      <div className="pointer-events-none fixed z-[9999] mix-blend-screen"
        style={{ left: cursor.x - 200, top: cursor.y - 200, width: 400, height: 400, background: "radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 70%)", borderRadius: "50%", transition: "left 0.08s ease, top 0.08s ease" }} />
      <div className="pointer-events-none fixed z-[9999] rounded-full border border-[#00C9A7]/30 transition-all duration-150"
        style={{ left: cursor.x - (cursorExpanded ? 24 : 6), top: cursor.y - (cursorExpanded ? 24 : 6), width: cursorExpanded ? 48 : 12, height: cursorExpanded ? 48 : 12, background: cursorExpanded ? "transparent" : "rgba(0,201,167,0.5)" }} />

      {/* ── SCROLL PROGRESS BAR ── */}
      <div className="fixed top-0 left-0 z-[60] h-[2px] transition-all duration-100"
        style={{ width: `${scrollPct}%`, background: "linear-gradient(90deg, #00C9A7, #60A5FA, #A78BFA)" }} />

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,15,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(30,30,46,0.6)" : "1px solid transparent",
        }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5" id="nav-logo"
            onMouseEnter={() => setCursorExpanded(true)} onMouseLeave={() => setCursorExpanded(false)}>
            <Image
              src="/favicon-icon.png"
              alt="IDEAPHASE"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-contain transition-transform duration-200 hover:scale-110"
            />
            <span className="font-extrabold text-lg tracking-widest uppercase">IDEA<span style={{ color: "#00C9A7" }}>PHASE</span></span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((item) => {
              const id = item.toLowerCase().replace(/ /g, "-");
              const isActive = activeSection === id || (id === "contact" && activeSection === "contact");
              return (
                <button key={item} onClick={() => scrollTo(id)}
                  onMouseEnter={() => setCursorExpanded(true)} onMouseLeave={() => setCursorExpanded(false)}
                  className="relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg"
                  style={{ color: isActive ? "#00C9A7" : "#A0A0C0" }}>
                  {item}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[#00C9A7]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" id="nav-login"
              onMouseEnter={() => setCursorExpanded(true)} onMouseLeave={() => setCursorExpanded(false)}
              className="text-sm text-[#6B6B85] hover:text-[#A0A0C0] transition-colors font-medium px-3 py-1.5">
              Client Portal
            </Link>
            <button onClick={() => scrollTo("contact")} id="nav-cta"
              onMouseEnter={() => setCursorExpanded(true)} onMouseLeave={() => setCursorExpanded(false)}
              className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.04]"
              style={{ background: "linear-gradient(135deg, #00C9A7, #00A37D)", color: "#fff" }}>
              Start a Project
            </button>
          </div>

          {/* Mobile hamburger */}
          <button id="nav-menu-toggle" className="md:hidden p-2 text-[#A0A0C0]"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className={`w-5 h-0.5 bg-current transition-all mb-1 origin-center ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-all mb-1 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-all origin-center ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden border-t border-[#1E1E2E] bg-[#0D0D16] overflow-hidden transition-all duration-300`}
          style={{ maxHeight: menuOpen ? 400 : 0 }}>
          <div className="px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))}
                className="text-sm text-[#A0A0C0] font-medium text-left py-1.5 hover:text-[#F0F0FF] transition-colors">
                {item}
              </button>
            ))}
            <Link href="/login" className="text-sm text-[#A0A0C0] font-medium py-1.5" onClick={() => setMenuOpen(false)}>Client Portal</Link>
            <button onClick={() => scrollTo("contact")}
              className="text-sm font-semibold px-5 py-2.5 rounded-lg text-center mt-2"
              style={{ background: "linear-gradient(135deg, #00C9A7, #00A37D)", color: "#fff" }}>
              Start a Project
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Parallax orbs — follow mouse */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full opacity-[0.09]"
            style={{
              width: 900, height: 900,
              top: `calc(20% + ${(mousePos.y - 0.5) * -40}px)`,
              left: `calc(50% + ${(mousePos.x - 0.5) * -60}px)`,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, #00C9A7 0%, transparent 70%)",
              transition: "top 0.8s ease, left 0.8s ease",
            }} />
          <div className="absolute rounded-full opacity-[0.06]"
            style={{
              width: 600, height: 600,
              top: `calc(35% + ${(mousePos.y - 0.5) * -80}px)`,
              left: `calc(25% + ${(mousePos.x - 0.5) * -100}px)`,
              background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
              transition: "top 1.2s ease, left 1.2s ease",
            }} />
          <div className="absolute rounded-full opacity-[0.05]"
            style={{
              width: 500, height: 500,
              top: `calc(55% + ${(mousePos.y - 0.5) * -60}px)`,
              right: `calc(20% + ${(mousePos.x - 0.5) * 80}px)`,
              background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)",
              transition: "top 1.0s ease, right 1.0s ease",
            }} />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(rgba(0,201,167,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,167,0.8) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
          {/* Floating particles (deterministic values to prevent SSR hydration mismatch) */}
          {[...Array(20)].map((_, i) => {
            const w = ((i * 17) % 3) + 1.5;
            const h = ((i * 23) % 3) + 1.5;
            const top = `${(i * 37 + 13) % 92}%`;
            const left = `${(i * 53 + 7) % 94}%`;
            const opacity = (((i * 19) % 30) + 10) / 100;
            const duration = ((i * 13) % 7) + 6;
            const delay = ((i * 29) % 4);
            return (
              <div key={i} className="absolute rounded-full bg-[#00C9A7]"
                style={{
                  width: `${w}px`,
                  height: `${h}px`,
                  top,
                  left,
                  opacity,
                  animation: `float-particle ${duration}s ease-in-out infinite ${delay}s`,
                }} />
            );
          })}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold uppercase tracking-widest border"
            style={{ borderColor: "rgba(0,201,167,0.3)", background: "rgba(0,201,167,0.08)", color: "#00C9A7", animation: "fade-up 0.6s ease forwards" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7] animate-pulse" />
            Now Onboarding New Clients — Limited Spots
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight mb-6"
            style={{ animation: "fade-up 0.7s ease 0.1s both" }}>
            We Build the
            <br />
            <span style={{ background: "linear-gradient(135deg, #00C9A7 0%, #60A5FA 60%, #A78BFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Software That{" "}
            </span>
            <br />
            <span className="relative inline-block">
              Elevates Growth
              <span className="absolute bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, #00C9A7, #3B82F6)", animation: "width-grow 1s ease 0.8s both" }} />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#A0A0C0] max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ animation: "fade-up 0.7s ease 0.25s both" }}>
            IdeaPhase is the technology partner for{" "}
            <strong className="text-[#F0F0FF] font-semibold">startups</strong>,{" "}
            <strong className="text-[#F0F0FF] font-semibold">small &amp; midsize businesses</strong>, and{" "}
            <strong className="text-[#F0F0FF] font-semibold">entrepreneurs</strong>{" "}
            ready to turn their ideas into powerful, revenue-generating digital products.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animation: "fade-up 0.7s ease 0.35s both" }}>
            <button onClick={() => scrollTo("contact")} id="hero-primary-cta"
              onMouseEnter={() => setCursorExpanded(true)} onMouseLeave={() => setCursorExpanded(false)}
              className="group relative px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden transition-all duration-300 hover:scale-[1.05]"
              style={{ background: "linear-gradient(135deg, #00C9A7 0%, #00A37D 100%)", boxShadow: "0 0 50px rgba(0,201,167,0.3)" }}>
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #00EED0 0%, #00C9A7 100%)" }} />
            </button>
            <button onClick={() => scrollTo("services")} id="hero-secondary-cta"
              className="px-8 py-4 rounded-xl font-semibold text-base border transition-all duration-300 hover:scale-[1.03] group"
              style={{ borderColor: "#1E1E2E", color: "#A0A0C0", background: "rgba(13,13,22,0.6)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,201,167,0.3)"; setCursorExpanded(true); }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; setCursorExpanded(false); }}>
              Explore Services
            </button>
          </div>

          {/* Social proof badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#6B6B85]"
            style={{ animation: "fade-up 0.7s ease 0.45s both" }}>
            {["120+ Projects Delivered", "No-Fluff Process", "Fixed-Scope Pricing", "Dedicated Dev Team"].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 hover:text-[#A0A0C0] transition-colors cursor-default">
                <svg className="w-4 h-4 text-[#00C9A7]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue — bouncing */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#3B3B55] cursor-pointer"
          onClick={() => scrollTo("services")}
          style={{ animation: "fade-up 1s ease 1.2s both" }}>
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border border-[#3B3B55] rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-[#00C9A7] rounded-full" style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── TECH MARQUEE ── */}
      <section className="border-y border-[#1E1E2E] py-5 overflow-hidden bg-[#0D0D16] relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(90deg, #0D0D16, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(270deg, #0D0D16, transparent)" }} />
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {[...Array(3)].flatMap((_, gi) =>
            ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "PostgreSQL", "Stripe", "Vercel", "AWS", "Figma", "GraphQL", "Redis"]
              .map((tech, i) => (
                <span key={`${gi}-${tech}-${i}`} className="flex items-center gap-3 text-sm text-[#3B3B55] font-semibold uppercase tracking-widest hover:text-[#6B6B85] transition-colors cursor-default">
                  <span className="w-1 h-1 rounded-full bg-[#3B3B55]" />
                  {tech}
                </span>
              ))
          )}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest text-[#00C9A7] font-semibold mb-4">What We Do</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Full-Stack Capabilities,<br />
              <span style={{ background: "linear-gradient(135deg, #00C9A7 0%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Zero Compromise
              </span>
            </h2>
            <p className="text-[#6B6B85] text-lg max-w-xl mx-auto">
              From strategy and design to engineering and deployment — everything under one roof.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 0.07}>
                <TiltCard
                  className="relative rounded-2xl p-8 border border-[#1E1E2E] bg-[#0D0D16] overflow-hidden cursor-default h-full"
                  style={{ willChange: "transform" }}>
                  {/* Glow on inner mouse pos */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 0% 0%, ${svc.color}0D 0%, transparent 60%)` }} />

                  {/* Icon badge */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6"
                    style={{ background: `linear-gradient(135deg, ${svc.color}20, ${svc.color}08)`, border: `1px solid ${svc.color}30` }}>
                    <span style={{ color: svc.color }}>{svc.icon}</span>
                  </div>

                  <h3 className="font-bold text-lg text-[#F0F0FF] mb-3">{svc.title}</h3>
                  <p className="text-[#6B6B85] text-sm leading-relaxed mb-6">{svc.desc}</p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {svc.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md border transition-colors duration-200"
                        style={{ borderColor: "#1E1E2E", color: "#6B6B85", background: "#1A1A28" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${svc.color}40`; e.currentTarget.style.color = svc.color; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#6B6B85"; }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-32 px-6 bg-[#0D0D16] border-y border-[#1E1E2E]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest text-[#00C9A7] font-semibold mb-4">The Process</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              From Idea to Live —{" "}
              <span style={{ background: "linear-gradient(135deg, #00C9A7 0%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Without the Chaos
              </span>
            </h2>
          </Reveal>

          <div ref={stepsSection.ref} className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {/* Animated progress line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-[1px] bg-[#1E1E2E]" />
            <div className="hidden md:block absolute top-8 left-[12.5%] h-[1px] bg-gradient-to-r from-[#00C9A7] to-transparent transition-all duration-700"
              style={{ width: activeStep === -1 ? "75%" : `${(activeStep / (STEPS.length - 1)) * 75}%`, right: "12.5%" }} />

            {STEPS.map((step, i) => {
              const done = activeStep === -1 || i <= activeStep;
              return (
                <div key={step.num} id={`step-${i}`}
                  className="relative flex flex-col items-center text-center px-6 py-8 group cursor-default"
                  onMouseEnter={() => setActiveStep(i)}>
                  <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-6 relative z-10 font-extrabold text-lg transition-all duration-500"
                    style={{
                      borderColor: done ? "#00C9A7" : "rgba(0,201,167,0.2)",
                      background: done ? "linear-gradient(135deg, rgba(0,201,167,0.2) 0%, rgba(0,201,167,0.06) 100%)" : "rgba(13,13,22,0.8)",
                      color: done ? "#00C9A7" : "#3B3B55",
                      boxShadow: done ? "0 0 30px rgba(0,201,167,0.2)" : "none",
                      transform: done ? "scale(1.08)" : "scale(1)",
                    }}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-3 transition-colors duration-300"
                    style={{ color: done ? "#F0F0FF" : "#3B3B55" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed transition-colors duration-300"
                    style={{ color: done ? "#6B6B85" : "#2A2A3A" }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest text-[#00C9A7] font-semibold mb-4">Who We Serve</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Built for Builders,{" "}
              <span style={{ background: "linear-gradient(135deg, #00C9A7 0%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Dreamers &amp; Operators
              </span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AUDIENCE.map((aud, i) => (
              <Reveal key={aud.label} delay={i * 0.12}>
                <TiltCard className="rounded-2xl p-10 border border-[#1E1E2E] bg-[#0D0D16] relative overflow-hidden h-full cursor-default">
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${aud.color}, transparent)` }} />
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.04]"
                    style={{ background: `radial-gradient(circle, ${aud.color} 0%, transparent 70%)`, transform: "translate(30%, -30%)" }} />

                  <div className="text-5xl mb-6 select-none">{aud.emoji}</div>
                  <h3 className="font-extrabold text-2xl text-[#F0F0FF] mb-4">{aud.label}</h3>
                  <p className="text-[#6B6B85] leading-relaxed mb-8 text-sm">{aud.desc}</p>
                  <ul className="space-y-3">
                    {aud.points.map((pt, pi) => (
                      <li key={pt} className="flex items-center gap-3 text-sm font-medium"
                        style={{ animation: `fade-up 0.4s ease ${pi * 0.1}s both`, color: aud.color }}>
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[#A0A0C0]">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-24 px-6 border-y border-[#1E1E2E]"
        style={{ background: "linear-gradient(180deg, #0D0D16 0%, #0A0A0F 100%)" }}>
        <div ref={statsSection.ref} className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map((s) => (
            <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} start={statsSection.inView} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-32 px-6 bg-[#0D0D16]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <p className="text-xs uppercase tracking-widest text-[#00C9A7] font-semibold mb-4">Client Results</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Words from{" "}
              <span style={{ background: "linear-gradient(135deg, #00C9A7 0%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Those Who&apos;ve Grown
              </span>
            </h2>
          </Reveal>
          <Reveal>
            <TestimonialCarousel />
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT / CTA ── */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-[#00C9A7] font-semibold mb-4">Ready to Build?</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your Idea Deserves<br />
              <span style={{ background: "linear-gradient(135deg, #00C9A7 0%, #60A5FA 60%, #A78BFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                World-Class Execution
              </span>
            </h2>
            <p className="text-[#6B6B85] text-lg max-w-xl mx-auto">
              Fill out the form below. We&apos;ll review your project and reach out within 24 hours to schedule your free discovery call.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-3xl p-8 md:p-14 border border-[#1E1E2E] relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0D0D16 0%, #0A150F 50%, #0D0D16 100%)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(0,201,167,0.12) 0%, transparent 60%)" }} />
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(90deg, transparent, #00C9A7, transparent)" }} />
              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 text-center">
            <p className="text-sm text-[#3B3B55]">
              Prefer to jump straight in?{" "}
              <a href="mailto:hello@ideaphase.dev" className="text-[#00C9A7] hover:underline">hello@ideaphase.dev</a>
              {" "}·{" "}
              <Link href="/login" className="text-[#6B6B85] hover:text-[#A0A0C0] transition-colors">Existing client? Sign in →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1E1E2E] py-12 px-6 bg-[#07070D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5" id="footer-logo">
            <Image
              src="/favicon-icon.png"
              alt="IDEAPHASE"
              width={28}
              height={28}
              className="w-7 h-7 rounded-md object-contain"
            />
            <span className="font-extrabold text-sm tracking-widest uppercase">IDEA<span style={{ color: "#00C9A7" }}>PHASE</span></span>
          </button>

          <p className="text-xs text-[#3B3B55] text-center">
            &copy; {new Date().getFullYear()} IdeaPhase Development Group · Elevating growth through technology.
          </p>

          <div className="flex items-center gap-6 text-xs text-[#3B3B55]">
            <a href="#" className="hover:text-[#6B6B85] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#6B6B85] transition-colors">Terms</a>
            <Link href="/login" className="hover:text-[#6B6B85] transition-colors">Client Portal</Link>
          </div>
        </div>
      </footer>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes width-grow {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.15; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.4; }
        }
        @keyframes scroll-dot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(14px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
