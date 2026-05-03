import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Pill,
  Clock,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Send,
  Mic,
  Shield,
  ArrowRight,
  Check,
  AlertCircle,
  TrendingUp,
  Lock,
  Database,
  ChevronRight,
  MoreVertical,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Bot,
  User as UserIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (Serene Health palette)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary: "#006172",
  primaryContainer: "#2a7a8c",
  onPrimary: "#ffffff",
  secondary: "#276676",
  secondaryContainer: "#b0ecfe",
  onSecondaryContainer: "#2e6c7c",
  tertiaryContainer: "#d4e6e5",
  surface: "#f9f9ff",
  surfaceContainerLow: "#f0f3ff",
  surfaceContainer: "#e7eeff",
  surfaceContainerHigh: "#dee8ff",
  surfaceContainerHighest: "#d8e3fa",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#111c2c",
  onSurfaceVariant: "#3f484b",
  outline: "#6f797c",
  outlineVariant: "#bec8cb",
  primaryFixed: "#acedff",
  inversePrimary: "#88d1e5",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  successText: "#1d6e3e",
  successBg: "#d6f3df",
  pendingText: "#7a5300",
  pendingBg: "#fdecc8",
};

const fontStack = `'Manrope', ui-sans-serif, system-ui, sans-serif`;
const labelStack = `'Public Sans', ui-sans-serif, system-ui, sans-serif`;

// ─────────────────────────────────────────────────────────────────────────────
// Initial seed data
// ─────────────────────────────────────────────────────────────────────────────
const initialMeds = [
  { id: 1, name: "Lisinopril", dose: "10mg Oral Tablet", time: "08:00 AM", timeOrder: 8, status: "taken", color: "#88d1e5" },
  { id: 2, name: "Multivitamin", dose: "1 Capsule", time: "12:00 PM", timeOrder: 12, status: "taken", color: "#94d0e1" },
  { id: 3, name: "Vitamin D3", dose: "1000 IU • Softgel", time: "12:30 PM", timeOrder: 12.5, status: "pending", color: "#b0ecfe" },
  { id: 4, name: "Omega-3", dose: "Liquid", time: "09:00 AM", timeOrder: 9, status: "missed", color: "#88d1e5" },
  { id: 5, name: "Metformin", dose: "500mg Oral Tablet", time: "06:00 PM", timeOrder: 18, status: "scheduled", color: "#2a7a8c" },
  { id: 6, name: "Ibuprofen", dose: "200mg Tablet", time: "06:00 PM", timeOrder: 18, status: "scheduled", color: "#94d0e1" },
  { id: 7, name: "Magnesium", dose: "400mg Capsule", time: "09:30 PM", timeOrder: 21.5, status: "scheduled", color: "#88d1e5" },
  { id: 8, name: "Melatonin", dose: "5mg Oral Tablet", time: "10:00 PM", timeOrder: 22, status: "scheduled", color: "#b0ecfe" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tiny helpers
// ─────────────────────────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const map = {
    taken: { bg: C.successBg, fg: C.successText, label: "Taken" },
    pending: { bg: C.pendingBg, fg: C.pendingText, label: "Pending" },
    missed: { bg: C.errorContainer, fg: C.onErrorContainer, label: "Missed" },
    scheduled: { bg: C.surfaceContainerHigh, fg: C.onSurfaceVariant, label: "Scheduled" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        fontFamily: labelStack,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      {s.label}
    </span>
  );
};

const PillIconSquare = ({ color = C.secondaryContainer, fg = C.primary, icon = "pill" }) => (
  <div
    className="flex items-center justify-center"
    style={{
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: color,
      color: fg,
      flexShrink: 0,
    }}
  >
    {icon === "pill" ? <Pill size={20} strokeWidth={2} /> : <Database size={20} strokeWidth={2} />}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Top navigation (shared)
// ─────────────────────────────────────────────────────────────────────────────
const TopNav = ({ active, onNavigate }) => {
  const items = [
    { key: "landing", label: "Dashboard" },
    { key: "schedule", label: "Schedule" },
    { key: "chat", label: "Chat" },
    { key: "history", label: "History" },
  ];
  return (
    <header
      className="sticky top-0 z-30"
      style={{ backgroundColor: C.surfaceContainerLowest, borderBottom: `1px solid ${C.outlineVariant}` }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2"
          style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 22, color: C.primary, letterSpacing: "-0.01em" }}
        >
          MedCare <span style={{ fontWeight: 500 }}>Chat</span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {items.map((it) => {
            const isActive = active === it.key;
            return (
              <button
                key={it.key}
                onClick={() => onNavigate(it.key)}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  fontFamily: fontStack,
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 15,
                  color: isActive ? C.primary : C.onSurfaceVariant,
                  borderBottom: isActive ? `2px solid ${C.primary}` : "2px solid transparent",
                  borderRadius: 0,
                  paddingBottom: 6,
                  marginBottom: -1,
                }}
              >
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-[#f0f3ff] transition" aria-label="Notifications">
            <Bell size={20} color={C.onSurfaceVariant} strokeWidth={1.75} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: C.error }}
            />
          </button>
          <button className="p-2 rounded-full hover:bg-[#f0f3ff] transition" aria-label="Settings">
            <Settings size={20} color={C.onSurfaceVariant} strokeWidth={1.75} />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${C.primaryContainer}, ${C.primary})`, color: C.onPrimary, fontFamily: fontStack, fontWeight: 600, fontSize: 14 }}
          >
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Landing page
// ─────────────────────────────────────────────────────────────────────────────
const Landing = ({ onNavigate }) => {
  return (
    <div style={{ backgroundColor: C.surfaceContainerLowest, color: C.onSurface, fontFamily: fontStack }}>
      {/* Hero */}
      <section style={{ backgroundColor: C.surfaceContainerLow }} className="px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: C.secondaryContainer, color: C.onSecondaryContainer, fontFamily: labelStack, fontSize: 12, fontWeight: 600 }}
            >
              <Shield size={14} strokeWidth={2} />
              Always here for your health
            </span>

            <h1
              style={{
                fontFamily: fontStack,
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: C.onSurface,
              }}
            >
              Stay on track with your health,{" "}
              <span style={{ color: C.primary }}>one chat at a time.</span>
            </h1>

            <p
              className="mt-6 max-w-lg"
              style={{ fontFamily: fontStack, fontSize: 18, lineHeight: 1.6, color: C.onSurfaceVariant }}
            >
              MedCare Chat is your empathetic digital companion, designed to simplify medication
              management through simple, natural conversations. Never miss a dose again.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("chat")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-transform active:scale-[0.98]"
                style={{ backgroundColor: C.primary, color: C.onPrimary, fontFamily: fontStack, fontWeight: 600, fontSize: 15 }}
              >
                Start Chatting
                <ArrowRight size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => onNavigate("schedule")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${C.outlineVariant}`,
                  color: C.onSurface,
                  fontFamily: fontStack,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                See How it Works
              </button>
            </div>
          </div>

          {/* Hero chat preview */}
          <div
            className="relative rounded-2xl p-6 lg:p-7"
            style={{
              backgroundColor: C.surfaceContainerLowest,
              boxShadow: "0 12px 40px rgba(0, 97, 114, 0.08), 0 2px 8px rgba(0, 97, 114, 0.04)",
            }}
          >
            <div className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: `1px solid ${C.outlineVariant}` }}>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ backgroundColor: C.secondaryContainer, color: C.primary }}
              >
                <Bot size={22} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 16, color: C.onSurface }}>Health Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1d6e3e" }} />
                  <span style={{ fontFamily: labelStack, fontSize: 12, color: C.onSurfaceVariant, fontWeight: 500 }}>
                    Active now
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]"
                style={{ backgroundColor: C.tertiaryContainer, color: C.onSurface, fontFamily: fontStack, fontSize: 15, lineHeight: 1.5 }}
              >
                Good morning! It's time for your 500mg Metformin dose. Have you taken it yet?
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto"
                style={{ backgroundColor: C.primary, color: C.onPrimary, fontFamily: fontStack, fontSize: 15, fontWeight: 500 }}
              >
                Yes, just took it!
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm max-w-[90%]"
                style={{ backgroundColor: C.tertiaryContainer, color: C.onSurface, fontFamily: fontStack, fontSize: 15, lineHeight: 1.5 }}
              >
                Great! I've logged that for today. I'll remind you about your evening dose at 7:00 PM.
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${C.outlineVariant}` }}>
              {["Yes, taken", "Remind me later"].map((t, i) => (
                <button
                  key={t}
                  className="px-4 py-1.5 rounded-full"
                  style={{
                    backgroundColor: i === 0 ? C.surfaceContainerLowest : C.surfaceContainerLow,
                    border: `1px solid ${i === 0 ? C.primary : C.outlineVariant}`,
                    color: i === 0 ? C.primary : C.onSurfaceVariant,
                    fontFamily: labelStack,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-10 py-16">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 style={{ fontFamily: fontStack, fontSize: 32, fontWeight: 600, letterSpacing: "-0.01em", color: C.onSurface }}>
              Empowering your health journey
            </h2>
            <p className="mt-3" style={{ fontFamily: fontStack, fontSize: 16, color: C.onSurfaceVariant, lineHeight: 1.6 }}>
              Our smart assistant combines clinical reliability with human-like empathy to help you manage your daily wellness routine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <FeatureCard
              icon={<Bell size={20} strokeWidth={2} />}
              title="Smart Reminders"
              body="Personalized alerts that adapt to your schedule and time zone, ensuring you're always on top of your meds."
            />
            <FeatureCard
              dark
              icon={<Lock size={20} strokeWidth={2} color={C.onPrimary} />}
              title="Secure & Private"
              body="HIPAA-compliant data encryption keeps your health information strictly between you and your healthcare team."
            />
            <FeatureCard
              icon={<TrendingUp size={20} strokeWidth={2} />}
              title="Health Insights"
              body="View weekly adherence reports and share them directly with your doctor."
            />
            <FeatureCard
              icon={<Database size={20} strokeWidth={2} />}
              title="Medication Database"
              body="Integrated with a comprehensive database to provide dosage instructions and potential interaction warnings automatically."
            />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ backgroundColor: C.surfaceContainerLow }} className="px-6 lg:px-10 py-16">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: fontStack, fontSize: 32, fontWeight: 600, letterSpacing: "-0.01em", color: C.onSurface }}>
              Start your journey in minutes
            </h2>
            <div className="w-12 h-0.5 mx-auto mt-3" style={{ backgroundColor: C.primary }} />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting dotted line */}
            <div
              className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-0"
              style={{ borderTop: `2px dashed ${C.inversePrimary}` }}
            />
            {[
              { icon: <MessageSquare size={22} strokeWidth={1.75} />, num: 1, title: "Add Medications", body: "Simply tell the bot what you're taking or scan your prescription label using your camera." },
              { icon: <Clock size={22} strokeWidth={1.75} />, num: 2, title: "Set the Schedule", body: "Confirm the dosage and times. Our assistant suggests optimal timing based on your lifestyle." },
              { icon: <CheckCircle2 size={22} strokeWidth={1.75} />, num: 3, title: "Log and Stay Healthy", body: "Receive gentle nudges and reply to log your doses instantly. We do the rest of the tracking." },
            ].map((s) => (
              <div key={s.num} className="text-center relative">
                <div
                  className="w-14 h-14 rounded-full mx-auto flex items-center justify-center relative z-10"
                  style={{ backgroundColor: C.surfaceContainerLowest, border: `1.5px solid ${C.primary}`, color: C.primary }}
                >
                  {s.icon}
                </div>
                <h3 className="mt-5" style={{ fontFamily: fontStack, fontSize: 18, fontWeight: 600, color: C.onSurface }}>
                  {s.num}. {s.title}
                </h3>
                <p className="mt-2 max-w-xs mx-auto" style={{ fontFamily: fontStack, fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.55 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-10 py-12">
        <div
          className="max-w-[1180px] mx-auto rounded-3xl px-8 py-12 lg:py-14 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryContainer} 100%)`,
            color: C.onPrimary,
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-15"
            style={{ background: C.inversePrimary }}
          />
          <div
            className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full opacity-10"
            style={{ background: C.primaryFixed }}
          />
          <div className="relative">
            <h2 style={{ fontFamily: fontStack, fontSize: 26, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Ready to simplify your health?
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ fontFamily: fontStack, fontSize: 16, opacity: 0.9, lineHeight: 1.6 }}>
              Join over 50,000 patients who have regained control of their medication routines with MedCare Chat.
            </p>
            <button
              onClick={() => onNavigate("chat")}
              className="mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-lg transition-transform active:scale-[0.98]"
              style={{ backgroundColor: C.surfaceContainerLowest, color: C.primary, fontFamily: fontStack, fontWeight: 600, fontSize: 15 }}
            >
              Get Started for Free
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-10 py-10" style={{ borderTop: `1px solid ${C.outlineVariant}` }}>
        <div className="max-w-[1180px] mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 18, color: C.primary }}>MedCare Chat</div>
            <p className="mt-2" style={{ fontFamily: fontStack, fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.6 }}>
              Empathetic health companions for a digital world. Helping you live better, every day.
            </p>
          </div>
          {[
            { h: "Product", items: ["Features", "Pricing", "Mobile App"] },
            { h: "Support", items: ["Help Center", "Privacy Policy", "Terms of Service"] },
            { h: "Download", items: ["iOS", "Android"] },
          ].map((col) => (
            <div key={col.h}>
              <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 14, color: C.onSurface }}>{col.h}</div>
              <ul className="mt-3 space-y-2">
                {col.items.map((i) => (
                  <li key={i} style={{ fontFamily: fontStack, fontSize: 13, color: C.onSurfaceVariant }}>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="max-w-[1180px] mx-auto mt-8 pt-6 flex justify-between flex-wrap gap-3"
          style={{ borderTop: `1px solid ${C.outlineVariant}`, fontFamily: labelStack, fontSize: 12, color: C.onSurfaceVariant }}
        >
          <span>© 2026 MedCare Chat. All rights reserved.</span>
          <span>System Status: Operational</span>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, body, dark = false }) => (
  <div
    className="rounded-2xl p-6 transition-shadow"
    style={{
      backgroundColor: dark ? C.primary : C.surfaceContainerLowest,
      color: dark ? C.onPrimary : C.onSurface,
      border: dark ? "none" : `1px solid ${C.outlineVariant}`,
      boxShadow: dark ? "0 8px 24px rgba(0, 97, 114, 0.18)" : "0 1px 3px rgba(0, 97, 114, 0.04)",
    }}
  >
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
      style={{
        backgroundColor: dark ? "rgba(255,255,255,0.12)" : C.secondaryContainer,
        color: dark ? C.onPrimary : C.primary,
      }}
    >
      {icon}
    </div>
    <h3 style={{ fontFamily: fontStack, fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
    <p style={{ fontFamily: fontStack, fontSize: 14, lineHeight: 1.55, color: dark ? "rgba(255,255,255,0.85)" : C.onSurfaceVariant }}>
      {body}
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar (chat + schedule shared)
// ─────────────────────────────────────────────────────────────────────────────
const SideNav = ({ active, onNavigate }) => {
  const items = [
    { key: "landing", label: "Home", icon: <Home size={19} strokeWidth={1.75} /> },
    { key: "schedule", label: "My Medications", icon: <Pill size={19} strokeWidth={1.75} /> },
    { key: "schedule", label: "Reminders", icon: <Clock size={19} strokeWidth={1.75} />, sub: "reminders" },
    { key: "chat", label: "Chat History", icon: <MessageSquare size={19} strokeWidth={1.75} /> },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col"
      style={{
        width: 240,
        flexShrink: 0,
        borderRight: `1px solid ${C.outlineVariant}`,
        backgroundColor: C.surfaceContainerLowest,
        padding: "20px 16px",
      }}
    >
      <div className="flex items-start gap-3 px-2 pb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: C.secondaryContainer, color: C.primary }}
        >
          <Shield size={20} strokeWidth={1.75} />
        </div>
        <div>
          <div style={{ fontFamily: fontStack, fontWeight: 700, fontSize: 16, color: C.onSurface, lineHeight: 1.2 }}>
            Health
            <br />
            Assistant
          </div>
          <div style={{ fontFamily: labelStack, fontSize: 11, color: C.onSurfaceVariant, marginTop: 4, fontWeight: 500 }}>
            Always here to help
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {items.map((it) => {
          const visuallyActive =
            (active === "chat" && it.label === "Chat History") ||
            (active === "schedule" && it.label === "Reminders");
          return (
            <button
              key={it.label}
              onClick={() => onNavigate(it.key)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
              style={{
                backgroundColor: visuallyActive ? C.surfaceContainer : "transparent",
                color: visuallyActive ? C.primary : C.onSurfaceVariant,
                fontFamily: fontStack,
                fontWeight: visuallyActive ? 600 : 500,
                fontSize: 14,
              }}
            >
              {it.icon}
              {it.label}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => onNavigate("chat")}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-transform active:scale-[0.98]"
        style={{ backgroundColor: C.primary, color: C.onPrimary, fontFamily: fontStack, fontWeight: 600, fontSize: 14 }}
      >
        <Plus size={18} strokeWidth={2} />
        New Reminder
      </button>
    </aside>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Chat interface
// ─────────────────────────────────────────────────────────────────────────────
const ChatBubble = ({ from, children, withCard }) => {
  const isBot = from === "bot";
  return (
    <div className={`flex items-start gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          backgroundColor: isBot ? C.surfaceContainerLowest : C.primary,
          color: isBot ? C.primary : C.onPrimary,
          border: isBot ? `1px solid ${C.outlineVariant}` : "none",
        }}
      >
        {isBot ? <Bot size={18} strokeWidth={1.75} /> : <UserIcon size={16} strokeWidth={2} />}
      </div>
      <div className={`flex flex-col gap-2 max-w-[78%] ${isBot ? "" : "items-end"}`}>
        <div
          className="px-4 py-3"
          style={{
            backgroundColor: isBot ? C.tertiaryContainer : C.primary,
            color: isBot ? C.onSurface : C.onPrimary,
            fontFamily: fontStack,
            fontSize: 15,
            lineHeight: 1.5,
            borderRadius: 16,
            borderTopLeftRadius: isBot ? 4 : 16,
            borderTopRightRadius: isBot ? 16 : 4,
            fontWeight: isBot ? 400 : 500,
          }}
        >
          {children}
        </div>
        {withCard && (
          <div
            className="flex items-center gap-3 p-3 rounded-2xl"
            style={{
              backgroundColor: C.surfaceContainerLowest,
              border: `1px solid ${C.outlineVariant}`,
              minWidth: 280,
            }}
          >
            <PillIconSquare color={C.secondaryContainer} fg={C.primary} />
            <div className="flex-1">
              <div style={{ fontFamily: fontStack, fontWeight: 600, fontSize: 15, color: C.primary }}>{withCard.name}</div>
              <div style={{ fontFamily: labelStack, fontSize: 12, color: C.onSurfaceVariant, marginTop: 2, fontWeight: 500 }}>
                {withCard.dose} • {withCard.frequency}
              </div>
            </div>
            <button className="p-1 rounded-full hover:bg-[#f0f3ff]">
              <MoreVertical size={18} color={C.onSurfaceVariant} strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickReplies = ({ replies, onPick }) => (
  <div className="flex gap-2 flex-wrap pl-12">
    {replies.map((r) => (
      <button
        key={r.label}
        onClick={() => onPick(r)}
        className="px-4 py-2 rounded-full transition-colors"
        style={{
          backgroundColor: C.surfaceContainerLow,
          border: `1px solid ${C.outlineVariant}`,
          color: C.primary,
          fontFamily: labelStack,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {r.label}
      </button>
    ))}
  </div>
);

const ChatView = ({ meds, setMeds, onNavigate }) => {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! I'm your health assistant. Would you like to set up a new medication reminder today?" },
    { id: 2, from: "user", text: "Yes, I need to set a reminder for Amoxicillin, twice daily." },
    {
      id: 3,
      from: "bot",
      text: "I can help with that. Amoxicillin is typically taken every 12 hours. Would you like me to schedule these for 8:00 AM and 8:00 PM?",
      card: { name: "Amoxicillin", dose: "500mg", frequency: "2x Daily" },
      replies: [
        { label: "Yes, that's perfect", action: "confirm-amox" },
        { label: "Adjust times", action: "adjust" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addBotMessage = (msg, delay = 700) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((m) => [...m, { id: Date.now() + Math.random(), from: "bot", ...msg }]);
    }, delay);
  };

  const handleQuickReply = (reply, msgId) => {
    setMessages((m) => [
      ...m.map((mm) => (mm.id === msgId ? { ...mm, replies: undefined } : mm)),
      { id: Date.now(), from: "user", text: reply.label },
    ]);

    if (reply.action === "confirm-amox") {
      const newMed = {
        id: Date.now(),
        name: "Amoxicillin",
        dose: "500mg Oral Tablet",
        time: "08:00 AM",
        timeOrder: 8,
        status: "scheduled",
        color: "#2a7a8c",
      };
      const newMed2 = { ...newMed, id: Date.now() + 1, time: "08:00 PM", timeOrder: 20 };
      setMeds((prev) => [...prev, newMed, newMed2]);
      addBotMessage({
        text: "Done! Amoxicillin is now in your schedule for 8:00 AM and 8:00 PM. I'll send a gentle reminder when each dose is due. Anything else?",
        replies: [
          { label: "View my schedule", action: "view-schedule" },
          { label: "Add another med", action: "add-another" },
        ],
      });
    } else if (reply.action === "adjust") {
      addBotMessage({
        text: "No problem. What times work best for you? You can say something like \"7 AM and 7 PM.\"",
      });
    } else if (reply.action === "view-schedule") {
      onNavigate("schedule");
    } else if (reply.action === "add-another") {
      addBotMessage({
        text: "Sure! Just tell me the medication name and how often you take it.",
      });
    } else if (reply.action === "mark-taken") {
      const target = meds.find((mm) => mm.id === reply.medId);
      setMeds((prev) => prev.map((mm) => (mm.id === reply.medId ? { ...mm, status: "taken" } : mm)));
      addBotMessage({
        text: `Logged ${target?.name || "that"} as taken. Nice work staying on track!`,
      });
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text }]);
    setInput("");

    const lc = text.toLowerCase();
    if (lc.includes("schedule") || lc.includes("today") || lc.includes("upcoming")) {
      addBotMessage({
        text: "Here's a snapshot: 3 of 5 doses taken today. Your next is Vitamin D3 at 12:30 PM.",
        replies: [{ label: "View my schedule", action: "view-schedule" }],
      });
    } else if (lc.includes("missed") || lc.includes("omega")) {
      const omega = meds.find((m) => m.name.toLowerCase().includes("omega"));
      addBotMessage({
        text: omega
          ? `Your Omega-3 dose at ${omega.time} was missed. Want to log it as taken now or skip for today?`
          : "I don't see any missed doses right now. Nice work!",
        replies: omega
          ? [
              { label: "Log as taken", action: "mark-taken", medId: omega.id },
              { label: "Skip today", action: "skip" },
            ]
          : [],
      });
    } else if (lc.includes("hello") || lc.includes("hi") || lc.includes("hey")) {
      addBotMessage({ text: "Hi there! How can I help with your meds today?" });
    } else {
      addBotMessage({
        text: "Got it. I can set up reminders, log doses, or show your schedule — just let me know what you'd like.",
        replies: [
          { label: "Show my schedule", action: "view-schedule" },
          { label: "Log a dose", action: "add-another" },
        ],
      });
    }
  };

  const upNext = meds.filter((m) => m.status === "pending" || m.status === "missed").slice(0, 2);
  const laterToday = meds.filter((m) => m.status === "scheduled" && m.timeOrder >= 14).slice(0, 3);
  const dailyTaken = meds.filter((m) => m.status === "taken").length;
  const dailyTotal = meds.length;
  const pct = Math.round((dailyTaken / dailyTotal) * 100);

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 64px)", backgroundColor: C.surface }}>
      <SideNav active="chat" onNavigate={onNavigate} />

      <main className="flex-1 flex flex-col" style={{ backgroundColor: C.surfaceContainerLowest, borderRight: `1px solid ${C.outlineVariant}` }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="max-w-[680px] mx-auto">
            <div className="flex justify-center mb-6">
              <span
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: C.surfaceContainer, color: C.onSurfaceVariant, fontFamily: labelStack, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}
              >
                TODAY
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {messages.map((m) => (
                <React.Fragment key={m.id}>
                  <ChatBubble from={m.from} withCard={m.card}>
                    {m.text}
                  </ChatBubble>
                  {m.replies && m.replies.length > 0 && (
                    <QuickReplies replies={m.replies} onPick={(r) => handleQuickReply(r, m.id)} />
                  )}
                </React.Fragment>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3 pl-1">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: C.surfaceContainerLowest, color: C.primary, border: `1px solid ${C.outlineVariant}` }}
                  >
                    <Bot size={18} strokeWidth={1.75} />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{ backgroundColor: C.tertiaryContainer, borderTopLeftRadius: 4 }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: C.primary,
                            animation: `bounce 1.2s ${i * 0.15}s infinite ease-in-out`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="px-6 lg:px-10 py-4" style={{ backgroundColor: C.surfaceContainerLowest, borderTop: `1px solid ${C.outlineVariant}` }}>
          <div className="max-w-[680px] mx-auto flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: C.surfaceContainerLow, color: C.onSurfaceVariant }}
              aria-label="Attach"
            >
              <Plus size={20} strokeWidth={2} />
            </button>
            <div
              className="flex-1 flex items-center gap-2 px-4 rounded-full"
              style={{ backgroundColor: C.surfaceContainerLow, height: 46 }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none"
                style={{ fontFamily: fontStack, fontSize: 15, color: C.onSurface }}
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95"
                style={{ backgroundColor: input.trim() ? C.primary : C.outlineVariant, color: C.onPrimary }}
                aria-label="Send"
              >
                <Send size={16} strokeWidth={2} />
              </button>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: C.surfaceContainerLow, color: C.onSurfaceVariant }}
              aria-label="Voice input"
            >
              <Mic size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </main>

      {/* Right sidebar — Up Next */}
      <aside
        className="hidden xl:block"
        style={{
          width: 320,
          flexShrink: 0,
          backgroundColor: C.surfaceContainerLow,
          padding: "24px 20px",
        }}
      >
        <div className="flex items-baseline justify-between mb-4">
          <h3 style={{ fontFamily: fontStack, fontSize: 18, fontWeight: 600, color: C.onSurface }}>Up Next</h3>
          <button onClick={() => onNavigate("schedule")} style={{ fontFamily: labelStack, fontSize: 13, color: C.primary, fontWeight: 600 }}>
            View All
          </button>
        </div>

        <div className="space-y-3">
          {upNext.length === 0 && (
            <div
              className="p-4 rounded-2xl text-center"
              style={{ backgroundColor: C.surfaceContainerLowest, color: C.onSurfaceVariant, fontFamily: fontStack, fontSize: 13 }}
            >
              You're all caught up — nice!
            </div>
          )}
          {upNext.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: C.surfaceContainerLowest,
                borderLeft: `3px solid ${m.status === "missed" ? C.error : C.pendingText}`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontFamily: fontStack, fontSize: 16, fontWeight: 600, color: C.onSurface }}>{m.name}</div>
                  <div style={{ fontFamily: labelStack, fontSize: 12, color: C.onSurfaceVariant, marginTop: 4, fontWeight: 500 }}>
                    {m.dose}
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: m.status === "missed" ? C.error : C.onSurface }}>
                    {m.status === "missed" ? "Missed" : m.time}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setMeds((prev) => prev.map((mm) => (mm.id === m.id ? { ...mm, status: "scheduled" } : mm)))}
                  className="flex-1 py-1.5 rounded-md"
                  style={{ backgroundColor: C.surfaceContainer, color: C.onSurfaceVariant, fontFamily: labelStack, fontSize: 13, fontWeight: 600 }}
                >
                  Skip
                </button>
                <button
                  onClick={() => setMeds((prev) => prev.map((mm) => (mm.id === m.id ? { ...mm, status: "taken" } : mm)))}
                  className="flex-1 py-1.5 rounded-md"
                  style={{ backgroundColor: C.primary, color: C.onPrimary, fontFamily: labelStack, fontSize: 13, fontWeight: 600 }}
                >
                  Take
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 mb-3" style={{ fontFamily: labelStack, fontSize: 11, color: C.onSurfaceVariant, fontWeight: 600, letterSpacing: "0.08em" }}>
          LATER TODAY
        </div>
        <div className="space-y-3">
          {laterToday.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: C.surfaceContainerLowest, color: C.primary, border: `1px solid ${C.outlineVariant}` }}
              >
                <Clock size={16} strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: C.onSurface }}>{m.name}</div>
                <div style={{ fontFamily: labelStack, fontSize: 12, color: C.onSurfaceVariant, fontWeight: 500 }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Goal */}
        <div
          className="mt-6 p-4 rounded-2xl relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`, color: C.onPrimary }}
        >
          <div
            className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10"
            style={{ background: C.primaryFixed }}
          />
          <div className="relative">
            <div style={{ fontFamily: fontStack, fontSize: 16, fontWeight: 600 }}>Daily Goal</div>
            <div style={{ fontFamily: fontStack, fontSize: 13, opacity: 0.9, marginTop: 2 }}>
              {dailyTaken} of {dailyTotal} medications taken
            </div>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: C.onPrimary }} />
            </div>
            <div className="mt-2" style={{ fontFamily: labelStack, fontSize: 12, fontWeight: 600 }}>
              {pct}% Complete
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Schedule view
// ─────────────────────────────────────────────────────────────────────────────
const ScheduleView = ({ meds, setMeds, onNavigate }) => {
  const days = ["Mon", "Tue", "Today", "Thu", "Fri"];
  const [activeDay, setActiveDay] = useState("Today");

  const taken = meds.filter((m) => m.status === "taken").length;
  const total = meds.length;
  const pct = Math.round((taken / total) * 100);

  const sortedMeds = [...meds].sort((a, b) => a.timeOrder - b.timeOrder);

  const now = new Date();
  const nowHrs = now.getHours() + now.getMinutes() / 60;
  const next = sortedMeds.find((m) => (m.status === "pending" || m.status === "scheduled") && m.timeOrder >= nowHrs);
  let nextLabel = "All done!";
  if (next) {
    const diff = next.timeOrder - nowHrs;
    const h = Math.floor(diff);
    const min = Math.round((diff - h) * 60);
    nextLabel = `${h}h ${min}m`;
  }

  const markTaken = (id) =>
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, status: "taken" } : m)));

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 64px)", backgroundColor: C.surface }}>
      <SideNav active="schedule" onNavigate={onNavigate} />

      <main className="flex-1 px-6 lg:px-10 py-8 overflow-x-hidden">
        <div className="max-w-[1080px] mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h1 style={{ fontFamily: fontStack, fontSize: 32, fontWeight: 700, color: C.onSurface, letterSpacing: "-0.01em" }}>
                Medication Schedule
              </h1>
              <p className="mt-1" style={{ fontFamily: fontStack, fontSize: 15, color: C.onSurfaceVariant }}>
                Stay on track with your daily health routine.
              </p>
            </div>

            <div
              className="inline-flex p-1 rounded-full"
              style={{ backgroundColor: C.surfaceContainer }}
            >
              {days.map((d) => {
                const isActive = activeDay === d;
                return (
                  <button
                    key={d}
                    onClick={() => setActiveDay(d)}
                    className="px-4 py-2 rounded-full transition-colors"
                    style={{
                      backgroundColor: isActive ? C.surfaceContainerLowest : "transparent",
                      color: isActive ? C.onSurface : C.onSurfaceVariant,
                      fontFamily: fontStack,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 14,
                      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid lg:grid-cols-[1fr_auto] gap-4 mb-8">
            <div
              className="rounded-2xl p-5 lg:p-6 flex items-center gap-5"
              style={{ backgroundColor: C.surfaceContainerLowest, border: `1px solid ${C.outlineVariant}` }}
            >
              <ProgressDonut pct={pct} />
              <div>
                <h3 style={{ fontFamily: fontStack, fontSize: 22, fontWeight: 600, color: C.onSurface, letterSpacing: "-0.01em" }}>
                  {pct >= 100 ? "All done today!" : pct >= 70 ? "Great progress!" : "Keep going!"}
                </h3>
                <p className="mt-1" style={{ fontFamily: fontStack, fontSize: 14, color: C.onSurfaceVariant }}>
                  You've completed {taken} of {total} doses for today. Keep it up!
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl p-5 lg:p-6 lg:min-w-[240px]"
              style={{ backgroundColor: C.secondaryContainer, color: C.onSurface }}
            >
              <Sparkles size={22} color={C.primary} />
              <div className="mt-7" style={{ fontFamily: labelStack, fontSize: 12, color: C.onSecondaryContainer, fontWeight: 600 }}>
                Next Dose In
              </div>
              <div className="mt-1" style={{ fontFamily: fontStack, fontSize: 26, fontWeight: 700, color: C.primary, letterSpacing: "-0.01em" }}>
                {nextLabel}
              </div>
            </div>
          </div>

          {/* Timeline list */}
          <div className="relative">
            <div
              className="absolute left-[27px] top-3 bottom-3 w-0"
              style={{ borderLeft: `2px dashed ${C.outlineVariant}` }}
            />

            <div className="space-y-3">
              {sortedMeds.map((m) => (
                <div key={m.id} className="flex items-start gap-5 relative">
                  <div className="relative z-10 flex-shrink-0 mt-2">
                    <TimelineNode status={m.status} />
                  </div>

                  <div
                    className="flex-1 rounded-2xl p-4 flex items-center gap-4 transition-all"
                    style={{
                      backgroundColor: C.surfaceContainerLowest,
                      border: m.status === "pending" ? `2px solid ${C.primary}` : `1px solid ${C.outlineVariant}`,
                      opacity: m.status === "scheduled" ? 0.92 : 1,
                    }}
                  >
                    <PillIconSquare color={m.status === "pending" ? C.primary : C.secondaryContainer} fg={m.status === "pending" ? C.onPrimary : C.primary} />
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontFamily: fontStack,
                          fontSize: 18,
                          fontWeight: 600,
                          color: C.onSurface,
                        }}
                      >
                        {m.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap" style={{ fontFamily: labelStack, fontSize: 13, color: C.onSurfaceVariant, fontWeight: 500 }}>
                        <span>{m.dose}</span>
                        <span style={{ color: C.outline }}>•</span>
                        <span>{m.time}</span>
                      </div>
                    </div>

                    {m.status === "pending" ? (
                      <button
                        onClick={() => markTaken(m.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-transform active:scale-[0.98]"
                        style={{ backgroundColor: C.primary, color: C.onPrimary, fontFamily: fontStack, fontWeight: 600, fontSize: 14 }}
                      >
                        <Check size={16} strokeWidth={2.5} />
                        Mark as Taken
                      </button>
                    ) : (
                      <StatusPill status={m.status} />
                    )}
                    {m.status === "pending" && (
                      <button className="p-2 rounded-full hover:bg-[#f0f3ff]" aria-label="More">
                        <MoreVertical size={18} color={C.onSurfaceVariant} strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-10 rounded-2xl overflow-hidden grid md:grid-cols-2"
            style={{ backgroundColor: C.tertiaryContainer }}
          >
            <div className="p-7 lg:p-9 flex flex-col justify-center">
              <h3 style={{ fontFamily: fontStack, fontSize: 22, fontWeight: 700, color: C.onSurface, letterSpacing: "-0.01em" }}>
                Need to update your medications?
              </h3>
              <p className="mt-2" style={{ fontFamily: fontStack, fontSize: 14, color: C.onSurfaceVariant, lineHeight: 1.55 }}>
                Chat with our AI health assistant to add new prescriptions or adjust your dosage easily.
              </p>
              <button
                onClick={() => onNavigate("chat")}
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg self-start transition-transform active:scale-[0.98]"
                style={{ backgroundColor: C.onSurface, color: C.surface, fontFamily: fontStack, fontWeight: 600, fontSize: 14 }}
              >
                <MessageSquare size={16} strokeWidth={2} />
                Talk to MedCare Chat
              </button>
            </div>
            <div
              className="hidden md:block relative min-h-[200px]"
              style={{
                background: `linear-gradient(135deg, ${C.primaryContainer}, ${C.primary})`,
              }}
            >
              <svg
                viewBox="0 0 400 280"
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-full"
              >
                <defs>
                  <radialGradient id="g1" cx="0.7" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#88d1e5" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#006172" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="400" height="280" fill="url(#g1)" />
                <rect x="120" y="50" width="180" height="220" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <rect x="140" y="80" width="140" height="14" rx="3" fill="rgba(255,255,255,0.4)" />
                <rect x="140" y="105" width="100" height="10" rx="2" fill="rgba(255,255,255,0.25)" />
                <rect x="140" y="135" width="140" height="40" rx="8" fill="rgba(255,255,255,0.15)" />
                <rect x="140" y="185" width="140" height="40" rx="8" fill="rgba(255,255,255,0.15)" />
                <circle cx="155" cy="155" r="6" fill="#88d1e5" />
                <circle cx="155" cy="205" r="6" fill="#b0ecfe" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const TimelineNode = ({ status }) => {
  if (status === "taken") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: C.surfaceContainerLowest, border: `2px solid ${C.primary}`, color: C.primary }}
      >
        <Check size={16} strokeWidth={2.5} />
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center relative"
        style={{ backgroundColor: C.surfaceContainerLowest, border: `2px solid ${C.primary}` }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.primary }} />
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ border: `2px solid ${C.primary}`, opacity: 0.4 }}
        />
      </div>
    );
  }
  if (status === "missed") {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: C.surfaceContainerLowest, border: `2px solid ${C.error}`, color: C.error }}
      >
        <AlertTriangle size={15} strokeWidth={2.25} />
      </div>
    );
  }
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ backgroundColor: C.surfaceContainerLowest, border: `2px solid ${C.outlineVariant}`, color: C.onSurfaceVariant }}
    >
      <Clock size={15} strokeWidth={1.75} />
    </div>
  );
};

const ProgressDonut = ({ pct }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke={C.surfaceContainerHigh} strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={C.primary}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontFamily: fontStack, fontSize: 20, fontWeight: 700, color: C.primary, letterSpacing: "-0.01em" }}>
          {pct}%
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState("landing");
  const [meds, setMeds] = useState(initialMeds);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Public+Sans:wght@500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }
      body { font-family: ${fontStack}; background: ${C.surface}; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ backgroundColor: C.surface, color: C.onSurface, minHeight: "100vh", fontFamily: fontStack }}>
      <TopNav active={route} onNavigate={setRoute} />
      {route === "landing" && <Landing onNavigate={setRoute} />}
      {route === "chat" && <ChatView meds={meds} setMeds={setMeds} onNavigate={setRoute} />}
      {route === "schedule" && <ScheduleView meds={meds} setMeds={setMeds} onNavigate={setRoute} />}
      {route === "history" && (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 style={{ fontFamily: fontStack, fontSize: 28, fontWeight: 600, color: C.onSurface }}>History</h2>
          <p className="mt-2" style={{ color: C.onSurfaceVariant, fontFamily: fontStack }}>
            Adherence reports coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
