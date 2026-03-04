import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScene, createRenderer, createCamera } from './engine/scene.js';
import { createScrollEngine } from './engine/scroll.js';
import { createParticles } from './engine/particles.js';
import { createHero, updateHero } from './sections/hero.js';
import {
  createArchive, updateArchive, setArchiveFocus,
  setupPanelClicks, getPanelGroups,
  ARTIFACT_SPACING, ARCHIVE_START_Z
} from './sections/archive.js';
import { initSelector } from './sections/selector.js';
import { initArtifactPage, openArtifactPage, closeArtifactPage } from './sections/artifact-page.js';
import { initRouter, navigate, goHome } from './router.js';
import { photographyData } from './data/photography.js';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────
// Three.js bootstrap
// ─────────────────────────────────────────────────────────
const container = document.getElementById('canvas-container');
const { scene } = createScene();
const renderer = createRenderer(container);
const camera = createCamera();
scene.add(camera);

const TOTAL_DEPTH = 200;
const particleSystem = createParticles(scene, TOTAL_DEPTH);
const particles = particleSystem.particles;
const scrollEngine = createScrollEngine(TOTAL_DEPTH);

// ─────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────
let inArchive = false;
let panelGroups = [];
let selectedRepos = [];
let focusedIndex = -1;
let clock = new THREE.Clock();
let cameraTargetZ = 0;
let cameraCurrentZ = 0;
let archiveInitialized = false;

// ─────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────
const heroObjects = createHero(scene);

// ─────────────────────────────────────────────────────────
// Preloader & Entrance
// ─────────────────────────────────────────────────────────
function initEntrance() {
  const tl = gsap.timeline();

  tl.to('.preloader-bar::after', { width: '100%', duration: 1.5, ease: "power2.inOut" });
  tl.to('#preloader', {
    opacity: 0, duration: 1, delay: 0.5, onComplete: () => {
      document.getElementById('preloader').style.display = 'none';
    }
  });

  tl.from('.hero-meta', { opacity: 0, y: 20, duration: 1, ease: "power3.out" }, "-=0.2");
  tl.from('.split-text', { opacity: 0, y: 100, stagger: 0.1, duration: 1.2, ease: "power4.out" }, "-=0.8");
  tl.from('.hero-desc', { opacity: 0, y: 20, duration: 1 }, "-=0.8");
  tl.from('.hero-cta', { opacity: 0, y: 20, duration: 1 }, "-=0.8");
  tl.to('#nav', { opacity: 1, y: 0, duration: 1 }, "-=1");
}

// ─────────────────────────────────────────────────────────
// Photography Gallery
// ─────────────────────────────────────────────────────────
function renderPhotography() {
  const gallery = document.getElementById('photography-gallery');
  if (!gallery) return;

  gallery.innerHTML = photographyData.map(item => `
    <div class="gallery-item glass" data-id="${item.id}">
      <img src="${item.url}" alt="${item.title}" class="gallery-img" loading="lazy">
      <div class="gallery-overlay">
        <div class="hero-meta" style="margin-bottom: 4px;">${item.category}</div>
        <h3 class="artifact-card-title" style="font-size: 18px; margin-bottom: 4px;">${item.title}</h3>
        <p class="gallery-desc" style="font-size: 11px; color: var(--text);">${item.desc}</p>
      </div>
    </div>
  `).join('');

  // Entrance animation for items
  gsap.from('.gallery-item', {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '.gallery-grid',
      start: "top 80%"
    }
  });
}

// ─────────────────────────────────────────────────────────
// Page Transitions
// ─────────────────────────────────────────────────────────
function switchPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => {
    if (p.id === `page-${pageId}`) {
      p.style.display = 'block';
      p.style.opacity = 0;
      p.style.transform = 'translateY(20px)';
      gsap.to(p, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.3 });
      p.classList.add('active');
    } else {
      gsap.to(p, {
        opacity: 0, y: 20, duration: 0.5, onComplete: () => {
          p.style.display = 'none';
          p.classList.remove('active');
        }
      });
    }
  });

  // Nav link active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`);
  });

  // Special logic for GitHub Archive/Portfolio
  if (pageId === 'portfolio') {
    scrollEngine.unlock();
    if (!archiveInitialized) {
      initSelector((repos) => {
        selectedRepos = repos;
        launchArchive(repos);
        archiveInitialized = true;
      });
    }
  } else {
    scrollEngine.lock();
    inArchive = false;
  }
}

// ─────────────────────────────────────────────────────────
// Archive launch
// ─────────────────────────────────────────────────────────
function launchArchive(repos) {
  inArchive = true;
  renderer.domElement.style.pointerEvents = 'auto';
  panelGroups = createArchive(scene, repos, (repo, group) => {
    openArtifactPage(repo);
  });
  setupPanelClicks(panelGroups, camera, renderer, scrollEngine);

  const openBtn = document.getElementById('open-artifact-btn');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (focusedIndex >= 0 && panelGroups[focusedIndex]) {
        const repo = panelGroups[focusedIndex].userData.repo;
        openArtifactPage(repo);
      }
    });
  }
}

// ─────────────────────────────────────────────────────────
// Portfolio Tabs
// ─────────────────────────────────────────────────────────
function initPortfolioTabs() {
  document.querySelectorAll('.portfolio-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.portfolio-section').forEach(sec => {
        if (sec.id === `portfolio-${target}`) {
          sec.classList.add('active');
          gsap.from(sec, { opacity: 0, y: 20, duration: 0.6 });
        } else {
          sec.classList.remove('active');
        }
      });

      // Control WebGL involvement
      if (target === 'github') {
        inArchive = true;
        document.getElementById('github-archive-container').style.pointerEvents = 'auto';
        document.getElementById('depth-indicator').style.display = 'flex';
        document.getElementById('scroll-hint').style.display = 'flex';
      } else {
        inArchive = false;
        document.getElementById('github-archive-container').style.pointerEvents = 'none';
        document.getElementById('depth-indicator').style.display = 'none';
        document.getElementById('scroll-hint').style.display = 'none';
      }
    });
  });
}

// ─────────────────────────────────────────────────────────
// Router Integration
// ─────────────────────────────────────────────────────────
initRouter((route) => {
  if (route.name === 'home') {
    switchPage('home');
  } else if (route.name === 'portfolio') {
    switchPage('portfolio');
    renderPhotography();
    initPortfolioTabs();
  } else if (route.name === 'artifact') {
    const repo = selectedRepos.find(r => r.name === route.slug);
    if (repo) openArtifactPage(repo);
    else navigate('/portfolio');
  }
});

// ─────────────────────────────────────────────────────────
// App Startup
// ─────────────────────────────────────────────────────────
initArtifactPage();

window.addEventListener('load', () => {
  initEntrance();
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  scrollEngine.update();
  const scrollPos = scrollEngine.current;

  if (inArchive) {
    cameraTargetZ = ARCHIVE_START_Z + scrollPos * 0.06;
  } else {
    cameraTargetZ = 0;
  }

  cameraCurrentZ += (cameraTargetZ - cameraCurrentZ) * 0.06;
  camera.position.z = cameraCurrentZ;

  // Subtle camera sway
  camera.position.x += (Math.sin(time * 0.18) * 0.08 - camera.position.x) * 0.03;
  camera.position.y += (Math.cos(time * 0.12) * 0.04 - camera.position.y) * 0.03;
  camera.lookAt(camera.position.x * 0.1, camera.position.y * 0.1, camera.position.z - 8);

  if (particles) {
    particles.rotation.y = time * 0.006;
    particles.rotation.x = time * 0.003;
  }

  if (!inArchive && heroObjects.length > 0) {
    updateHero(heroObjects, time);
  }

  if (inArchive && panelGroups.length > 0) {
    const { focusedIndex: fi } = updateArchive(panelGroups, time, camera);
    focusedIndex = fi;
    setArchiveFocus(panelGroups, focusedIndex);

    const card = document.getElementById('artifact-card');
    if (focusedIndex >= 0) {
      const repo = panelGroups[focusedIndex].userData.repo;
      document.getElementById('artifact-card-index').textContent = `ARTIFACT ${String(focusedIndex + 1).padStart(2, '0')}`;
      document.getElementById('artifact-card-title').textContent = repo.name;
      document.getElementById('artifact-card-desc').textContent = repo.description || '';
      card.classList.add('visible');

      const depthBar = document.getElementById('depth-bar');
      const depthLabel = document.getElementById('depth-label');
      if (depthBar && depthLabel) {
        const pct = ((focusedIndex + 1) / panelGroups.length) * 100;
        depthBar.style.setProperty('--depth-pct', `${pct}%`);
        depthLabel.textContent = `${focusedIndex + 1}/${panelGroups.length}`;
      }
    } else {
      if (card) card.classList.remove('visible');
    }
  }

  renderer.render(scene, camera);
}

animate();
