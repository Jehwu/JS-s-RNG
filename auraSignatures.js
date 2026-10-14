/* =========================================================
   👑 고급 칭호 전용 아우라 (LEGEND 이상)
   칭호마다 이름에 맞는 연출 하나. 전부 네모 블록.
   auras.js 의 fx.signature 이름으로 연결된다.

   각 함수가 받는 것:
     group     여기에 붙인 건 아우라 바꿀 때 같이 지워짐
     tick(fn)  매 프레임 fn(t, dt, speed) 실행
     colors    칭호 색들 (THREE.Color), pick(i) 로 돌려쓰기
     dummy     캐릭터 (root, parts, head, torso, armL, armR, legL, legR)
     stage     { scene, setSky(hex), floorTiles(fn), onClear(fn) }
     kit       { THREE, BOX, glowMat, solidMat, square, rand, ghost, sword, bolt }
   ========================================================= */

export const SIGNATURES = {

    /* 크레이지콩 — 콩 큐브가 바닥에서 통통 튀며 찌그러짐 */
    crazyBounce({ group, tick, pick, dummy, kit }) {
        const { THREE, BOX, solidMat, rand } = kit;
        const beans = [];
        for (let i = 0; i < 11; i++) {
            const m = new THREE.Mesh(BOX, solidMat(pick(i), 1.4));
            const a = (i / 11) * Math.PI * 2 + rand(-0.2, 0.2);
            const r = rand(1.9, 3.3);
            m.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r, h: rand(1.2, 3.2), sp: rand(3.2, 5.2), ph: rand(0, 6), s: rand(0.32, 0.48) };
            beans.push(m);
            group.add(m);
        }
        tick(t => {
            beans.forEach(b => {
                const d = b.userData;
                const k = Math.abs(Math.sin(t * d.sp + d.ph));
                const y = k * d.h;
                const squash = k < 0.15 ? 1 - (0.15 - k) * 3 : 1 + Math.min(0.25, k * 0.25);
                b.scale.set(d.s / Math.sqrt(squash), d.s * squash, d.s / Math.sqrt(squash));
                b.position.set(d.x, y + b.scale.y / 2, d.z);
                b.rotation.y = t * 2 + d.ph;
            });
            dummy.root.rotation.z = Math.sin(t * 9) * 0.025;   // 신나서 들썩
        });
    },

    /* 광속의 김민채 — 잔상 2개 + 옆으로 스치는 속도선 */
    lightspeed({ group, tick, pick, kit }) {
        const { THREE, BOX, glowMat, rand, ghost } = kit;
        const g1 = ghost(pick(0), 0.32), g2 = ghost(pick(1), 0.16);
        group.add(g1, g2);
        const lines = [];
        for (let i = 0; i < 26; i++) {
            const m = new THREE.Mesh(BOX, glowMat(pick(i), 0.8));
            m.userData = { y: rand(0.2, 6.5), z: rand(-2.5, 2.5), v: rand(18, 34), len: rand(1.5, 5), x: rand(-12, 12) };
            m.scale.set(m.userData.len, 0.035, 0.035);
            m.userData.noFit = true;
            lines.push(m); group.add(m);
        }
        tick((t, dt) => {
            g1.position.set(-1.0 + Math.sin(t * 7) * 0.08, 0, -0.5);
            g2.position.set(-2.1 + Math.sin(t * 7 + 1) * 0.1, 0, -1.0);
            lines.forEach(l => {
                const d = l.userData;
                d.x -= d.v * dt;
                if (d.x < -12) { d.x = 12; d.y = rand(0.2, 6.5); }
                l.position.set(d.x, d.y, d.z);
            });
        });
    },

    /* 대마법사 공병은 — 겹겹이 반대로 도는 네모 마법진 + 나선으로 솟는 룬 */
    archmage({ group, tick, pick, kit }) {
        const { THREE, BOX, glowMat, square } = kit;
        const circle = new THREE.Group();
        const outer = square(4.6, 0.06, glowMat(pick(0), 0.95));
        const mid = square(3.4, 0.05, glowMat(pick(1), 0.9)); mid.rotation.y = Math.PI / 4;
        const inner = square(2.2, 0.05, glowMat(pick(0), 0.9));
        const runes = new THREE.Group();
        for (let i = 0; i < 20; i++) {
            const side = i % 4, f = (Math.floor(i / 4) + 0.5) / 5 - 0.5;
            const rr = new THREE.Mesh(BOX, glowMat(pick(1), 1));
            rr.scale.set(0.16, 0.04, 0.16);
            const p = [[f * 4.6, 2.65], [f * 4.6, -2.65], [2.65, f * 4.6], [-2.65, f * 4.6]][side];
            rr.position.set(p[0], 0, p[1]);
            runes.add(rr);
        }
        circle.add(outer, mid, inner, runes);
        circle.position.y = 0.06;
        group.add(circle);
        const orbs = [];
        for (let i = 0; i < 4; i++) {
            const o = new THREE.Mesh(BOX, glowMat(pick(i), 1));
            orbs.push(o); group.add(o);
        }
        tick((t, dt, speed) => {
            outer.rotation.y = t * 0.25 * speed;
            mid.rotation.y = Math.PI / 4 - t * 0.5 * speed;
            inner.rotation.y = t * 0.9 * speed;
            runes.rotation.y = t * 0.25 * speed;
            orbs.forEach((o, i) => {
                const k = ((t * 0.35 + i / 4) % 1);
                const a = k * Math.PI * 3 + (i * Math.PI) / 2;
                const r = 2.4 * (1 - k * 0.85);
                o.position.set(Math.cos(a) * r, 0.2 + k * 6, Math.sin(a) * r);
                o.scale.setScalar(0.28 * (1 - k * 0.6));
                o.rotation.set(t * 3, t * 2, 0);
                o.material.opacity = Math.min(1, (1 - k) * 2.5);
            });
        });
    },

    /* 김민제미나이 — 깜빡이는 데이터 벽 + 몸을 훑는 스캔선 + 8자로 도는 쌍둥이 큐브 */
    gemini({ group, tick, pick, kit }) {
        const { THREE, BOX, glowMat, rand } = kit;
        const COLS = 11, ROWS = 9, n = COLS * ROWS;
        const wall = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 0.75), n);
        const m4 = new THREE.Matrix4(), col = new THREE.Color();
        const seeds = [];
        let i = 0;
        for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
            m4.makeScale(0.42, 0.42, 0.05);
            m4.setPosition((x - (COLS - 1) / 2) * 0.62, 0.6 + y * 0.66, -2.4);
            wall.setMatrixAt(i, m4);
            seeds.push({ sp: rand(0.6, 3), ph: rand(0, 6), c: rand() < 0.7 ? 0 : 1 });
            i++;
        }
        group.add(wall);
        const scan = new THREE.Mesh(BOX, glowMat(pick(0), 0.9));
        scan.scale.set(3.4, 0.04, 1.6);
        group.add(scan);
        const twinA = new THREE.Mesh(BOX, glowMat(pick(0), 1));
        const twinB = new THREE.Mesh(BOX, glowMat(pick(1), 1));
        twinA.scale.setScalar(0.32); twinB.scale.setScalar(0.32);
        group.add(twinA, twinB);
        tick((t, dt, speed) => {
            seeds.forEach((s, k) => {
                const on = Math.sin(t * s.sp + s.ph) > 0.35 ? 1 : 0.08;
                col.copy(pick(s.c)).multiplyScalar(on);
                wall.setColorAt(k, col);
            });
            wall.instanceColor.needsUpdate = true;
            scan.position.y = 0.2 + (Math.sin(t * 1.4) * 0.5 + 0.5) * 5.4;
            const a = t * 1.3 * speed;
            twinA.position.set(Math.sin(a) * 2.2, 3 + Math.sin(a * 2) * 0.8, Math.cos(a) * 1.4);
            twinB.position.set(-Math.sin(a) * 2.2, 3 - Math.sin(a * 2) * 0.8, -Math.cos(a) * 1.4);
            twinA.rotation.set(t * 2, t * 3, 0); twinB.rotation.set(-t * 2, t * 3, 0);
        });
    },

    /* 건숭이 — 근두운 블록 위에 떠서, 여의봉이 몸 주위를 휘돎 */
    monkeyKing({ group, tick, pick, dummy, kit, stage }) {
        const { THREE, BOX, solidMat, glowMat, rand } = kit;
        const cloud = new THREE.Group();
        const puffs = [[0, 0, 0, 2.2, 0.55, 1.6], [-1.2, 0.05, 0.2, 1.3, 0.45, 1.2], [1.25, 0.02, -0.1, 1.4, 0.5, 1.3], [0.3, -0.12, 0.9, 1.4, 0.4, 0.9], [-0.4, -0.1, -0.9, 1.5, 0.42, 0.9], [2.0, -0.08, 0.4, 0.8, 0.32, 0.8], [-2.0, -0.1, -0.3, 0.8, 0.3, 0.7]];
        const cloudMat = solidMat(new THREE.Color('#fff4d6'), 0.35);
        for (const [x, y, z, w, h, d] of puffs) {
            const p = new THREE.Mesh(BOX, cloudMat);
            p.scale.set(w, h, d); p.position.set(x, y, z);
            cloud.add(p);
        }
        group.add(cloud);
        const staff = new THREE.Group();
        const rod = new THREE.Mesh(BOX, solidMat(pick(0), 1.2));
        rod.scale.set(5.6, 0.13, 0.13);
        const capL = new THREE.Mesh(BOX, solidMat(pick(1), 1.6)), capR = capL.clone();
        capL.scale.set(0.45, 0.22, 0.22); capR.scale.copy(capL.scale);
        capL.position.x = -2.9; capR.position.x = 2.9;
        staff.add(rod, capL, capR);
        group.add(staff);
        const trail = [];
        for (let i = 0; i < 14; i++) {
            const m = new THREE.Mesh(BOX, glowMat(new THREE.Color('#fff4d6'), 0.5));
            m.userData = { k: rand(0, 1), x: rand(-1.6, 1.6), z: rand(-0.8, 0.8) };
            trail.push(m); group.add(m);
        }
        stage.onClear(() => { dummy.root.position.y = 0; });
        tick((t, dt, speed) => {
            const lift = 1.15 + Math.sin(t * 1.4) * 0.15;
            dummy.root.position.y = lift;
            cloud.position.y = lift - 0.32;
            cloud.rotation.y = Math.sin(t * 0.5) * 0.15;
            staff.position.y = lift + 2.6;
            staff.rotation.set(Math.sin(t * 0.9) * 0.35, t * 2.6 * speed, Math.cos(t * 1.1) * 0.25);
            trail.forEach(m => {
                const d = m.userData;
                d.k += dt * 0.6; if (d.k > 1) d.k = 0;
                m.position.set(d.x + d.k * 0.5, lift - 0.5 - d.k * 1.2, d.z - d.k * 1.5);
                m.scale.setScalar(0.22 * (1 - d.k));
            });
        });
    },

    /* 두 개의 심장 박지성 — 가슴 큐브 심장 2개가 쿵쿵, 뛸 때마다 네모 충격파 */
    twoHearts({ group, tick, pick, kit }) {
        const { THREE, BOX, glowMat, square } = kit;
        const hearts = [0, 1].map(i => {
            const h = new THREE.Mesh(BOX, glowMat(pick(i === 0 ? 1 : 0), 1));
            h.position.set(i === 0 ? -0.42 : 0.42, 3.25, 0.62);
            h.rotation.z = Math.PI / 4;
            group.add(h);
            return h;
        });
        const waves = Array.from({ length: 6 }, (_, i) => {
            const w = square(1, 0.05, glowMat(pick(i % 2 ? 0 : 1), 0.9));
            w.visible = false; w.userData = { k: 1 };
            group.add(w);
            return w;
        });
        let next = 0, wi = 0, beatN = 0;
        const pulse = [0, 0];
        tick((t, dt) => {
            if (t > next) {
                const which = beatN % 2;                 // 쿵(왼) - 쿵(오) 번갈아
                pulse[which] = 1;
                const w = waves[wi++ % waves.length];
                w.userData.k = 0; w.visible = true;
                w.position.set(which === 0 ? -0.4 : 0.4, 3.2, 0);
                next = t + (which === 0 ? 0.22 : 0.68);
                beatN++;
            }
            hearts.forEach((h, i) => {
                pulse[i] *= Math.pow(0.002, dt);
                h.scale.setScalar(0.42 + pulse[i] * 0.3);
            });
            waves.forEach(w => {
                if (!w.visible) return;
                w.userData.k += dt * 0.9;
                const k = w.userData.k;
                if (k >= 1) { w.visible = false; return; }
                w.scale.setScalar(0.6 + k * 7);
                w.children.forEach(c => { c.material.opacity = 0.9 * (1 - k); });
            });
        });
    },

    /* 초월자 김건우 — 공중부양 + 등 뒤 거대한 세로 네모 후광 + 내려오는 빛줄기 */
    transcend({ group, tick, pick, dummy, kit, stage }) {
        const { THREE, BOX, glowMat, square, rand } = kit;
        const halo = new THREE.Group();
        const big = square(5.6, 0.09, glowMat(pick(0), 1));
        const inner = square(3.6, 0.07, glowMat(pick(1), 0.9)); inner.rotation.y = Math.PI / 4;
        halo.add(big, inner);
        for (let i = 0; i < 16; i++) {
            const s = new THREE.Mesh(BOX, glowMat(pick(i % 3), 0.55));
            const a = (i / 16) * Math.PI * 2;
            s.scale.set(0.04, 0.04, 1.3);
            s.position.set(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2);
            s.rotation.y = -a + Math.PI / 2;
            halo.add(s);
        }
        halo.rotation.x = Math.PI / 2;      // 세워서 화면을 향하게
        halo.position.set(0, 4.2, -1.6);
        group.add(halo);
        const rays = Array.from({ length: 7 }, () => {
            const r = new THREE.Mesh(BOX, glowMat(pick(0), 0.6));
            r.userData = { k: rand(0, 1), x: rand(-3.5, 3.5), z: rand(-2.5, 1.5), sp: rand(0.35, 0.6), noFit: true };
            group.add(r); return r;
        });
        stage.onClear(() => { dummy.root.position.y = 0; });
        tick((t, dt) => {
            const lift = 0.85 + Math.sin(t * 1.1) * 0.12;
            dummy.root.position.y = lift;
            halo.rotation.z = t * 0.15;
            inner.rotation.y = Math.PI / 4 - t * 0.4;
            halo.position.y = 4.2 + lift;
            rays.forEach(r => {
                const d = r.userData;
                d.k += dt * d.sp;
                if (d.k > 1) { d.k = 0; d.x = rand(-3.5, 3.5); d.z = rand(-2.5, 1.5); }
                const len = 4;
                r.scale.set(0.05, len, 0.05);
                r.position.set(d.x, 14 - d.k * 16 + len / 2, d.z);
                r.material.opacity = 0.6 * Math.sin(d.k * Math.PI);
            });
        });
    },

    /* 빛의 기사 김가은 : 성검의 소유자 — 등 뒤 땅에 꽂힌 거대한 성검 + 머리 위를 도는 작은 검들 */
    holySword({ group, tick, pick, kit }) {
        const { THREE, BOX, glowMat, sword, rand } = kit;
        const big = sword(5.6, pick(0), pick(2), 1.3);
        big.position.set(2.25, -0.7, -0.6);   // 기사 옆, 칼끝이 바닥에 꽂힘
        big.rotation.z = -0.07;
        group.add(big);
        const ring = new THREE.Group();
        const smalls = [];
        for (let i = 0; i < 6; i++) {
            const s = sword(1.5, pick(1), pick(0), 0.35);
            const a = (i / 6) * Math.PI * 2;
            s.position.set(Math.cos(a) * 1.7, 0, Math.sin(a) * 1.7);
            s.userData.ph = a;
            ring.add(s); smalls.push(s);
        }
        ring.position.y = 6.1;
        group.add(ring);
        const motes = Array.from({ length: 16 }, () => {
            const m = new THREE.Mesh(BOX, glowMat(pick(0), 0.9));
            m.userData = { k: rand(0, 1), x: rand(-0.3, 0.3) };
            group.add(m); return m;
        });
        tick((t, dt) => {
            ring.rotation.y = t * 0.5;
            smalls.forEach(s => { s.position.y = Math.sin(t * 2 + s.userData.ph) * 0.15; });
            motes.forEach(m => {
                const d = m.userData;
                d.k += dt * 0.25; if (d.k > 1) d.k = 0;
                m.position.set(2.25 + d.x, -0.5 + d.k * 5.6, -0.6);
                m.scale.setScalar(0.12 * Math.sin(d.k * Math.PI));
            });
        });
    },

    /* 곤지암병은 — 조명이 깜빡이고, 초록 유령 더미가 나타났다 사라짐, 캐릭터 글리치 */
    haunted({ group, tick, pick, dummy, kit, stage }) {
        const { THREE, BOX, rand, ghost } = kit;
        stage.setSky('#020a06');
        const ghosts = [0, 1, 2].map(i => {
            const g = ghost(pick(0), 0);
            g.userData = { k: rand(0, 1) + i * 0.4, x: 0, z: 0, noFit: true };
            group.add(g); return g;
        });
        const mist = [];
        for (let i = 0; i < 12; i++) {
            const m = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: pick(1), transparent: true, opacity: 0.22, depthWrite: false }));
            m.scale.set(rand(1.5, 3), 0.15, rand(1, 2));
            m.userData = { x: rand(-4, 4), z: rand(-3, 2), v: rand(0.2, 0.5), noFit: true };
            mist.push(m); group.add(m);
        }
        const light = new THREE.PointLight(pick(0), 6, 10, 1.6);
        light.userData.own = true;
        light.position.set(0, 6, 1.5);
        group.add(light);
        let glitch = 0, nextGlitch = 2;
        stage.onClear(() => { dummy.root.position.x = 0; });
        tick((t, dt) => {
            light.intensity = Math.random() < 0.08 ? 0.2 : 6 + Math.sin(t * 20) * 1.5;
            ghosts.forEach(g => {
                const d = g.userData;
                d.k += dt * 0.45;
                if (d.k > 1.6) {
                    d.k = 0;
                    const a = rand(0, Math.PI * 2), r = rand(2.6, 4.2);
                    d.x = Math.cos(a) * r; d.z = Math.sin(a) * r - 1;
                }
                const vis = d.k < 1 ? Math.sin(d.k * Math.PI) : 0;
                g.position.set(d.x, 0, d.z);
                g.rotation.y = Math.atan2(-d.x, -d.z);   // 캐릭터 쪽을 봄
                g.traverse(o => { if (o.material) o.material.opacity = vis * 0.35 * (Math.random() < 0.1 ? 0.2 : 1); });
            });
            mist.forEach(m => {
                const d = m.userData;
                d.x += d.v * dt; if (d.x > 5) d.x = -5;
                m.position.set(d.x, 0.15, d.z);
            });
            if (t > nextGlitch) { glitch = 0.12; nextGlitch = t + rand(1.5, 4); }
            glitch -= dt;
            dummy.root.position.x = glitch > 0 ? rand(-0.25, 0.25) : 0;
        });
    },

    /* 강철검 공병은 : 강철검제 — 금속 검 11자루가 등 뒤에 부채꼴로 */
    steelEmperor({ group, tick, pick, kit }) {
        const { THREE, sword } = kit;
        const fan = new THREE.Group();
        const blades = [];
        const N = 11;
        for (let i = 0; i < N; i++) {
            const a = -Math.PI * 0.42 + (i / (N - 1)) * Math.PI * 0.84;   // 위쪽 반원
            const holder = new THREE.Group();
            holder.rotation.z = -a;
            const s = sword(3.0, null, pick(1), 0.3, true);   // 금속 날
            s.rotation.z = Math.PI;                             // 칼끝이 바깥쪽
            holder.add(s);
            fan.add(holder);
            blades.push({ s, a, i });
        }
        fan.position.set(0, 3.3, -1.3);
        group.add(fan);
        const rim = new THREE.PointLight(pick(1), 8, 9, 1.5);
        rim.userData.own = true;
        rim.position.set(0, 4, -2.5);
        group.add(rim);
        tick((t, dt, speed) => {
            blades.forEach(b => {
                const breathe = Math.sin(t * 1.6 - b.i * 0.35) * 0.25;
                b.s.position.y = 4.3 + breathe;              // 바깥쪽으로 나갔다 들어옴
                b.s.rotation.y = Math.sin(t * 0.8 + b.i) * 0.4;
            });
            fan.rotation.z = Math.sin(t * 0.4) * 0.05 * speed;
        });
    },

    /* 공허왕 공허병은 — 머리 위 검은 큐브 코어 + 기울어진 링, 바닥 타일이 빨려 올라감 */
    voidKing({ group, tick, pick, kit, stage, dummy }) {
        const { THREE, BOX, glowMat, square, rand, bolt } = kit;
        stage.setSky('#0a0006');
        // 몸이 흑요석처럼 검게, 눈은 붉게 빛남
        stage.setSkin({ color: '#16121c', eye: '#ff1a40', glowEyes: true, smile: false, emissive: 0.08 });

        // 등 뒤 공허의 문: 검은 판 + 반대로 도는 붉은/푸른 네모 테두리
        const gate = new THREE.Group();
        const gatePlane = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        gatePlane.scale.set(5.4, 5.4, 0.05);
        const gOuter = square(5.8, 0.09, glowMat(pick(0), 1));
        const gInner = square(4.2, 0.07, glowMat(pick(1), 1));
        gOuter.rotation.x = gInner.rotation.x = Math.PI / 2;
        gate.add(gatePlane, gOuter, gInner);
        gate.position.set(0, 3.6, -2.4);
        group.add(gate);
        const gateBolts = [0, 1, 2].map(() => { const b = bolt(5, glowMat(pick(0), 1)); b.userData.noFit = true; group.add(b); return b; });
        let gateNext = 0;

        // 검은 파편 날개
        const wings = [-1, 1].map(side => {
            const w = new THREE.Group();
            for (let k = 0; k < 7; k++) {
                const f = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x050008, emissive: pick(k % 2 ? 1 : 0), emissiveIntensity: 0.6, roughness: 0.4 }));
                const len = 2.9 - k * 0.3;
                f.scale.set(len, 0.26, 0.1);
                f.position.set(side * (len / 2 + 0.15), 0.9 - k * 0.38, -k * 0.04);
                f.rotation.z = side * (0.55 - k * 0.15);
                w.add(f);
            }
            w.position.set(side * 0.7, 3.8, -0.75);
            group.add(w);
            return w;
        });
        // 머리 위 검은 큐브 왕관
        const crown = new THREE.Group();
        for (let k = 0; k < 6; k++) {
            const c = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x000000 }));
            const e = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), new THREE.LineBasicMaterial({ color: pick(0), toneMapped: false }));
            const a = (k / 6) * Math.PI * 2;
            c.position.set(Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85); e.position.copy(c.position);
            c.scale.setScalar(0.28); e.scale.setScalar(0.29);
            crown.add(c, e);
        }
        group.add(crown);
        tick((t, dt) => {
            gOuter.rotation.y = t * 0.6; gInner.rotation.y = -t * 1.1;
            gatePlane.rotation.z = t * 0.2;
            const flap = Math.sin(t * 1.8) * 0.25;
            wings[0].rotation.y = 0.4 + flap; wings[1].rotation.y = -0.4 - flap;
            wings.forEach(w => { w.position.y = 3.8 + dummy.root.position.y; });
            crown.position.y = 6.0 + dummy.root.position.y + Math.sin(t * 2) * 0.08;
            crown.rotation.y = t * 1.4;
            gate.position.y = 3.6 + dummy.root.position.y * 0.5;
            if (t > gateNext) {
                gateNext = t + rand(0.06, 0.25);
                gateBolts.forEach(b => {
                    b.visible = Math.random() < 0.6;
                    const a = rand(0, Math.PI * 2), a2 = a + rand(1, 2.5);
                    b.reshape([Math.cos(a) * 2.6, gate.position.y + Math.sin(a) * 2.6, -2.3], [Math.cos(a2) * 1.2, gate.position.y + Math.sin(a2) * 1.2, -2.3], 0.5);
                });
            }
        });
        const core = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        core.scale.setScalar(1.5);
        const coreEdge = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), new THREE.LineBasicMaterial({ color: pick(0), toneMapped: false }));
        coreEdge.scale.setScalar(1.52);
        const coreG = new THREE.Group();
        coreG.add(core, coreEdge);
        coreG.position.set(0, 7.6, -0.6);
        group.add(coreG);
        const rings = [0, 1, 2].map(i => {
            const r = square(2.6 + i * 0.9, 0.05, glowMat(pick(i), 0.9));
            r.position.copy(coreG.position);
            group.add(r); return r;
        });
        const tiles = Array.from({ length: 16 }, () => {
            const m = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x14142a, roughness: 0.35, metalness: 0.5, emissive: pick(0), emissiveIntensity: 0.4 }));
            m.userData = { k: rand(0, 1), x: 0, z: 0, sp: rand(0.15, 0.3), noFit: true };
            group.add(m); return m;
        });
        const reset = d => { d.x = Math.round(rand(-3, 3)) * 1.02; d.z = Math.round(rand(-3, 3)) * 1.02; d.k = 0; };
        tiles.forEach(m => reset(m.userData));
        const glow = new THREE.PointLight(pick(0), 10, 12, 1.4);
        glow.userData.own = true;
        glow.position.set(0, 7, 0);
        group.add(glow);
        tick((t, dt, speed) => {
            coreG.rotation.set(t * 0.7, t * 0.9, t * 0.3);
            rings.forEach((r, i) => {
                r.rotation.set(0.9 + i * 0.5 + Math.sin(t * 0.3) * 0.1, t * (0.8 + i * 0.3) * (i % 2 ? -1 : 1) * speed, 0.4 * i);
            });
            tiles.forEach(m => {
                const d = m.userData;
                d.k += dt * d.sp;
                if (d.k > 1) reset(d);
                const k = d.k * d.k;
                const a = k * 5;
                m.position.set(
                    THREE.MathUtils.lerp(d.x, 0, k) * Math.cos(a) - THREE.MathUtils.lerp(d.z, 0, k) * Math.sin(a) * 0.3,
                    THREE.MathUtils.lerp(-0.05, 7.6, k),
                    THREE.MathUtils.lerp(d.z, -0.6, k));
                m.rotation.set(k * 6, k * 4, 0);
                const s = 0.96 * (1 - k * 0.9);
                m.scale.set(s, 0.18 * (1 - k * 0.5), s);
            });
        });
    },

    /* 번개의 좌 박지성 — 등 뒤 거대한 돌 왕좌 + 바닥으로 내리꽂히는 번개 + 몸에 튀는 전기 */
    thunderThrone({ group, tick, pick, dummy, kit, stage }) {
        const { THREE, BOX, glowMat, square, rand, bolt } = kit;
        stage.setSky('#02060c');
        // 몸에 전기가 흘러 하얗게, 눈은 청록으로 빛남
        stage.setSkin({ color: '#b9dbe8', eye: '#00ffff', glowEyes: true, smile: false, emissive: 0.03 });

        // 머리 위 먹구름 (어두운 블록 덩어리) + 안에서 번쩍
        const cloud = new THREE.Group();
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0x1a1f33, roughness: 0.9, emissive: pick(0), emissiveIntensity: 0 });
        for (let k = 0; k < 16; k++) {
            const c = new THREE.Mesh(BOX, cloudMat);
            c.scale.set(rand(1.4, 2.8), rand(0.5, 1), rand(1.2, 2.4));
            c.position.set(rand(-3.8, 3.8), rand(-0.3, 0.4), rand(-2.8, 0.6));
            c.userData.noFit = true;
            cloud.add(c);
        }
        cloud.position.y = 11.5;
        group.add(cloud);
        let cloudFlash = 0;

        // 허리를 도는 전기 링 + 링 위를 달리는 불꽃
        const waist = square(3.6, 0.05, glowMat(pick(0), 1));
        const sparks = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 1), 10);
        group.add(waist, sparks);
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), pv = new THREE.Vector3(), sv = new THREE.Vector3();

        // 바닥에 그을린 자국 (번개 맞은 타일)
        const scorch = Array.from({ length: 4 }, () => {
            const sc = new THREE.Mesh(BOX, glowMat(pick(0), 0));
            sc.scale.set(0.96, 0.03, 0.96);
            sc.userData.noFit = true;
            group.add(sc); return sc;
        });
        let scorchI = 0;
        const throne = new THREE.Group();
        const stone = new THREE.MeshStandardMaterial({ color: 0x1b1d2e, roughness: 0.8, metalness: 0.2 });
        const edgeMat = new THREE.LineBasicMaterial({ color: pick(0), toneMapped: false });
        const blocks = [[0, 4.6, -1.9, 3.6, 7.4, 0.5], [-2.5, 1.6, -1.1, 0.6, 1.6, 1.8], [2.5, 1.6, -1.1, 0.6, 1.6, 1.8], [0, 0.6, -1.4, 4.4, 1.2, 1.1], [0, 8.6, -1.9, 1.6, 0.9, 0.5], [-1.3, 8.1, -1.9, 0.6, 0.6, 0.5], [1.3, 8.1, -1.9, 0.6, 0.6, 0.5]];
        for (const [x, y, z, w, h, d] of blocks) {
            const b = new THREE.Mesh(BOX, stone);
            b.scale.set(w, h, d); b.position.set(x, y, z);
            const e = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), edgeMat);
            e.scale.copy(b.scale); e.position.copy(b.position);
            throne.add(b, e);
        }
        group.add(throne);
        const strikes = [0, 1].map(() => {
            const b = bolt(9, glowMat(pick(2), 1));
            const ring = square(1, 0.06, glowMat(pick(0), 1));
            const flash = new THREE.PointLight(pick(0), 0, 10, 1.4);
            b.userData.noFit = true; ring.userData.noFit = true; flash.userData.own = true;
            group.add(b, ring, flash);
            return { b, ring, flash, life: 0, next: rand(0.3, 1.2) };
        });
        const arcs = [0, 1, 2].map(() => { const a = bolt(3, glowMat(pick(0), 1)); group.add(a); return a; });
        const bodyPts = [[0, 4.8, 0.5], [-1.5, 2.3, 0.4], [1.5, 2.3, 0.4], [-0.5, 0.4, 0.5], [0.5, 0.4, 0.5], [0, 3, 0.55]];
        let arcNext = 0;
        tick((t, dt) => {
            edgeMat.color.copy(pick(0)).multiplyScalar(0.6 + 0.4 * Math.abs(Math.sin(t * 13)));
            strikes.forEach(s => {
                s.next -= dt;
                if (s.next <= 0) {
                    const a = rand(0, Math.PI * 2), r = rand(2.2, 3.8);
                    const x = Math.cos(a) * r, z = Math.sin(a) * r * 0.7 + 0.5;
                    s.b.reshape([x + rand(-1, 1), 16, z], [x, 0, z], 0.9);
                    s.ring.position.set(x, 0.08, z);
                    s.flash.position.set(x, 1.5, z);
                    s.life = 1; s.next = rand(0.35, 1.0);
                    cloudFlash = 1;
                    const sc = scorch[scorchI++ % scorch.length];
                    sc.position.set(Math.round(x / 1.02) * 1.02, 0.02, Math.round(z / 1.02) * 1.02);
                    sc.material.opacity = 1;
                }
                s.life = Math.max(0, s.life - dt * 3.2);
                s.b.visible = s.life > 0.45 && Math.random() > 0.15;
                s.ring.visible = s.life > 0;
                s.ring.scale.setScalar(0.4 + (1 - s.life) * 3.5);
                s.ring.children.forEach(c => { c.material.opacity = s.life; });
                s.flash.intensity = s.life * 16;
            });
            cloudFlash *= Math.pow(0.01, dt);
            cloudMat.emissiveIntensity = cloudFlash * 2.5 + (Math.random() < 0.03 ? 1.2 : 0);
            cloud.rotation.y = t * 0.05;
            scorch.forEach(sc => { sc.material.opacity *= Math.pow(0.3, dt); });
            const lift = dummy.root.position.y;
            waist.position.y = 2.2 + lift;
            waist.rotation.y = -t * 2.4;
            for (let k = 0; k < 10; k++) {
                const side = k % 4, f = ((t * 1.7 + k / 10) % 1) - 0.5;
                const p = [[f * 3.6, 1.8], [1.8, f * 3.6], [-f * 3.6, -1.8], [-1.8, -f * 3.6]][side];
                pv.set(p[0], 0, p[1]).applyAxisAngle(new THREE.Vector3(0, 1, 0), waist.rotation.y);
                pv.y = 2.2 + lift;
                q.setFromEuler(new THREE.Euler(t * 9, t * 7, 0));
                sv.setScalar(0.12 + Math.random() * 0.08);
                sparks.setMatrixAt(k, m4.compose(pv, q, sv));
            }
            sparks.instanceMatrix.needsUpdate = true;
            if (t > arcNext) {
                arcNext = t + rand(0.05, 0.18);
                const lift = dummy.root.position.y;
                arcs.forEach(a => {
                    a.visible = Math.random() < 0.7;
                    const p = bodyPts[Math.floor(rand(0, bodyPts.length))], q = bodyPts[Math.floor(rand(0, bodyPts.length))];
                    a.reshape([p[0], p[1] + lift, p[2]], [q[0] + rand(-0.4, 0.4), q[1] + lift, q[2]], 0.35);
                });
            }
        });
    }
};
