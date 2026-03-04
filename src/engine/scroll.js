// Z-axis scroll engine — translates wheel/swipe into camera depth movement

const INERTIA = 0.06;       // lerp factor — lower = more inertia
const SCROLL_SPEED = 0.006; // wheel delta multiplier
const SWIPE_SPEED = 0.004;  // touch delta multiplier

export function createScrollEngine(maxDepth) {
    let targetZ = 0;
    let currentZ = 0;
    let touchStartY = 0;
    let isLocked = false; // locked when a detail panel is open

    // --- Wheel ---
    window.addEventListener('wheel', (e) => {
        if (isLocked) return;
        e.preventDefault();
        const delta = e.deltaY * SCROLL_SPEED;
        targetZ = Math.max(0, Math.min(maxDepth, targetZ + delta));
    }, { passive: false });

    // --- Touch ---
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isLocked) return;
        const dy = touchStartY - e.touches[0].clientY;
        touchStartY = e.touches[0].clientY;
        const delta = dy * SWIPE_SPEED;
        targetZ = Math.max(0, Math.min(maxDepth, targetZ + delta));
    }, { passive: true });

    function lock() { isLocked = true; }
    function unlock() { isLocked = false; }

    function jumpTo(z, snap = false) {
        targetZ = Math.max(0, Math.min(maxDepth, z));
        if (snap) currentZ = targetZ;
    }

    function update() {
        currentZ += (targetZ - currentZ) * INERTIA;
        return currentZ;
    }

    function getProgress() {
        return maxDepth > 0 ? currentZ / maxDepth : 0;
    }

    return { update, jumpTo, lock, unlock, getProgress, get current() { return currentZ; }, get target() { return targetZ; } };
}
