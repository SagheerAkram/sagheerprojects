import * as THREE from 'three';

// Z positions for sections
export const Z = {
    HERO: 0,
    ARCHIVE_START: -12
};

export function createHeroArtifact(scene) {
    const group = new THREE.Group();

    // Core — icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0a2040,
        emissive: 0x4ab8f0,
        emissiveIntensity: 0.3,
        metalness: 0.7,
        roughness: 0.2
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner wireframe shell
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const innerWire = new THREE.WireframeGeometry(innerGeo);
    const innerLineMat = new THREE.LineBasicMaterial({
        color: 0x4ab8f0, transparent: true, opacity: 0.35
    });
    const innerWireMesh = new THREE.LineSegments(innerWire, innerLineMat);
    group.add(innerWireMesh);

    // Outer transparent shell — octahedron
    const outerGeo = new THREE.OctahedronGeometry(1.7, 2);
    const outerMat = new THREE.MeshStandardMaterial({
        color: 0x4ab8f0,
        transparent: true,
        opacity: 0.04,
        wireframe: false,
        side: THREE.DoubleSide
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    group.add(outer);

    const outerWireGeo = new THREE.OctahedronGeometry(1.7, 2);
    const outerWire = new THREE.WireframeGeometry(outerWireGeo);
    const outerLineMat = new THREE.LineBasicMaterial({
        color: 0x4ab8f0, transparent: true, opacity: 0.12
    });
    const outerWireMesh = new THREE.LineSegments(outerWire, outerLineMat);
    group.add(outerWireMesh);

    // Point glow
    const glow = new THREE.PointLight(0x4ab8f0, 1.5, 6);
    group.add(glow);

    group.position.set(0.8, 0.1, -4);
    scene.add(group);

    let time = 0;
    function update(dt) {
        time += dt;
        group.rotation.y += 0.003;
        group.rotation.x += 0.001;
        outerWireMesh.rotation.y -= 0.002;
        outerWireMesh.rotation.z += 0.001;

        // Breathing glow
        const pulse = Math.sin(time * 1.2) * 0.5 + 0.5;
        glow.intensity = 1.0 + pulse * 0.8;
        coreMat.emissiveIntensity = 0.25 + pulse * 0.2;
        innerLineMat.opacity = 0.25 + pulse * 0.12;
    }

    function setVisible(v) { group.visible = v; }

    return { group, update, setVisible };
}

export function initHeroUI(onEnter) {
    const heroUI = document.getElementById('hero-ui');
    const enterBtn = document.getElementById('enter-archive-btn');
    const scrollHint = document.getElementById('scroll-hint');
    const nav = document.getElementById('nav');
    const depthIndicator = document.getElementById('depth-indicator');

    enterBtn.addEventListener('click', () => {
        heroUI.style.opacity = '0';
        heroUI.style.pointerEvents = 'none';
        setTimeout(() => {
            heroUI.classList.remove('active');
            nav.classList.add('visible');
            depthIndicator.classList.add('visible');
            scrollHint.classList.remove('hidden');
            onEnter();
        }, 800);
    });
}

// Convenience exports for main.js API
export function createHero(scene) {
    const artifact = createHeroArtifact(scene);
    return [artifact]; // Return array so main.js can iterate/remove
}

export function updateHero(artifacts, time) {
    if (artifacts && artifacts[0]) {
        const dt = 0.016;
        artifacts[0].update(dt);
    }
}
