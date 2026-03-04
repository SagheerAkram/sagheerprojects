import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    // Volumetric space fog
    scene.fog = new THREE.FogExp2(0x060810, 0.018);

    // Ambient light — very dim, sets the void mood
    const ambient = new THREE.AmbientLight(0x0a1628, 0.8);
    scene.add(ambient);

    // Key light — cool blue accent
    const keyLight = new THREE.DirectionalLight(0x4ab8f0, 1.2);
    keyLight.position.set(5, 8, -4);
    scene.add(keyLight);

    // Rim light — warm teal fill
    const rimLight = new THREE.DirectionalLight(0x4af0c4, 0.4);
    rimLight.position.set(-8, -3, 6);
    scene.add(rimLight);

    // Point light at origin for hero artifact glow
    const heroGlow = new THREE.PointLight(0x4ab8f0, 2, 12);
    heroGlow.position.set(0, 0, 0);
    scene.add(heroGlow);

    return { scene, heroGlow };
}

export function createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x060810, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;

    container.appendChild(renderer.domElement);
    return renderer;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        500
    );
    camera.position.set(0, 0, 0);
    return camera;
}

export function handleResize(camera, renderer) {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}
