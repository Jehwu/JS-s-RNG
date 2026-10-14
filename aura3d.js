/* =========================================================
   🧊 3D 아우라 무대 (aura3d.js)
   - 더미 캐릭터, 바닥, 별, 아우라 전부 네모 박스로만 만든다
   - 화면 전체 배경에 그리고, 캐릭터는 .stage 영역 가운데에 오게 맞춘다
   ========================================================= */

import * as THREE from 'three';
import { EffectComposer } from './lib/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './lib/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './lib/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './lib/jsm/postprocessing/OutputPass.js';

const BOX = new THREE.BoxGeometry(1, 1, 1);
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- 얼굴 (머리 앞면에만 붙이는 그림) ---------- */
function makeFaceTexture(base) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = base;
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#15151c';
    g.beginPath(); g.ellipse(98, 104, 9, 15, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(158, 104, 9, 15, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#15151c';
    g.lineWidth = 9;
    g.lineCap = 'round';
    g.beginPath(); g.arc(128, 140, 40, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
}

/* ---------- 더미 캐릭터 (R6) ---------- */
function makeDummy() {
    const SKIN = '#c3c7d2';
    const mat = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.6, metalness: 0.05 });
    const faceMat = new THREE.MeshStandardMaterial({ map: makeFaceTexture(SKIN), roughness: 0.6 });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x5d6170, transparent: true, opacity: 0.55 });

    const root = new THREE.Group();
    const parts = [];   // 외곽 빛 테두리용

    function part(w, h, d, x, y, z, pivotY = 0, material = mat) {
        const pivot = new THREE.Group();
        pivot.position.set(x, y + pivotY, z);
        const mesh = new THREE.Mesh(BOX, material);
        mesh.scale.set(w, h, d);
        mesh.position.y = -pivotY;
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), edgeMat);
        edges.scale.copy(mesh.scale);
        edges.position.copy(mesh.position);
        pivot.add(mesh, edges);
        root.add(pivot);
        parts.push(mesh);
        return pivot;
    }

    // 몸 크기 (Roblox R6 비율)
    const legL = part(0.98, 2, 1, -0.5, 1, 0, 1);
    const legR = part(0.98, 2, 1, 0.5, 1, 0, 1);
    const torso = part(2, 2, 1, 0, 3, 0);
    const armL = part(1, 2, 1, -1.5, 3, 0, 0.9);
    const armR = part(1, 2, 1, 1.5, 3, 0, 0.9);
    const headMats = [mat, mat, mat, mat, faceMat, mat];   // +z 면에만 얼굴
    const head = part(1.25, 1.2, 1.2, 0, 4.62, 0, 0, headMats);

    return { root, parts, legL, legR, armL, armR, head, torso };
}

/* ---------- 네모 링 (얇은 박스 4개) ---------- */
function makeSquareRing(size, thick, mat) {
    const g = new THREE.Group();
    const h = size / 2;
    const sides = [[0, h, size + thick, thick], [0, -h, size + thick, thick], [h, 0, thick, size - thick], [-h, 0, thick, size - thick]];
    for (const [x, z, w, d] of sides) {
        const m = new THREE.Mesh(BOX, mat);
        m.scale.set(w, thick, d);
        m.position.set(x, 0, z);
        g.add(m);
    }
    return g;
}

function glowMat(color, opacity = 1) {
    return new THREE.MeshBasicMaterial({
        color, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    });
}

/* ---------- 아우라 만들기 ---------- */
function buildAura(aura, dummy) {
    const fx = aura.fx || {};
    const colors = (fx.colors || [aura.color]).map(c => new THREE.Color(c));
    const c0 = colors[0];
    const pick = i => colors[i % colors.length];
    const group = new THREE.Group();
    const updaters = [];
    const glow = fx.glow || 0;

    // 캐릭터 둘레 빛 테두리
    if (glow > 0) {
        const outlineMat = new THREE.MeshBasicMaterial({
            color: c0, side: THREE.BackSide, transparent: true,
            opacity: Math.min(0.42, 0.08 + glow * 0.12),
            blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
        });
        for (const p of dummy.parts) {
            const o = new THREE.Mesh(BOX, outlineMat);
            o.scale.setScalar(1).multiply(new THREE.Vector3(1.09, 1.06, 1.12));
            p.add(o);
            group.userData.outlines = group.userData.outlines || [];
            group.userData.outlines.push(o);
        }
        updaters.push(t => { outlineMat.opacity = Math.min(0.42, 0.08 + glow * 0.12) * (0.75 + 0.25 * Math.sin(t * 3)); });
    }

    // 몸 쪽 조명
    const light = new THREE.PointLight(c0, Math.min(glow * 2.5, 4.5), 7, 1.8);
    light.position.set(0, 3, 1.6);
    group.add(light);

    // 위로 떠오르는 큐브
    if (fx.particles) {
        const n = fx.particles, rise = fx.rise || 1;
        const mesh = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 0.7), n);
        const data = [];
        for (let i = 0; i < n; i++) {
            data.push({ r: rand(1.7, 3.1), a: rand(0, Math.PI * 2), y: rand(0, 6), v: rand(0.5, 1.4) * rise, s: rand(0.08, 0.2), spin: rand(-3, 3) });
            mesh.setColorAt(i, pick(i));
        }
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
        updaters.push((t, dt) => {
            data.forEach((d, i) => {
                d.y += d.v * dt;
                if (d.y > 6.5) { d.y = 0; d.a = rand(0, Math.PI * 2); }
                const fade = Math.min(1, d.y * 2) * Math.max(0, 1 - (d.y - 4.5) / 2);
                p.set(Math.cos(d.a + t * 0.2) * d.r, d.y, Math.sin(d.a + t * 0.2) * d.r);
                e.set(t * d.spin, t * d.spin * 0.7, 0); q.setFromEuler(e);
                sc.setScalar(d.s * fade);
                mesh.setMatrixAt(i, m4.compose(p, q, sc));
            });
            mesh.instanceMatrix.needsUpdate = true;
        });
        group.add(mesh);
    }

    // 몸 주위를 도는 큐브
    if (fx.orbit) {
        const n = fx.orbit;
        const mesh = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 1), n);
        for (let i = 0; i < n; i++) mesh.setColorAt(i, pick(i + 1));
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
        updaters.push((t, dt, speed) => {
            for (let i = 0; i < n; i++) {
                const a = t * 1.1 * speed + (i / n) * Math.PI * 2;
                p.set(Math.cos(a) * 2.3, 2.8 + Math.sin(a * 2 + i) * 0.9, Math.sin(a) * 2.3);
                e.set(t * 2 + i, t * 1.5, 0); q.setFromEuler(e);
                sc.setScalar(0.26);
                mesh.setMatrixAt(i, m4.compose(p, q, sc));
            }
            mesh.instanceMatrix.needsUpdate = true;
        });
        group.add(mesh);
    }

    // 발밑 네모 링
    for (let i = 0; i < (fx.rings || 0); i++) {
        const ring = makeSquareRing(3.4 + i * 0.9, 0.07, glowMat(pick(i), 0.85));
        ring.position.y = 0.2 + i * 0.06;
        const dir = i % 2 ? -1 : 1, sp = 0.4 + i * 0.15;
        updaters.push((t, dt, speed) => {
            ring.rotation.y = t * sp * dir * speed;
            ring.position.y = 0.2 + i * 0.06 + Math.sin(t * 1.5 + i) * 0.05;
        });
        group.add(ring);
    }

    // 머리 위 네모 후광
    if (fx.halo) {
        const halo = new THREE.Group();
        const outer = makeSquareRing(1.5, 0.08, glowMat(c0, 1));
        const inner = makeSquareRing(1.0, 0.06, glowMat(pick(1), 0.9));
        inner.rotation.y = Math.PI / 4;
        halo.add(outer, inner);
        halo.position.y = 5.75;
        updaters.push(t => {
            halo.rotation.y = t * 0.8;
            inner.rotation.y = Math.PI / 4 - t * 1.6;
            halo.position.y = 5.75 + Math.sin(t * 2) * 0.06;
        });
        group.add(halo);
    }

    // 빛기둥
    if (fx.pillar) {
        const pillar = new THREE.Group();
        const colMat = glowMat(c0, 0.5);
        for (const [x, z] of [[1.7, 1.7], [-1.7, 1.7], [1.7, -1.7], [-1.7, -1.7]]) {
            const col = new THREE.Mesh(BOX, colMat);
            col.scale.set(0.06, 18, 0.06);
            col.position.set(x, 9, z);
            pillar.add(col);
        }
        updaters.push(t => {
            pillar.rotation.y = t * 0.25;
            colMat.opacity = 0.35 + 0.2 * Math.sin(t * 2.4);
        });
        group.add(pillar);
    }

    // 블록 날개
    if (fx.wings) {
        const makeWing = side => {
            const w = new THREE.Group();
            for (let k = 0; k < 6; k++) {
                const f = new THREE.Mesh(BOX, glowMat(pick(k), 0.75 - k * 0.07));
                const len = 2.6 - k * 0.28;
                f.scale.set(len, 0.22, 0.08);
                f.position.set(side * (len / 2 + 0.1), 0.55 - k * 0.32, 0);
                f.rotation.z = side * (0.35 - k * 0.14);
                w.add(f);
            }
            w.position.set(side * 0.6, 3.6, -0.75);
            return w;
        };
        const L = makeWing(-1), R = makeWing(1);
        updaters.push(t => {
            const flap = Math.sin(t * 2.2) * 0.22;
            L.rotation.y = 0.35 + flap; R.rotation.y = -0.35 - flap;
        });
        group.add(L, R);
    }

    // 떠다니는 크리스탈 큐브
    if (fx.shards) {
        const n = fx.shards;
        const mesh = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 0.4), n);
        for (let i = 0; i < n; i++) mesh.setColorAt(i, pick(i + 2));
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
        updaters.push((t, dt, speed) => {
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2 - t * 0.35 * speed;
                p.set(Math.cos(a) * 3.3, 2.4 + Math.sin(t * 1.3 + i * 1.7) * 1.4, Math.sin(a) * 3.3);
                e.set(t * 0.8 + i, t * 1.1 + i, Math.PI / 4); q.setFromEuler(e);
                sc.set(0.42, 0.42, 0.42);
                mesh.setMatrixAt(i, m4.compose(p, q, sc));
            }
            mesh.instanceMatrix.needsUpdate = true;
        });
        group.add(mesh);
    }

    // 공허: 검은 큐브가 소용돌이치며 빨려 들어감
    if (fx.void) {
        const n = 46;
        const mesh = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: 0x050008, transparent: true, opacity: 0.85, depthWrite: false }), n);
        const data = Array.from({ length: n }, () => ({ k: Math.random(), a: rand(0, Math.PI * 2), y: rand(0.5, 5.5), s: rand(0.12, 0.3) }));
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3();
        updaters.push((t, dt) => {
            data.forEach((d, i) => {
                d.k -= dt * 0.25;
                if (d.k < 0) { d.k = 1; d.a = rand(0, Math.PI * 2); d.y = rand(0.5, 5.5); }
                const r = 0.9 + d.k * 3.6, a = d.a + (1 - d.k) * 4;
                p.set(Math.cos(a) * r, d.y, Math.sin(a) * r);
                e.set(t + i, t * 1.3, 0); q.setFromEuler(e);
                sc.setScalar(d.s * Math.min(1, d.k * 3));
                mesh.setMatrixAt(i, m4.compose(p, q, sc));
            });
            mesh.instanceMatrix.needsUpdate = true;
        });
        group.add(mesh);
    }

    // 번개: 꺾인 박스 줄기가 번쩍
    if (fx.lightning) {
        const bolts = [];
        for (let b = 0; b < 4; b++) {
            const bolt = new THREE.Group();
            for (let s = 0; s < 6; s++) bolt.add(new THREE.Mesh(BOX, glowMat(pick(b === 0 ? 2 : 0), 1)));
            bolts.push(bolt);
            group.add(bolt);
        }
        let next = 0;
        const reshape = bolt => {
            const a = rand(0, Math.PI * 2), r = rand(1.6, 3.2);
            let x = Math.cos(a) * r, z = Math.sin(a) * r, y = 7.5;
            bolt.children.forEach(seg => {
                const nx = x + rand(-0.7, 0.7), nz = z + rand(-0.7, 0.7), ny = y - rand(0.9, 1.4);
                const len = Math.hypot(nx - x, ny - y, nz - z);
                seg.scale.set(0.07, len, 0.07);
                seg.position.set((x + nx) / 2, (y + ny) / 2, (z + nz) / 2);
                seg.lookAt(nx, ny, nz); seg.rotateX(Math.PI / 2);
                x = nx; y = ny; z = nz;
            });
        };
        updaters.push(t => {
            if (t > next) {
                next = t + rand(0.08, 0.35);
                bolts.forEach(b => { b.visible = Math.random() < 0.55; if (b.visible) reshape(b); });
            }
        });
    }

    return { group, updaters, color: c0, glow };
}

/* =========================================================
   무대
   ========================================================= */

export function createAuraStage(canvas, { getStageRect, onLabel }) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03030a);
    scene.fog = new THREE.Fog(0x03030a, 26, 90);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);
    const target = new THREE.Vector3(0, 3.1, 0);

    scene.add(new THREE.HemisphereLight(0x8a90c0, 0x0a0a18, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 9, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6b5cff, 1.2);
    rim.position.set(-5, 5, -6);
    scene.add(rim);

    // 별 (작은 큐브)
    const STARS = 700;
    const stars = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false }), STARS);
    {
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), c = new THREE.Color();
        for (let i = 0; i < STARS; i++) {
            const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = rand(70, 160);
            const s = Math.sqrt(1 - u * u);
            p.set(Math.cos(th) * s * r, u * r * 0.7 + 10, Math.sin(th) * s * r);
            q.setFromEuler(new THREE.Euler(rand(0, 3), rand(0, 3), 0));
            sc.setScalar(Math.random() ** 3 * 0.45 + 0.12);
            stars.setMatrixAt(i, m4.compose(p, q, sc));
            const b = rand(0.35, 1.25);
            stars.setColorAt(i, c.setRGB(b, b, b * rand(1, 1.25)));
        }
    }
    scene.add(stars);

    // 바닥 타일
    const floor = new THREE.Group();
    const TILES = 7, T = 1.02;
    const tileMesh = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ color: 0x14142a, roughness: 0.35, metalness: 0.5 }), TILES * TILES);
    {
        const m4 = new THREE.Matrix4();
        let i = 0;
        for (let x = 0; x < TILES; x++) for (let z = 0; z < TILES; z++) {
            m4.makeScale(0.96, 0.18, 0.96);
            m4.setPosition((x - (TILES - 1) / 2) * T, -0.09, (z - (TILES - 1) / 2) * T);
            tileMesh.setMatrixAt(i++, m4);
        }
    }
    const gapGlow = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x5b4dff, toneMapped: false }));
    gapGlow.scale.set(TILES * T - 0.06, 0.02, TILES * T - 0.06);
    gapGlow.position.y = -0.16;
    floor.add(tileMesh, gapGlow);
    scene.add(floor);

    // 캐릭터
    const dummy = makeDummy();
    scene.add(dummy.root);

    // 아우라
    let current = null;
    let auraScale = 0;
    let rolling = false, speed = 1;
    let flash = 0;
    let shakeAmt = 0;

    function clearAura() {
        if (!current) return;
        scene.remove(current.group);
        current.group.traverse(o => { if (o.material) o.material.dispose?.(); });
        for (const p of dummy.parts) {
            [...p.children].forEach(ch => { ch.material?.dispose?.(); p.remove(ch); });
        }
        current = null;
    }

    function setAura(aura) {
        clearAura();
        if (!aura) return;
        current = buildAura(aura, dummy);
        scene.add(current.group);
        gapGlow.material.color.copy(current.color).multiplyScalar(0.35 + Math.min(1, current.glow) * 0.4);
        rim.color.copy(current.color);
        bloom.strength = 0.5 + Math.min(current.glow, 2) * 0.12;
        auraScale = 0;
        flash = 1;
    }

    // 블룸
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.32, 0.82);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // 화면 크기 & 캐릭터를 .stage 영역 가운데 맞추기
    let W = 1, H = 1, frame = { cx: 0.5, cy: 0.55, h: 0.6 };
    function resize() {
        W = window.innerWidth; H = window.innerHeight;
        renderer.setSize(W, H, false);
        composer.setSize(W, H);
        bloom.resolution.set(W / 2, H / 2);
        const r = getStageRect && getStageRect();
        if (r && r.height > 40) {
            frame = { cx: (r.left + r.width / 2) / W, cy: (r.top + r.height * 0.64) / H, h: r.height / H };
        } else {
            frame = { cx: 0.5, cy: 0.5, h: 0.42 };
        }
        camera.aspect = W / H;
        // 캐릭터+아우라(높이 약 8.6)가 무대 높이에 꽉 차도록 거리 계산
        const fovR = THREE.MathUtils.degToRad(camera.fov);
        dist = 10.5 / (frame.h * 2 * Math.tan(fovR / 2));
        camera.setViewOffset(W, H, W / 2 - frame.cx * W, H / 2 - frame.cy * H, W, H);
        camera.updateProjectionMatrix();
    }
    let dist = 20;
    window.addEventListener('resize', resize);
    resize();

    // 루프
    const clock = new THREE.Clock();
    const headTop = new THREE.Vector3();
    let t = 0;
    function tick() {
        const dt = Math.min(clock.getDelta(), 0.05);
        speed += ((rolling ? 3.2 : 1) - speed) * Math.min(1, dt * 4);
        t += dt;

        // 카메라: 천천히 좌우로 흔들리며 캐릭터를 봄
        const yaw = Math.sin(t * 0.18) * 0.35;
        camera.position.set(Math.sin(yaw) * dist, target.y + dist * 0.16, Math.cos(yaw) * dist);
        if (shakeAmt > 0.001) {
            camera.position.x += rand(-1, 1) * shakeAmt;
            camera.position.y += rand(-1, 1) * shakeAmt;
            shakeAmt *= Math.pow(0.02, dt);
        }
        camera.lookAt(target);

        // 숨쉬기 / 팔다리 살짝
        const breathe = Math.sin(t * 1.6);
        dummy.torso.position.y = 3 + breathe * 0.02;
        dummy.head.position.y = 4.62 + breathe * 0.03;
        dummy.armL.rotation.x = Math.sin(t * 1.2) * 0.06;
        dummy.armR.rotation.x = -Math.sin(t * 1.2) * 0.06;
        dummy.armL.rotation.z = -0.04 - (rolling ? 0.25 : 0);
        dummy.armR.rotation.z = 0.04 + (rolling ? 0.25 : 0);

        stars.rotation.y = t * 0.004;

        if (current) {
            auraScale += (1 - auraScale) * Math.min(1, dt * 5);
            current.group.scale.setScalar(0.4 + 0.6 * auraScale);
            current.updaters.forEach(u => u(t, dt, speed));
            current.group.children.forEach(ch => { if (ch.isPointLight) ch.intensity = Math.min(current.glow * 2.5, 4.5) * (1 + flash * 1.2); });
        }
        flash *= Math.pow(0.04, dt);

        composer.render();

        if (onLabel) {
            headTop.set(0, 6.35, 0).project(camera);
            onLabel((headTop.x * 0.5 + 0.5) * W, (-headTop.y * 0.5 + 0.5) * H);
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    return {
        setAura,
        resize,
        setRolling(v) { rolling = v; },
        flash() { flash = 1; },
        shake(amount = 0.35) { shakeAmt = amount; flash = 1; }
    };
}
