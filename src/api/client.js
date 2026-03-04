// API client — all calls route through the Express backend proxy

let sessionCallCount = 0;
const SESSION_LIMIT = 5;

export function getSessionCallsRemaining() {
    return SESSION_LIMIT - sessionCallCount;
}
export function getSessionCallCount() {
    return sessionCallCount;
}

export async function callAI(prompt, systemPrompt = '', cacheKey = null) {
    if (sessionCallCount >= SESSION_LIMIT) {
        return { error: `AI call limit reached (${SESSION_LIMIT} per session). Refresh to reset.` };
    }
    sessionCallCount++;

    try {
        const body = { prompt, systemPrompt };
        if (cacheKey) body.cacheKey = cacheKey;

        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Unknown error' }));
            sessionCallCount = Math.max(0, sessionCallCount - 1); // refund on error
            return { error: err.error || `HTTP ${res.status}` };
        }
        return await res.json();
    } catch (err) {
        sessionCallCount = Math.max(0, sessionCallCount - 1);
        return { error: 'Network error — backend may be offline.' };
    }
}

export async function fetchGitHub() {
    try {
        const res = await fetch('/api/github');
        if (!res.ok) return { error: 'Failed to fetch GitHub data.' };
        return await res.json();
    } catch {
        return { error: 'Network error — backend may be offline.' };
    }
}

export async function fetchGitHubProjects() {
    try {
        const res = await fetch('/api/github-projects');
        if (!res.ok) return { error: 'Failed to fetch repositories.', repos: [] };
        return await res.json();
    } catch {
        return { error: 'Network error — backend may be offline.', repos: [] };
    }
}

export async function fetchReadme(repoName) {
    try {
        const res = await fetch(`/api/github-readme/${encodeURIComponent(repoName)}`);
        if (!res.ok) return { content: null };
        return await res.json();
    } catch {
        return { content: null };
    }
}
