import * as THREE from 'three';

const PARTICLE_COUNT = 900;
const SPREAD_XY = 18;
const SPREAD_Z = 160;
const DRIFT_SPEED = 0.00012;

export function createParticles(scene, maxDepth) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const brightnesses = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * SPREAD_XY * 2;
        positions[i3 + 1] = (Math.random() - 0.5) * SPREAD_XY;
        positions[i3 + 2] = -Math.random() * SPREAD_Z;
        sizes[i] = Math.random() * 1.8 + 0.3;
        brightnesses[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('brightness', new THREE.BufferAttribute(brightnesses, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        },
        vertexShader: `
      attribute float size;
      attribute float brightness;
      varying float vBrightness;
      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vBrightness = brightness;
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + position.x * 0.5) * 0.08;
        pos.x += cos(uTime * 0.2 + position.z * 0.3) * 0.06;
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * uPixelRatio * (200.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
        fragmentShader: `
      varying float vBrightness;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = (1.0 - dist * 2.0) * vBrightness * 0.55;
        gl_FragColor = vec4(0.6 + vBrightness * 0.4, 0.75 + vBrightness * 0.2, 1.0, alpha);
      }
    `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    function update(time) {
        material.uniforms.uTime.value = time;
    }

    return { particles, update };
}
