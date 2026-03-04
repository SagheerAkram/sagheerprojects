import { PROJECTS } from '../data/projects.js';
import { callAI } from '../api/client.js';

let currentProjectIndex = -1;
let projectionGenerated = false;

export function initDetailPanel(scrollEngine) {
    const panel = document.getElementById('detail-panel');
    const closeBtn = document.getElementById('detail-close');

    closeBtn.addEventListener('click', () => closeDetail(scrollEngine));

    // Generate projection button
    document.getElementById('generate-projection-btn').addEventListener('click', () => {
        if (!projectionGenerated) generateProjection();
    });
}

export function openDetail(index, scrollEngine) {
    currentProjectIndex = index;
    projectionGenerated = false;

    const project = PROJECTS[index];
    const panel = document.getElementById('detail-panel');

    // Populate content
    document.getElementById('detail-index').textContent = `ARTIFACT — ${project.index}`;
    document.getElementById('detail-title').textContent = project.title;
    document.getElementById('detail-overview').textContent = project.overview;
    document.getElementById('repo-link').href = project.github;

    // Tags
    const tagsEl = document.getElementById('detail-tags');
    tagsEl.innerHTML = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

    // Reset projection
    const projOut = document.getElementById('projection-output');
    projOut.innerHTML = '';
    projOut.classList.add('hidden');
    document.getElementById('generate-projection-btn').textContent = 'Generate Future Projection';

    // Render blueprint
    renderBlueprint(project);

    // Show panel
    panel.classList.remove('hidden');
    requestAnimationFrame(() => panel.classList.add('visible'));

    // Lock scroll
    scrollEngine.lock();

    // Hide artifact card
    document.getElementById('artifact-card').classList.remove('visible');

    // Slightly darken background via body class
    document.body.classList.add('panel-open');
}

export function closeDetail(scrollEngine) {
    const panel = document.getElementById('detail-panel');
    panel.classList.remove('visible');
    setTimeout(() => panel.classList.add('hidden'), 1000);

    scrollEngine.unlock();
    document.body.classList.remove('panel-open');
}

async function generateProjection() {
    if (currentProjectIndex < 0) return;
    const project = PROJECTS[currentProjectIndex];
    const btn = document.getElementById('generate-projection-btn');
    const output = document.getElementById('projection-output');

    btn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
    btn.disabled = true;

    const systemPrompt = `You are a structured analytical system performing speculative technology analysis.
Output must be analytical, restrained, and grounded — not promotional or optimistic.
Format your response with exactly these five labeled sections, each on its own line:

THEORETICAL EVOLUTION: [2-3 sentences]
EMERGENT PATTERN: [2-3 sentences]
PHILOSOPHICAL TENSION: [2-3 sentences]
STRUCTURAL FRAGILITY: [2-3 sentences]
DEVELOPER COGNITIVE SIGNAL: [1-2 sentences]

Be precise, critical, and structural. No hype. No affirmations.`;

    const prompt = `Analyze this project: "${project.title}"
Overview: ${project.overview}
Tags: ${project.tags.join(', ')}`;

    const cacheKey = `projection_${project.id}`;
    const { result, error } = await callAI(prompt, systemPrompt, cacheKey);

    if (error) {
        output.innerHTML = `<div class="projection-text" style="color:var(--muted)">${error}</div>`;
        output.classList.remove('hidden');
        btn.textContent = 'Generate Future Projection';
        btn.disabled = false;
        return;
    }

    // Parse and render the five sections
    output.innerHTML = parseProjectionOutput(result);
    output.classList.remove('hidden');

    btn.textContent = 'Projection Generated';
    projectionGenerated = true;

    // Subtle visual effect
    document.body.classList.add('projection-active');
    setTimeout(() => document.body.classList.remove('projection-active'), 4000);
}

function parseProjectionOutput(text) {
    const sections = [
        { key: 'THEORETICAL EVOLUTION', label: 'Theoretical Evolution' },
        { key: 'EMERGENT PATTERN', label: 'Emergent Pattern' },
        { key: 'PHILOSOPHICAL TENSION', label: 'Philosophical Tension' },
        { key: 'STRUCTURAL FRAGILITY', label: 'Structural Fragility' },
        { key: 'DEVELOPER COGNITIVE SIGNAL', label: 'Developer Cognitive Signal' }
    ];

    let html = '';
    sections.forEach(({ key, label }) => {
        const regex = new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z ]+:|$)`, 's');
        const match = text.match(regex);
        const content = match ? match[1].trim() : '—';
        html += `
      <div class="projection-section">
        <div class="projection-label">${label}</div>
        <div class="projection-text">${content}</div>
      </div>`;
    });

    return html || `<div class="projection-text">${text}</div>`;
}

function renderBlueprint(project) {
    const container = document.getElementById('blueprint-container');
    const { nodes, edges } = project.blueprint;

    const W = container.clientWidth || 420;
    const nodeR = 28;
    const cols = Math.min(nodes.length, 3);
    const rows = Math.ceil(nodes.length / cols);
    const colW = W / (cols + 1);
    const rowH = 80;
    const H = (rows + 1) * rowH;

    // Calculate positions
    const positions = nodes.map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
            x: (col + 1) * colW,
            y: (row + 1) * rowH
        };
    });

    const color = project.color;

    // Build SVG
    const edgePaths = edges.map(([from, to], ei) => {
        const f = positions[from];
        const t = positions[to];
        const mx = (f.x + t.x) / 2;
        const my = (f.y + t.y) / 2 - 12;
        return `<path class="bp-edge" id="bp-edge-${ei}"
      d="M${f.x},${f.y} Q${mx},${my} ${t.x},${t.y}"
      style="stroke:${color}"
    />`;
    }).join('');

    const nodeSVG = nodes.map((label, i) => {
        const { x, y } = positions[i];
        const lines = wrapText(label, 14);
        const textY = lines.length > 1 ? y - 6 : y + 3;
        return `
      <g class="bp-node" data-index="${i}" data-label="${label}">
        <circle class="bp-node-circle" cx="${x}" cy="${y}" r="${nodeR}"
          style="stroke:${color}"/>
        <circle cx="${x}" cy="${y}" r="${nodeR - 6}"
          fill="${color}" opacity="0.08"/>
        ${lines.map((line, li) =>
            `<text class="bp-node-label" x="${x}" y="${textY + li * 12}" fill="${color === '#f0504a' ? '#f07a78' : project.color}">${line}</text>`
        ).join('')}
      </g>`;
    }).join('');

    container.innerHTML = `
    <svg class="blueprint-svg" viewBox="0 0 ${W} ${H}" height="${H}">
      <defs>
        <filter id="glow-${project.id}">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      ${edgePaths}
      ${nodeSVG}
    </svg>`;

    // Animate edges after paint
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            container.querySelectorAll('.bp-edge').forEach((el, i) => {
                setTimeout(() => el.classList.add('animated'), i * 150);
            });
        });
    });

    // Hover tooltips
    const descriptions = {
        'Input Query': 'Entry point for external requests',
        'Graph Router': 'Routes inference to sub-reasoners',
        'Output Synthesis': 'Combines outputs into final response',
        'Contradiction Resolver': 'Detects and resolves conflicting inferences',
        'Prompt': 'Raw user or system input',
        'Primary Model': 'Main language model inference',
        'Output Buffer': 'Holds generated output for evaluation',
        'Semantic Anchors': 'Known verified facts used as reference',
        'Echo Evaluator': 'Evaluates output against anchors',
        'Confidence Map': 'Weighted map of factual certainty',
        'Flagged Regions': 'Areas of low-confidence output',
        'Containment Engine': 'Enforces hard behavioral limits',
        'Violation Handler': 'Response to boundary violations'
    };

    container.querySelectorAll('.bp-node').forEach(nodeEl => {
        const label = nodeEl.dataset.label;
        nodeEl.addEventListener('mouseenter', (e) => {
            const desc = descriptions[label] || label;
            showBlueprintTooltip(container, desc, e);
        });
        nodeEl.addEventListener('mouseleave', () => hideBlueprintTooltip(container));
    });
}

function wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let current = '';
    for (const word of words) {
        if ((current + word).length > maxChars) {
            if (current) lines.push(current.trim());
            current = word + ' ';
        } else {
            current += word + ' ';
        }
    }
    if (current) lines.push(current.trim());
    return lines.slice(0, 2);
}

function showBlueprintTooltip(container, text, e) {
    let tip = container.querySelector('.bp-tooltip');
    if (!tip) {
        tip = document.createElement('div');
        tip.className = 'bp-tooltip';
        container.style.position = 'relative';
        container.appendChild(tip);
    }
    tip.textContent = text;
    tip.style.left = '12px';
    tip.style.bottom = '8px';
    tip.style.opacity = '1';
}

function hideBlueprintTooltip(container) {
    const tip = container.querySelector('.bp-tooltip');
    if (tip) tip.style.opacity = '0';
}
