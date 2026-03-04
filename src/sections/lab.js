import { callAI, getSessionCallCount } from '../api/client.js';

const SESSION_LIMIT = 5;
let _getRepos = () => [];


export function initLab(getRepos) {
    if (getRepos) _getRepos = getRepos;

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        });
    });

    // Concept Generator
    document.getElementById('concept-generate-btn').addEventListener('click', generateConcept);

    // Projection Engine
    document.getElementById('projection-generate-btn').addEventListener('click', generateProjectionLab);

    // Cognitive Reflection
    document.getElementById('cognitive-generate-btn').addEventListener('click', generateCognitive);

    updateSessionCounter();
}


function updateSessionCounter() {
    const el = document.getElementById('session-counter-text');
    if (el) el.textContent = `AI calls this session: ${getSessionCallCount()} / ${SESSION_LIMIT}`;
}


async function generateConcept() {
    const btn = document.getElementById('concept-generate-btn');
    const output = document.getElementById('concept-output');

    btn.innerHTML = '<span class="loading-spinner"></span> Generating...';
    btn.disabled = true;

    const systemPrompt = `You are a speculative technology analyst generating plausible future technology constructs.
Output exactly three labeled sections:

CORE TECHNOLOGY: [2-3 sentences describing the technical mechanism]
SOCIETAL IMPLICATION: [2-3 sentences describing structural effect on society or cognition]
CRITICAL INTERROGATION: [One sharp, uncomfortable question this technology raises]

Keep it grounded, structural, and analytical. No enthusiasm. No marketing language.`;

    const categories = ['AI cognition', 'distributed computation', 'synthetic biology-AI interface',
        'emergent behavior systems', 'memory architecture', 'adversarial inference', 'semantic compression'];
    const cat = categories[Math.floor(Math.random() * categories.length)];

    const { result, error } = await callAI(`Generate a speculative technology construct in the domain of: ${cat}`, systemPrompt);

    updateSessionCounter();
    btn.textContent = 'Generate Construct';
    btn.disabled = false;

    if (error) {
        output.textContent = error;
        output.classList.remove('hidden');
        return;
    }

    output.innerHTML = formatLabOutput(result);
    output.classList.remove('hidden');
}

async function generateProjectionLab() {
    const input = document.getElementById('projection-input').value.trim();
    if (!input) return;

    const btn = document.getElementById('projection-generate-btn');
    const output = document.getElementById('projection-output-lab');

    btn.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
    btn.disabled = true;

    const systemPrompt = `You are a structural analysis system for speculative technology.
Given a concept, produce a structured analysis in exactly these five sections:

THEORETICAL EVOLUTION: [How this concept evolves structurally over time]
EMERGENT PATTERN: [What non-obvious behavior or pattern emerges]
PHILOSOPHICAL TENSION: [The core philosophical contradiction or tension]
STRUCTURAL FRAGILITY: [Where the concept is most likely to fail or collapse]
DEVELOPER COGNITIVE SIGNAL: [What building this reveals about the builder's mental model]

Be analytical, critical, and restrained. No promotional tone.`;

    const { result, error } = await callAI(`Analyze this concept: ${input}`, systemPrompt);

    updateSessionCounter();
    btn.textContent = 'Analyze Concept';
    btn.disabled = false;

    if (error) {
        output.textContent = error;
        output.classList.remove('hidden');
        return;
    }

    output.innerHTML = formatLabOutput(result);
    output.classList.remove('hidden');
}

async function generateCognitive() {
    const btn = document.getElementById('cognitive-generate-btn');
    const output = document.getElementById('cognitive-output');

    btn.innerHTML = '<span class="loading-spinner"></span> Running analysis...';
    btn.disabled = true;

    const repos = _getRepos();
    const projectSummary = repos.length > 0
        ? repos.map(r => `- ${r.name}: ${r.description || 'no description'} [${r.language || 'unknown'}]`).join('\n')
        : 'No projects selected yet.';

    const systemPrompt = `You are a cognitive pattern analysis system.
Given a body of software/AI projects, analyze the builder's cognitive patterns.
Output exactly these four labeled sections:

DOMINANT STRUCTURAL PATTERN: [The recurring architectural or conceptual pattern across all work]
EPISTEMIC ORIENTATION: [How the builder relates to knowledge, certainty, and unknowns]
EMERGENT OBSESSION: [The core concern that all projects orbit, even implicitly]
STRUCTURAL BLIND SPOT: [What the builder consistently avoids, under-estimates, or ignores]

Be direct, analytical, and specific to the actual projects. No flattery.`;

    const cacheKey = `cognitive_dynamic_${repos.map(r => r.name).join('_').slice(0, 40)}`;
    const { result, error } = await callAI(
        `Analyze the cognitive patterns of a developer who built these projects:\n${projectSummary}`,
        systemPrompt,
        cacheKey
    );

    updateSessionCounter();
    btn.textContent = 'Run Analysis';
    btn.disabled = false;

    if (error) {
        output.textContent = error;
        output.classList.remove('hidden');
        return;
    }

    output.innerHTML = formatLabOutput(result);
    output.classList.remove('hidden');
}


function formatLabOutput(text) {
    // Convert labeled sections into styled divs
    const lines = text.split('\n').filter(l => l.trim());
    let html = '';
    for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0 && line.slice(0, colonIdx) === line.slice(0, colonIdx).toUpperCase() && colonIdx < 40) {
            const label = line.slice(0, colonIdx).trim();
            const content = line.slice(colonIdx + 1).trim();
            html += `<div class="projection-section">
        <div class="projection-label">${label}</div>
        <div class="projection-text">${content}</div>
      </div>`;
        } else {
            html += `<div class="projection-text" style="margin-bottom:8px">${line}</div>`;
        }
    }
    return html || `<div class="projection-text">${text}</div>`;
}
