/* =========================================================
   🛠 제작창 3D 미리보기
   렌더러 하나로 장비 모형을 돌려 그려서, 카드마다 있는 작은 캔버스에 복사한다
   (WebGL 창을 여러 개 만들면 폰이 버벅여서)
   ========================================================= */

import * as THREE from 'three';
import { buildGearModel } from './gear3d.js?v=17';

export function createGearPreviews() {
    const SIZE = 200;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(SIZE, SIZE, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x8a7bff, 1.6); rim.position.set(-4, 2, -3); scene.add(rim);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0.4, 5.6);
    camera.lookAt(0, -0.05, 0);
    const holder = new THREE.Group(); scene.add(holder);

    const models = new Map();
    let canvases = [];
    let raf = 0, t0 = performance.now(), last = 0;

    function model(id) {
        if (!models.has(id)) models.set(id, buildGearModel(id));
        return models.get(id);
    }

    function frame(now) {
        raf = requestAnimationFrame(frame);
        if (now - last < 33) return;   // 30fps 면 충분
        last = now;
        const t = (now - t0) / 1000;
        canvases = canvases.filter(c => c.isConnected);
        if (!canvases.length) { stop(); return; }
        for (const c of canvases) {
            const r = c.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) continue;   // 화면 밖은 안 그림
            const m = model(c.dataset.gear);
            if (!m) continue;
            holder.clear();
            holder.add(m.root);
            m.root.rotation.set(0.12, t * 0.7 + (c.dataset.ph ? +c.dataset.ph : 0), m.isAmulet ? 0.25 : -0.25);
            m.root.position.y = m.isAmulet ? -0.55 : 0.45;
            m.update(t);
            renderer.render(scene, camera);
            const ctx = c.getContext('2d');
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.drawImage(renderer.domElement, 0, 0, c.width, c.height);
        }
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; }

    return {
        // 제작창을 열거나 다시 그릴 때마다 호출
        attach(root) {
            canvases = [...root.querySelectorAll('canvas[data-gear]')];
            canvases.forEach((c, i) => { c.width = c.height = SIZE; c.dataset.ph = i * 0.9; });
            if (!raf && canvases.length) raf = requestAnimationFrame(frame);
        },
        stop
    };
}
