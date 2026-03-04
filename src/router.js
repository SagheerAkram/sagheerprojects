// Minimal hash-based router for the Speculative Archive
// Routes: / (archive) | /artifact/:slug

const listeners = [];

function getCurrentRoute() {
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/') return { name: 'home' };
    if (hash === '/portfolio') return { name: 'portfolio' };
    const match = hash.match(/^\/artifact\/(.+)$/);
    if (match) return { name: 'artifact', slug: match[1] };
    return { name: 'home' };
}

export function initRouter(onRouteChange) {
    listeners.push(onRouteChange);

    window.addEventListener('hashchange', () => {
        const route = getCurrentRoute();
        listeners.forEach(fn => fn(route));
    });

    // Handle initial load
    const initial = getCurrentRoute();
    if (initial.name !== 'home') {
        requestAnimationFrame(() => listeners.forEach(fn => fn(initial)));
    }

    return getCurrentRoute();
}

export function navigate(path) {
    window.location.hash = path;
}

export function goHome() {
    window.location.hash = '/';
}
