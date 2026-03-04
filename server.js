import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'sagheerakram';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.use(cors());
app.use(express.json());

// ── In-memory cache ───────────────────────────────────────────
const cache = {};
function getCached(key) {
    const e = cache[key];
    if (e && Date.now() - e.ts < e.ttl) return e.data;
    return null;
}
function setCache(key, data, ttlMs) {
    cache[key] = { data, ts: Date.now(), ttl: ttlMs };
}

// ── Rate-limit state (per IP) ─────────────────────────────────
const SESSION_LIMIT = 5;
const ipCallCount = {};
function aiRateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    if (!ipCallCount[ip]) ipCallCount[ip] = 0;
    if (ipCallCount[ip] >= SESSION_LIMIT) {
        return res.status(429).json({ error: 'Session AI call limit reached (5). Refresh to reset.' });
    }
    ipCallCount[ip]++;
    next();
}

// ── GitHub helpers ────────────────────────────────────────────
function ghHeaders() {
    const h = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'SpeculativeArchive/2.0'
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN !== 'your_github_token_here') {
        h['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    return h;
}

// ── /api/github-projects ──────────────────────────────────────
// Returns all non-fork repos, sorted by pushed_at desc
app.get('/api/github-projects', async (req, res) => {
    const cacheKey = `github_projects_${GITHUB_USERNAME}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        let allRepos = [];
        let page = 1;
        while (true) {
            const r = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=pushed&direction=desc`,
                { headers: ghHeaders() }
            );
            if (!r.ok) {
                const txt = await r.text();
                console.error('GitHub repos error:', txt);
                return res.status(r.status).json({ error: `GitHub API error: ${r.status}` });
            }
            const repos = await r.json();
            if (!Array.isArray(repos) || repos.length === 0) break;
            allRepos = allRepos.concat(repos.filter(repo => !repo.fork));
            if (repos.length < 100) break;
            page++;
        }

        const result = allRepos.map(r => ({
            name: r.name,
            description: r.description || '',
            html_url: r.html_url,
            stargazers_count: r.stargazers_count || 0,
            language: r.language || null,
            updated_at: r.updated_at,
            pushed_at: r.pushed_at,
            topics: r.topics || []
        }));

        setCache(cacheKey, result, 30 * 60 * 1000); // 30 min
        res.json(result);
    } catch (err) {
        console.error('GitHub projects error:', err);
        res.status(500).json({ error: 'Failed to fetch GitHub projects.' });
    }
});

// ── /api/github-readme/:repo ──────────────────────────────────
// Returns decoded README content (first 3000 chars)
app.get('/api/github-readme/:repo', async (req, res) => {
    const { repo } = req.params;
    const cacheKey = `readme_${GITHUB_USERNAME}_${repo}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        const r = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/readme`,
            { headers: ghHeaders() }
        );
        if (!r.ok) {
            return res.json({ content: null }); // README not found — not an error
        }
        const data = await r.json();
        const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
        // Strip markdown syntax for AI readability, keep first 3000 chars
        const clean = decoded
            .replace(/```[\s\S]*?```/g, '')
            .replace(/#{1,6}\s/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/[*_`~]/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .slice(0, 3000);

        const result = { content: clean };
        setCache(cacheKey, result, 60 * 60 * 1000); // 1 hr
        res.json(result);
    } catch (err) {
        console.error('README error:', err);
        res.json({ content: null });
    }
});

// ── /api/github (profile + stats) ────────────────────────────
app.get('/api/github', async (req, res) => {
    const cacheKey = `github_profile_${GITHUB_USERNAME}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers: ghHeaders() }),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers: ghHeaders() })
        ]);
        const user = await userRes.json();
        const repos = await reposRes.json();

        if (!Array.isArray(repos)) {
            return res.json({ error: 'GitHub rate limited or user not found.', user: null, repos: [] });
        }

        const langCount = {};
        for (const repo of repos) {
            if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
        const sortedLangs = Object.entries(langCount)
            .sort((a, b) => b[1] - a[1]).slice(0, 6)
            .map(([lang, count]) => ({ lang, count }));

        const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

        const result = {
            name: user.name || GITHUB_USERNAME,
            username: user.login,
            avatar: user.avatar_url,
            bio: user.bio,
            location: user.location,
            public_repos: user.public_repos,
            followers: user.followers,
            totalStars,
            languages: sortedLangs,
            recentRepos: repos.slice(0, 6).map(r => ({
                name: r.name, description: r.description,
                stars: r.stargazers_count, language: r.language,
                url: r.html_url, updated: r.updated_at
            }))
        };
        setCache(cacheKey, result, 60 * 60 * 1000);
        res.json(result);
    } catch (err) {
        console.error('GitHub profile error:', err);
        res.status(500).json({ error: 'Failed to fetch GitHub profile.' });
    }
});

// ── /api/ai ───────────────────────────────────────────────────
// OpenRouter proxy — mistralai/mistral-7b-instruct
app.post('/api/ai', aiRateLimit, async (req, res) => {
    const { prompt, systemPrompt, cacheKey } = req.body;
    if (!prompt) return res.status(400).json({ error: 'No prompt provided.' });

    if (cacheKey) {
        const cached = getCached(cacheKey);
        if (cached) return res.json({ result: cached });
    }

    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('your_')) {
        return res.json({ result: '[AI features require OPENROUTER_API_KEY in .env]' });
    }

    try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'Speculative Technology Archive'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages,
                max_tokens: 900,
                temperature: 0.65
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('OpenRouter error:', errBody);
            return res.status(500).json({ error: 'AI service error.' });
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content || 'No response generated.';

        if (cacheKey) setCache(cacheKey, text, 60 * 60 * 1000);
        res.json({ result: text });
    } catch (err) {
        console.error('AI endpoint error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ── Health ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', model: 'mistralai/mistral-7b-instruct' }));

app.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════╗`);
    console.log(`  ║  Archive v2 Backend → port ${PORT}      ║`);
    console.log(`  ║  AI: OpenRouter / mistral-7b-instruct ║`);
    console.log(`  ╚══════════════════════════════════════╝\n`);
});
