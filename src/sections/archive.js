import * as THREE from 'three';
import { getLangColor } from './selector.js';
import { navigate } from '../router.js';

export const PANEL_W = 1.4;
export const PANEL_H = 1.85;
export const ARTIFACT_SPACING = 13;
export const ARCHIVE_START_Z = -12;
const X_OFFSETS = [-2.0, 2.0, -2.3, 2.3, -1.8, 2.1, -2.2, 2.0];

let panelGroups = [];
let currentSelected = [];
let onOpenCb = null;

export function createArchive(scene, repos, onOpen) {
    onOpenCb = onOpen;

    // Clear any existing panels
    panelGroups.forEach(g => scene.remove(g));
    panelGroups = [];
    currentSelected = repos;

    repos.forEach((repo, i) => {
        const group = createPanelGroup(repo, i);
        group.position.set(
            X_OFFSETS[i % X_OFFSETS.length],
            (Math.random() - 0.5) * 0.4,
            ARCHIVE_START_Z - i * ARTIFACT_SPACING
        );
        group.rotation.y = THREE.MathUtils.degToRad(i % 2 === 0 ? -6 : 6);
        scene.add(group);
        panelGroups.push(group);
    });

    return panelGroups;
}

function createPanelGroup(repo, index) {
    const group = new THREE.Group();
    const color = getLangColor(repo.language);
    const colorObj = new THREE.Color(color);

    // Main panel
    const geo = new THREE.PlaneGeometry(PANEL_W, PANEL_H, 1, 1);
    const texture = createPanelTexture(repo);
    const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(geo, mat);
    group.add(panel);

    // Edge glow — slightly oversized plane behind panel
    const glowGeo = new THREE.PlaneGeometry(PANEL_W + 0.08, PANEL_H + 0.08);
    const glowMat = new THREE.MeshBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.07,
        side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.z = -0.005;
    group.add(glow);

    // Top accent line
    const lineGeo = new THREE.PlaneGeometry(PANEL_W, 0.006);
    const lineMat = new THREE.MeshBasicMaterial({ color: colorObj, transparent: true, opacity: 0.7 });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.y = PANEL_H / 2;
    group.add(line);

    // Click interaction via raycaster stored on group
    group.userData = {
        repo,
        panel,
        glow,
        glowMat,
        colorStr: color,
        baseX: X_OFFSETS[index % X_OFFSETS.length],
        driftOffset: Math.random() * Math.PI * 2,
        driftSpeed: 0.35 + Math.random() * 0.15,
        targetRotY: THREE.MathUtils.degToRad(index % 2 === 0 ? -6 : 6),
        hovered: false,
        distFromCamera: 0
    };

    return group;
}

function createPanelTexture(repo) {
    const W = 560, H = 760;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const color = getLangColor(repo.language);

    // Background
    ctx.fillStyle = '#080f1e';
    ctx.fillRect(0, 0, W, H);

    // Glass tint overlay
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(74,184,240,0.06)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    ctx.globalAlpha = 1;

    // Top accent bar
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(0, 0, W, 4);
    ctx.globalAlpha = 1;

    // Index label
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.font = '500 15px monospace';
    ctx.fillText('ARTIFACT', 28, 46);
    ctx.globalAlpha = 1;

    // Stars (right aligned)
    if (repo.stargazers_count > 0) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.font = '500 14px monospace';
        const starStr = `★ ${repo.stargazers_count}`;
        const sw = ctx.measureText(starStr).width;
        ctx.fillText(starStr, W - sw - 28, 46);
        ctx.globalAlpha = 1;
    }

    // Divider
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, 60);
    ctx.lineTo(W - 28, 60);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Project title (large)
    ctx.fillStyle = '#e8f0f8';
    ctx.font = 'bold 30px sans-serif';
    const titleStr = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
    wrapCanvasText(ctx, titleStr, 28, 108, W - 56, 36, 2);

    // Language badge
    if (repo.language) {
        const badgeW = ctx.measureText(repo.language).width + 28;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.12;
        roundRect(ctx, 28, 168, badgeW, 26, 3);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = color;
        ctx.font = '500 14px monospace';
        ctx.fillText(repo.language, 38, 186);
    }

    // Divider 2
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, 216);
    ctx.lineTo(W - 28, 216);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Description
    const desc = repo.description || '—';
    ctx.fillStyle = '#6a8090';
    ctx.font = '16px sans-serif';
    wrapCanvasText(ctx, desc, 28, 256, W - 56, 24, 4);

    // Topics pills
    if (repo.topics && repo.topics.length > 0) {
        let tx = 28, ty = 480;
        ctx.font = '12px monospace';
        repo.topics.slice(0, 4).forEach(topic => {
            const tw = ctx.measureText(topic).width + 18;
            if (tx + tw > W - 28) { tx = 28; ty += 30; }

            ctx.fillStyle = color;
            ctx.globalAlpha = 0.1;
            roundRect(ctx, tx, ty, tw, 22, 2);
            ctx.fill();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = color;
            ctx.fillText(topic, tx + 9, ty + 15);
            ctx.globalAlpha = 1;
            tx += tw + 8;
        });
    }

    // Bottom meta
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, H - 60);
    ctx.lineTo(W - 28, H - 60);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const dateStr = repo.pushed_at
        ? new Date(repo.pushed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        : '';
    ctx.fillStyle = '#3a5060';
    ctx.font = '13px monospace';
    ctx.fillText(`UPDATED ${dateStr}`, 28, H - 34);

    // "Open" indicator bottom right
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.fillText('OPEN →', W - 90, H - 34);
    ctx.globalAlpha = 1;

    return new THREE.CanvasTexture(canvas);
}

function wrapCanvasText(ctx, text, x, y, maxW, lineH, maxLines) {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (const word of words) {
        if (lineCount >= maxLines) break;
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxW && line !== '') {
            ctx.fillText(line.trim(), x, y);
            y += lineH;
            line = word + ' ';
            lineCount++;
        } else {
            line = test;
        }
    }
    if (lineCount < maxLines && line) {
        ctx.fillText(line.trim(), x, y);
    }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

// Per-frame update — returns { focusedIndex }
export function updateArchive(panelGroups, time, camera) {
    let focusedIndex = -1;
    let closestDist = Infinity;

    panelGroups.forEach((group, i) => {
        const ud = group.userData;

        // Hover drift
        const bob = Math.sin(time * ud.driftSpeed + ud.driftOffset) * 0.025;
        group.position.y = ud.baseY !== undefined ? ud.baseY + bob : group.position.y + bob * 0.05;

        // Subtle Y rotation drift
        const rotDrift = Math.sin(time * 0.2 + i) * THREE.MathUtils.degToRad(1.2);
        group.rotation.y = ud.targetRotY + rotDrift;

        // Distance from camera
        ud.distFromCamera = Math.abs(group.position.z - camera.position.z);
        if (ud.distFromCamera < closestDist) {
            closestDist = ud.distFromCamera;
            focusedIndex = i;
        }
    });

    return { focusedIndex, closestDist };
}

export function setArchiveFocus(panelGroups, focusedIndex) {
    panelGroups.forEach((group, i) => {
        const ud = group.userData;
        const isFocused = i === focusedIndex;

        if (isFocused !== ud.focused) {
            ud.focused = isFocused;
            ud.glowMat.opacity = isFocused ? 0.18 : 0.07;
        }
    });
}

// Setup raycaster-based click detection
export function setupPanelClicks(panelGroups, camera, renderer, scrollEngine) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const meshes = panelGroups.map(g => g.userData.panel).filter(Boolean);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const group = panelGroups.find(g => g.userData.panel === hit);
            if (group) {
                const { repo } = group.userData;
                onOpenCb && onOpenCb(repo, group);
                navigate(`/artifact/${repo.name}`);
            }
        }
    });
}

export function getPanelGroups() { return panelGroups; }
