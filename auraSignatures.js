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

    /* 곤지암병은 — 깜빡이는 형광등, 바닥에서 솟는 유령 손, 붉은 눈 유령, 정전과 순간이동 */
    haunted({ group, tick, pick, dummy, kit, stage }) {
        const { THREE, BOX, glowMat, rand, ghost, TMP } = kit;
        stage.setSky('#010604');

        // 천장 형광등 3개 (하나는 흔들림)
        const tubes = [-2.4, 0.2, 2.6].map((x, i) => {
            const g = new THREE.Group();
            const housing = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x1a1f1c, roughness: 0.8 }));
            housing.scale.set(2.2, 0.16, 0.42);
            const tube = new THREE.Mesh(BOX, glowMat(new THREE.Color('#dfffe9'), 1));
            tube.scale.set(2.0, 0.08, 0.14); tube.position.y = -0.12;
            const wire = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x222222 }));
            wire.scale.set(0.03, 1.4, 0.03); wire.position.y = 0.75;
            g.add(housing, tube, wire);
            g.position.set(x, 8.6 - i * 0.2, -0.5 - i * 0.6);
            g.userData = { tube, ph: rand(0, 6), noFit: true };
            group.add(g);
            return g;
        });
        const lamp = new THREE.PointLight(new THREE.Color('#bfffd8'), 9, 14, 1.4);
        lamp.userData.own = true;
        lamp.position.set(0, 7.5, 0.5);
        group.add(lamp);

        // 바닥에서 솟는 유령 손
        const handMat = new THREE.MeshStandardMaterial({ color: 0x9fe8bf, emissive: pick(0), emissiveIntensity: 0.35, transparent: true, opacity: 0.85, roughness: 0.6 });
        const hands = Array.from({ length: 6 }, (_, i) => {
            const h = new THREE.Group();
            const arm = new THREE.Mesh(BOX, handMat); arm.scale.set(0.34, 1.7, 0.34); arm.position.y = 0.85;
            const palm = new THREE.Mesh(BOX, handMat); palm.scale.set(0.42, 0.32, 0.2); palm.position.y = 1.85;
            h.add(arm, palm);
            const fingers = [];
            for (let f = 0; f < 4; f++) {
                const fp = new THREE.Group(); fp.position.set(-0.15 + f * 0.1, 2.0, 0);
                const fm = new THREE.Mesh(BOX, handMat); fm.scale.set(0.07, 0.42, 0.07); fm.position.y = 0.21;
                fp.add(fm); h.add(fp); fingers.push(fp);
            }
            const a = (i / 6) * Math.PI * 2 + 0.3, r = 1.5 + (i % 2) * 0.9;
            h.position.set(Math.cos(a) * r, -2.4, Math.sin(a) * r);
            h.rotation.y = -a + Math.PI / 2;
            h.rotation.z = Math.cos(a) * 0.25; h.rotation.x = -Math.sin(a) * 0.25;
            h.userData = { fingers, ph: i * 0.83 };
            group.add(h);
            return h;
        });

        // 붉은 눈 유령
        const ghosts = [0, 1, 2].map(i => {
            const g = ghost(pick(0), 0);
            for (const x of [-0.28, 0.28]) {
                const eye = new THREE.Mesh(BOX, glowMat(new THREE.Color('#ff1a2a'), 1));
                eye.scale.set(0.2, 0.09, 0.05); eye.position.set(x, 4.72, 0.62);
                g.add(eye);
            }
            g.userData = { k: rand(0, 1) + i * 0.5, x: 0, z: 0, noFit: true };
            group.add(g);
            return g;
        });
        const mist = [];
        for (let i = 0; i < 12; i++) {
            const m = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: pick(1), transparent: true, opacity: 0.22, depthWrite: false }));
            m.scale.set(rand(1.5, 3), 0.15, rand(1, 2));
            m.userData = { x: rand(-4, 4), z: rand(-3, 2), v: rand(0.2, 0.5), noFit: true };
            mist.push(m); group.add(m);
        }

        let blackout = 0, nextBlack = 4, glitch = 0, nextGlitch = 2, gx = 0;
        tick((t, dt) => {
            // 형광등 깜빡임
            tubes.forEach((g, i) => {
                const on = blackout > 0 ? 0 : (Math.sin(t * 13 + g.userData.ph) > -0.85 && Math.random() > 0.04 ? 1 : 0.05);
                g.userData.tube.material.opacity = on;
                if (i === 1) g.rotation.z = Math.sin(t * 1.3) * 0.18;
            });
            lamp.intensity = blackout > 0 ? 0 : (Math.random() < 0.06 ? 0.5 : 9);

            // 유령 손: 솟아서 움켜쥐고 가라앉음
            hands.forEach(h => {
                const k = ((t * 0.32 + h.userData.ph) % 2) / 2;   // 0~1
                const rise = k < 0.35 ? Math.sin((k / 0.35) * Math.PI / 2) : k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
                h.position.y = -2.4 + rise * 2.2;
                const grab = k > 0.35 && k < 0.7 ? 1 : 0;
                h.userData.fingers.forEach((f, n) => { f.rotation.x = grab * (1.1 + Math.sin(t * 20 + n) * 0.1); });
            });

            // 유령: 나타났다 사라짐, 캐릭터를 바라봄
            ghosts.forEach((g, i) => {
                const d = g.userData;
                d.k += dt * 0.42;
                if (d.k > 1.7) {
                    d.k = 0;
                    if (i === 0 && Math.random() < 0.4) { d.x = 0.9; d.z = -1.3; }   // 어깨 뒤에 바짝
                    else { const a = rand(0, Math.PI * 2), r = rand(2.8, 4.2); d.x = Math.cos(a) * r; d.z = Math.sin(a) * r - 1; }
                }
                const vis = d.k < 1 ? Math.sin(d.k * Math.PI) : 0;
                g.position.set(d.x, 0, d.z);
                g.rotation.y = Math.atan2(-d.x, -d.z);
                g.children.forEach((o, n) => { o.material.opacity = n < 6 ? vis * 0.33 : vis; });
            });
            mist.forEach(m => { const d = m.userData; d.x += d.v * dt; if (d.x > 5) d.x = -5; m.position.set(d.x, 0.15, d.z); });

            // 정전: 잠깐 완전히 어두워지고, 다시 켜지면 유령이 더 가까이
            if (t > nextBlack) { blackout = 0.22; nextBlack = t + rand(4, 7); stage.setSky('#000000'); }
            if (blackout > 0) { blackout -= dt; if (blackout <= 0) stage.setSky('#010604'); }
            // 순간이동 글리치
            if (t > nextGlitch) { glitch = 0.1; gx = rand(-0.7, 0.7); nextGlitch = t + rand(1.8, 3.8); }
            glitch -= dt;
            if (glitch > 0) dummy.root.position.x += gx;
        });
    },

    /* 강철검 공병은 : 강철검제 — 검 부채, 3.2초마다 일제사격, 허리 검 고리, 칼날 왕관 */
    steelEmperor({ group, tick, pick, dummy, kit, stage }) {
        const { THREE, BOX, glowMat, sword, square, rand, TMP } = kit;
        stage.setSky('#03060c');
        const up = new THREE.Vector3(0, 1, 0);
        const CENTER = new THREE.Vector3(0, 3.4, -1.4);
        const N = 13;
        const blades = [];
        for (let i = 0; i < N; i++) {
            const a = -Math.PI * 0.45 + (i / (N - 1)) * Math.PI * 0.9;   // 위쪽 반원
            const out = new THREE.Vector3(Math.sin(a), Math.cos(a), 0);
            const s = sword(3.2, null, pick(1), 0.36, true);
            group.add(s);
            blades.push({ s, out, home: CENTER.clone().addScaledVector(out, 4.4), target: new THREE.Vector3(), state: 0, k: 0, delay: 0 });
        }
        // 착지 충격 링
        const rings = blades.map(() => { const r = square(1, 0.05, glowMat(pick(0), 0)); r.userData.noFit = true; r.userData.k = 1; group.add(r); return r; });

        // 허리를 도는 검 고리
        const waist = new THREE.Group();
        for (let i = 0; i < 8; i++) {
            const holder = new THREE.Group();
            const s = sword(1.3, null, pick(1), 0.22, true);
            s.rotation.z = Math.PI / 2;   // 눕혀서 둘레 방향으로
            s.position.set(0, 0, 2.2);
            holder.add(s);
            holder.rotation.y = (i / 8) * Math.PI * 2;
            waist.add(holder);
        }
        group.add(waist);

        // 칼날 왕관 (칼끝이 위로)
        const crown = new THREE.Group();
        for (let i = 0; i < 8; i++) {
            const s = sword(0.7, null, pick(0), 0.16, true);
            s.rotation.x = Math.PI;   // 칼끝이 위
            const a = (i / 8) * Math.PI * 2;
            s.position.set(Math.cos(a) * 0.62, 1.15, Math.sin(a) * 0.62);
            crown.add(s);
        }
        group.add(crown);

        // 칼날 반사광
        const glints = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 1), 8);
        group.add(glints);

        const rim = new THREE.PointLight(pick(1), 10, 10, 1.5);
        rim.userData.own = true;
        rim.position.set(0, 4, -2.6);
        group.add(rim);

        let lastVolley = -1;
        const v = new THREE.Vector3();
        tick((t, dt, speed) => {
            const lift = dummy.root.position.y;
            // 3.2초마다 일제사격 (포즈의 휘두르는 순간과 맞춤)
            const vol = Math.floor((t + 0.1 - 0.15) / 3.2);
            if (vol !== lastVolley) {
                lastVolley = vol;
                blades.forEach((b, i) => {
                    b.state = 1; b.k = 0; b.delay = i * 0.035;
                    b.target.set(-4 + (i / (N - 1)) * 8 + rand(-0.3, 0.3), 0.05, rand(2.5, 4.5));
                });
            }
            blades.forEach((b, i) => {
                const home = TMP.v.copy(b.home); home.y += lift * 0.5;
                if (b.state === 0) {
                    const breathe = Math.sin(t * 1.6 - i * 0.35) * 0.25;
                    b.s.position.copy(home).addScaledVector(b.out, breathe);
                    b.s.quaternion.setFromUnitVectors(up, v.copy(b.out).negate());   // 칼끝이 바깥
                    b.s.rotateY(Math.sin(t * 0.8 + i) * 0.4);
                    return;
                }
                if (b.delay > 0) { b.delay -= dt; return; }
                b.k += dt;
                if (b.state === 1) {               // 날아감
                    const k = Math.min(1, b.k / 0.3);
                    b.s.position.lerpVectors(home, b.target, k * k);
                    b.s.quaternion.setFromUnitVectors(up, v.subVectors(home, b.target).normalize());
                    if (k >= 1) {
                        b.state = 2; b.k = 0;
                        const r = rings[i]; r.userData.k = 0; r.position.copy(b.target);
                    }
                } else if (b.state === 2) {        // 꽂혀 있음
                    if (b.k > 0.45) { b.state = 3; b.k = 0; }
                } else {                           // 돌아옴
                    const k = Math.min(1, b.k / 0.5);
                    const e = 1 - Math.pow(1 - k, 3);
                    b.s.position.lerpVectors(b.target, home, e);
                    b.s.quaternion.setFromUnitVectors(up, v.copy(b.out).negate());
                    if (k >= 1) b.state = 0;
                }
            });
            rings.forEach(r => {
                if (r.userData.k >= 1) { r.visible = false; return; }
                r.visible = true;
                r.userData.k = Math.min(1, r.userData.k + dt * 2);
                r.scale.setScalar(0.3 + r.userData.k * 2.4);
                r.children.forEach(c => { c.material.opacity = 1 - r.userData.k; });
            });
            waist.position.y = 2.4 + lift;
            waist.rotation.y = t * 2.2 * speed;
            crown.position.y = 4.62 + lift;
            crown.rotation.y = t * 0.9;
            for (let g = 0; g < 8; g++) {
                const b = blades[(g * 5 + Math.floor(t * 3)) % N];
                const on = Math.sin(t * 7 + g * 2) > 0.6;
                TMP.p.copy(b.s.position).addScaledVector(b.out, -1.4 - (g % 3) * 0.4);
                TMP.sc.setScalar(on ? 0.13 : 0.0001);
                TMP.q.setFromEuler(TMP.e.set(t * 4, t * 3, 0.78));
                glints.setMatrixAt(g, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            }
            glints.instanceMatrix.needsUpdate = true;
        });
    },

    /* 공허왕 공허병은 — 등 뒤 거신 그림자, 망토, 공허의 문, 무너지는 바닥, 공허를 부르는 맥동 */
    voidKing({ group, tick, pick, kit, stage, dummy }) {
        const { THREE, BOX, glowMat, square, rand, bolt, TMP } = kit;
        stage.setSky('#0a0006');
        stage.setSkin({ color: '#16121c', eye: '#ff1a40', glowEyes: true, smile: false, emissive: 0.08 });

        // 등 뒤 거신 그림자 (캐릭터와 같은 모양, 2.6배)
        const colossus = new THREE.Group();
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x050008, transparent: true, opacity: 0.92 });
        const cparts = {};
        for (const [k, w, h, d, x, y, py] of [['legL', 0.98, 2, 1, -0.5, 1, 1], ['legR', 0.98, 2, 1, 0.5, 1, 1], ['torso', 2, 2, 1, 0, 3, 0], ['armL', 1, 2, 1, -1.5, 3, 0.9], ['armR', 1, 2, 1, 1.5, 3, 0.9], ['head', 1.25, 1.2, 1.2, 0, 4.62, 0]]) {
            const pv = new THREE.Group(); pv.position.set(x, y + py, 0);
            const m = new THREE.Mesh(BOX, shadowMat); m.scale.set(w, h, d); m.position.y = -py;
            const e = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), new THREE.LineBasicMaterial({ color: pick(0), transparent: true, opacity: 0.35, toneMapped: false }));
            e.scale.copy(m.scale); e.position.copy(m.position);
            pv.add(m, e); colossus.add(pv); cparts[k] = pv;
        }
        const eyes = [-0.3, 0.3].map(x => {
            const e = new THREE.Mesh(BOX, glowMat(pick(0), 1));
            e.scale.set(0.3, 0.12, 0.05); e.position.set(x, 0.08, 0.62);
            cparts.head.add(e); return e;
        });
        colossus.scale.setScalar(2.6);
        colossus.position.set(0, -2.2, -7.5);
        colossus.userData.noFit = true;
        group.add(colossus);

        // 공허의 문 (검은 태양)
        const gate = new THREE.Group();
        const gatePlane = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        gatePlane.scale.set(4.6, 4.6, 0.05);
        const gOuter = square(5.0, 0.09, glowMat(pick(0), 1));
        const gInner = square(3.6, 0.07, glowMat(pick(1), 1));
        gOuter.rotation.x = gInner.rotation.x = Math.PI / 2;
        gate.add(gatePlane, gOuter, gInner);
        gate.position.set(0, 4.2, -2.6);
        group.add(gate);
        const gateBolts = [0, 1, 2].map(() => { const b = bolt(5, glowMat(pick(0), 1)); b.userData.noFit = true; group.add(b); return b; });

        // 망토 (어깨에서 늘어진 블록 5줄, 펄럭임) — 캐릭터 몸에 붙음
        const cape = new THREE.Group();
        cape.position.set(0, 3.95, -0.58);
        const capeMat = new THREE.MeshStandardMaterial({ color: 0x0a0008, emissive: pick(0), emissiveIntensity: 0.15, roughness: 0.5 });
        const strips = [];
        for (let i = 0; i < 5; i++) {
            const pv = new THREE.Group(); pv.position.x = -0.9 + i * 0.45;
            const m = new THREE.Mesh(BOX, capeMat); m.scale.set(0.46, 3.7, 0.06); m.position.y = -1.85;
            const edge = new THREE.Mesh(BOX, glowMat(pick(0), 0.8)); edge.scale.set(0.46, 0.06, 0.07); edge.position.y = -3.7;
            pv.add(m, edge); cape.add(pv); strips.push(pv);
        }
        dummy.root.add(cape);
        stage.onClear(() => { dummy.root.remove(cape); capeMat.dispose(); });

        // 검은 파편 날개
        const wings = [-1, 1].map(side => {
            const w = new THREE.Group();
            for (let k = 0; k < 7; k++) {
                const f = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x050008, emissive: pick(k % 2 ? 1 : 0), emissiveIntensity: 0.6, roughness: 0.4 }));
                const len = 3.0 - k * 0.3;
                f.scale.set(len, 0.26, 0.1);
                f.position.set(side * (len / 2 + 0.15), 0.9 - k * 0.38, -k * 0.04);
                f.rotation.z = side * (0.55 - k * 0.15);
                w.add(f);
            }
            group.add(w);
            return w;
        });
        // 큐브 왕관
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

        // 무너져 공허로 떨어지는 바닥 타일
        const tileMat = new THREE.MeshStandardMaterial({ color: 0x14142a, roughness: 0.35, metalness: 0.5, emissive: pick(0), emissiveIntensity: 0.5 });
        const tiles = Array.from({ length: 10 }, () => {
            const m = new THREE.Mesh(BOX, tileMat);
            m.userData = { k: rand(0, 1), x: 0, z: 0, sp: rand(0.25, 0.45), noFit: true };
            group.add(m); return m;
        });
        const resetTile = d => { d.x = Math.round(rand(-3, 3)) * 1.02; d.z = Math.round(rand(-3, 3)) * 1.02; d.k = 0; };
        tiles.forEach(m => resetTile(m.userData));
        const pit = square(7.4, 0.08, glowMat(pick(0), 0.8));
        pit.position.y = -0.3; pit.userData.noFit = true;
        group.add(pit);

        // 크게 궤도를 도는 잔해
        const DEB = 26;
        const debris = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: 0x000000 }), DEB);
        const debrisGlow = new THREE.InstancedMesh(BOX, glowMat(pick(0), 0.9), DEB);
        debris.userData.noFit = debrisGlow.userData.noFit = true;
        const debData = Array.from({ length: DEB }, () => ({ r: rand(4.5, 7), y: rand(0.5, 8), a: rand(0, 6.28), s: rand(0.15, 0.45), sp: rand(0.1, 0.25) }));
        group.add(debris, debrisGlow);

        const glow = new THREE.PointLight(pick(0), 10, 12, 1.4);
        glow.userData.own = true;
        glow.position.set(0, 7, 0);
        group.add(glow);

        let gateNext = 0;
        tick((t, dt) => {
            const lift = dummy.root.position.y;
            const call = (t % 5) / 2.2 < 1 ? Math.sin(((t % 5) / 2.2) * Math.PI) : 0;   // 포즈와 같은 5초 맥동

            // 거신: 팔을 같이 펼치고, 공허를 부를 때 눈이 타오름
            const open = 0.7 + call * 1.0;
            cparts.armL.rotation.set(-0.2 - call * 0.3, 0, -open);
            cparts.armR.rotation.set(-0.2 - call * 0.3, 0, open);
            cparts.head.rotation.x = 0.35 - call * 0.15;
            colossus.position.y = -2.2 + Math.sin(t * 0.6) * 0.15;
            eyes.forEach(e => { e.scale.set(0.3 + call * 0.25, 0.12 + call * 0.08, 0.05); });
            stage.setSky(call > 0.85 ? '#2a0008' : '#0a0006');
            glow.intensity = 10 + call * 25;

            gOuter.rotation.y = t * 0.6; gInner.rotation.y = -t * 1.1;
            gatePlane.rotation.z = t * 0.2;
            gate.scale.setScalar(1 + call * 0.25);
            gate.position.y = 4.2 + lift * 0.6;

            strips.forEach((pv, i) => { pv.rotation.x = 0.18 + Math.sin(t * 2.2 + i * 0.7) * 0.12 + call * 0.25; });
            const flap = Math.sin(t * 1.8) * 0.25 + call * 0.3;
            wings[0].rotation.y = 0.4 + flap; wings[1].rotation.y = -0.4 - flap;
            wings.forEach((w, i) => w.position.set(i ? 0.7 : -0.7, 3.9 + lift, -0.8));
            crown.position.y = 6.0 + lift + Math.sin(t * 2) * 0.08;
            crown.rotation.y = t * 1.4;

            tiles.forEach(m => {
                const d = m.userData;
                d.k += dt * d.sp;
                if (d.k > 1) resetTile(d);
                const k = d.k;
                m.position.set(d.x, -0.09 - k * k * 9, d.z);
                m.rotation.set(k * 3, k * 2, k * 1.5);
                m.scale.set(0.96 * (1 - k * 0.4), 0.18, 0.96 * (1 - k * 0.4));
            });
            pit.children.forEach(c => { c.material.opacity = 0.5 + call * 0.5; });

            debData.forEach((d, i) => {
                const a = d.a + t * d.sp;
                TMP.p.set(Math.cos(a) * d.r, d.y + Math.sin(t * 0.7 + i) * 0.3, Math.sin(a) * d.r - 1);
                TMP.q.setFromEuler(TMP.e.set(t * 0.5 + i, t * 0.7, 0));
                TMP.sc.setScalar(d.s);
                debris.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
                TMP.sc.setScalar(d.s * 1.08 * (i % 3 === 0 ? 1 : 0.0001));
                debrisGlow.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            });
            debris.instanceMatrix.needsUpdate = true;
            debrisGlow.instanceMatrix.needsUpdate = true;

            if (t > gateNext) {
                gateNext = t + rand(0.06, 0.22);
                gateBolts.forEach(b => {
                    b.visible = Math.random() < 0.55 + call * 0.4;
                    const a = rand(0, Math.PI * 2), a2 = a + rand(1, 2.5);
                    b.reshape([Math.cos(a) * 2.3, gate.position.y + Math.sin(a) * 2.3, -2.5], [Math.cos(a2) * 1.1, gate.position.y + Math.sin(a2) * 1.1, -2.5], 0.5);
                });
            }
        });
    },

    /* 번개의 좌 박지성 (제우스) — 최강 칭호
       떠서 번개를 들고 → 몸을 비틀어 힘을 모으면(번개가 커지고 불꽃이 손으로 모이고 하늘이 어두워짐)
       → 내던짐: 갈라지는 낙뢰 + 폭발 + 화면 흔들림.
       금빛 후광, 하늘을 도는 블록 독수리, 기둥 사이를 잇는 전기, 발밑 올림포스 구름 */
    thunderThrone({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, square, rand, bolt, TMP } = kit;
        const SKY = '#03070e';
        stage.setSky(SKY);
        stage.setSkin({ color: '#d9e2ee', eye: '#7af7ff', glowEyes: true, smile: false, emissive: 0.04 });
        const owned = [];
        const attach = (parent, obj) => { parent.add(obj); owned.push([parent, obj]); };
        stage.onClear(() => owned.forEach(([p, o]) => p.remove(o)));

        // 흰 수염 + 금빛 월계관
        const beardMat = solidMat(new THREE.Color('#f4f7ff'), 0.25);
        for (const [w, h, d, x, y, z] of [[1.15, 0.5, 0.3, 0, -0.42, 0.55], [0.8, 0.45, 0.28, 0, -0.85, 0.52], [0.42, 0.35, 0.26, 0, -1.18, 0.48], [0.75, 0.12, 0.12, 0, -0.08, 0.64]]) {
            const b = new THREE.Mesh(BOX, beardMat); b.scale.set(w, h, d); b.position.set(x, y, z); attach(dummy.head, b);
        }
        const goldMat = solidMat(new THREE.Color('#ffd34d'), 0.9);
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            if (Math.abs(Math.sin(a)) < 0.2 && Math.cos(a) > 0) continue;
            const leaf = new THREE.Mesh(BOX, goldMat);
            leaf.scale.set(0.24, 0.1, 0.12); leaf.position.set(Math.sin(a) * 0.72, 0.5, Math.cos(a) * 0.68); leaf.rotation.set(0.5, a, 0.4);
            attach(dummy.head, leaf);
        }
        // 등 뒤 금빛 후광 (머리에 붙어 따라다님)
        const halo = new THREE.Group();
        const hOuter = square(2.4, 0.07, glowMat(new THREE.Color('#ffd34d'), 1)); hOuter.rotation.x = Math.PI / 2;
        const hInner = square(1.7, 0.05, glowMat(pick(0), 1)); hInner.rotation.x = Math.PI / 2; hInner.rotation.y = Math.PI / 4;
        halo.add(hOuter, hInner);
        for (let i = 0; i < 12; i++) {
            const r = new THREE.Mesh(BOX, glowMat(new THREE.Color('#fff3b0'), 0.7));
            const a = (i / 12) * Math.PI * 2;
            r.scale.set(0.05, 0.9, 0.05); r.position.set(Math.cos(a) * 1.75, Math.sin(a) * 1.75, 0); r.rotation.z = a - Math.PI / 2;
            halo.add(r);
        }
        halo.position.set(0, 0.1, -0.85);
        attach(dummy.head, halo);

        // 손에 든 번개 (힘을 모을수록 커짐)
        const handBolt = new THREE.Group();
        const pts = [[0, 0], [0.25, -0.6], [-0.1, -0.75], [0.3, -1.5], [0.05, -1.6], [0.35, -2.5]];
        const hbMat = glowMat(new THREE.Color('#e8fdff'), 1);
        for (let i = 0; i < pts.length - 1; i++) {
            const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            const seg = new THREE.Mesh(BOX, hbMat);
            seg.scale.set(0.16, Math.hypot(x2 - x1, y2 - y1) + 0.08, 0.16);
            seg.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
            seg.rotation.z = -Math.atan2(x2 - x1, -(y2 - y1));
            handBolt.add(seg);
        }
        const hbGlow = new THREE.Mesh(BOX, glowMat(pick(0), 0.15));
        hbGlow.scale.set(0.42, 2.6, 0.3); hbGlow.position.set(0.15, -1.25, 0);
        handBolt.add(hbGlow);
        handBolt.position.set(-0.1, -1.75, 0);
        attach(dummy.armR, handBolt);
        const tip = new THREE.Object3D(); tip.position.set(0.35, -2.5, 0); handBolt.add(tip);
        const hand = new THREE.Object3D(); hand.position.set(0, -1.9, 0); attach(dummy.armR, hand);

        // 대리석 기둥 2개 + 금테 대리석 왕좌
        const marble = new THREE.MeshStandardMaterial({ color: 0xe9ecf2, roughness: 0.45, metalness: 0.05 });
        const flute = new THREE.MeshStandardMaterial({ color: 0xbfc5d2, roughness: 0.5 });
        const colTops = [];
        for (const x of [-3.6, 3.6]) {
            const col = new THREE.Group();
            for (const [w, h, d, y, m] of [[1.5, 0.35, 1.5, 0.18, marble], [1.05, 6.4, 1.05, 3.55, marble], [1.6, 0.3, 1.6, 6.9, marble], [1.8, 0.28, 1.8, 7.2, goldMat]]) {
                const b = new THREE.Mesh(BOX, m); b.scale.set(w, h, d); b.position.y = y; col.add(b);
            }
            for (const [fx, fz] of [[0.53, 0], [-0.53, 0], [0, 0.53], [0, -0.53]]) {
                const f = new THREE.Mesh(BOX, flute); f.scale.set(fx ? 0.06 : 0.3, 6.2, fz ? 0.06 : 0.3); f.position.set(fx, 3.55, fz); col.add(f);
            }
            col.position.set(x, 0, -1.6);
            group.add(col);
            colTops.push([x, 7.4, -1.6]);
        }
        const throne = new THREE.Group();
        const edgeMat = new THREE.LineBasicMaterial({ color: new THREE.Color('#ffd34d'), toneMapped: false });
        for (const [x, y, z, w, h, d] of [[0, 4.4, -2.4, 3.2, 7, 0.5], [-2.0, 1.4, -1.6, 0.6, 1.4, 1.6], [2.0, 1.4, -1.6, 0.6, 1.4, 1.6], [0, 0.5, -1.8, 3.6, 1.0, 1.0], [0, 8.3, -2.4, 1.4, 0.8, 0.5]]) {
            const b = new THREE.Mesh(BOX, marble); b.scale.set(w, h, d); b.position.set(x, y, z);
            const e = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), edgeMat); e.scale.copy(b.scale); e.position.copy(b.position);
            throne.add(b, e);
        }
        group.add(throne);

        // 발밑 올림포스 구름 + 머리 위 먹구름
        const puffMat = new THREE.MeshStandardMaterial({ color: 0x8e98ab, roughness: 0.95 });
        const floorClouds = [];
        for (let k = 0; k < 14; k++) {
            const c = new THREE.Mesh(BOX, puffMat);
            const a = (k / 14) * Math.PI * 2, r = rand(1.8, 4.4);
            c.scale.set(rand(1.2, 2.2), rand(0.35, 0.7), rand(1, 1.8));
            c.position.set(Math.cos(a) * r, rand(0.1, 0.4), Math.sin(a) * r * 0.8 - 0.4);
            c.userData = { y: c.position.y, ph: rand(0, 6), noFit: true };
            group.add(c); floorClouds.push(c);
        }
        const cloud = new THREE.Group();
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0x1a1f33, roughness: 0.9, emissive: pick(0), emissiveIntensity: 0 });
        for (let k = 0; k < 16; k++) {
            const c = new THREE.Mesh(BOX, cloudMat);
            c.scale.set(rand(1.4, 2.8), rand(0.5, 1), rand(1.2, 2.4));
            c.position.set(rand(-4.4, 4.4), rand(-0.3, 0.4), rand(-3, 0.4));
            cloud.add(c);
        }
        cloud.position.y = 11.5; cloud.userData.noFit = true;
        group.add(cloud);

        // 블록 독수리 (하늘을 돎)
        const eagle = new THREE.Group();
        const brown = new THREE.MeshStandardMaterial({ color: 0x5a3a1e, roughness: 0.7 });
        const whiteM = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.6 });
        const yellowM = solidMat(new THREE.Color('#ffb800'), 0.4);
        const body = new THREE.Mesh(BOX, brown); body.scale.set(0.5, 0.45, 1.3);
        const ehead = new THREE.Mesh(BOX, whiteM); ehead.scale.set(0.42, 0.42, 0.45); ehead.position.set(0, 0.15, 0.8);
        const beak = new THREE.Mesh(BOX, yellowM); beak.scale.set(0.16, 0.14, 0.28); beak.position.set(0, 0.08, 1.12);
        const tail = new THREE.Mesh(BOX, whiteM); tail.scale.set(0.5, 0.08, 0.5); tail.position.set(0, 0, -0.85);
        eagle.add(body, ehead, beak, tail);
        const wingsE = [-1, 1].map(side => {
            const w = new THREE.Group();
            const a = new THREE.Mesh(BOX, brown); a.scale.set(1.3, 0.08, 0.7); a.position.x = side * 0.65;
            const b = new THREE.Mesh(BOX, brown); b.scale.set(1.1, 0.06, 0.5); b.position.x = side * 1.75;
            w.add(a, b); w.position.x = side * 0.22; eagle.add(w); return w;
        });
        eagle.userData.noFit = true;
        group.add(eagle);

        // 낙뢰 (본줄기 + 갈래 2개), 폭발 파편, 충격 링, 섬광, 그을린 타일
        const strikes = [bolt(10, glowMat(new THREE.Color('#ffffff'), 1)), bolt(6, glowMat(pick(0), 1)), bolt(6, glowMat(pick(1), 1))];
        const strikeGlow = bolt(10, glowMat(pick(0), 0.55));
        [...strikes, strikeGlow].forEach(b => { b.userData.noFit = true; group.add(b); });
        const ring = square(1, 0.08, glowMat(pick(0), 1)); ring.userData.noFit = true; group.add(ring);
        const ring2 = square(1, 0.05, glowMat(new THREE.Color('#ffd34d'), 1)); ring2.userData.noFit = true; group.add(ring2);
        const flash = new THREE.PointLight(pick(0), 0, 16, 1.2); flash.userData.own = true; group.add(flash);
        const scorch = Array.from({ length: 4 }, () => { const sc = new THREE.Mesh(BOX, glowMat(pick(0), 0)); sc.scale.set(0.96, 0.03, 0.96); sc.userData.noFit = true; group.add(sc); return sc; });
        const DEB = 18;
        const debris = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 1), DEB); debris.userData.noFit = true; group.add(debris);
        const debData = Array.from({ length: DEB }, () => ({ v: new THREE.Vector3() }));
        // 힘을 모을 때 손으로 빨려드는 불꽃
        const SP = 16;
        const sparks = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 1), SP); sparks.userData.noFit = true; group.add(sparks);
        const spData = Array.from({ length: SP }, () => ({ dir: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(), d: rand(1, 3) }));
        // 몸·기둥에 튀는 전기, 멀리 떨어지는 번개
        const arcs = [0, 1, 2, 3].map(() => { const a = bolt(3, glowMat(pick(0), 1)); group.add(a); return a; });
        const colArc = bolt(7, glowMat(pick(0), 1)); colArc.userData.noFit = true; group.add(colArc);
        const farBolt = bolt(8, glowMat(new THREE.Color('#bdf6ff'), 0.8)); farBolt.userData.noFit = true; group.add(farBolt);
        const bodyPts = [[0, 4.8, 0.5], [-1.5, 2.3, 0.4], [0, 3, 0.55], [-0.5, 0.4, 0.5], [0.5, 0.4, 0.5], [1.5, 3.5, 0.4]];

        const CYCLE = 3.2, WIND_START = 1.2, THROW_AT = 2.0;
        let life = 0, debK = 1, scorchI = 0, cloudFlash = 0, arcNext = 0, farNext = 1, thrown = -1;
        const tipW = new THREE.Vector3(), handW = new THREE.Vector3(), hit = new THREE.Vector3();
        sig.windK = 0; sig.throwK = 0;
        tick((t, dt) => {
            const c = t % CYCLE, n = Math.floor(t / CYCLE);
            // 힘 모으기 → 던지기 → 회복
            sig.windK = c < WIND_START ? 0 : c < THROW_AT ? Math.sin(((c - WIND_START) / (THROW_AT - WIND_START)) * Math.PI / 2) : Math.max(0, 1 - (c - THROW_AT) / 0.15);
            sig.throwK = c < THROW_AT ? 0 : c < THROW_AT + 0.15 ? (c - THROW_AT) / 0.15 : Math.max(0, 1 - (c - THROW_AT - 0.15) / 0.7);
            const charging = sig.windK > 0 && sig.throwK === 0;

            // 손에 든 번개: 모을수록 커지고 밝아짐, 던지고 잠깐 사라짐
            handBolt.visible = !(c > THROW_AT + 0.05 && c < THROW_AT + 0.7);
            handBolt.scale.setScalar(1 + sig.windK * 0.7);
            hbGlow.material.opacity = 0.12 + sig.windK * 0.45 + Math.random() * 0.1;
            stage.setSky(charging ? (Math.random() < 0.06 ? '#06101a' : '#010205') : SKY);

            // 손으로 모이는 불꽃
            hand.getWorldPosition(handW); group.worldToLocal(handW);
            spData.forEach((sp, i) => {
                if (charging) { sp.d -= dt * 4; if (sp.d < 0.2) { sp.d = rand(1.5, 3); sp.dir.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(); } }
                TMP.p.copy(sp.dir).multiplyScalar(sp.d).add(handW);
                TMP.q.setFromEuler(TMP.e.set(t * 6 + i, t * 4, 0));
                TMP.sc.setScalar(charging ? 0.12 : 0.0001);
                sparks.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            });
            sparks.instanceMatrix.needsUpdate = true;

            // 던지는 순간
            if (n !== thrown && c >= THROW_AT + 0.06) {
                thrown = n;
                tip.getWorldPosition(tipW); group.worldToLocal(tipW);
                hit.set(rand(-2.8, 2.8), 0, rand(1.6, 3.6));
                strikes[0].reshape([tipW.x, tipW.y, tipW.z], [hit.x, 0, hit.z], 0.8);
                strikeGlow.reshape([tipW.x, tipW.y, tipW.z], [hit.x, 0, hit.z], 0.8);
                strikeGlow.children.forEach(ch => { ch.scale.x = ch.scale.z = 0.4; });
                strikes[1].reshape([hit.x, 2.5, hit.z], [hit.x + rand(-2.5, 2.5), 0, hit.z + rand(-1, 1)], 0.6);
                strikes[2].reshape([hit.x, 3.5, hit.z], [hit.x + rand(-2.5, 2.5), 0, hit.z + rand(-1.5, 0.5)], 0.6);
                ring.position.set(hit.x, 0.08, hit.z); ring2.position.copy(ring.position);
                flash.position.set(hit.x, 1.5, hit.z);
                const sc = scorch[scorchI++ % scorch.length];
                sc.position.set(Math.round(hit.x / 1.02) * 1.02, 0.02, Math.round(hit.z / 1.02) * 1.02); sc.material.opacity = 1;
                debK = 0;
                debData.forEach(d => d.v.set(rand(-1, 1), rand(0.6, 1.6), rand(-1, 1)).normalize().multiplyScalar(rand(4, 8)));
                life = 1; cloudFlash = 1;
                stage.shake(0.45); stage.flash(0.5);
            }
            life = Math.max(0, life - dt * 2.6);
            strikes.forEach((b, i) => { b.visible = life > (i ? 0.62 : 0.45) && Math.random() > 0.12; });
            strikeGlow.visible = strikes[0].visible;
            ring.visible = ring2.visible = life > 0;
            ring.scale.setScalar(0.4 + (1 - life) * 5.5); ring2.scale.setScalar(0.3 + (1 - life) * 3.5);
            ring.children.forEach(ch => { ch.material.opacity = life; }); ring2.children.forEach(ch => { ch.material.opacity = life; });
            flash.intensity = life * 12;
            scorch.forEach(sc => { sc.material.opacity *= Math.pow(0.35, dt); });
            if (debK < 1) {
                debK = Math.min(1, debK + dt * 1.6);
                debData.forEach((d, i) => {
                    TMP.p.set(hit.x + d.v.x * debK, Math.max(0, d.v.y * debK * 1.2 - 6 * debK * debK), hit.z + d.v.z * debK);
                    TMP.q.setFromEuler(TMP.e.set(debK * 9 + i, debK * 7, 0));
                    TMP.sc.setScalar(0.16 * (1 - debK));
                    debris.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
                });
                debris.instanceMatrix.needsUpdate = true;
            }
            debris.visible = debK < 1;

            // 하늘, 구름, 독수리
            cloudFlash = Math.max(cloudFlash * Math.pow(0.02, dt), charging ? 0.3 + Math.random() * 0.4 : 0);
            cloudMat.emissiveIntensity = cloudFlash * 2.2 + (Math.random() < 0.03 ? 1 : 0);
            cloud.rotation.y = t * 0.05;
            floorClouds.forEach(fc => { fc.position.y = fc.userData.y + Math.sin(t * 0.8 + fc.userData.ph) * 0.08; });
            const ea = t * 0.55;
            eagle.position.set(Math.cos(ea) * 4.8, 9 + Math.sin(t * 1.3) * 0.4, Math.sin(ea) * 3.2 - 1);
            eagle.rotation.set(0, -ea, Math.sin(t * 1.3) * 0.15 + 0.35);
            const flapE = Math.sin(t * 5) * 0.45;
            wingsE[0].rotation.z = flapE; wingsE[1].rotation.z = -flapE;
            edgeMat.color.setRGB(1, 0.83 + Math.random() * 0.17, 0.3);
            halo.rotation.z = t * 0.4; hInner.rotation.y = Math.PI / 4 - t * 1.2;

            // 전기: 몸, 기둥 사이, 먼 하늘
            if (t > arcNext) {
                arcNext = t + rand(0.04, 0.16);
                const lift = dummy.root.position.y;
                arcs.forEach(a => {
                    a.visible = Math.random() < 0.65 + sig.windK * 0.3;
                    const p = bodyPts[Math.floor(rand(0, bodyPts.length))], q = bodyPts[Math.floor(rand(0, bodyPts.length))];
                    a.reshape([p[0], p[1] + lift, p[2]], [q[0] + rand(-0.5, 0.5), q[1] + lift, q[2]], 0.4);
                });
                colArc.visible = Math.random() < 0.35 + sig.windK * 0.5;
                if (colArc.visible) colArc.reshape(colTops[0], colTops[1], 0.6);
            }
            if (t > farNext) {
                farNext = t + rand(0.4, 1.2);
                const a = rand(0, Math.PI * 2);
                farBolt.reshape([Math.cos(a) * 14, 18, Math.sin(a) * 6 - 10], [Math.cos(a) * 14 + rand(-2, 2), 0, Math.sin(a) * 6 - 10], 1.4);
                farBolt.userData.life = 0.12;
            }
            farBolt.userData.life = (farBolt.userData.life || 0) - dt;
            farBolt.visible = farBolt.userData.life > 0;
        });
    },

    /* ================= 새 칭호 ================= */

    /* 김티비디오 — 지지직거리는 블록 TV들이 둥둥 */
    tvStatic({ group, tick, pick, kit }) {
        const { THREE, BOX, glowMat, rand } = kit;
        const cv = document.createElement('canvas'); cv.width = 32; cv.height = 24;
        const g2 = cv.getContext('2d');
        const tex = new THREE.CanvasTexture(cv); tex.magFilter = THREE.NearestFilter;
        const screenMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
        const caseMat = new THREE.MeshStandardMaterial({ color: 0x3a3a44, roughness: 0.6 });
        const tvs = [0, 1, 2, 3].map(i => {
            const tv = new THREE.Group();
            const body = new THREE.Mesh(BOX, caseMat); body.scale.set(1, 0.8, 0.7);
            const scr = new THREE.Mesh(BOX, screenMat); scr.scale.set(0.78, 0.58, 0.02); scr.position.z = 0.36;
            const ant1 = new THREE.Mesh(BOX, caseMat); ant1.scale.set(0.03, 0.6, 0.03); ant1.position.set(-0.15, 0.65, 0); ant1.rotation.z = 0.4;
            const ant2 = ant1.clone(); ant2.position.x = 0.15; ant2.rotation.z = -0.4;
            tv.add(body, scr, ant1, ant2);
            tv.userData = { a: (i / 4) * Math.PI * 2, y: rand(2.5, 5.5) };
            group.add(tv); return tv;
        });
        let next = 0, mode = 0;
        const img = g2.createImageData(32, 24);
        tick(t => {
            if (t > next) {
                next = t + 0.08;
                if (Math.random() < 0.03) mode = 1 - mode;
                for (let i = 0; i < 32 * 24; i++) {
                    let r, gg, b;
                    if (mode) { const bar = Math.floor((i % 32) / 4.6); [r, gg, b] = [[255,255,255],[255,255,0],[0,255,255],[0,255,0],[255,0,255],[255,0,0],[0,0,255]][bar]; }
                    else { r = gg = b = Math.random() * 255; }
                    img.data.set([r, gg, b, 255], i * 4);
                }
                g2.putImageData(img, 0, 0);
                tex.needsUpdate = true;
            }
            tvs.forEach((tv, i) => {
                const a = tv.userData.a + t * 0.4;
                tv.position.set(Math.cos(a) * 2.4, tv.userData.y + Math.sin(t * 1.5 + i) * 0.2, Math.sin(a) * 1.6 - 0.3);
                tv.rotation.set(Math.sin(t + i) * 0.15, Math.atan2(-tv.position.x, 6 - tv.position.z), Math.sin(t * 0.8 + i) * 0.2);
            });
        });
    },

    /* 김민채소로날유혹해 — 옆에 블록 소 + 하트 큐브 */
    cowCharm({ group, tick, pick, kit, sig }) {
        const { THREE, BOX, glowMat, rand } = kit;
        const cow = new THREE.Group();
        const white = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.7 });
        const black = new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.7 });
        const pink = new THREE.MeshStandardMaterial({ color: 0xffa8c6, roughness: 0.6 });
        const add = (m, w, h, d, x, y, z, parent = cow) => { const b = new THREE.Mesh(BOX, m); b.scale.set(w, h, d); b.position.set(x, y, z); parent.add(b); return b; };
        add(white, 2.4, 1.3, 1.2, 0, 1.75, 0);
        add(black, 0.7, 0.6, 1.22, -0.4, 2.0, 0); add(black, 0.5, 0.5, 1.22, 0.6, 1.5, 0); add(black, 0.4, 0.4, 1.22, -0.9, 1.4, 0);
        for (const [x, z] of [[-0.85, 0.4], [0.85, 0.4], [-0.85, -0.4], [0.85, -0.4]]) { add(white, 0.32, 1.2, 0.32, x, 0.6, z); add(black, 0.34, 0.2, 0.34, x, 0.1, z); }
        const head = new THREE.Group(); head.position.set(-1.45, 2.3, 0); cow.add(head);
        add(white, 0.9, 0.85, 0.85, 0, 0, 0, head);
        add(pink, 0.35, 0.45, 0.75, -0.55, -0.2, 0, head);
        add(black, 0.3, 0.15, 0.08, -0.15, 0.48, 0.32, head); add(black, 0.3, 0.15, 0.08, -0.15, 0.48, -0.32, head);
        add(white, 0.12, 0.3, 0.12, 0.1, 0.55, 0.4, head); add(white, 0.12, 0.3, 0.12, 0.1, 0.55, -0.4, head);
        add(black, 0.1, 0.12, 0.05, -0.47, 0.12, 0.25, head); add(black, 0.1, 0.12, 0.05, -0.47, 0.12, -0.25, head);
        const tail = add(white, 0.1, 0.9, 0.1, 1.25, 1.8, 0);
        cow.position.set(2.9, 0, 0.2);
        cow.rotation.y = 0.35;
        group.add(cow);
        // 픽셀 하트
        const heartCells = [[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[1,3],[2,3],[3,3],[2,4]];
        const hearts = [0, 1, 2].map(i => {
            const h = new THREE.Group();
            const m = glowMat(pick(0), 1);
            heartCells.forEach(([x, y]) => { const c = new THREE.Mesh(BOX, m); c.scale.setScalar(0.12); c.position.set((x - 2) * 0.12, -y * 0.12, 0); h.add(c); });
            h.userData = { k: i / 3, x: 0 }; h.userData.noFit = true;
            group.add(h); return h;
        });
        tick((t, dt) => {
            head.rotation.z = Math.sin(t * 3) * 0.08;            // 우물우물
            head.rotation.y = 0.2 + Math.sin(t * 0.7) * 0.15;
            tail.rotation.x = Math.sin(t * 4) * 0.4;
            hearts.forEach((h, i) => {
                h.userData.k += dt * 0.35;
                if (h.userData.k > 1) { h.userData.k = 0; h.userData.x = rand(0.8, 2.2); }
                const k = h.userData.k;
                h.position.set(h.userData.x + Math.sin(k * 8 + i) * 0.2, 3.2 + k * 3, 0.6);
                h.scale.setScalar(Math.sin(k * Math.PI) * 1.4);
                h.rotation.y = Math.sin(t * 2 + i) * 0.4;
            });
        });
    },

    /* 꽁꽁병은 — 얼음 블록에 꽁꽁, 서리와 고드름 */
    frozen({ group, tick, pick, kit }) {
        const { THREE, BOX, glowMat, rand } = kit;
        const ice = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0xbfeaff, transparent: true, opacity: 0.32, roughness: 0.05, metalness: 0.2, emissive: pick(0), emissiveIntensity: 0.15, depthWrite: false }));
        ice.scale.set(3.4, 5.9, 1.9); ice.position.y = 2.95;
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), new THREE.LineBasicMaterial({ color: 0xffffff, toneMapped: false }));
        edges.scale.copy(ice.scale); edges.position.copy(ice.position);
        group.add(ice, edges);
        // 얼음 금 (면 위의 하얀 선)
        for (let i = 0; i < 6; i++) {
            const c = new THREE.Mesh(BOX, glowMat(new THREE.Color('#ffffff'), 0.6));
            c.scale.set(rand(0.4, 1.2), 0.025, 0.02); c.position.set(rand(-1.4, 1.4), rand(0.5, 5.5), 0.96); c.rotation.z = rand(-1, 1);
            group.add(c);
        }
        // 바닥 얼음 결정
        for (let i = 0; i < 10; i++) {
            const c = new THREE.Mesh(BOX, glowMat(pick(i % 3), 0.55));
            const a = rand(0, Math.PI * 2), r = rand(1.9, 3.2);
            c.scale.set(0.25, rand(0.5, 1.4), 0.25); c.position.set(Math.cos(a) * r, 0.3, Math.sin(a) * r);
            c.rotation.set(rand(-0.4, 0.4), rand(0, 3), rand(-0.4, 0.4));
            group.add(c);
        }
        // 고드름 (얼음 블록 윗모서리)
        for (let i = 0; i < 7; i++) {
            const c = new THREE.Mesh(BOX, glowMat(new THREE.Color('#e6f9ff'), 0.7));
            const h = rand(0.25, 0.6); c.scale.set(0.12, h, 0.12); c.position.set(-1.5 + i * 0.5, 5.9 - h / 2 - 0.05, 0.95);
            group.add(c);
        }
        tick(t => { ice.material.emissiveIntensity = 0.12 + Math.sin(t * 2) * 0.05; });
    },

    /* 김건우족을보았다 — 미니 김건우 부족이 둘러싸고 의식 춤, 모닥불, 북 */
    gunwooTribe({ group, tick, pick, dummy, kit }) {
        const { THREE, BOX, glowMat, solidMat, square, rand, mini } = kit;
        const tribe = Array.from({ length: 7 }, (_, i) => {
            const m = mini(0xb98a62, { paint: i % 2 ? '#ff9a3c' : '#c23b22', scale: 0.42 });
            const spear = new THREE.Group();
            const shaft = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x6b4423 })); shaft.scale.set(0.15, 4.5, 0.15); shaft.position.y = -1.6;
            const head = new THREE.Mesh(BOX, solidMat(new THREE.Color('#dddddd'), 0.2)); head.scale.set(0.3, 0.6, 0.12); head.position.y = 0.8; head.rotation.z = Math.PI / 4;
            spear.add(shaft, head); spear.position.y = -1.9; m.armR.add(spear);
            m.root.userData = { a: (i / 7) * Math.PI * 2 };
            group.add(m.root);
            return m;
        });
        // 모닥불 (뒤쪽)
        const fire = new THREE.Group();
        const log = new THREE.MeshStandardMaterial({ color: 0x4a2e17 });
        for (const r of [0.6, -0.6]) { const l = new THREE.Mesh(BOX, log); l.scale.set(1.6, 0.25, 0.25); l.rotation.y = r; l.position.y = 0.15; fire.add(l); }
        const flames = Array.from({ length: 10 }, (_, i) => { const f = new THREE.Mesh(BOX, glowMat(pick(i % 2), 0.9)); fire.add(f); f.userData.ph = rand(0, 6); return f; });
        fire.position.set(0, 0, -2.4);
        const fireLight = new THREE.PointLight(pick(0), 12, 9, 1.4); fireLight.userData.own = true; fireLight.position.set(0, 1.2, -2.4);
        group.add(fire, fireLight);
        // 북 2개 + 북소리 링
        const drumMat = new THREE.MeshStandardMaterial({ color: 0x7a4b25, roughness: 0.6 });
        const drums = [-2.7, 2.7].map(x => {
            const d = new THREE.Group();
            const b = new THREE.Mesh(BOX, drumMat); b.scale.set(0.9, 1.0, 0.9); b.position.y = 0.5;
            const top = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0xe8d3a8 })); top.scale.set(0.92, 0.06, 0.92); top.position.y = 1.02;
            d.add(b, top); d.position.set(x, 0, -0.6); group.add(d);
            const r = square(1, 0.04, glowMat(pick(0), 1)); r.position.set(x, 1.05, -0.6); r.userData.noFit = true; group.add(r);
            return { d, r };
        });
        tick((t, dt) => {
            const beat = (t % 0.5) / 0.5;
            tribe.forEach((m, i) => {
                const a = m.root.userData.a + t * 0.45;
                m.root.position.set(Math.cos(a) * 3.0, Math.abs(Math.sin(t * 6.28 + i)) * 0.25, Math.sin(a) * 2.2 - 0.3);
                m.root.rotation.y = -a - Math.PI / 2 + Math.sin(t * 3 + i) * 0.3;
                const up = Math.sin(t * 6.28 + i) * 0.5 + 0.5;
                m.armL.rotation.z = -0.4 - up * 2.2; m.armR.rotation.z = 0.5 + (1 - up) * 1.6;
                m.legL.rotation.x = Math.sin(t * 12.56 + i) * 0.5; m.legR.rotation.x = -Math.sin(t * 12.56 + i) * 0.5;
            });
            flames.forEach((f, i) => {
                const k = ((t * 1.4 + f.userData.ph) % 1);
                f.scale.setScalar(0.45 * (1 - k)); f.position.set(Math.sin(f.userData.ph + t * 3) * 0.3, 0.3 + k * 1.6, Math.cos(f.userData.ph) * 0.25);
                f.rotation.set(t * 3 + i, t * 2, 0);
            });
            fireLight.intensity = 10 + Math.random() * 6;
            drums.forEach(({ d, r }) => {
                d.scale.y = 1 - (beat < 0.15 ? (0.15 - beat) * 0.8 : 0);
                r.scale.setScalar(0.6 + beat * 2.5);
                r.children.forEach(c => { c.material.opacity = 1 - beat; });
            });
        });
    },

    /* 170KG OOO — 거대한 바벨을 들었다 내리찍음. 쾅 할 때 땅이 흔들림 */
    heavy170({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, square, rand, TMP } = kit;
        // 몸집을 크게
        dummy.torso.scale.set(1.35, 1, 1.45);
        dummy.legL.scale.set(1.15, 1, 1.15); dummy.legR.scale.set(1.15, 1, 1.15);
        const bar = new THREE.Group();
        const steel = new THREE.MeshStandardMaterial({ color: 0xcfd3da, metalness: 0.8, roughness: 0.3 });
        const plateMat = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.5 });
        const rod = new THREE.Mesh(BOX, steel); rod.scale.set(6.2, 0.14, 0.14); bar.add(rod);
        for (const side of [-1, 1]) {
            [[1.7, 1.7, 0.28], [1.45, 1.45, 0.26], [1.15, 1.15, 0.24]].forEach(([h, d, w], k) => {
                const p = new THREE.Mesh(BOX, plateMat); p.scale.set(w, h, d); p.position.x = side * (2.35 + k * 0.3); bar.add(p);
                const rimEdge = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), new THREE.LineBasicMaterial({ color: pick(0), toneMapped: false }));
                rimEdge.scale.copy(p.scale); rimEdge.position.copy(p.position); bar.add(rimEdge);
            });
            const collar = new THREE.Mesh(BOX, steel); collar.scale.set(0.2, 0.4, 0.4); collar.position.x = side * 2.05; bar.add(collar);
        }
        bar.position.z = 0.2;
        group.add(bar);
        const ring = square(1, 0.1, glowMat(pick(0), 1)); ring.userData.noFit = true; group.add(ring);
        const ring2 = square(1, 0.06, glowMat(pick(1), 1)); ring2.userData.noFit = true; group.add(ring2);
        const cracks = Array.from({ length: 8 }, () => { const c = new THREE.Mesh(BOX, glowMat(pick(0), 0)); c.userData.noFit = true; group.add(c); return c; });
        const DEB = 20;
        const debris = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ color: 0x2a2a3a }), DEB); debris.userData.noFit = true; group.add(debris);
        const debData = Array.from({ length: DEB }, () => ({ v: new THREE.Vector3(), x: 0 }));
        const CYCLE = 3.4;
        let slamN = -1, k = 1;
        sig.liftK = 1;
        tick((t, dt) => {
            const c = t % CYCLE, n = Math.floor(t / CYCLE);
            // 0~1.5 머리 위로 버팀, 1.5~1.8 떨어뜨림, 1.8~2.3 바닥, 2.3~3.4 다시 들어올림
            let y;
            if (c < 1.5) { sig.liftK = 1; y = 6.4 + Math.sin(t * 9) * 0.04; }
            else if (c < 1.8) { const q = (c - 1.5) / 0.3; sig.liftK = 1 - q * q; y = 6.4 - (6.4 - 0.85) * q * q; }
            else if (c < 2.3) { sig.liftK = 0; y = 0.85; }
            else { const q = (c - 2.3) / 1.1; const e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; sig.liftK = e; y = 0.85 + (6.4 - 0.85) * e; }
            bar.position.y = y + (sig.liftK > 0.9 ? dummy.root.position.y : 0);
            bar.rotation.z = Math.sin(t * 2) * 0.03 * sig.liftK;
            if (n !== slamN && c >= 1.8) {
                slamN = n; k = 0;
                stage.shake(0.7); stage.flash(0.8);
                cracks.forEach(cr => {
                    const a = rand(0, Math.PI * 2), len = rand(1.2, 3.2);
                    cr.scale.set(len, 0.03, 0.08); cr.position.set(Math.cos(a) * (len / 2 + 0.6), 0.03, Math.sin(a) * (len / 2 + 0.6) + 0.2); cr.rotation.y = -a;
                    cr.material.opacity = 1;
                });
                debData.forEach(d => { d.v.set(rand(-1, 1), rand(0.8, 1.6), rand(-1, 1)).normalize().multiplyScalar(rand(3, 7)); d.x = rand(-3, 3); });
            }
            if (k < 1) {
                k = Math.min(1, k + dt * 1.4);
                ring.visible = ring2.visible = true;
                ring.position.set(0, 0.08, 0.2); ring2.position.copy(ring.position);
                ring.scale.setScalar(0.6 + k * 9); ring2.scale.setScalar(0.4 + k * 6);
                ring.children.forEach(c2 => { c2.material.opacity = 1 - k; }); ring2.children.forEach(c2 => { c2.material.opacity = 1 - k; });
                debData.forEach((d, i) => {
                    TMP.p.set(d.x * 0.6 + d.v.x * k, Math.max(0, d.v.y * k * 1.4 - 7 * k * k), 0.2 + d.v.z * k);
                    TMP.q.setFromEuler(TMP.e.set(k * 9 + i, k * 6, 0));
                    TMP.sc.setScalar(0.3 * (1 - k * 0.7));
                    debris.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
                });
                debris.instanceMatrix.needsUpdate = true;
                debris.visible = true;
            } else { ring.visible = ring2.visible = debris.visible = false; }
            cracks.forEach(cr => { cr.material.opacity *= Math.pow(0.4, dt); });
        });
    },

    /* 절대여제 김가은 — 황금 단상, 거대한 왕관, 손에 든 홀, 망토, 엎드린 신하, 깃발 */
    empress({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, square, rand, mini, TMP } = kit;
        const gold = solidMat(new THREE.Color('#ffd34d'), 0.6);
        const royal = new THREE.MeshStandardMaterial({ color: 0x4a1a7a, roughness: 0.5, emissive: pick(0), emissiveIntensity: 0.15 });
        const owned = [];
        const attach = (parent, obj) => { parent.add(obj); owned.push([parent, obj]); };
        stage.onClear(() => owned.forEach(([p, o]) => p.remove(o)));
        // 3단 단상
        [[5.2, 0.25, 4.2], [4.2, 0.25, 3.4], [3.2, 0.25, 2.6]].forEach(([w, h, d], i) => {
            const st = new THREE.Mesh(BOX, royal); st.scale.set(w, h, d); st.position.set(0, 0.12 + i * 0.25, -0.2); group.add(st);
            const trim = new THREE.Mesh(BOX, gold); trim.scale.set(w + 0.02, 0.05, d + 0.02); trim.position.set(0, 0.25 + i * 0.25, -0.2); group.add(trim);
        });
        // 거대한 왕관 (머리 위 높이)
        const crown = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            const side = new THREE.Mesh(BOX, gold); side.scale.set(2.6, 0.45, 0.12);
            const a = (i * Math.PI) / 2; side.position.set(Math.sin(a) * 1.25, 0, Math.cos(a) * 1.25); side.rotation.y = a; crown.add(side);
            for (const off of [-0.9, 0, 0.9]) {
                const sp = new THREE.Mesh(BOX, gold); sp.scale.set(0.22, off === 0 ? 0.9 : 0.6, 0.12);
                sp.position.set(Math.sin(a) * 1.25 + Math.cos(a) * off, off === 0 ? 0.6 : 0.45, Math.cos(a) * 1.25 - Math.sin(a) * off); sp.rotation.y = a; crown.add(sp);
                const gem = new THREE.Mesh(BOX, glowMat(pick(off === 0 ? 0 : 2), 1)); gem.scale.setScalar(0.18);
                gem.position.copy(sp.position); gem.position.y += off === 0 ? 0.5 : 0.35; gem.rotation.set(0.78, 0.78, 0); crown.add(gem);
            }
        }
        group.add(crown);
        // 손에 든 홀
        const scepter = new THREE.Group();
        const rod = new THREE.Mesh(BOX, gold); rod.scale.set(0.12, 2.6, 0.12); rod.position.y = -1.3;
        const orb = new THREE.Mesh(BOX, glowMat(pick(0), 1)); orb.scale.setScalar(0.38); orb.position.y = -2.75; orb.rotation.set(0.78, 0.78, 0);
        const wingL = new THREE.Mesh(BOX, gold); wingL.scale.set(0.5, 0.1, 0.08); wingL.position.set(-0.28, -2.45, 0); wingL.rotation.z = 0.5;
        const wingR = wingL.clone(); wingR.position.x = 0.28; wingR.rotation.z = -0.5;
        scepter.add(rod, orb, wingL, wingR);
        scepter.position.y = -1.6;
        attach(dummy.armR, scepter);
        // 망토 (보라 + 금테)
        const cape = new THREE.Group(); cape.position.set(0, 3.95, -0.58);
        const strips = [];
        for (let i = 0; i < 5; i++) {
            const pv = new THREE.Group(); pv.position.x = -0.9 + i * 0.45;
            const m = new THREE.Mesh(BOX, royal); m.scale.set(0.46, 4.2, 0.06); m.position.y = -2.1;
            const e = new THREE.Mesh(BOX, gold); e.scale.set(0.46, 0.12, 0.07); e.position.y = -4.2;
            pv.add(m, e); cape.add(pv); strips.push(pv);
        }
        attach(dummy.root, cape);
        // 엎드린 신하들
        const servants = Array.from({ length: 6 }, (_, i) => {
            const m = mini(0x2a2238, { scale: 0.4 });
            const side = i < 3 ? -1 : 1, k = i % 3;
            m.root.position.set(side * (2.6 + k * 0.4), 0, 1.0 - k * 1.1);
            m.root.rotation.y = side * -1.2;
            group.add(m.root);
            return m;
        });
        // 깃발 2개
        const banners = [-3.8, 3.8].map(x => {
            const pole = new THREE.Mesh(BOX, gold); pole.scale.set(0.12, 7.5, 0.12); pole.position.set(x, 3.75, -1.8); group.add(pole);
            const flag = new THREE.Group(); flag.position.set(x, 7.2, -1.8);
            const cloth = new THREE.Mesh(BOX, royal); cloth.scale.set(1.3, 3.2, 0.05); cloth.position.y = -1.6;
            const emblem = new THREE.Mesh(BOX, gold); emblem.scale.set(0.5, 0.5, 0.07); emblem.position.y = -1.3; emblem.rotation.z = Math.PI / 4;
            flag.add(cloth, emblem); group.add(flag); return flag;
        });
        // 금가루
        const DUST = 30;
        const dust = new THREE.InstancedMesh(BOX, glowMat(new THREE.Color('#ffe7a0'), 1), DUST); dust.userData.noFit = true; group.add(dust);
        const dustD = Array.from({ length: DUST }, () => ({ x: rand(-4, 4), y: rand(0, 10), z: rand(-3, 2), v: rand(0.3, 0.8) }));
        const ring = square(1, 0.07, glowMat(new THREE.Color('#ffd34d'), 1)); ring.userData.noFit = true; group.add(ring);
        let slamN = -1, rk = 1;
        sig.slamK = 0;
        tick((t, dt) => {
            const c = t % 4.5, n = Math.floor(t / 4.5);
            sig.slamK = c > 3.6 && c < 4.2 ? Math.sin(((c - 3.6) / 0.6) * Math.PI) : 0;
            if (n !== slamN && c > 3.9) { slamN = n; rk = 0; stage.shake(0.25); stage.flash(0.7); }
            const lift = dummy.root.position.y;
            crown.position.y = 7.4 + lift + Math.sin(t * 1.2) * 0.15;
            crown.rotation.y = t * 0.35;
            strips.forEach((pv, i) => { pv.rotation.x = 0.15 + Math.sin(t * 1.8 + i * 0.6) * 0.1; });
            servants.forEach((m, i) => {
                const bow = 0.9 + Math.sin(t * 1.5 + i * 0.4) * 0.15 + (rk < 0.6 ? 0.3 : 0);
                // 무릎 꿇고 몸을 숙여 절함
                m.root.rotation.x = bow * 0.85;
                m.legL.rotation.x = m.legR.rotation.x = -1.5;
                m.armL.rotation.x = m.armR.rotation.x = -1.3;
                m.root.position.y = -0.3;
            });
            banners.forEach((b, i) => { b.rotation.y = Math.sin(t * 1.4 + i) * 0.25; });
            dustD.forEach((d, i) => {
                d.y -= d.v * dt; if (d.y < 0) d.y = 10;
                TMP.p.set(d.x + Math.sin(t + i) * 0.3, d.y, d.z);
                TMP.q.setFromEuler(TMP.e.set(t * 2 + i, t, 0));
                TMP.sc.setScalar(0.07);
                dust.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            });
            dust.instanceMatrix.needsUpdate = true;
            if (rk < 1) {
                rk = Math.min(1, rk + dt * 1.2);
                ring.visible = true; ring.position.set(0, 0.85, -0.2); ring.scale.setScalar(0.5 + rk * 8);
                ring.children.forEach(cc => { cc.material.opacity = 1 - rk; });
            } else ring.visible = false;
        });
    },

    /* 흉악범 — 장미와 마술사 (괴도)
       실크햇·가면·망토·지팡이, 카드 폭풍, 피어나는 장미, 꽃잎 소용돌이,
       등 뒤 거대한 네모 장미, 인사 → 꽃잎 속으로 사라졌다가 옆에서 나타나는 마술 */
    phantomRose({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, square, rand, TMP } = kit;
        stage.setSky('#0a0004');
        const owned = [];
        const attach = (parent, obj) => { parent.add(obj); owned.push([parent, obj]); };
        stage.onClear(() => owned.forEach(([p, o]) => p.remove(o)));
        const black = new THREE.MeshStandardMaterial({ color: 0x0b0b10, roughness: 0.35, metalness: 0.2 });
        const crimson = new THREE.MeshStandardMaterial({ color: 0x8a0018, roughness: 0.4, emissive: pick(0), emissiveIntensity: 0.25 });
        const gold = solidMat(new THREE.Color('#ffd34d'), 0.6);

        // 실크햇 + 가면
        const hat = new THREE.Group();
        const brim = new THREE.Mesh(BOX, black); brim.scale.set(1.75, 0.08, 1.6);
        const top = new THREE.Mesh(BOX, black); top.scale.set(1.1, 1.0, 1.05); top.position.y = 0.52;
        const band = new THREE.Mesh(BOX, crimson); band.scale.set(1.12, 0.2, 1.07); band.position.y = 0.16;
        const rosePin = new THREE.Mesh(BOX, glowMat(pick(0), 1)); rosePin.scale.setScalar(0.22); rosePin.position.set(0.5, 0.2, 0.45); rosePin.rotation.set(0.78, 0.78, 0);
        hat.add(brim, top, band, rosePin);
        hat.position.set(0, 0.64, 0); hat.rotation.z = -0.12;
        attach(dummy.head, hat);
        const mask = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0xf6f6f6, roughness: 0.3 }));
        mask.scale.set(0.62, 0.75, 0.05); mask.position.set(0.3, 0.05, 0.62);
        attach(dummy.head, mask);
        // 지팡이 (왼손)
        const cane = new THREE.Group();
        const shaft = new THREE.Mesh(BOX, black); shaft.scale.set(0.1, 2.6, 0.1); shaft.position.y = -1.0;
        const knob = new THREE.Mesh(BOX, gold); knob.scale.setScalar(0.24); knob.position.y = 0.3;
        cane.add(shaft, knob); cane.position.y = -1.9;
        attach(dummy.armL, cane);
        // 망토 (겉은 검정, 안은 진홍) + 높은 깃
        const cape = new THREE.Group(); cape.position.set(0, 4.0, -0.58);
        const strips = [];
        for (let i = 0; i < 6; i++) {
            const pv = new THREE.Group(); pv.position.x = -1.05 + i * 0.42;
            const outer = new THREE.Mesh(BOX, black); outer.scale.set(0.43, 4.1, 0.05); outer.position.set(0, -2.05, -0.03);
            const inner = new THREE.Mesh(BOX, crimson); inner.scale.set(0.43, 4.1, 0.03); inner.position.set(0, -2.05, 0.02);
            pv.add(outer, inner); cape.add(pv); strips.push(pv);
        }
        const collar = new THREE.Mesh(BOX, crimson); collar.scale.set(2.4, 0.9, 0.06); collar.position.set(0, 0.35, 0.05); collar.rotation.x = -0.35;
        cape.add(collar);
        attach(dummy.root, cape);

        // 등 뒤 거대한 네모 장미 (겹겹이 돌린 네모 = 꽃잎)
        const bigRose = new THREE.Group();
        for (let i = 0; i < 9; i++) {
            const sz = 4.6 - i * 0.48;
            const petal = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.98, 0.9, 0.12 + i * 0.045), emissive: pick(0), emissiveIntensity: 0.05 + i * 0.03, roughness: 0.5 }));
            petal.scale.set(sz, sz, 0.08); petal.position.z = i * 0.06; petal.rotation.z = i * 0.35;
            bigRose.add(petal);
        }
        const stemBig = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x0e3d1a })); stemBig.scale.set(0.25, 5, 0.1); stemBig.position.set(0, -4.6, -0.05);
        bigRose.add(stemBig);
        bigRose.position.set(0, 5.2, -3.2);
        group.add(bigRose);

        // 바닥에서 피는 장미들
        const roses = Array.from({ length: 8 }, (_, i) => {
            const r = new THREE.Group();
            const stem = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x1d6b2e })); stem.scale.set(0.08, 1.2, 0.08); stem.position.y = 0.6;
            const leaf = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x2a8a3e })); leaf.scale.set(0.35, 0.05, 0.18); leaf.position.set(0.15, 0.55, 0); leaf.rotation.z = 0.4;
            r.add(stem, leaf);
            for (let k = 0; k < 3; k++) {
                const b = new THREE.Mesh(BOX, glowMat(new THREE.Color().setHSL(0.98, 1, 0.35 + k * 0.08), 1));
                b.scale.setScalar(0.42 - k * 0.11); b.position.y = 1.3 + k * 0.05; b.rotation.set(0.6, k * 0.8, 0.6);
                r.add(b);
            }
            const a = (i / 8) * Math.PI * 2 + 0.2, rr = i % 2 ? 2.5 : 3.3;
            r.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr * 0.75);
            r.userData.ph = i * 0.7;
            group.add(r); return r;
        });

        // 카드 폭풍
        const CARDS = 36;
        const cardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.15 });
        const cards = new THREE.InstancedMesh(BOX, cardMat, CARDS);
        const suit = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 1), CARDS);
        for (let i = 0; i < CARDS; i++) suit.setColorAt(i, i % 2 ? new THREE.Color('#ff1744') : new THREE.Color('#111111'));
        cards.userData.noFit = suit.userData.noFit = true;
        group.add(cards, suit);
        const cardD = Array.from({ length: CARDS }, (_, i) => ({ a: rand(0, 6.28), y: rand(0.3, 7), r: rand(1.6, 3.6), sp: rand(0.8, 1.6) }));
        // 꽃잎 소용돌이
        const PET = 60;
        const petals = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 0.7), PET);
        for (let i = 0; i < PET; i++) petals.setColorAt(i, new THREE.Color().setHSL(0.97 + Math.random() * 0.03, 1, 0.3 + Math.random() * 0.25));
        petals.userData.noFit = true;
        group.add(petals);
        const petD = Array.from({ length: PET }, () => ({ a: rand(0, 6.28), y: rand(0, 7), r: rand(0.8, 3.2), v: rand(0.3, 0.9), burst: 0 }));
        const light = new THREE.PointLight(pick(0), 5, 9, 1.6); light.userData.own = true; light.position.set(0, 4, 2.5); group.add(light);

        // 마술: 인사 → 꽃잎 속으로 사라짐 → 옆에서 나타나 두 팔 활짝 → 제자리로
        const CYCLE = 6.4;
        let lastVanish = -1, burstK = 1, offX = 0;
        sig.bowK = 0; sig.revealK = 0;
        tick((t, dt, speed) => {
            const c = t % CYCLE, n = Math.floor(t / CYCLE);
            sig.bowK = c > 1.4 && c < 2.6 ? Math.sin(((c - 1.4) / 1.2) * Math.PI) : 0;
            const hidden = c > 2.6 && c < 3.05;
            if (n !== lastVanish && c > 2.6) {
                lastVanish = n; burstK = 0; offX = (n % 2 ? 1 : -1) * 1.3;
                stage.flash(0.6);
            }
            sig.revealK = c > 3.05 && c < 5.0 ? Math.min(1, (c - 3.05) / 0.3) * (c > 4.6 ? (5.0 - c) / 0.4 : 1) : 0;
            const slide = c > 3.05 && c < 6.0 ? (c < 5.0 ? 1 : 1 - (c - 5.0) / 1.0) : 0;
            dummy.root.visible = !hidden;
            dummy.root.position.x += offX * slide;
            burstK = Math.min(1, burstK + dt * 1.2);

            strips.forEach((pv, i) => { pv.rotation.x = 0.2 + Math.sin(t * 2 + i * 0.6) * 0.12 + sig.revealK * 0.5; pv.rotation.z = (i - 2.5) * 0.04 * sig.revealK; });
            bigRose.rotation.z = t * 0.12;
            bigRose.children.forEach((pt, i) => { if (i < 9) pt.rotation.z = i * 0.35 + Math.sin(t * 0.5 + i * 0.3) * 0.1; });
            roses.forEach((r, i) => {
                const bloom = 0.6 + 0.4 * Math.sin(t * 0.8 + r.userData.ph);
                r.scale.setScalar(0.9 + bloom * 0.35);
                r.rotation.y = Math.sin(t * 0.6 + i) * 0.3;
            });
            for (let i = 0; i < CARDS; i++) {
                const d = cardD[i];
                const a = d.a + t * d.sp * speed;
                const r = d.r + (burstK < 1 ? (1 - burstK) * 3 : 0);
                TMP.p.set(Math.cos(a) * r + offX * slide * 0.5, d.y + Math.sin(t + i) * 0.3, Math.sin(a) * r * 0.8 - 0.3);
                TMP.q.setFromEuler(TMP.e.set(Math.sin(t * 2 + i) * 0.6, -a + Math.PI / 2, t * 1.5 + i));
                TMP.sc.set(0.5, 0.72, 0.02);
                cards.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
                TMP.sc.set(0.16, 0.16, 0.04);
                suit.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            }
            cards.instanceMatrix.needsUpdate = true; suit.instanceMatrix.needsUpdate = true;
            for (let i = 0; i < PET; i++) {
                const d = petD[i];
                d.y += d.v * dt * 0.6; if (d.y > 8) d.y = 0;
                const a = d.a + t * 0.7;
                const r = d.r + (1 - burstK) * 4 * (i % 3 ? 1 : 0.4);
                TMP.p.set(Math.cos(a) * r + offX * slide * 0.3, d.y + (hidden ? 2 : 0), Math.sin(a) * r * 0.8);
                TMP.q.setFromEuler(TMP.e.set(t * 2 + i, t * 1.3, i));
                TMP.sc.set(0.22, 0.03, 0.18);
                petals.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            }
            petals.instanceMatrix.needsUpdate = true;
            light.intensity = 4 + Math.sin(t * 2) * 1.5 + (1 - burstK) * 20;
        });
    },

    /* 폭풍의 김가은 — 몸을 감아 도는 두 줄기 바람, 휘말려 오르는 잎, 머리 위 먹구름과 번쩍임 */
    stormDancer({ group, tick, pick, dummy, kit }) {
        const { THREE, BOX, glowMat, solidMat, rand, TMP } = kit;
        const N = 36;
        const wind = new THREE.InstancedMesh(BOX, glowMat(pick(0), 0.75), N * 2);
        group.add(wind);
        const LEAF = 22;
        const leaves = new THREE.InstancedMesh(BOX, solidMat(new THREE.Color('#5fe08a'), 0.5), LEAF);
        group.add(leaves);
        const leafD = Array.from({ length: LEAF }, () => ({ a: rand(0, 6.3), y: rand(0, 7), r: rand(1.6, 3), v: rand(0.8, 1.6) }));
        const cloud = new THREE.Group();
        const cMat = new THREE.MeshStandardMaterial({ color: 0x2a2f45, roughness: 0.9 });
        for (let i = 0; i < 9; i++) {
            const c = new THREE.Mesh(BOX, cMat);
            c.scale.set(rand(1.2, 2.2), rand(0.6, 1.0), rand(1.0, 1.8));
            c.position.set(rand(-2, 2), rand(-0.2, 0.3), rand(-1.2, 0.6));
            cloud.add(c);
        }
        const zap = new THREE.Mesh(BOX, glowMat(pick(1), 0)); zap.scale.set(4.5, 0.9, 2.5); cloud.add(zap);
        cloud.userData.noFit = true;
        group.add(cloud);
        tick((t, dt, speed) => {
            const lift = dummy.root.position.y;
            for (let s = 0; s < 2; s++) {
                for (let i = 0; i < N; i++) {
                    const k = i / N;
                    const a = k * Math.PI * 4 + t * 3.4 * speed + s * Math.PI;
                    const r = 1.7 + k * 1.1 + Math.sin(t * 2 + i) * 0.08;
                    TMP.p.set(Math.cos(a) * r, 0.2 + k * 6.2 + lift * 0.5, Math.sin(a) * r);
                    TMP.q.setFromEuler(TMP.e.set(0, -a, 0.35));
                    TMP.sc.set(0.05, 0.05, 0.55 + k * 0.4);
                    wind.setMatrixAt(s * N + i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
                }
            }
            wind.instanceMatrix.needsUpdate = true;
            leafD.forEach((d, i) => {
                d.y += dt * d.v * speed; if (d.y > 7.5) d.y = 0;
                const a = d.a + t * 2.6 * speed;
                TMP.p.set(Math.cos(a) * d.r, d.y, Math.sin(a) * d.r);
                TMP.q.setFromEuler(TMP.e.set(t * 3 + i, t * 2, i));
                TMP.sc.set(0.2, 0.03, 0.14);
                leaves.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            });
            leaves.instanceMatrix.needsUpdate = true;
            cloud.position.set(0, 8.2 + lift, -0.6);
            cloud.rotation.y = t * 0.15;
            const f = (t * 0.9) % 2.6;
            zap.material.opacity = f < 0.08 || (f > 0.16 && f < 0.22) ? 0.55 : 0;
        });
    },

    /* 심해의 공병은 — 잠수 헬멧, 올라오는 물방울, 흔들리는 해초, 위에서 내리는 빛줄기, 뒤에서 도는 거대 고래 */
    deepSea({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, rand, TMP } = kit;
        stage.setSky('#020a1a');
        const owned = [];
        const attach = (parent, obj) => { parent.add(obj); owned.push([parent, obj]); };
        stage.onClear(() => owned.forEach(([p, o]) => p.remove(o)));
        // 잠수 헬멧
        const brass = new THREE.MeshStandardMaterial({ color: 0xc8933a, metalness: 0.85, roughness: 0.3 });
        const helmet = new THREE.Group();
        const glass = new THREE.Mesh(BOX, glowMat(pick(1), 0.16)); glass.scale.set(1.7, 1.6, 1.6); helmet.add(glass);
        const collar = new THREE.Mesh(BOX, brass); collar.scale.set(1.8, 0.25, 1.7); collar.position.y = -0.82; helmet.add(collar);
        for (const [w, h, x, y] of [[1.0, 0.1, 0, 0.5], [1.0, 0.1, 0, -0.45], [0.1, 1.0, 0.5, 0], [0.1, 1.0, -0.5, 0]]) {
            const fr = new THREE.Mesh(BOX, brass); fr.scale.set(w, h, 0.08); fr.position.set(x, y, 0.82); helmet.add(fr);
        }
        const topV = new THREE.Mesh(BOX, brass); topV.scale.set(0.4, 0.25, 0.4); topV.position.y = 0.9; helmet.add(topV);
        attach(dummy.head, helmet);
        // 물방울
        const B = 46;
        const bubbles = new THREE.InstancedMesh(BOX, glowMat(pick(1), 0.55), B);
        const bD = Array.from({ length: B }, () => ({ x: rand(-4, 4), z: rand(-4, 2.5), y: rand(0, 10), v: rand(0.6, 1.6), s: rand(0.06, 0.2), ph: rand(0, 6) }));
        group.add(bubbles);
        // 해초
        const kelpMat = solidMat(new THREE.Color('#1f8a5a'), 0.25);
        const kelps = [];
        for (let i = 0; i < 7; i++) {
            const a = -Math.PI * 0.9 + (i / 6) * Math.PI * 0.8 + rand(-0.1, 0.1);
            const r = rand(3.6, 5.2);
            let parent = new THREE.Group();
            parent.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 1);
            parent.userData.noFit = true;
            group.add(parent);
            const segs = [];
            for (let j = 0; j < 9; j++) {
                const seg = new THREE.Group();
                const m = new THREE.Mesh(BOX, kelpMat); m.scale.set(0.32, 0.8, 0.12); m.position.y = 0.4; seg.add(m);
                seg.position.y = j === 0 ? 0 : 0.8;
                parent.add(seg); parent = seg; segs.push(seg);
            }
            kelps.push({ segs, ph: rand(0, 6) });
        }
        // 빛줄기
        const rays = [];
        for (let i = 0; i < 5; i++) {
            const r = new THREE.Mesh(BOX, glowMat(pick(0), 0.04));
            r.scale.set(rand(0.4, 0.9), 16, 0.2);
            r.position.set(rand(-5, 5), 9, rand(-5, -1));
            r.rotation.z = rand(-0.25, 0.25);
            r.userData = { noFit: true, ph: rand(0, 6), x: r.position.x };
            group.add(r); rays.push(r);
        }
        // 고래
        const whale = new THREE.Group();
        const wMat = new THREE.MeshStandardMaterial({ color: 0x1d3a66, roughness: 0.6, emissive: pick(0), emissiveIntensity: 0.08 });
        const belly = new THREE.MeshStandardMaterial({ color: 0x9fb8d8, roughness: 0.7 });
        const body = new THREE.Mesh(BOX, wMat); body.scale.set(2.6, 2.2, 6); whale.add(body);
        const head = new THREE.Mesh(BOX, wMat); head.scale.set(2.4, 2.0, 2.0); head.position.set(0, 0.1, 3.6); whale.add(head);
        const bel = new THREE.Mesh(BOX, belly); bel.scale.set(2.2, 0.4, 7.6); bel.position.set(0, -1.05, 0.8); whale.add(bel);
        const eye = new THREE.Mesh(BOX, glowMat(pick(1), 1)); eye.scale.set(2.5, 0.18, 0.18); eye.position.set(0, 0.4, 3.9); whale.add(eye);
        const tail = new THREE.Group(); tail.position.z = -3;
        const stem = new THREE.Mesh(BOX, wMat); stem.scale.set(1.2, 1.0, 2.4); stem.position.z = -1.2; tail.add(stem);
        const fluke = new THREE.Mesh(BOX, wMat); fluke.scale.set(4.2, 0.25, 1.2); fluke.position.z = -2.6; tail.add(fluke);
        whale.add(tail);
        for (const s of [-1, 1]) { const fin = new THREE.Mesh(BOX, wMat); fin.scale.set(1.8, 0.2, 1.0); fin.position.set(s * 2.0, -0.6, 1.6); fin.rotation.z = s * -0.4; whale.add(fin); }
        whale.userData.noFit = true;
        whale.scale.setScalar(0.9);
        group.add(whale);
        sig.swimK = 0;
        tick((t, dt) => {
            bD.forEach((d, i) => {
                d.y += dt * d.v; if (d.y > 10) { d.y = 0; d.x = rand(-4, 4); }
                TMP.p.set(d.x + Math.sin(t * 2 + d.ph) * 0.2, d.y, d.z);
                TMP.q.setFromEuler(TMP.e.set(t + i, t * 0.7, 0));
                TMP.sc.setScalar(d.s);
                bubbles.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            });
            bubbles.instanceMatrix.needsUpdate = true;
            kelps.forEach(k => k.segs.forEach((s, j) => { s.rotation.z = Math.sin(t * 1.1 + k.ph + j * 0.5) * 0.12; s.rotation.x = Math.sin(t * 0.8 + k.ph + j * 0.4) * 0.06; }));
            rays.forEach(r => { r.position.x = r.userData.x + Math.sin(t * 0.3 + r.userData.ph) * 0.8; r.material.opacity = 0.025 + 0.025 * Math.sin(t * 0.7 + r.userData.ph); });
            const a = t * 0.22;
            whale.position.set(Math.cos(a) * 10, 6.5 + Math.sin(t * 0.5) * 0.6, Math.sin(a) * 6 - 11);
            whale.rotation.y = -a + Math.PI;   // 진행 방향을 봄
            whale.rotation.z = Math.sin(t * 0.5) * 0.08;
            tail.rotation.x = Math.sin(t * 1.6) * 0.35;
            sig.swimK = Math.sin(t * 1.4);
        });
    },

    /* 멸종의 김민채 — 뒤에 서 있는 거대한 공룡 화석, 쏟아지는 유성, 재와 불씨, 바닥의 용암 균열 */
    extinction({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, square, rand, TMP } = kit;
        stage.setSky('#160502');
        // 공룡 화석
        const bone = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.85, emissive: pick(0), emissiveIntensity: 0.06 });
        const fossil = new THREE.Group();
        const spine = [];
        for (let i = 0; i < 16; i++) {
            const k = i / 15;
            const v = new THREE.Mesh(BOX, bone);
            const x = -7 + k * 13, y = 6.2 + Math.sin(k * Math.PI * 0.9 + 0.3) * 1.6 - (k > 0.75 ? (k - 0.75) * 6 : 0);
            v.scale.set(0.55, 0.5, 0.5); v.position.set(x, y, 0); v.rotation.z = (i % 2) * 0.2;
            fossil.add(v); spine.push(v);
            if (i > 3 && i < 11) {
                for (const s of [-1, 1]) {
                    const rib = new THREE.Mesh(BOX, bone); rib.scale.set(0.16, 2.2 - Math.abs(i - 7) * 0.2, 0.16);
                    rib.position.set(x, y - 1.1, s * 0.6); rib.rotation.x = s * 0.35; fossil.add(rib);
                }
            }
        }
        // 머리뼈 + 턱
        const skull = new THREE.Group(); skull.position.set(6.6, 4.2, 0);
        const cran = new THREE.Mesh(BOX, bone); cran.scale.set(2.6, 1.3, 1.3); skull.add(cran);
        const socket = new THREE.Mesh(BOX, glowMat(pick(0), 1)); socket.scale.set(0.35, 0.35, 1.35); socket.position.set(-0.4, 0.25, 0); skull.add(socket);
        const jaw = new THREE.Group(); jaw.position.set(-1.0, -0.6, 0);
        const jm = new THREE.Mesh(BOX, bone); jm.scale.set(2.5, 0.4, 1.1); jm.position.x = 1.25; jaw.add(jm);
        for (let i = 0; i < 6; i++) { const tth = new THREE.Mesh(BOX, bone); tth.scale.set(0.12, 0.3, 0.12); tth.position.set(0.4 + i * 0.38, 0.3, 0.4); jaw.add(tth); const t2 = tth.clone(); t2.position.z = -0.4; jaw.add(t2); }
        skull.add(jaw);
        fossil.add(skull);
        // 다리뼈
        for (const [x, z] of [[-2.5, 0.5], [-2.0, -0.5], [2.6, 0.5], [3.1, -0.5]]) {
            const th = new THREE.Mesh(BOX, bone); th.scale.set(0.4, 3.0, 0.4); th.position.set(x, 3.3, z); th.rotation.z = 0.25; fossil.add(th);
            const sh = new THREE.Mesh(BOX, bone); sh.scale.set(0.32, 2.4, 0.32); sh.position.set(x + 0.2, 1.2, z); sh.rotation.z = -0.3; fossil.add(sh);
            const ft = new THREE.Mesh(BOX, bone); ft.scale.set(1.0, 0.25, 0.5); ft.position.set(x + 0.6, 0.12, z); fossil.add(ft);
        }
        fossil.position.set(-0.5, 0, -7.5);
        fossil.rotation.y = 0.12;
        fossil.userData.noFit = true;
        group.add(fossil);

        // 유성
        const M = 5;
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x3a1a0e, emissive: pick(0), emissiveIntensity: 0.9, roughness: 0.8 });
        const TRAIL = 10;
        const trail = new THREE.InstancedMesh(BOX, glowMat(pick(1), 0.85), M * TRAIL);
        trail.userData.noFit = true;
        group.add(trail);
        const rings = [];
        const meteors = Array.from({ length: M }, (_, i) => {
            const m = new THREE.Mesh(BOX, rockMat); m.userData.noFit = true; group.add(m);
            const r = square(1, 0.08, glowMat(pick(0), 0)); r.userData.noFit = true; r.visible = false; group.add(r); rings.push(r);
            return { m, r, from: new THREE.Vector3(), to: new THREE.Vector3(), k: 1, dur: 1, s: 1, wait: i * 0.9 + rand(0, 0.5), rk: 1, big: false };
        });
        function launch(me, big) {
            me.big = big;
            me.to.set(big ? rand(-2, 2) : rand(-7, 7), 0, big ? rand(-6, -4) : rand(-9, -2));
            me.from.set(me.to.x + rand(8, 13), rand(18, 24), me.to.z + rand(-3, 1));
            me.k = 0; me.dur = big ? 1.4 : rand(0.8, 1.2); me.s = big ? 1.3 : rand(0.35, 0.65);
        }
        // 재와 불씨
        const ASH = 60;
        const ash = new THREE.InstancedMesh(BOX, glowMat(pick(1), 0.7), ASH);
        const ashD = Array.from({ length: ASH }, () => ({ x: rand(-6, 6), y: rand(0, 11), z: rand(-6, 3), v: rand(0.3, 0.8), ph: rand(0, 6) }));
        group.add(ash);
        // 용암 균열
        const cracks = [];
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2 + rand(-0.2, 0.2), len = rand(1.4, 3.4);
            const c = new THREE.Mesh(BOX, glowMat(pick(0), 0.8));
            c.scale.set(len, 0.03, 0.1); c.position.set(Math.cos(a) * (len / 2 + 1.0), 0.03, Math.sin(a) * (len / 2 + 1.0)); c.rotation.y = -a;
            c.userData.noFit = true; c.userData.ph = rand(0, 6);
            group.add(c); cracks.push(c);
        }
        const glowL = new THREE.PointLight(pick(0), 6, 14, 1.5); glowL.userData.own = true; glowL.position.set(0, 1, 1.5); group.add(glowL);
        const BIG = 5.0;
        let bigN = -1;
        sig.callK = 0;
        tick((t, dt) => {
            // 5초마다 큰 유성 하나를 불러 내림 (포즈: 팔을 들었다가 내려찍음)
            const c = t % BIG, n = Math.floor(t / BIG);
            sig.callK = c < 1.2 ? Math.sin((c / 1.2) * Math.PI * 0.5) : c < 2.6 ? 1 - (c - 1.2) / 1.4 : 0;
            if (n !== bigN && c > 1.0) { bigN = n; launch(meteors[0], true); }
            meteors.forEach((me, i) => {
                if (me.k >= 1) {
                    if (i > 0) { me.wait -= dt; if (me.wait <= 0) { launch(me, false); me.wait = rand(0.6, 1.8); } }
                    me.m.visible = false;
                } else {
                    me.k = Math.min(1, me.k + dt / me.dur);
                    const e = me.k * me.k;
                    me.m.visible = true;
                    me.m.position.lerpVectors(me.from, me.to, e);
                    me.m.scale.setScalar(me.s);
                    me.m.rotation.set(t * 3 + i, t * 2, 0);
                    if (me.k >= 1) {
                        me.rk = 0; me.r.position.copy(me.to); me.r.position.y = 0.06;
                        if (me.big) { stage.shake(0.45); stage.flash(0.5); }
                    }
                }
                for (let j = 0; j < TRAIL; j++) {
                    const on = me.k < 1;
                    const q = Math.max(0, me.k * me.k - j * 0.025);
                    TMP.p.lerpVectors(me.from, me.to, q);
                    TMP.q.setFromEuler(TMP.e.set(t * 4 + j, t * 3, j));
                    TMP.sc.setScalar(on ? me.s * (1 - j / TRAIL) * 0.9 : 0.0001);
                    trail.setMatrixAt(i * TRAIL + j, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
                }
                if (me.rk < 1) {
                    me.rk = Math.min(1, me.rk + dt * 1.5);
                    me.r.visible = true;
                    me.r.scale.setScalar((me.big ? 1.5 : 0.6) + me.rk * (me.big ? 9 : 3.5));
                    me.r.children.forEach(ch => { ch.material.opacity = 1 - me.rk; });
                } else me.r.visible = false;
            });
            trail.instanceMatrix.needsUpdate = true;
            ashD.forEach((d, i) => {
                d.y -= dt * d.v; if (d.y < 0) d.y = 11;
                TMP.p.set(d.x + Math.sin(t * 0.7 + d.ph) * 0.6, d.y, d.z);
                TMP.q.setFromEuler(TMP.e.set(t + i, t * 1.3, 0));
                TMP.sc.setScalar(i % 4 ? 0.05 : 0.09);
                ash.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            });
            ash.instanceMatrix.needsUpdate = true;
            cracks.forEach(cr => { cr.material.opacity = 0.45 + 0.4 * Math.sin(t * 2 + cr.userData.ph); });
            jaw.rotation.z = -0.15 - Math.max(0, Math.sin(t * 0.8)) * 0.35;
            socket.material.opacity = 0.6 + 0.4 * Math.sin(t * 3);
            glowL.intensity = 5 + Math.sin(t * 2.3) * 1.5;
        });
    },

    /* 마지막 기관사 김건우 — 뒤에서 하늘로 감아 올라가는 나선 철로 위를 달리는 거대한 증기기관차,
       기관사 모자와 랜턴, 발밑 승강장, 6초마다 기적 소리와 함께 증기 폭발 */
    lastConductor({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, rand, TMP } = kit;
        stage.setSky('#07050c');
        const owned = [];
        const attach = (parent, obj) => { parent.add(obj); owned.push([parent, obj]); };
        stage.onClear(() => owned.forEach(([p, o]) => p.remove(o)));
        const gold = solidMat(new THREE.Color('#ffcc55'), 0.45);
        const navy = new THREE.MeshStandardMaterial({ color: 0x1a2140, roughness: 0.5 });

        // 기관사 모자
        const cap = new THREE.Group();
        const crown = new THREE.Mesh(BOX, navy); crown.scale.set(1.36, 0.42, 1.36); crown.position.y = 0.8; cap.add(crown);
        const top = new THREE.Mesh(BOX, navy); top.scale.set(1.5, 0.12, 1.5); top.position.y = 1.04; cap.add(top);
        const band = new THREE.Mesh(BOX, gold); band.scale.set(1.38, 0.1, 1.38); band.position.y = 0.64; cap.add(band);
        const brim = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x0b0d16, roughness: 0.3 })); brim.scale.set(1.1, 0.07, 0.55); brim.position.set(0, 0.6, 0.85); cap.add(brim);
        const badge = new THREE.Mesh(BOX, glowMat(pick(0), 1)); badge.scale.set(0.24, 0.22, 0.06); badge.position.set(0, 0.85, 0.7); cap.add(badge);
        attach(dummy.head, cap);
        // 랜턴 (캐릭터 왼손)
        const lantern = new THREE.Group(); lantern.position.y = -2.0;
        const handle = new THREE.Mesh(BOX, gold); handle.scale.set(0.08, 0.35, 0.08); handle.position.y = -0.15; lantern.add(handle);
        const frameL = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x2a2a30, metalness: 0.7, roughness: 0.3 })); frameL.scale.set(0.5, 0.1, 0.5); frameL.position.y = -0.35; lantern.add(frameL);
        const flame = new THREE.Mesh(BOX, glowMat(pick(0), 1)); flame.scale.set(0.36, 0.5, 0.36); flame.position.y = -0.65; lantern.add(flame);
        const base = frameL.clone(); base.position.y = -0.95; lantern.add(base);
        attach(dummy.armR, lantern);

        // 승강장
        const platform = new THREE.Group();
        const slab = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x2b2a33, roughness: 0.8 })); slab.scale.set(6.5, 0.3, 3.4); slab.position.y = 0.15; platform.add(slab);
        const edge = new THREE.Mesh(BOX, glowMat(new THREE.Color('#ffd23f'), 0.9)); edge.scale.set(6.5, 0.04, 0.2); edge.position.set(0, 0.32, 1.55); platform.add(edge);
        for (const s of [-1, 1]) {
            const post = new THREE.Mesh(BOX, navy); post.scale.set(0.16, 4.2, 0.16); post.position.set(s * 2.9, 2.3, -1.2); platform.add(post);
            const arm = new THREE.Mesh(BOX, navy); arm.scale.set(0.7, 0.12, 0.12); arm.position.set(s * 2.65, 4.35, -1.2); platform.add(arm);
            const lamp = new THREE.Mesh(BOX, glowMat(pick(2), 1)); lamp.scale.set(0.34, 0.3, 0.34); lamp.position.set(s * 2.4, 4.15, -1.2); platform.add(lamp);
        }
        group.add(platform);

        // 나선 철로 (캐릭터 뒤에서 하늘로)
        const CX = 0, CZ = -15, R = 8, PITCH = 0.62, TURNS = 3.2, Y0 = 0.3;
        const L = Math.sqrt(R * R + PITCH * PITCH);
        const TOTAL = TURNS * Math.PI * 2 * L;
        const at = (s, out) => { const a = s / L - Math.PI / 2; return out.set(CX + Math.cos(a) * R, Y0 + (s / L) * PITCH, CZ + Math.sin(a) * R); };
        const track = new THREE.Group(); track.userData.noFit = true; group.add(track);
        const NT = Math.floor(TOTAL / 0.9);
        const ties = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.9 }), NT);
        const rails = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ color: 0xb8bcc8, metalness: 0.85, roughness: 0.25, emissive: pick(0), emissiveIntensity: 0.12 }), NT * 2);
        const p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), side = new THREE.Vector3(), fwd = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), m3 = new THREE.Matrix4();
        const frameAt = (s, pos, quat) => {
            at(s, pos); at(s + 0.3, p2);
            fwd.subVectors(p2, pos).normalize();
            side.crossVectors(Y, fwd).normalize();
            const up = TMP.v.crossVectors(fwd, side).normalize();
            m3.makeBasis(side, up, fwd);
            quat.setFromRotationMatrix(m3);
        };
        const q0 = new THREE.Quaternion();
        for (let i = 0; i < NT; i++) {
            const s = i * 0.9;
            frameAt(s, p1, q0);
            ties.setMatrixAt(i, TMP.m4.compose(p1, q0, TMP.sc.set(2.6, 0.18, 0.45)));
            for (const k of [0, 1]) {
                TMP.p.copy(p1).addScaledVector(side, k ? 0.85 : -0.85).addScaledVector(TMP.v.set(0, 1, 0), 0.16);
                rails.setMatrixAt(i * 2 + k, TMP.m4.compose(TMP.p, q0, TMP.sc.set(0.14, 0.16, 0.95)));
            }
        }
        track.add(ties, rails);
        // 받침 기둥 (첫 바퀴만, 바닥까지)
        const pierMat = new THREE.MeshStandardMaterial({ color: 0x25222c, roughness: 0.7 });
        for (let s = 6; s < TOTAL * 0.62; s += 7) {
            at(s, p1);
            const pier = new THREE.Mesh(BOX, pierMat); pier.scale.set(0.5, p1.y, 0.5); pier.position.set(p1.x, p1.y / 2 - 0.1, p1.z);
            track.add(pier);
        }
        // 위아래 차고 문 (열차가 여기서 나오고 들어감)
        const gate = s => {
            const g = new THREE.Group();
            frameAt(s, p1, q0); g.position.copy(p1); g.quaternion.copy(q0);
            for (const [w, h, x, y] of [[3.6, 0.25, 0, 3.7], [0.25, 3.8, 1.75, 1.9], [0.25, 3.8, -1.75, 1.9]]) {
                const b = new THREE.Mesh(BOX, glowMat(pick(0), 1)); b.scale.set(w, h, 0.25); b.position.set(x, y, 0); g.add(b);
            }
            const veil = new THREE.Mesh(BOX, glowMat(pick(2), 0.35)); veil.scale.set(3.3, 3.5, 0.05); veil.position.y = 1.85; g.add(veil);
            track.add(g);
            return g;
        };
        gate(0.2); const topGate = gate(TOTAL - 0.2);

        // 열차
        const loco = buildLocomotive(kit, pick);
        const cars = [{ g: loco.g, off: 0, len: 5.2 }];
        const tender = buildTender(kit); cars.push({ g: tender, off: 5.2 / 2 + 2.9 / 2 + 0.3, len: 2.9 });
        let off = cars[1].off + 2.9 / 2;
        for (let i = 0; i < 4; i++) {
            const c = buildCoach(kit, pick, i);
            off += 0.35 + 4.2 / 2;
            cars.push({ g: c.g, off, len: 4.2, wheels: c.wheels });
            off += 4.2 / 2;
        }
        const TRAIN = off + 1;
        const trainG = new THREE.Group(); trainG.userData.noFit = true; group.add(trainG);
        cars.forEach(c => trainG.add(c.g));
        // 증기
        const PUFF = 34;
        const puffs = new THREE.InstancedMesh(BOX, glowMat(new THREE.Color('#aab0c0'), 0.2), PUFF);
        puffs.userData.noFit = true; group.add(puffs);
        const puffD = Array.from({ length: PUFF }, () => ({ p: new THREE.Vector3(0, -50, 0), v: new THREE.Vector3(), age: 9, life: 1.6 }));
        let puffI = 0, puffAcc = 0;
        const emit = (pos, n, big) => {
            for (let i = 0; i < n; i++) {
                const d = puffD[puffI++ % PUFF];
                d.p.copy(pos); d.v.set(rand(-0.6, 0.6), rand(1.6, 2.8) * (big ? 1.6 : 1), rand(-0.6, 0.6)); d.age = 0; d.life = big ? 2.4 : rand(1.2, 1.8);
            }
        };
        const chimneyW = new THREE.Vector3();
        const SPEED = 6.5;
        const WHISTLE = 6;
        let whistleN = -1;
        sig.whistleK = 0;
        tick((t, dt, speed) => {
            const head = (t * SPEED) % (TOTAL + TRAIN + 6) - 2;
            cars.forEach((c, i) => {
                const s = head - c.off;
                const vis = s > 0.6 && s < TOTAL - 0.6;
                c.g.visible = vis;
                if (!vis) return;
                frameAt(s, c.g.position, c.g.quaternion);
                c.g.position.addScaledVector(TMP.v.set(0, 1, 0), 0.25);
            });
            loco.wheels.forEach(w => { w.rotation.x = -t * SPEED / 0.6; });
            const ang = -t * SPEED / 0.6;
            loco.rods.forEach((r, k) => { r.position.y = r.userData.y + Math.sin(ang) * 0.3; r.position.z = r.userData.z + Math.cos(ang) * 0.3; });
            cars.forEach(c => c.wheels?.forEach(w => { w.rotation.x = ang * 1.4; }));
            // 증기
            puffAcc += dt;
            if (loco.g.visible && puffAcc > 0.08) {
                puffAcc = 0;
                loco.chimney.getWorldPosition(chimneyW);
                group.worldToLocal(chimneyW);
                emit(chimneyW, 1, false);
            }
            const c6 = t % WHISTLE, wn = Math.floor(t / WHISTLE);
            sig.whistleK = c6 < 1.6 ? Math.sin((c6 / 1.6) * Math.PI) : 0;
            if (wn !== whistleN && c6 > 0.3) {
                whistleN = wn;
                if (loco.g.visible) { loco.chimney.getWorldPosition(chimneyW); group.worldToLocal(chimneyW); emit(chimneyW, 10, true); }
                stage.shake(0.12);
            }
            puffD.forEach((d, i) => {
                d.age += dt;
                const k = d.age / d.life;
                if (k >= 1) { TMP.sc.setScalar(0.0001); TMP.p.set(0, -50, 0); }
                else {
                    d.p.addScaledVector(d.v, dt);
                    d.v.multiplyScalar(Math.pow(0.5, dt));
                    TMP.p.copy(d.p);
                    TMP.sc.setScalar(0.35 + k * 1.2);
                }
                TMP.q.setFromEuler(TMP.e.set(i, d.age, i * 0.5));
                puffs.setMatrixAt(i, TMP.m4.compose(TMP.p, TMP.q, TMP.sc));
            });
            puffs.instanceMatrix.needsUpdate = true;
            loco.headlight.material.opacity = 0.85 + Math.sin(t * 20) * 0.1;
            flame.scale.set(0.36, 0.5 + Math.sin(t * 13) * 0.05, 0.36);
            topGate.children[3].material.opacity = 0.3 + 0.15 * Math.sin(t * 3);
        });
    }
};

/* ---------- 열차 블록 모형 (나선 철로, 컷씬에서 같이 씀). 앞이 +z ---------- */
export function buildLocomotive(kit, pick) {
    const { THREE, BOX, glowMat, solidMat } = kit;
    const g = new THREE.Group();
    const iron = new THREE.MeshStandardMaterial({ color: 0x16171c, metalness: 0.6, roughness: 0.4 });
    const body = new THREE.MeshStandardMaterial({ color: 0x1b2448, metalness: 0.45, roughness: 0.35 });
    const red = new THREE.MeshStandardMaterial({ color: 0xa31c1c, metalness: 0.3, roughness: 0.4, emissive: 0x3a0505, emissiveIntensity: 0.6 });
    const gold = solidMat(new THREE.Color('#ffcc55'), 0.35);
    const add = (mat, w, h, d, x, y, z) => { const m = new THREE.Mesh(BOX, mat); m.scale.set(w, h, d); m.position.set(x, y, z); g.add(m); return m; };
    add(iron, 2.0, 0.45, 5.2, 0, 0.95, 0);          // 차대
    add(body, 1.7, 1.7, 3.3, 0, 2.05, 0.75);        // 보일러
    for (const z of [-0.3, 0.6, 1.5, 2.2]) add(gold, 1.74, 1.74, 0.1, 0, 2.05, z);
    add(iron, 1.8, 1.8, 0.6, 0, 2.05, 2.55);        // 연기실
    add(gold, 0.9, 0.9, 0.06, 0, 2.05, 2.88);       // 문 테두리
    add(iron, 0.7, 0.7, 0.08, 0, 2.05, 2.9);
    const headlight = add(glowMat(new THREE.Color('#fff3c0'), 0.9), 0.55, 0.45, 0.2, 0, 3.15, 2.75);
    const beam = add(glowMat(new THREE.Color('#fff3c0'), 0.05), 0.9, 0.7, 6, 0, 3.15, 5.8); beam.userData.noFit = true;
    const chimney = add(iron, 0.55, 1.1, 0.55, 0, 3.4, 1.95);
    add(iron, 0.85, 0.22, 0.85, 0, 4.0, 1.95);
    add(gold, 0.65, 0.5, 0.65, 0, 3.1, 0.6);        // 증기 돔
    add(body, 2.1, 2.3, 1.7, 0, 2.35, -1.75);        // 기관실
    add(iron, 2.4, 0.2, 2.0, 0, 3.55, -1.75);       // 지붕
    for (const s of [-1, 1]) add(glowMat(pick(0), 0.9), 0.06, 0.7, 0.9, s * 1.06, 2.8, -1.75);   // 창문
    for (let i = 0; i < 4; i++) { const w = add(red, 0.36, 0.5, 0.14, -0.6 + i * 0.4, 0.55, 2.75); w.rotation.x = -0.5; }   // 배장기
    add(red, 2.06, 0.12, 5.2, 0, 1.22, 0);          // 빨간 띠
    const wheels = [], rods = [];
    for (const s of [-1, 1]) {
        for (const z of [1.3, 0, -1.3]) {
            const w = new THREE.Group(); w.position.set(s * 1.05, 0.62, z);
            const a = new THREE.Mesh(BOX, red); a.scale.set(0.16, 1.2, 1.2);
            const b = new THREE.Mesh(BOX, red); b.scale.set(0.16, 1.2, 1.2); b.rotation.x = Math.PI / 4;
            const hub = new THREE.Mesh(BOX, gold); hub.scale.set(0.2, 0.3, 0.3);
            w.add(a, b, hub); g.add(w); wheels.push(w);
        }
        const rod = add(gold, 0.08, 0.12, 2.8, s * 1.2, 0.62, 0); rod.userData.y = 0.62; rod.userData.z = 0; rods.push(rod);
    }
    return { g, wheels, rods, chimney, headlight };
}
function buildTender(kit) {
    const { THREE, BOX } = kit;
    const g = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: 0x1b2448, metalness: 0.45, roughness: 0.35 });
    const coal = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 1 });
    const m = new THREE.Mesh(BOX, body); m.scale.set(2.0, 1.7, 2.9); m.position.y = 1.65; g.add(m);
    for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(BOX, coal); c.scale.setScalar(0.5); c.position.set(-0.6 + (i % 3) * 0.6, 2.6, -0.6 + Math.floor(i / 3) * 1.1); c.rotation.set(i, i * 2, 0); g.add(c); }
    const base = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x16171c })); base.scale.set(2.0, 0.4, 2.9); base.position.y = 0.6; g.add(base);
    return g;
}
function buildCoach(kit, pick, n) {
    const { THREE, BOX, glowMat, solidMat } = kit;
    const g = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: n % 2 ? 0x6e1020 : 0x7d1426, metalness: 0.3, roughness: 0.4 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x14151b, roughness: 0.5 });
    const gold = solidMat(new THREE.Color('#ffcc55'), 0.35);
    const add = (mat, w, h, d, x, y, z) => { const m = new THREE.Mesh(BOX, mat); m.scale.set(w, h, d); m.position.set(x, y, z); g.add(m); return m; };
    add(body, 2.0, 2.1, 4.2, 0, 2.0, 0);
    add(dark, 2.2, 0.25, 4.3, 0, 3.15, 0);
    add(gold, 2.04, 0.1, 4.22, 0, 1.25, 0);
    const win = glowMat(pick(2), 0.9);
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) add(win, 0.05, 0.6, 0.62, s * 1.02, 2.3, -1.4 + i * 0.93);
    const wheels = [];
    for (const s of [-1, 1]) for (const z of [-1.4, 1.4]) {
        const w = new THREE.Group(); w.position.set(s * 0.9, 0.55, z);
        const a = new THREE.Mesh(BOX, dark); a.scale.set(0.14, 0.8, 0.8);
        const b = a.clone(); b.rotation.x = Math.PI / 4;
        w.add(a, b); g.add(w); wheels.push(w);
    }
    add(dark, 1.9, 0.35, 4.0, 0, 0.85, 0);
    return { g, wheels };
}
