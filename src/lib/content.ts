export const profile = {
  name: "Abolfazl Abbaspour",
  firstName: "Abolfazl",
  lastName: "Abbaspour",
  role: "Front-End Developer",
  stack: "React / Next.js",
  email: "gabolfazl83@gmail.com",
  github: "https://github.com/iabolfazl83",
  linkedin: "https://linkedin.com/in/abolfazlabbaspour",
  telegram: "https://t.me/+989335403596",
  resume: "/Abolfazl_Abbaspour_Resume.pdf",
  location: "Working worldwide",
  timezone: "Asia/Tehran",
  tagline:
    "I design and build fast, modern and unforgettable web experiences that turn visitors into customers.",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const marquee = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "React Query",
  "Zustand",
  "REST APIs",
  "SSR · ISR · SSG",
  "Web Vitals",
  "Clean Code",
  "Hero UI",
  "Redux",
];

export const about = {
  statement:
    "I'm Abolfazl — a front-end developer with 4+ years of professional experience turning complex ideas into fast, elegant and maintainable web products. From modernizing legacy enterprise systems to architecting full-stack Next.js apps, I obsess over the details your customers actually feel: speed, clarity and craft.",
  stats: [
    { value: 4, suffix: "+", label: "Years of professional experience" },
    { value: 5, suffix: "", label: "Enterprise modules shipped" },
    { value: 4, suffix: "", label: "Rendering strategies in my toolbox" },
    { value: 2, suffix: "", label: "Live products you can try today" },
  ],
};

export const services = [
  {
    code: "S/01",
    title: "Web Applications",
    body: "Full-stack Next.js apps with REST APIs, authentication, persistent storage and the right rendering strategy for every route.",
    tags: ["Next.js", "API design", "Auth"],
  },
  {
    code: "S/02",
    title: "Landing Pages & Websites",
    body: "Animated, high-converting marketing sites that load instantly and look incredible on every screen size.",
    tags: ["Motion", "Responsive", "SEO-ready"],
  },
  {
    code: "S/03",
    title: "Dashboards & Internal Tools",
    body: "Complex interfaces — payroll, chat, document builders — designed to stay clean, fast and easy to maintain.",
    tags: ["React", "TypeScript", "Data-heavy UI"],
  },
  {
    code: "S/04",
    title: "Legacy Modernization",
    body: "Outdated jQuery codebase holding you back? I migrate it step by step to modern ES6+ and React without breaking what works.",
    tags: ["jQuery → ES6+", "Refactoring", "Zero downtime"],
  },
  {
    code: "S/05",
    title: "Performance Tuning",
    body: "Core Web Vitals, caching strategies and smart SSR / ISR choices that make your product feel instant — and rank better.",
    tags: ["Web Vitals", "Caching", "SSR / ISR"],
  },
  {
    code: "S/06",
    title: "Pixel-Perfect UI",
    body: "Your design, translated into reusable, accessible, component-driven code with custom hooks and clean architecture.",
    tags: ["Components", "Accessibility", "Clean code"],
  },
];

export const process = [
  {
    step: "01",
    title: "Discover",
    body: "We talk goals, audience and scope. I map out the architecture and the fastest route from idea to launch — no surprises later.",
    points: ["Goals & audience", "Scope & timeline", "Tech architecture"],
  },
  {
    step: "02",
    title: "Design",
    body: "Wireframes become a clean interface system. Every section is shaped to guide your visitors towards one thing: taking action.",
    points: ["Wireframes", "UI system", "Motion language"],
  },
  {
    step: "03",
    title: "Develop",
    body: "React, Next.js and TypeScript. Typed, component-driven code with solid state management — built to scale with your business.",
    points: ["React & Next.js", "Type-safe code", "API integration"],
  },
  {
    step: "04",
    title: "Deliver",
    body: "Optimized, deployed and measured. You get a fast, SEO-ready product — and a developer who sticks around for what comes next.",
    points: ["Performance pass", "Deployment", "Ongoing support"],
  },
];

export type Project = {
  index: string;
  title: string;
  kind: string;
  description: string;
  highlights: string[];
  stack: string[];
  live?: string;
  repo?: string;
  mockup: "devjobs" | "habits" | "enterprise";
};

export const projects: Project[] = [
  {
    index: "01",
    title: "Habit Tracker",
    kind: "Productivity app",
    description:
      "A lightweight, delightful habit tracker — add, complete and edit daily habits with progress saved automatically and a polished light / dark mode.",
    highlights: [
      "Custom hooks for habits, theme and persistent local storage",
      "Micro-interactions: confetti bursts and sound on every completed habit",
      "Inline editing, validation and a mobile-first layout",
    ],
    stack: ["React 19", "TypeScript", "Vite", "Tailwind v4", "Custom Hooks"],
    live: "https://iabolfazl83.github.io/habit-tracker/",
    repo: "https://github.com/iabolfazl83/habit-tracker",
    mockup: "habits",
  },
  {
    index: "02",
    title: "DevJobs",
    kind: "Full-stack job board",
    description:
        "A production-grade job board built with Next.js 16 and TypeScript — browse, search and save listings backed by a real database and a REST API.",
    highlights: [
      "ISR listings (5 min revalidate) + SSR detail pages — each route gets the strategy it deserves",
      "One shared React Query cache keeps every “Saved” state in sync instantly",
      "Middleware-protected routes, sanitized HTML and dedicated error boundaries",
    ],
    stack: ["Next.js 16", "TypeScript", "React Query", "Zustand", "SQLite", "Tailwind v4"],
    live: "https://devjobs-pdn9.onrender.com/jobs",
    repo: "https://github.com/iabolfazl83/devjobs",
    mockup: "devjobs",
  },
  {
    index: "03",
    title: "HRBOX Suite",
    kind: "Enterprise HR platform",
    description:
      "Features built for a real HR product used by businesses every day — from a legacy DNN / jQuery application to a modern React monorepo.",
    highlights: [
      "Contract builder, PDF generation system and automated lettering — built from scratch",
      "Payroll module and internal chat UI in a large React + TypeScript monorepo",
      "Legacy jQuery codebase migrated to modern ES6+ for long-term maintainability",
    ],
    stack: ["React", "TypeScript", "Hero UI", "jQuery", "C# Razor", "Monorepo"],
    live: "https://hrbox.ir/",
    mockup: "enterprise",
  },
];

export const experience = {
  company: "HRBOX",
  url: "https://hrbox.ir/",
  role: "Front-End Developer",
  period: "Dec 2023 — Present",
  items: [
    {
      title: "Legacy modernization",
      body: "Refactored and modernized a legacy DotNetNuke (DNN) application built on jQuery — migrating outdated code to ES6+ and improving maintainability across the codebase.",
    },
    {
      title: "Advanced features from scratch",
      body: "Built a contract builder, a PDF generation system and an automated lettering system in vanilla JavaScript and jQuery, working directly with backend engineers on API integration and C# Razor views.",
    },
    {
      title: "Modern React monorepo",
      body: "Delivered the front-end for a payroll module and an internal chat system inside a large monorepo using React, React Router, TypeScript, Tailwind CSS and Hero UI.",
    },
  ],
  modules: [
    "Contract Builder",
    "PDF Generation",
    "Automated Lettering",
    "Payroll Module",
    "Internal Chat",
    "ES6+ Migration",
  ],
};

export const skills = [
  { group: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"] },
  {
    group: "Frameworks",
    items: ["React", "Next.js (App Router)", "React Router", "Tailwind CSS", "Hero UI", "jQuery"],
  },
  { group: "State & Data", items: ["TanStack React Query", "Zustand", "Context API", "Redux"] },
  { group: "Backend", items: ["REST API design", "Next.js Middleware", "Auth patterns"] },
  { group: "Performance", items: ["SSR", "SSG", "ISR", "CSR", "Caching", "Web Vitals"] },
  {
    group: "Practices",
    items: ["Git", "Clean Code", "Component-Driven", "Custom Hooks", "Error Boundaries", "XSS-aware sanitization"],
  },
];

export const projectTypes = ["Website", "Web App", "Landing Page", "Dashboard", "Modernization", "Other"];
export const budgets = ["> $1k", "< $1k", "$1k – $3k", "$3k – $7k", "$7k +", "Not sure yet"];
