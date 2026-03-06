/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_HCp-Xtt9.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_9yidJr-C.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "404 \u2014 Page Not Found | Sagheer", "description": "This page doesn't exist." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="relative z-10 min-h-screen flex items-center justify-center px-6 text-center"> <!-- Blobs --> <div class="blob w-72 h-72 bg-violet-glow top-20 left-1/4 opacity-10"></div> <div class="page-enter"> <p class="text-8xl md:text-9xl font-black gradient-text mb-4 leading-none">404</p> <h1 class="text-2xl md:text-3xl font-bold text-white mb-4">Page not found</h1> <p class="text-slate-400 mb-10 max-w-md mx-auto">
Either this page never existed, or it wandered off into the void. Either way, it's not here.
</p> <div class="flex gap-4 items-center justify-center"> <a href="/" class="btn-glow">Go Home</a> <a href="/projects" class="btn-outline">View Projects</a> </div> </div> </section> ` })}`;
}, "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/pages/404.astro", void 0);

const $$file = "C:/Users/SM/Desktop/Github Projects/sagheerprojects/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
