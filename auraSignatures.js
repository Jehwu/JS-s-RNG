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

    /* 번개의 좌 박지성 (제우스) — 수염, 월계관, 손에 든 번개, 대리석 기둥과 왕좌, 내던지는 낙뢰 */
    thunderThrone({ group, tick, pick, dummy, kit, stage, sig }) {
        const { THREE, BOX, glowMat, solidMat, square, rand, bolt, TMP } = kit;
        stage.setSky('#03070e');
        stage.setSkin({ color: '#d9e2ee', eye: '#7af7ff', glowEyes: true, smile: false, emissive: 0.04 });
        const owned = [];   // 캐릭터 몸에 붙인 것들 (아우라 바뀌면 떼어냄)
        const attach = (parent, obj) => { parent.add(obj); owned.push([parent, obj]); };
        stage.onClear(() => owned.forEach(([p, o]) => p.remove(o)));

        // 흰 수염 + 콧수염
        const beardMat = solidMat(new THREE.Color('#f4f7ff'), 0.25);
        for (const [w, h, d, x, y, z] of [[1.15, 0.5, 0.3, 0, -0.42, 0.55], [0.8, 0.45, 0.28, 0, -0.85, 0.52], [0.42, 0.35, 0.26, 0, -1.18, 0.48], [0.75, 0.12, 0.12, 0, -0.08, 0.64]]) {
            const b = new THREE.Mesh(BOX, beardMat); b.scale.set(w, h, d); b.position.set(x, y, z);
            attach(dummy.head, b);
        }
        // 금빛 월계관
        const goldMat = solidMat(new THREE.Color('#ffd34d'), 0.9);
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            if (Math.abs(Math.sin(a)) < 0.2 && Math.cos(a) > 0) continue;   // 앞 이마 쪽 비움
            const leaf = new THREE.Mesh(BOX, goldMat);
            leaf.scale.set(0.24, 0.1, 0.12);
            leaf.position.set(Math.sin(a) * 0.72, 0.5, Math.cos(a) * 0.68);
            leaf.rotation.set(0.5, a, 0.4);
            attach(dummy.head, leaf);
        }
        // 손에 든 번개 (지그재그 블록)
        const handBolt = new THREE.Group();
        const pts = [[0, 0], [0.25, -0.6], [-0.1, -0.75], [0.3, -1.5], [0.05, -1.6], [0.35, -2.5]];
        const hbMat = glowMat(new THREE.Color('#e8fdff'), 1);
        for (let i = 0; i < pts.length - 1; i++) {
            const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            const seg = new THREE.Mesh(BOX, hbMat);
            const len = Math.hypot(x2 - x1, y2 - y1);
            seg.scale.set(0.16, len + 0.08, 0.16);
            seg.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0);
            seg.rotation.z = Math.atan2(x2 - x1, -(y2 - y1)) * -1;
            handBolt.add(seg);
        }
        const hbGlow = new THREE.Mesh(BOX, glowMat(pick(0), 0.18));
        hbGlow.scale.set(0.42, 2.6, 0.3); hbGlow.position.set(0.15, -1.25, 0);
        handBolt.add(hbGlow);
        handBolt.position.set(-0.1, -1.75, 0);   // 손 끝에서 팔 방향으로 뻗음
        attach(dummy.armR, handBolt);
        const tip = new THREE.Object3D(); tip.position.set(0.35, -2.5, 0); handBolt.add(tip);

        // 대리석 기둥 2개 + 대리석 왕좌
        const marble = new THREE.MeshStandardMaterial({ color: 0xe9ecf2, roughness: 0.45, metalness: 0.05 });
        const flute = new THREE.MeshStandardMaterial({ color: 0xbfc5d2, roughness: 0.5 });
        for (const x of [-3.5, 3.5]) {
            const col = new THREE.Group();
            for (const [w, h, d, y, m] of [[1.5, 0.35, 1.5, 0.18, marble], [1.05, 6.4, 1.05, 3.55, marble], [1.6, 0.3, 1.6, 6.9, marble], [1.8, 0.28, 1.8, 7.2, goldMat]]) {
                const b = new THREE.Mesh(BOX, m); b.scale.set(w, h, d); b.position.y = y; col.add(b);
            }
            for (const [fx, fz] of [[0.53, 0], [-0.53, 0], [0, 0.53], [0, -0.53]]) {
                const f = new THREE.Mesh(BOX, flute); f.scale.set(fx ? 0.06 : 0.3, 6.2, fz ? 0.06 : 0.3); f.position.set(fx, 3.55, fz); col.add(f);
            }
            col.position.set(x, 0, -1.6);
            group.add(col);
        }
        const throne = new THREE.Group();
        const edgeMat = new THREE.LineBasicMaterial({ color: new THREE.Color('#ffd34d'), toneMapped: false });
        for (const [x, y, z, w, h, d] of [[0, 4.4, -2.4, 3.2, 7, 0.5], [-2.0, 1.4, -1.6, 0.6, 1.4, 1.6], [2.0, 1.4, -1.6, 0.6, 1.4, 1.6], [0, 0.5, -1.8, 3.6, 1.0, 1.0], [0, 8.3, -2.4, 1.4, 0.8, 0.5]]) {
            const b = new THREE.Mesh(BOX, marble); b.scale.set(w, h, d); b.position.set(x, y, z);
            const e = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), edgeMat); e.scale.copy(b.scale); e.position.copy(b.position);
            throne.add(b, e);
        }
        group.add(throne);

        // 먹구름 + 안에서 번쩍
        const cloud = new THREE.Group();
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0x1a1f33, roughness: 0.9, emissive: pick(0), emissiveIntensity: 0 });
        for (let k = 0; k < 16; k++) {
            const c = new THREE.Mesh(BOX, cloudMat);
            c.scale.set(rand(1.4, 2.8), rand(0.5, 1), rand(1.2, 2.4));
            c.position.set(rand(-4.2, 4.2), rand(-0.3, 0.4), rand(-3, 0.4));
            cloud.add(c);
        }
        cloud.position.y = 11.5; cloud.userData.noFit = true;
        group.add(cloud);

        // 던지는 낙뢰
        const strike = bolt(10, glowMat(new THREE.Color('#ffffff'), 1)); strike.userData.noFit = true; group.add(strike);
        const strikeGlow = bolt(10, glowMat(pick(0), 0.6)); strikeGlow.userData.noFit = true; group.add(strikeGlow);
        strikeGlow.children.forEach(c => c.scale.x = 0.25);
        const ring = square(1, 0.07, glowMat(pick(0), 1)); ring.userData.noFit = true; group.add(ring);
        const flash = new THREE.PointLight(pick(0), 0, 14, 1.3); flash.userData.own = true; group.add(flash);
        const scorch = Array.from({ length: 4 }, () => { const sc = new THREE.Mesh(BOX, glowMat(pick(0), 0)); sc.scale.set(0.96, 0.03, 0.96); sc.userData.noFit = true; group.add(sc); return sc; });
        // 몸에 튀는 전기
        const arcs = [0, 1, 2].map(() => { const a = bolt(3, glowMat(pick(0), 1)); group.add(a); return a; });
        const bodyPts = [[0, 4.8, 0.5], [-1.5, 2.3, 0.4], [0, 3, 0.55], [-0.5, 0.4, 0.5], [0.5, 0.4, 0.5]];

        let life = 0, scorchI = 0, cloudFlash = 0, arcNext = 0, thrown = -1;
        const tipW = new THREE.Vector3(), hit = new THREE.Vector3();
        sig.throwK = 0;
        tick((t, dt) => {
            // 2.6초마다 던짐: 0~0.25초 동안 팔을 앞으로 휘두름
            const cyc = t % 2.6;
            sig.throwK = cyc < 0.25 ? Math.sin((cyc / 0.25) * Math.PI / 2) : cyc < 0.5 ? 1 - (cyc - 0.25) / 0.25 : 0;
            const n = Math.floor(t / 2.6);
            handBolt.visible = !(cyc > 0.12 && cyc < 0.8);   // 던진 동안 손에서 사라짐
            hbGlow.material.opacity = 0.12 + Math.random() * 0.12;
            if (n !== thrown && cyc > 0.12) {
                thrown = n;
                tip.getWorldPosition(tipW);
                group.worldToLocal(tipW);
                hit.set(rand(-3, 3), 0, rand(1.5, 3.5));
                strike.reshape([tipW.x, tipW.y, tipW.z], [hit.x, 0, hit.z], 0.7);
                strikeGlow.reshape([tipW.x, tipW.y, tipW.z], [hit.x, 0, hit.z], 0.7);
                strikeGlow.children.forEach(c => { c.scale.x = c.scale.z = 0.35; });
                ring.position.set(hit.x, 0.08, hit.z);
                flash.position.set(hit.x, 1.5, hit.z);
                const sc = scorch[scorchI++ % scorch.length];
                sc.position.set(Math.round(hit.x / 1.02) * 1.02, 0.02, Math.round(hit.z / 1.02) * 1.02);
                sc.material.opacity = 1;
                life = 1; cloudFlash = 1;
            }
            life = Math.max(0, life - dt * 2.8);
            strike.visible = strikeGlow.visible = life > 0.5 && Math.random() > 0.12;
            ring.visible = life > 0;
            ring.scale.setScalar(0.4 + (1 - life) * 4.5);
            ring.children.forEach(c => { c.material.opacity = life; });
            flash.intensity = life * 22;
            scorch.forEach(sc => { sc.material.opacity *= Math.pow(0.35, dt); });

            cloudFlash *= Math.pow(0.02, dt);
            cloudMat.emissiveIntensity = cloudFlash * 2.2 + (Math.random() < 0.03 ? 1 : 0);
            cloud.rotation.y = t * 0.05;
            edgeMat.color.setRGB(1, 0.83 + Math.random() * 0.17, 0.3);

            if (t > arcNext) {
                arcNext = t + rand(0.05, 0.2);
                const lift = dummy.root.position.y;
                arcs.forEach(a => {
                    a.visible = Math.random() < 0.6;
                    const p = bodyPts[Math.floor(rand(0, bodyPts.length))], q = bodyPts[Math.floor(rand(0, bodyPts.length))];
                    a.reshape([p[0], p[1] + lift, p[2]], [q[0] + rand(-0.4, 0.4), q[1] + lift, q[2]], 0.35);
                });
            }
        });
    }
};
