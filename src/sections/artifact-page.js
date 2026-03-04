import { callAI, fetchReadme } from '../api/client.js';
import { goHome } from '../router.js';
import { getLangColor } from './selector.js';

let currentRepo = null;
let overviewGenerated = false;
let projectionGenerated = false;

const SYSTEM_OVERVIEW_PROMPT = `You are a systems analyst creating a structured technical overview.
Given a GitHub project, write a concise, analytical System Overview in 3-4 sentences.
Focus on: what it does structurally, how it works, and what problem domain it operates in.
Keep tone restrained and technical. No marketing language. No hype.`;

const PROJECTION_PROMPT_SYSTEM = `You are a structured analytical system performing speculative technology analysis.
Output must be analytical, restrained, grounded — not promotional.
Return exactly these sections (one per line, colon-separated):

THEORETICAL EVOLUTION: [2-3 sentences]
EMERGENT PATTERN: [2-3 sentences]
PHILOSOPHICAL TENSION: [2-3 sentences]
STRUCTURAL FRAGILITY: [2-3 sentences]
DEVELOPER COGNITIVE SIGNAL: [1-2 sentences]`;

export function initArtifactPage() {
    document.getElementById('artifact-back').addEventListener('click', () => {
        closeArtifactPage();
        goHome();
    });

    document.getElementById('artifact-generate-overview').addEventListener('click', generateOverview);
    document.getElementById('artifact-generate-projection').addEventListener('click', generateProjection);
}

export async function openArtifactPage(repo) {
    currentRepo = repo;
    overviewGenerated = false;
    projectionGenerated = false;

    const page = document.getElementById('artifact-page');
    const color = getLangColor(repo.language);

    // Header
    document.getElementById('artifact-page-title').textContent =
        repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
    document.getElementById('artifact-page-language').textContent = repo.language || '—';
    document.getElementById('artifact-page-language').style.color = color;
    document.getElementById('artifact-page-stars').textContent = repo.stargazers_count
        ? `★ ${repo.stargazers_count}` : '';
    const ghLink = document.getElementById('artifact-github-link');
    ghLink.href = repo.html_url;

    // Reset sections
    document.getElementById('artifact-overview-text').textContent = '';
    document.getElementById('artifact-overview-btn-area').classList.remove('hidden');
    document.getElementById('artifact-projection-output').innerHTML = '';
    document.getElementById('artifact-projection-output').classList.add('hidden');
    document.getElementById('artifact-generate-projection').textContent = 'Generate Projection';
    document.getElementById('artifact-generate-projection').disabled = false;
    document.getElementById('artifact-generate-overview').textContent = 'Generate System Overview';
    document.getElementById('artifact-generate-overview').disabled = false;

    // Accent color on page accent line
    document.getElementById('artifact-accent-line').style.background = color;

    // Blueprint
    renderGenericBlueprint(repo, color);

    // Show page
    page.classList.remove('hidden');
    requestAnimationFrame(() => {
        page.classList.add('visible');
        page.scrollTop = 0;
    });

    document.body.classList.add('artifact-open');
}

export function closeArtifactPage() {
    const page = document.getElementById('artifact-page');
    page.classList.remove('visible');
    setTimeout(() => page.classList.add('hidden'), 700);
    document.body.classList.remove('artifact-open');
    currentRepo = null;
}

async function generateOverview() {
    if (!currentRepo) return;
    const btn = document.getElementById('artifact-generate-overview');
    const textEl = document.getElementById('artifact-overview-text');

    btn.innerHTML = '<span class="loading-spinner"></span> Fetching & analyzing...';
    btn.disabled = true;

    // Fetch README
    const readme = await fetchReadme(currentRepo.name);
    const context = [
        currentRepo.description ? `Description: ${currentRepo.description}` : '',
        currentRepo.topics?.length ? `Topics: ${currentRepo.topics.join(', ')}` : '',
        readme.content ? `README excerpt:\n${readme.content.slice(0, 1500)}` : ''
    ].filter(Boolean).join('\n\n');

    const cacheKey = `overview_${currentRepo.name}`;
    const { result, error } = await callAI(
        `Project name: ${currentRepo.name}\n\n${context}`,
        SYSTEM_OVERVIEW_PROMPT,
        cacheKey
    );

    if (error) {
        textEl.textContent = error;
        document.getElementById('artifact-overview-btn-area').classList.add('hidden');
        return;
    }

    textEl.textContent = result;
    overviewGenerated = true;
    document.getElementById('artifact-overview-btn-area').classList.add('hidden');
}

async function generateProjection() {
    if (!currentRepo) return;
    const btn = document.getElementById('artifact-generate-projection');
    const output = document.getElementById('artifact-projection-output');

    btn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
    btn.disabled = true;

    const prompt = `Analyze this GitHub project as a speculative technological system.

Project: ${currentRepo.name}
Language: ${currentRepo.language || 'Unknown'}
Description: ${currentRepo.description || 'Not provided'}
Stars: ${currentRepo.stargazers_count}
Topics: ${(currentRepo.topics || []).join(', ') || 'None'}`;

    const cacheKey = `projection_v2_${currentRepo.name}`;
    const { result, error } = await callAI(prompt, PROJECTION_PROMPT_SYSTEM, cacheKey);

    btn.textContent = 'Generate Projection';
    btn.disabled = false;

    if (error) {
        output.innerHTML = `<div class="projection-text" style="color:var(--muted)">${error}</div>`;
        output.classList.remove('hidden');
        return;
    }

    output.innerHTML = parseProjectionOutput(result);
    output.classList.remove('hidden');
    projectionGenerated = true;

    document.body.classList.add('projection-active');
    setTimeout(() => document.body.classList.remove('projection-active'), 4000);
}

function parseProjectionOutput(text) {
    const sections = [
        ['THEORETICAL EVOLUTION', 'Theoretical Evolution'],
        ['EMERGENT PATTERN', 'Emergent Pattern'],
        ['PHILOSOPHICAL TENSION', 'Philosophical Tension'],
        ['STRUCTURAL FRAGILITY', 'Structural Fragility'],
        ['DEVELOPER COGNITIVE SIGNAL', 'Developer Cognitive Signal']
    ];

    let html = '';
    sections.forEach(([key, label]) => {
        const regex = new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z ]+:|$)`, 's');
        const match = text.match(regex);
        const content = match ? match[1].trim() : '';
        if (content) {
            html += `<div class="projection-section">
        <div class="projection-label">${label}</div>
        <div class="projection-text">${content}</div>
      </div>`;
        }
    });

    return html || `<div class="projection-text">${text}</div>`;
}

function renderGenericBlueprint(repo, color) {
    const container = document.getElementById('artifact-page-blueprint');
    const W = container.clientWidth || 480;

    // Generic 4-node blueprint: Interface → Logic → Data → External Systems
    const nodes = ['Interface', 'Core Logic', 'Data Layer', 'External APIs'];
    const edges = [[0, 1], [1, 2], [1, 3], [2, 3]];
    const positions = [
        { x: W * 0.18, y: 70 },
        { x: W * 0.5, y: 70 },
        { x: W * 0.3, y: 160 },
        { x: W * 0.72, y: 160 }
    ];

    const edgeSVG = edges.map(([f, t], ei) => {
        const fp = positions[f], tp = positions[t];
        return `<line class="bp-edge" id="bpg-edge-${ei}"
      x1="${fp.x}" y1="${fp.y}" x2="${tp.x}" y2="${tp.y}"
      style="stroke:${color};stroke-width:1.2;opacity:0.5;
             stroke-dasharray:120;stroke-dashoffset:120;
             transition:stroke-dashoffset 0.9s ease ${ei * 0.18}s"/>`;
    }).join('');

    const nodeSVG = nodes.map((label, i) => {
        const { x, y } = positions[i];
        return `<g class="bp-node">
      <circle cx="${x}" cy="${y}" r="26"
        fill="rgba(8,15,30,0.9)" stroke="${color}" stroke-width="1.2" opacity="0.9"/>
      <circle cx="${x}" cy="${y}" r="20" fill="${color}" opacity="0.08"/>
      <text x="${x}" y="${y - 4}" text-anchor="middle"
        font-family="monospace" font-size="8" fill="${color}">${label.split(' ')[0]}</text>
      <text x="${x}" y="${y + 9}" text-anchor="middle"
        font-family="monospace" font-size="8" fill="${color}">${label.split(' ')[1] || ''}</text>
    </g>`;
    }).join('');

    container.innerHTML = `
    <svg width="100%" height="220" viewBox="0 0 ${W} 220">
      ${edgeSVG}${nodeSVG}
    </svg>`;

    // Animate edges
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            container.querySelectorAll('.bp-edge').forEach(el => {
                el.style.strokeDashoffset = '0';
            });
        });
    });
}
