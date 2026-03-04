import { fetchGitHubProjects } from '../api/client.js';

// Language → accent color mapping
const LANG_COLORS = {
    'Python': '#4af0a0',
    'JavaScript': '#f0e04a',
    'TypeScript': '#4a9af0',
    'Rust': '#f07040',
    'Go': '#4af0e0',
    'C': '#a0a0f0',
    'C++': '#e040f0',
    'C#': '#a040f0',
    'Java': '#f09040',
    'HTML': '#f06040',
    'CSS': '#40a0f0',
    'Shell': '#80f080',
    'Ruby': '#f04060',
    'PHP': '#8080f0',
    'Swift': '#f08040',
    'Kotlin': '#a040a0',
    'Jupyter Notebook': '#f0a040',
};
export function getLangColor(lang) {
    return LANG_COLORS[lang] || '#4ab8f0';
}

let allRepos = [];
let confirmedCallback = null;

export function initSelector(onConfirmed) {
    confirmedCallback = onConfirmed;

    const modal = document.getElementById('selector-modal');
    const confirmBtn = document.getElementById('selector-confirm');
    const listEl = document.getElementById('selector-list');
    const loadingEl = document.getElementById('selector-loading');
    const countEl = document.getElementById('selector-count');
    const searchEl = document.getElementById('selector-search');

    if (!modal) {
        console.error('[selector] #selector-modal not found in DOM');
        return;
    }

    // Show modal — explicitly set display before opacity transition
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => modal.classList.add('visible'));
    });

    // Fetch repos
    fetchGitHubProjects().then(repos => {
        if (!Array.isArray(repos)) {
            loadingEl.textContent = (repos && repos.error) ? repos.error : 'Failed to load repositories. Is the backend running?';
            loadingEl.style.color = '#f05050';
            return;
        }

        allRepos = repos;
        loadingEl.style.display = 'none';
        renderList(repos, listEl, countEl, confirmBtn);

        // Search filter
        searchEl.addEventListener('input', () => {
            const q = searchEl.value.toLowerCase();
            const filtered = allRepos.filter(r =>
                r.name.toLowerCase().includes(q) ||
                (r.description || '').toLowerCase().includes(q) ||
                (r.language || '').toLowerCase().includes(q)
            );
            renderList(filtered, listEl, countEl, confirmBtn);
        });
    }).catch(err => {
        console.error('[selector] fetchGitHubProjects error:', err);
        loadingEl.textContent = `Network error: ${err.message}. Make sure backend is running on port 3001.`;
        loadingEl.style.color = '#f05050';
    });

    confirmBtn.addEventListener('click', () => {
        const selected = getSelectedRepos(listEl);
        if (selected.length === 0) return;
        closeSelector();
        confirmedCallback(selected);
    });
}

function renderList(repos, listEl, countEl, confirmBtn) {
    listEl.innerHTML = '';

    if (repos.length === 0) {
        listEl.innerHTML = '<div class="selector-empty">No repositories found.</div>';
        return;
    }

    repos.forEach(repo => {
        const color = getLangColor(repo.language);
        const item = document.createElement('label');
        item.className = 'selector-item';
        item.dataset.repoName = repo.name;
        item.innerHTML = `
      <input type="checkbox" class="selector-check" value="${repo.name}" />
      <span class="selector-item-dot" style="background:${color}"></span>
      <span class="selector-item-body">
        <span class="selector-item-name">${repo.name.replace(/-/g, ' ')}</span>
        <span class="selector-item-meta">
          ${repo.language ? `<span style="color:${color}">${repo.language}</span>` : ''}
          ${repo.stargazers_count ? `<span>★ ${repo.stargazers_count}</span>` : ''}
        </span>
        ${repo.description ? `<span class="selector-item-desc">${repo.description}</span>` : ''}
      </span>
    `;

        item.querySelector('input').addEventListener('change', () => {
            const total = listEl.querySelectorAll('input:checked').length;
            countEl.textContent = total > 0 ? `${total} selected` : 'Select repositories to display';
            confirmBtn.disabled = total === 0;
        });

        listEl.appendChild(item);
    });
}

function getSelectedRepos(listEl) {
    const checked = listEl.querySelectorAll('input:checked');
    const names = Array.from(checked).map(c => c.value);
    return allRepos.filter(r => names.includes(r.name));
}

function closeSelector() {
    const modal = document.getElementById('selector-modal');
    modal.classList.remove('visible');
    setTimeout(() => modal.classList.add('hidden'), 600);
}
