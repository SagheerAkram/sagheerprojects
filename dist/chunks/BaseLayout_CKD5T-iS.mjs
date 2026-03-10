import { i as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, d as renderTemplate, r as renderComponent, k as renderSlot, l as renderHead } from './astro/server_CntiJJAx.mjs';
import 'kleur/colors';
/* empty css                         */
import 'clsx';

const $$Astro$2 = createAstro("https://sagheerprojects.fun/");
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Navbar;
  const navLinks = [
    { href: "/projects", label: "Archive" },
    { href: "/photography", label: "Visuals" },
    { href: "/about", label: "About" }
  ];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<header id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"> <nav class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"> <!-- Brand --> <a href="/" class="group flex items-center gap-3"> <div class="w-2 h-2 rounded-full bg-accent-ice opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_#a5f3fc]"></div> <span class="text-sm font-black tracking-[0.3em] text-white uppercase transition-all duration-300 group-hover:tracking-[0.4em]">
Sagheer Akram.
</span> </a> <!-- Desktop nav --> <div class="hidden md:block relative px-1 py-1 rounded-full border border-white/[0.03] bg-white/[0.02]"> <!-- Sliding Indicator --> <div id="nav-indicator" class="absolute h-[calc(100%-8px)] top-1 bg-accent-ice/10 border border-accent-ice/20 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div> <ul class="relative flex items-center gap-1"> ${navLinks.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} data-nav-link${addAttribute(`relative px-6 py-2 block text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 z-10 ${currentPath.startsWith(link.href) ? "text-accent-ice" : "text-slate-500 hover:text-white"}`, "class")}> ${link.label} </a> </li>`)} </ul> </div> <!-- Mobile hamburger --> <button id="mobile-menu-btn" class="md:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu" aria-expanded="false"> <span class="hamburger-line w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span> <span class="hamburger-line w-6 h-0.5 bg-white transition-all duration-300"></span> <span class="hamburger-line w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span> </button> </nav> <!-- Mobile menu --> <div id="mobile-menu" class="md:hidden hidden fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-50"> <div class="flex flex-col h-full p-8"> <div class="flex justify-end p-2"> <button id="close-menu" class="text-slate-500 hover:text-white"> <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg> </button> </div> <ul class="flex flex-col gap-8 mt-12"> <li><a href="/" class="text-3xl font-black text-white hover:text-accent-ice transition-colors tracking-tighter">Home</a></li> ${navLinks.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-3xl font-black text-white hover:text-accent-ice transition-colors tracking-tighter"> ${link.label} </a> </li>`)} </ul> <div class="mt-auto pb-12"> <p class="text-[10px] uppercase tracking-widest text-slate-700">Digital Archive // v2.0</p> </div> </div> </div> </header> `;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="mt-32 pb-16 relative overflow-hidden"> <!-- Subtle top border/gradient --> <div class="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"></div> <div class="max-w-6xl mx-auto px-6"> <!-- Contact CTA - The "Chill Contact Button" --> <div class="py-24 text-center"> <h2 class="text-3xl md:text-5xl font-black text-white tracking-tighter mb-8">
Have an idea? <br class="md:hidden"> <span class="text-slate-500 italic font-medium">Let's explore it.</span> </h2> <a href="mailto:contact@sagheerprojects.fun" class="inline-block px-12 py-5 bg-white text-black font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-accent-ice hover:scale-105 transition-all duration-300 active:scale-95">
Chill Contact
</a> </div> <!-- Main Footer Content --> <div class="flex flex-col md:flex-row items-center justify-between gap-12 pt-16 border-t border-white/[0.05]"> <!-- Brand & Identity --> <div class="text-center md:text-left"> <a href="/" class="text-xl font-black text-white tracking-tighter hover:text-accent-ice transition-colors">
Sagheer Akram.
</a> <p class="text-[10px] uppercase tracking-[0.3em] text-slate-600 mt-3 font-bold">
Researcher // Student // Observer
</p> </div> <!-- Quick Links --> <nav class="flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500"> <a href="/projects" class="hover:text-white transition-colors">Projects</a> <a href="/about" class="hover:text-white transition-colors">About</a> <a href="/photography" class="hover:text-white transition-colors">Visuals</a> </nav> <!-- Social Discovery --> <div class="flex items-center gap-6"> <a href="https://github.com/SagheerAkram" target="_blank" class="text-slate-500 hover:text-white transition-colors"> <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"> <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"></path> </svg> </a> <a href="https://instagram.com/rizzsagheer" target="_blank" class="text-slate-500 hover:text-white transition-colors"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect> <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path> <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line> </svg> </a> </div> </div> <!-- Copyright --> <div class="mt-16 text-center"> <p class="text-[10px] uppercase tracking-widest text-slate-700">
© ${year} // SAGHEER AKRAM. ALL MOMENTS ARCHIVED.
</p> </div> </div> </footer>`;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/components/Footer.astro", void 0);

const $$CursorGlow = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="cursor-glow" aria-hidden="true" class="pointer-events-none fixed z-50 rounded-full" style="
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    top: -300px;
    left: -300px;
    transition: background 0.8s ease;
    will-change: transform;
  "></div> `;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/components/CursorGlow.astro", void 0);

const $$CustomCursor = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="custom-cursor-dot" class="custom-cursor dot" data-astro-cid-ofxtmv4x></div> <div id="custom-cursor-ring" class="custom-cursor ring" data-astro-cid-ofxtmv4x></div>  `;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/components/CustomCursor.astro", void 0);

const $$ParticleBackground = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<canvas id="particle-canvas" class="fixed inset-0 pointer-events-none z-0" aria-hidden="true"></canvas> `;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/components/ParticleBackground.astro", void 0);

const $$Astro$1 = createAstro("https://sagheerprojects.fun/");
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/node_modules/astro/components/ViewTransitions.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://sagheerprojects.fun/");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Sagheer Akram // Researcher. Builder. Artist.",
    description = "Personal creative lab of Sagheer Akram, exploring the intersection of AI, code, and visual narratives.",
    image = "/og-image.jpg"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  return renderTemplate(_a || (_a = __template(['<html lang="en" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><link rel="canonical"', '><!-- Mobile Specific Meta --><meta name="theme-color" content="#000000"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- Open Graph / SEO --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Preconnect fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">', "", '</head> <body class="antialiased relative"> <!-- Premium Global Cursor Glow --> <div id="global-glow" class="fixed pointer-events-none w-[600px] h-[600px] rounded-full bg-accent-ice opacity-[0.03] blur-[120px] -translate-x-1/2 -translate-y-1/2 z-[5] transition-opacity duration-1000"></div> <!-- Premium Futurism Background System --> <div class="bg-mesh"></div> <div class="subgrid"></div> <!-- Signature character \u2014 subtle cursor glow --> ', " ", " ", " ", " <main> ", " </main> ", " <script>\n      // Global reveal animation observer\n      const revealObserver = new IntersectionObserver((entries) => {\n        entries.forEach((entry) => {\n          if (entry.isIntersecting) {\n            entry.target.classList.add('revealed');\n            revealObserver.unobserve(entry.target);\n          }\n        });\n      }, { \n        threshold: 0.15,\n        rootMargin: '0px 0px -50px 0px'\n      });\n\n      function initReveals() {\n        const revealElements = document.querySelectorAll('.reveal');\n        revealElements.forEach((el) => {\n          revealObserver.observe(el);\n        });\n      }\n\n      // Initial run\n      initReveals();\n\n      // Mouse Glow Follower logic\n      let glowElement = null;\n      function updateGlowPosition(e) {\n        if (!glowElement) glowElement = document.getElementById('global-glow');\n        if (glowElement) {\n          glowElement.style.left = e.clientX + 'px';\n          glowElement.style.top = e.clientY + 'px';\n        }\n      }\n\n      // Add listener once globally\n      if (!window.hasGlobalGlowListener) {\n        window.addEventListener('mousemove', updateGlowPosition);\n        window.hasGlobalGlowListener = true;\n      }\n\n      // Support for client-side navigation or dynamic content\n      document.addEventListener('astro:page-load', () => {\n        initReveals();\n        glowElement = document.getElementById('global-glow'); // Re-capture element after navigation\n      });\n    <\/script> </body> </html>"])), title, addAttribute(description, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.site), "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(new URL(image, Astro2.site), "content"), renderComponent($$result, "ViewTransitions", $$ViewTransitions, {}), renderHead(), renderComponent($$result, "CursorGlow", $$CursorGlow, {}), renderComponent($$result, "CustomCursor", $$CustomCursor, {}), renderComponent($$result, "ParticleBackground", $$ParticleBackground, {}), renderComponent($$result, "Navbar", $$Navbar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
