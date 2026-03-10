/* empty css                                    */
import { i as createAstro, c as createComponent, r as renderComponent, d as renderTemplate, e as addAttribute, m as maybeRenderHead, u as unescapeHTML } from '../../chunks/astro/server_CntiJJAx.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_CKD5T-iS.mjs';
import { p as projects } from '../../chunks/projects_BeHvfDW6.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://sagheerprojects.fun/");
async function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project }
  }));
}
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { project } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${project.title} // Sagheer Akram`, "description": project.summary, "data-astro-cid-ovxcmftc": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([`  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"><\/script> <script>
    document.addEventListener('astro:page-load', () => {
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#14b8a6',
          primaryTextColor: '#fff',
          lineColor: '#14b8a6',
          secondaryColor: '#2d5a27',
          tertiaryColor: '#050b0a'
        }
      });
      mermaid.contentLoaded();
    });
  <\/script>  <script type="application/ld+json">`, '<\/script> <script type="application/ld+json">', "<\/script> ", '<article class="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto" data-astro-cid-ovxcmftc> <!-- Project Header --> <header class="mb-16" data-astro-cid-ovxcmftc> <div class="flex items-center gap-4 mb-6 reveal" data-astro-cid-ovxcmftc> <span class="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-accent-teal uppercase tracking-widest" data-astro-cid-ovxcmftc> ', ' </span> <span class="text-xs font-mono text-slate-500 uppercase tracking-widest" data-astro-cid-ovxcmftc>\nSTATUS: ', ' </span> </div> <h1 class="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 reveal" data-astro-cid-ovxcmftc> ', ' </h1> <div class="grid md:grid-cols-3 gap-12 border-t border-white/[0.05] pt-12" data-astro-cid-ovxcmftc> <div class="md:col-span-2 reveal" data-astro-cid-ovxcmftc> <p class="text-xl md:text-2xl text-slate-300 leading-relaxed font-light" data-astro-cid-ovxcmftc> ', ' </p> </div> <div class="space-y-8 reveal" data-astro-cid-ovxcmftc> <div data-astro-cid-ovxcmftc> <h3 class="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3" data-astro-cid-ovxcmftc>Core Stack</h3> <div class="flex flex-wrap gap-2" data-astro-cid-ovxcmftc> ', " </div> </div> ", ' </div> </div> </header> <!-- Visual Showcase / Interactive Block --> <section class="mb-24 rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.05] aspect-video relative group reveal" data-astro-cid-ovxcmftc> <div', "", ' data-astro-cid-ovxcmftc></div> <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" data-astro-cid-ovxcmftc></div> <div class="absolute inset-0 flex items-center justify-center p-8 md:p-16" data-astro-cid-ovxcmftc> <!-- Terminal Animation for OmniShell --> ', " <!-- Graph Animation Placeholder for ATLAS --> ", " <!-- Default for others --> ", ' </div> </section> <!-- Research Logs & Diagrams --> <div class="grid md:grid-cols-5 gap-16 mb-24" data-astro-cid-ovxcmftc> <!-- Content Sidebar --> <aside class="md:col-span-2 space-y-16" data-astro-cid-ovxcmftc> <div class="reveal" data-astro-cid-ovxcmftc> <h2 class="text-xs uppercase tracking-[0.3em] text-slate-500 mb-8 border-b border-white/5 pb-4 italic" data-astro-cid-ovxcmftc>RESEARCH LOGS</h2> <div class="space-y-8" data-astro-cid-ovxcmftc> ', ' </div> </div> </aside> <!-- Main Case Study Content --> <div class="md:col-span-3 space-y-16" data-astro-cid-ovxcmftc> <section class="reveal" data-astro-cid-ovxcmftc> <h2 class="text-2xl font-bold text-white mb-6" data-astro-cid-ovxcmftc>The Intent</h2> <p class="text-slate-400 leading-relaxed text-lg" data-astro-cid-ovxcmftc> ', ' </p> </section> <!-- Dynamic Mermaid Diagram --> <section class="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] reveal" data-astro-cid-ovxcmftc> <h3 class="text-xs font-mono text-slate-500 mb-8 tracking-[0.3em] uppercase" data-astro-cid-ovxcmftc>System Schematic</h3> <div class="mermaid opacity-60 hover:opacity-100 transition-opacity duration-500" data-astro-cid-ovxcmftc> ', " ", " ", " ", ' </div> </section> <section class="reveal" data-astro-cid-ovxcmftc> <h2 class="text-2xl font-bold text-white mb-6" data-astro-cid-ovxcmftc>The Build</h2> <p class="text-slate-400 leading-relaxed text-lg" data-astro-cid-ovxcmftc> ', ' </p> </section> <section class="reveal" data-astro-cid-ovxcmftc> <h2 class="text-2xl font-bold text-white mb-6" data-astro-cid-ovxcmftc>Reflections</h2> <p class="text-slate-400 leading-relaxed text-lg" data-astro-cid-ovxcmftc> ', ` </p> </section> </div> </div> <!-- Contact CTA --> <footer class="text-center py-24 border-t border-white/[0.05] reveal" data-astro-cid-ovxcmftc> <p class="text-slate-500 mb-8 font-mono text-sm tracking-[0.2em]" data-astro-cid-ovxcmftc>END OF LOG</p> <a href="/contact" class="inline-block text-3xl font-black text-white hover:text-accent-teal transition-colors" data-astro-cid-ovxcmftc>
Got thoughts? Let's talk.
</a> </footer> </article>   `])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://sagheerprojects.fun"
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "Projects",
      "item": "https://sagheerprojects.fun/projects"
    }, {
      "@type": "ListItem",
      "position": 3,
      "name": project.title,
      "item": `https://sagheerprojects.fun/projects/${project.slug}`
    }]
  })), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.summary,
    "author": {
      "@type": "Person",
      "name": "Sagheer Akram"
    },
    "image": `https://sagheerprojects.fun${project.image}`,
    "url": `https://sagheerprojects.fun/projects/${project.slug}`,
    "genre": project.category,
    "keywords": project.tags.join(", ")
  })), maybeRenderHead(), project.category, project.status || "LOGGED", project.title, project.overview, project.tags.map((tag) => renderTemplate`<span class="text-sm text-white/70 font-mono italic" data-astro-cid-ovxcmftc>#${tag}</span>`), project.github && renderTemplate`<a${addAttribute(project.github, "href")} target="_blank" class="inline-flex items-center gap-2 text-accent-teal hover:gap-4 transition-all duration-300 group" data-astro-cid-ovxcmftc> <span class="font-bold tracking-tight" data-astro-cid-ovxcmftc>VIEW SOURCE</span> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60 group-hover:opacity-100" data-astro-cid-ovxcmftc><path d="M7 7h10v10" data-astro-cid-ovxcmftc></path><path d="M7 17 17 7" data-astro-cid-ovxcmftc></path></svg> </a>`, addAttribute(`absolute inset-0 transition-opacity duration-1000 opacity-40 group-hover:opacity-60 bg-cover bg-center ${project.bannerGradient}`, "class"), addAttribute(`background-image: url(${project.image})`, "style"), project.showcaseType === "terminal-p2p" && renderTemplate`<div class="w-full max-w-2xl bg-black/80 rounded-xl border border-accent-teal/30 p-6 font-mono text-sm overflow-hidden shadow-2xl shadow-accent-teal/5" data-astro-cid-ovxcmftc> <div class="flex gap-2 mb-4 border-b border-white/5 pb-2" data-astro-cid-ovxcmftc> <div class="w-2 h-2 rounded-full bg-red-500/50" data-astro-cid-ovxcmftc></div> <div class="w-2 h-2 rounded-full bg-yellow-500/50" data-astro-cid-ovxcmftc></div> <div class="w-2 h-2 rounded-full bg-green-500/50" data-astro-cid-ovxcmftc></div> <span class="text-[10px] text-slate-600 ml-2" data-astro-cid-ovxcmftc>omnishell_daemon_v0.4</span> </div> <div class="space-y-1 text-accent-teal/80" data-astro-cid-ovxcmftc> <p class="text-slate-500" data-astro-cid-ovxcmftc>[SYSTEM] Initializing DH-KEA Exchange...</p> <p class="text-slate-500" data-astro-cid-ovxcmftc>[SYSTEM] Key verified. Buffer established.</p> <p class="typing-text" data-astro-cid-ovxcmftc>Sagheer: Send encrypted packet 0xA4...</p> <p class="text-slate-400 opacity-0 animate-delay-1 whitespace-pre" data-astro-cid-ovxcmftc>Remote: [REDACTED BY AES-256]</p> <p class="text-accent-aurora animate-pulse mt-4" data-astro-cid-ovxcmftc>&gt; Listening on port 4433...</p> </div> </div>`, project.showcaseType === "graph-visualization" && renderTemplate`<div class="relative w-full h-full flex items-center justify-center" data-astro-cid-ovxcmftc> <div class="absolute inset-0 flex items-center justify-center opacity-20" data-astro-cid-ovxcmftc> <div class="w-64 h-64 rounded-full border border-accent-teal border-dashed animate-spin-slow" data-astro-cid-ovxcmftc></div> <div class="absolute w-48 h-48 rounded-full border border-accent-aurora border-dashed animate-reverse-spin" data-astro-cid-ovxcmftc></div> </div> <div class="text-center z-10" data-astro-cid-ovxcmftc> <p class="text-xs font-mono text-accent-teal mb-2 uppercase tracking-[0.5em]" data-astro-cid-ovxcmftc>Mapping Architecture</p> <h3 class="text-3xl font-black text-white italic" data-astro-cid-ovxcmftc>VISUAL GRAVITY</h3> </div> </div>`, !project.showcaseType && renderTemplate`<div class="text-center" data-astro-cid-ovxcmftc> <p class="text-sm font-mono text-slate-500 mb-4 tracking-[0.3em]" data-astro-cid-ovxcmftc>NO VISUAL LOGS FOUND</p> <div class="w-32 h-1 bg-white/5 mx-auto rounded-full overflow-hidden" data-astro-cid-ovxcmftc> <div class="w-1/2 h-full bg-accent-teal animate-shimmer" data-astro-cid-ovxcmftc></div> </div> </div>`, project.researchLogs?.map((log, i) => renderTemplate`<div class="relative pl-8 border-l border-accent-teal/20 py-1" data-astro-cid-ovxcmftc> <span class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-accent-teal/40" data-astro-cid-ovxcmftc></span> <p class="text-sm text-slate-400 leading-relaxed italic" data-astro-cid-ovxcmftc>
"${log}"
</p> </div>`), project.problem, project.slug === "omnishell" && `
                graph TD
                    A[Source Node] -->|RSA-Handshake| B(P2P Bridge)
                    B -->|Encrypted Payload| C{Transport Layer}
                    C -->|Tor| D[Onion Network]
                    C -->|BLE| E[Local Peer]
                    D --> F[Destination]
                    E --> F
                `, project.slug === "quickcmd" && `
                graph LR
                    A[User Note] -->|interpreted by| B(QuickCmd)
                    B -->|query| C[LLM API]
                    C -->|suggested cmd| D{Approval Prompt}
                    D -->|Verified| E[Execution]
                    D -->|Decline| F[Refine]
                    E -->|Optional| G[Docker Sandbox]
                `, project.slug === "atlas" && `
                graph TD
                    A[File Scanner] --> B[AST Parser]
                    B --> C[Dependency Map]
                    C --> D(PageRank Engine)
                    D --> E[D3 Force Graph]
                    E --> F[3D Three.js Scene]
                `, project.slug === "code-archaeologist" && `
                graph TD
                    A[Legacy Code] --> B[FAISS Index]
                    B --> C[Intent Decoder]
                    C --> D{Query Interface}
                    D -->|RAG| E[Explanation]
                    E --> F[Human Understanding]
                `, project.solution, project.learned) })}`;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/pages/projects/[slug].astro", void 0);

const $$file = "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/pages/projects/[slug].astro";
const $$url = "/projects/[slug]/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
