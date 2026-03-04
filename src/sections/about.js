import { fetchGitHub, callAI } from '../api/client.js';
import { PROJECTS } from '../data/projects.js';

export function initAbout() {
    document.getElementById('cognitive-about-btn').addEventListener('click', generateCognitiveAbout);
}


export async function openAbout() {
    const panel = document.getElementById('about-panel');
    panel.classList.remove('hidden');
    requestAnimationFrame(() => panel.classList.add('visible'));

    // Load GitHub data
    loadGitHubStats();
}

function closeAbout() {
    const panel = document.getElementById('about-panel');
    panel.classList.remove('visible');
    setTimeout(() => panel.classList.add('hidden'), 600);
}

let githubLoaded = false;

async function loadGitHubStats() {
    if (githubLoaded) return;

    const loadingEl = document.getElementById('github-loading');
    const statsEl = document.getElementById('github-stats');

    const data = await fetchGitHub();

    if (data.error) {
        loadingEl.textContent = data.error;
        return;
    }

    githubLoaded = true;
    loadingEl.style.display = 'none';

    // Build stats cards
    statsEl.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${data.public_repos ?? '—'}</div>
      <div class="stat-label">Repositories</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${data.totalStars ?? '—'}</div>
      <div class="stat-label">Total Stars</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${data.followers ?? '—'}</div>
      <div class="stat-label">Followers</div>
    </div>
  `;
    statsEl.classList.remove('hidden');

    // Language bar
    if (data.languages && data.languages.length) {
        const langBar = document.createElement('div');
        langBar.className = 'lang-bar';
        langBar.innerHTML = data.languages.map(l =>
            `<span class="lang-pill">${l.lang} ×${l.count}</span>`
        ).join('');

        const hdr = document.querySelector('#about-github .detail-section-title');
        hdr.after(statsEl, langBar);
    }

    // Synthetic contribution heatmap
    renderHeatmap(data.recentRepos);
}

function renderHeatmap(repos) {
    const container = document.getElementById('about-github');

    const heatmapLabel = document.createElement('div');
    heatmapLabel.className = 'detail-section-title';
    heatmapLabel.style.marginTop = '28px';
    heatmapLabel.textContent = 'Activity Heatmap (Simulated)';
    container.appendChild(heatmapLabel);

    const heatmap = document.createElement('div');
    heatmap.className = 'heatmap';

    // Generate a 12×7 heatmap seeded from repo update dates
    const WEEKS = 16;
    const DAYS = 7;
    const seed = repos ? repos.length : 10;

    for (let d = 0; d < DAYS; d++) {
        const row = document.createElement('div');
        row.className = 'heatmap-row';
        for (let w = 0; w < WEEKS; w++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            // Pseudo-random activity level
            const val = seededRandom(d * WEEKS + w + seed);
            const level = val < 0.5 ? 0 : val < 0.68 ? 1 : val < 0.82 ? 2 : val < 0.93 ? 3 : 4;
            if (level > 0) cell.dataset.level = level;
            row.appendChild(cell);
        }
        heatmap.appendChild(row);
    }

    container.appendChild(heatmap);
}

function seededRandom(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

async function generateCognitiveAbout() {
    const btn = document.getElementById('cognitive-about-btn');
    const output = document.getElementById('cognitive-about-output');

    btn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
    btn.disabled = true;

    const projectSummary = PROJECTS.map(p =>
        `${p.title}: ${p.shortDesc}`
    ).join('\n');

    const systemPrompt = `You are a cognitive architecture analyst.
Write a concise, perceptive cognitive summary of a developer based on their projects.
Keep it under 200 words. Write in second person ("You...").
Be analytical, not flattering. Identify structural tendencies, not achievements.`;

    const cacheKey = `cognitive_about_${PROJECTS.length}`;
    const { result, error } = await callAI(
        `Generate a cognitive summary for a developer who built these projects:\n${projectSummary}`,
        systemPrompt,
        cacheKey
    );

    btn.textContent = 'Generate Cognitive Summary';
    btn.disabled = false;

    if (error) {
        output.textContent = error;
        output.classList.remove('hidden');
        return;
    }

    output.textContent = result;
    output.classList.remove('hidden');
}
