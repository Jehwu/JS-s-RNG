/* =========================================================
   🎬 3D 컷씬 (cutscene3d.js)

   솔스 RNG 흐름을 따름:
     암전 → 가운데에서 별(박스 빔)이 생겨 점점 빠르게 돌며 커짐
     → 빛 조각이 사방에서 빨려 들어오고, 바닥에서 빛기둥이 솟음
     → 터지기 직전 한 점으로 수축 → 하얀 섬광(+화면 깨짐) → 캐릭터와 아우라 공개
   등급마다 별 모양이 다르고 (MYTHIC 네모별 / ANCIENT 팔각별 / ABSOLUTE 겹팔각 / JXS 깨진 별),
   칭호마다 motif 로 개성을 얹음 (성검이 내려옴, 유령이 다가옴, 번개가 내리침 ...).

   시간은 script.js 가 넘겨주는 getTime() (사운드와 같은 시계) 기준.
   cfg = { tier, hit, hit2?, total }
     hit  : 첫 번째로 터지는 시간 (사운드의 쾅)
     hit2 : JXS만. 두 번째 클라이맥스. hit~hit2 동안은 각성 직전 단계
   ========================================================= */

export function createCutscene(ctx) {
    const { THREE, scene, camera, dummy, floor, stars, kit, bloom, stageApi } = ctx;
    const { BOX, glowMat, square, rand, bolt, sword, ghost } = kit;

    const root = new THREE.Group();
    scene.add(root);

    const ease = {
        in: k => k * k * k,
        out: k => 1 - Math.pow(1 - k, 3),
        inOut: k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
    };
    const clamp01 = k => Math.max(0, Math.min(1, k));

    /* ---------- 별 만들기 (등급별) ---------- */
    function beam(len, w, color, op = 1) {
        const m = new THREE.Mesh(BOX, glowMat(color, op));
        m.scale.set(len, w, w * 0.5);
        return m;
    }
    function buildStar(tier, colors) {
        const g = new THREE.Group();
        const c0 = colors[0], c1 = colors[1 % colors.length], white = new THREE.Color('#ffffff');
        const core = new THREE.Mesh(BOX, glowMat(white, 1));
        core.scale.setScalar(0.32);
        core.rotation.z = Math.PI / 4;
        g.add(core);
        const layers = [];
        const addOcta = (len, w, color, rot = 0) => {
            const l = new THREE.Group();
            for (let i = 0; i < 4; i++) { const b = beam(len * (i % 2 ? 0.78 : 1), w, color); b.rotation.z = (i * Math.PI) / 4; l.add(b); }
            const r1 = square(len * 0.38, w * 0.6, glowMat(color, 0.9)); r1.rotation.x = Math.PI / 2;
            const r2 = square(len * 0.38, w * 0.6, glowMat(color, 0.9)); r2.rotation.x = Math.PI / 2; r2.rotation.y = Math.PI / 4;
            l.add(r1, r2);
            l.rotation.z = rot;
            g.add(l); layers.push(l);
            return l;
        };
        if (tier === 'MYTHIC') {
            // 솔스의 네모 별: 십자 빔 + 짧은 대각 빔 + 45도 돌린 네모
            const l = new THREE.Group();
            const h = beam(3.4, 0.14, c0), v = beam(3.4, 0.14, c0);
            v.rotation.z = Math.PI / 2;
            l.add(h, v);
            const d1 = beam(1.6, 0.08, c1); d1.rotation.z = Math.PI / 4;
            const d2 = beam(1.6, 0.08, c1); d2.rotation.z = -Math.PI / 4;
            const sq = square(0.9, 0.06, glowMat(c1, 1)); sq.rotation.x = Math.PI / 2; sq.rotation.y = Math.PI / 4;
            l.add(d1, d2, sq);
            g.add(l); layers.push(l);
        } else if (tier === 'ANCIENT') {
            addOcta(4.2, 0.16, c0);
        } else if (tier === 'ABSOLUTE') {
            addOcta(4.4, 0.16, c0);
            addOcta(6.2, 0.06, c1, Math.PI / 8);
            const ring = new THREE.Group();
            for (let i = 0; i < 16; i++) {
                const c = new THREE.Mesh(BOX, glowMat(i % 2 ? c0 : c1, 1));
                const a = (i / 16) * Math.PI * 2;
                c.position.set(Math.cos(a) * 2.6, Math.sin(a) * 2.6, 0);
                c.scale.setScalar(0.16);
                c.rotation.z = a + Math.PI / 4;
                ring.add(c);
            }
            g.add(ring); layers.push(ring);
        } else {
            // JXS: 색이 다른 세 겹의 별이 서로 어긋나며 떨림
            addOcta(4.6, 0.18, c0);
            addOcta(5.6, 0.07, c1, Math.PI / 8);
            addOcta(7.2, 0.04, colors[2 % colors.length] || white, Math.PI / 16);
        }
        return { g, core, layers };
    }

    /* ---------- 사방에서 빨려 들어오는 빛 조각 ---------- */
    function buildStreaks(colors, n) {
        const mesh = new THREE.InstancedMesh(BOX, glowMat(0xffffff, 0.9), n);
        const data = [];
        for (let i = 0; i < n; i++) {
            const dir = new THREE.Vector3(rand(-1, 1), rand(-0.7, 0.9), rand(-1, 0.35)).normalize();
            data.push({ dir, d: rand(3, 16), v: rand(0.7, 1.3) });
            mesh.setColorAt(i, colors[i % colors.length].clone().lerp(new THREE.Color('#ffffff'), rand(0, 0.5)));
        }
        const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1);
        return {
            mesh,
            update(dt, speedK, center) {
                data.forEach((s, i) => {
                    s.d -= dt * s.v * (3 + speedK * 22);
                    if (s.d < 0.4) { s.d = rand(10, 16); s.dir.set(rand(-1, 1), rand(-0.7, 0.9), rand(-1, 0.35)).normalize(); }
                    p.copy(s.dir).multiplyScalar(s.d).add(center);
                    q.setFromUnitVectors(Z, s.dir);
                    const len = 0.3 + speedK * 2.4;
                    sc.set(0.05, 0.05, len * Math.min(1, s.d / 3));
                    mesh.setMatrixAt(i, m4.compose(p, q, sc));
                });
                mesh.instanceMatrix.needsUpdate = true;
            }
        };
    }

    /* ---------- 바닥에서 솟는 빛기둥 (ANCIENT 이상) ---------- */
    function buildFloorLight(colors, n) {
        const g = new THREE.Group();
        const cols = [];
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + rand(-0.15, 0.15), r = rand(3, 6.5);
            const m = new THREE.Mesh(BOX, glowMat(colors[i % colors.length], 0.7));
            m.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 1);
            m.userData = { delay: rand(0, 0.35), w: rand(0.06, 0.16) };
            g.add(m); cols.push(m);
        }
        return {
            g,
            update(k) {   // k: 0~1 솟아오른 정도
                cols.forEach(m => {
                    const kk = clamp01((k - m.userData.delay) / (1 - m.userData.delay));
                    const h = 0.01 + ease.out(kk) * 14;
                    m.scale.set(m.userData.w, h, m.userData.w);
                    m.position.y = -2 + h / 2;
                    m.visible = kk > 0;
                });
            }
        };
    }

    /* =========================================================
       칭호별 개성 (motif)
       update(time, phase, k, dt)  phase: 'build' | 'phase2' | 'reveal'
       ========================================================= */
    const MOTIFS = {
        // 절대여제: 황금 계단이 한 칸씩 솟아 별까지 이어지고, 거대한 왕관이 내려와 별에 씌워짐
        empress({ g, colors }) {
            const gold = new THREE.MeshStandardMaterial({ color: 0xffd34d, emissive: 0xffb800, emissiveIntensity: 0.6, roughness: 0.4 });
            const steps = Array.from({ length: 9 }, (_, i) => {
                const st = new THREE.Mesh(BOX, gold);
                st.scale.set(3.2 - i * 0.12, 0.3, 1.1);
                st.position.set(0, -1 + i * 0.5, 9 - i * 1.1);
                g.add(st); return st;
            });
            const crown = new THREE.Group();
            for (let i = 0; i < 4; i++) {
                const a = (i * Math.PI) / 2;
                const side = new THREE.Mesh(BOX, gold); side.scale.set(2.2, 0.4, 0.1);
                side.position.set(Math.sin(a) * 1.05, 0, Math.cos(a) * 1.05); side.rotation.y = a; crown.add(side);
                const sp = new THREE.Mesh(BOX, gold); sp.scale.set(0.2, 0.8, 0.1);
                sp.position.set(Math.sin(a) * 1.05, 0.55, Math.cos(a) * 1.05); sp.rotation.y = a; crown.add(sp);
                const gem = new THREE.Mesh(BOX, glowMat(colors[0], 1)); gem.scale.setScalar(0.2); gem.position.copy(sp.position); gem.position.y += 0.5; crown.add(gem);
            }
            g.add(crown);
            return {
                update(time, phase, k) {
                    const vis = phase === 'build';
                    steps.forEach((st, i) => {
                        st.visible = vis && k > i / 12;
                        const rise = clamp01((k - i / 12) * 6);
                        st.scale.y = 0.3 * rise + 0.001;
                    });
                    crown.visible = vis;
                    crown.position.set(0, THREE.MathUtils.lerp(15, 5.1, ease.out(k)), 0);
                    crown.rotation.y = time * (0.5 + k * 3);
                }
            };
        },

        // 흉악범: 카드 회오리가 별을 감싸고, 마지막에 거대한 실크햇이 별을 덮었다가 → 쾅, 장미 꽃잎 폭발
        phantomRose({ g, colors, star }) {
            const N = 48;
            const cards = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3 }), N);
            g.add(cards);
            const data = Array.from({ length: N }, (_, i) => ({ a: (i / N) * Math.PI * 2, y: rand(-3, 3), r: rand(2, 4.5) }));
            const hat = new THREE.Group();
            const black = new THREE.MeshStandardMaterial({ color: 0x0b0b10, roughness: 0.3 });
            const brim = new THREE.Mesh(BOX, black); brim.scale.set(5.4, 0.25, 5.0);
            const top = new THREE.Mesh(BOX, black); top.scale.set(3.4, 3.4, 3.2); top.position.y = 1.8;
            const band = new THREE.Mesh(BOX, new THREE.MeshStandardMaterial({ color: 0x8a0018, emissive: colors[0], emissiveIntensity: 0.6 })); band.scale.set(3.45, 0.6, 3.25); band.position.y = 0.55;
            hat.add(brim, top, band);
            hat.rotation.x = Math.PI;   // 뒤집힌 모자가 위에서 덮침
            g.add(hat);
            const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3(0.5, 0.72, 0.02);
            return {
                update(time, phase, k) {
                    const vis = phase === 'build';
                    cards.visible = vis;
                    data.forEach((d, i) => {
                        const a = d.a + time * (1 + k * 6);
                        const r = d.r * (1 - ease.in(k) * 0.6);
                        p.set(Math.cos(a) * r, 3.5 + d.y * (1 - k * 0.5), Math.sin(a) * r);
                        q.setFromEuler(e.set(time * 2 + i, -a, time + i));
                        cards.setMatrixAt(i, m4.compose(p, q, sc));
                    });
                    cards.instanceMatrix.needsUpdate = true;
                    hat.visible = vis && k > 0.72;
                    const drop = clamp01((k - 0.72) / 0.22);
                    hat.position.set(0, THREE.MathUtils.lerp(14, 5.3, ease.in(drop)), 0);
                    hat.rotation.y = time * 2;
                }
            };
        },

        // 초월자 김건우: 하늘에서 금빛 광선이 부채처럼 내려오고, 등 뒤에 거대한 네모 후광이 생김
        transcend({ g, colors }) {
            const rays = [];
            for (let i = 0; i < 9; i++) {
                const r = new THREE.Mesh(BOX, glowMat(colors[i % colors.length], 0.35));
                r.scale.set(0.12, 30, 0.12);
                r.userData.a = (i - 4) * 0.13;
                g.add(r); rays.push(r);
            }
            const halo = square(7, 0.1, glowMat(colors[0], 1)); halo.rotation.x = Math.PI / 2;
            const halo2 = square(5, 0.07, glowMat(colors[1], 1)); halo2.rotation.x = Math.PI / 2; halo2.rotation.y = Math.PI / 4;
            const haloG = new THREE.Group(); haloG.add(halo, halo2); haloG.position.set(0, 3.5, -3);
            g.add(haloG);
            return {
                update(time, phase, k) {
                    const vis = phase === 'build';
                    rays.forEach((r, i) => {
                        r.visible = vis;
                        const a = r.userData.a + Math.sin(time * 0.6 + i) * 0.04;
                        r.position.set(Math.sin(a) * 15, 3.5 + Math.cos(a) * 15, -2);
                        r.rotation.z = a;
                        r.material.opacity = 0.12 + k * 0.35;
                    });
                    haloG.visible = vis;
                    haloG.scale.setScalar(0.2 + ease.out(k) * 0.9);
                    haloG.rotation.z = time * 0.3;
                    halo2.rotation.y = Math.PI / 4 - time * 0.8;
                }
            };
        },

        // 성검의 소유자: 거대한 성검이 하늘에서 천천히 돌며 내려오다가, 터지는 순간 땅에 꽂힘
        holySword({ g, colors }) {
            const s = sword(5.6, colors[0], colors[2] || colors[1], 1.3);
            g.add(s);
            return {
                update(time, phase, k) {
                    s.visible = phase === 'build';
                    if (!s.visible) return;
                    const fall = k < 0.88 ? ease.out(k / 0.88) * 0.75 : 0.75 + ease.in((k - 0.88) / 0.12) * 0.25;
                    s.position.set(THREE.MathUtils.lerp(0, 2.25, ease.inOut(k)), THREE.MathUtils.lerp(16, -0.7, fall), THREE.MathUtils.lerp(0.5, -0.6, k));
                    s.rotation.y = time * (1 + k * 6);
                }
            };
        },

        // 곤지암병은: 별 대신 어둠. 깜빡일 때마다 유령이 점점 가까이, 마지막엔 코앞에
        haunted({ g, colors, star }) {
            const ghosts = [0, 1, 2, 3].map(() => { const gh = ghost(colors[0], 0); g.add(gh); return gh; });
            const scare = ghost(colors[0], 0);
            g.add(scare);
            let next = 0, idx = 0;
            return {
                hideStar: true,
                update(time, phase, k) {
                    star.g.visible = phase === 'build' && Math.random() < 0.15 + k * 0.3;
                    if (phase !== 'build') { ghosts.forEach(gh => (gh.visible = false)); scare.visible = false; return; }
                    if (time > next) {
                        next = time + THREE.MathUtils.lerp(1.4, 0.35, k);
                        const gh = ghosts[idx++ % ghosts.length];
                        const z = THREE.MathUtils.lerp(-8, 6, k);
                        gh.position.set(rand(-3, 3), 0, z);
                        gh.rotation.y = Math.atan2(-gh.position.x, 12 - z);
                        gh.userData.life = 0.18;
                    }
                    ghosts.forEach(gh => {
                        gh.userData.life = (gh.userData.life || 0) - 1 / 60;
                        const vis = gh.userData.life > 0;
                        gh.visible = vis;
                        gh.traverse(o => { if (o.material) o.material.opacity = vis ? 0.55 : 0; });
                    });
                    // 터지기 직전, 카메라 바로 앞에 유령
                    const near = k > 0.965;
                    scare.visible = near;
                    if (near) {
                        scare.position.set(0, camera.position.y - 4.4, camera.position.z - 4.2);
                        scare.traverse(o => { if (o.material) o.material.opacity = 0.75; });
                    }
                }
            };
        },

        // 강철검제: 사방에서 검이 날아와 별 둘레에 회전하는 검의 고리를 만듦
        steelEmperor({ g, colors }) {
            const ring = new THREE.Group();
            ring.position.set(0, 3.5, 0);
            g.add(ring);
            const blades = [];
            for (let i = 0; i < 16; i++) {
                const holder = new THREE.Group();
                const s = sword(2.2, null, colors[1], 0.3, true);
                s.rotation.z = Math.PI;
                holder.add(s);
                const a = (i / 16) * Math.PI * 2;
                holder.rotation.z = -a;
                holder.userData = { from: new THREE.Vector3(rand(-14, 14), rand(-8, 14), rand(-10, 6)), a };
                ring.add(holder); blades.push({ holder, s });
            }
            return {
                update(time, phase, k) {
                    ring.visible = phase === 'build';
                    const gather = ease.inOut(clamp01(k / 0.8));
                    ring.rotation.z = time * (0.4 + k * 4);
                    blades.forEach(({ holder, s }) => {
                        holder.position.copy(holder.userData.from).multiplyScalar(1 - gather);
                        s.position.y = THREE.MathUtils.lerp(9, 3.6, gather);
                    });
                }
            };
        },

        // 공허왕: 별빛이 전부 가운데로 빨려들고 검은 큐브 코어가 자람. 각성 단계엔 붉은 문이 열림
        voidKing({ g, colors }) {
            const core = new THREE.Mesh(BOX, new THREE.MeshBasicMaterial({ color: 0x000000 }));
            const edge = new THREE.LineSegments(new THREE.EdgesGeometry(BOX), new THREE.LineBasicMaterial({ color: colors[0], toneMapped: false }));
            const coreG = new THREE.Group(); coreG.add(core, edge); coreG.position.set(0, 3.5, -1.5);
            g.add(coreG);
            const cracks = [0, 1, 2, 3, 4].map(() => { const b = bolt(6, glowMat(colors[0], 1)); g.add(b); return b; });
            const gate = new THREE.Group();
            const gOuter = square(9, 0.12, glowMat(colors[0], 1)); gOuter.rotation.x = Math.PI / 2;
            const gInner = square(6.5, 0.08, glowMat(colors[1], 1)); gInner.rotation.x = Math.PI / 2;
            gate.add(gOuter, gInner); gate.position.set(0, 3.6, -4);
            g.add(gate);
            let next = 0;
            return {
                update(time, phase, k) {
                    stars.scale.setScalar(phase === 'reveal' ? 1 : 1 - (phase === 'build' ? ease.in(k) * 0.85 : 0.85));
                    coreG.visible = phase !== 'reveal';
                    const size = phase === 'build' ? 0.2 + ease.in(k) * 2.4 : 2.6 + k * 1.5;
                    core.scale.setScalar(size); edge.scale.setScalar(size * 1.02);
                    coreG.rotation.set(time * 0.7, time * 0.9, time * 0.4);
                    if (phase === 'phase2') coreG.position.set(0, 7.2, -2);
                    gate.visible = phase === 'phase2';
                    gate.scale.setScalar(0.3 + ease.out(k) * 0.8);
                    gOuter.rotation.y = time * 0.8; gInner.rotation.y = -time * 1.4;
                    if (time > next) {
                        next = time + rand(0.05, 0.2);
                        cracks.forEach(b => {
                            b.visible = phase !== 'reveal' && Math.random() < 0.3 + k * 0.5;
                            const a = rand(0, Math.PI * 2), r = size * 0.9;
                            const c = coreG.position;
                            b.reshape([c.x + Math.cos(a) * r, c.y + Math.sin(a) * r, c.z + 0.5], [c.x + Math.cos(a) * (r + 4), c.y + Math.sin(a) * (r + 4), c.z + 0.5], 0.5);
                        });
                    }
                },
                end() { stars.scale.setScalar(1); }
            };
        },

        // 번개의 좌: 번개가 점점 잦아지며 가운데를 내리침. 각성 단계엔 등 뒤로 왕좌가 솟아오름
        thunderThrone({ g, colors }) {
            const strikes = [0, 1, 2].map(() => { const b = bolt(10, glowMat(colors[2] || colors[0], 1)); g.add(b); return { b, life: 0 }; });
            const light = new THREE.PointLight(colors[0], 0, 30, 1.2);
            light.position.set(0, 6, 3);
            g.add(light);
            const throne = new THREE.Group();
            const stone = new THREE.MeshStandardMaterial({ color: 0x1b1d2e, roughness: 0.8, emissive: colors[0], emissiveIntensity: 0 });
            for (const [x, y, z, w, h, d] of [[0, 4.6, -1.9, 3.6, 7.4, 0.5], [-2.5, 1.6, -1.1, 0.6, 1.6, 1.8], [2.5, 1.6, -1.1, 0.6, 1.6, 1.8], [0, 8.6, -1.9, 1.6, 0.9, 0.5]]) {
                const b = new THREE.Mesh(BOX, stone); b.scale.set(w, h, d); b.position.set(x, y, z); throne.add(b);
            }
            g.add(throne);
            let next = 0;
            return {
                update(time, phase, k, dt) {
                    const rate = phase === 'build' ? THREE.MathUtils.lerp(1.6, 0.18, k) : phase === 'phase2' ? 0.12 : 99;
                    if (time > next && phase !== 'reveal') {
                        next = time + rate * rand(0.6, 1.2);
                        const s = strikes.find(x => x.life <= 0) || strikes[0];
                        const tx = rand(-4, 4) * (1 - k * 0.7), tz = rand(-2, 1);
                        s.b.reshape([tx + rand(-2, 2), 18, tz], [phase === 'phase2' ? rand(-3, 3) : tx * 0.3, phase === 'build' ? 3.5 : 0, tz], 1.1);
                        s.life = 0.14;
                        light.intensity = 160;
                    }
                    strikes.forEach(s => { s.life -= dt; s.b.visible = s.life > 0 && Math.random() > 0.2; });
                    light.intensity *= Math.pow(0.0005, dt);
                    throne.visible = phase === 'phase2';
                    throne.position.y = phase === 'phase2' ? THREE.MathUtils.lerp(-9, 0, ease.out(k)) : -9;
                    stone.emissiveIntensity = Math.random() < 0.1 ? 0.6 : 0.05;
                }
            };
        }
    };

    /* =========================================================
       재생
       ========================================================= */
    let st = null;
    const api = { active: false };

    function cleanup() {
        st?.motif?.end?.();
        root.traverse(o => { if (o !== root && o.material) o.material.dispose?.(); });
        while (root.children.length) root.remove(root.children[0]);
        dummy.root.visible = true;
        floor.visible = true;
        stars.scale.setScalar(1);
        bloom.strength = st?.bloomBase ?? bloom.strength;
        camera.up.set(0, 1, 0);
    }

    api.play = (aura, cfg, getTime, hooks) => new Promise(resolve => {
        if (st) { cleanup(); st.resolve(); }
        const fx = aura.fx || {};
        const colors = (fx.colors || [aura.color]).map(c => new THREE.Color(c));
        const tier = cfg.tier;
        const star = buildStar(tier, colors);
        star.g.position.set(0, 3.5, 0);
        root.add(star.g);
        const streaks = buildStreaks(colors, tier === 'MYTHIC' ? 50 : tier === 'JXS' ? 140 : 100);
        root.add(streaks.mesh);
        const floorLight = tier === 'MYTHIC' ? null : buildFloorLight(colors, tier === 'ANCIENT' ? 12 : tier === 'ABSOLUTE' ? 18 : 26);
        if (floorLight) root.add(floorLight.g);
        const motifG = new THREE.Group();
        root.add(motifG);
        const motif = MOTIFS[fx.signature]?.({ g: motifG, colors, star }) || null;

        ctx.setAura(null);
        dummy.root.visible = false;
        floor.visible = false;
        st = {
            aura, cfg, getTime, hooks, resolve, star, streaks, floorLight, motif, colors,
            stage: 0, bloomBase: bloom.strength, spin: 0, center: new THREE.Vector3(0, 3.5, 0)
        };
        bloom.strength = tier === 'MYTHIC' ? 0.9 : 1.15;
        api.active = true;
    });

    api.update = dt => {
        if (!st) return;
        const { cfg, star, streaks, floorLight, motif, hooks } = st;
        const time = st.getTime();
        const H = cfg.hit, H2 = cfg.hit2 || cfg.hit, T = cfg.total;
        const tier = cfg.tier;

        // 장면 전환 순간들
        if (st.stage === 0 && time >= H) {
            st.stage = 1;
            ctx.flash(1.5);
            hooks.shake(tier === 'MYTHIC' ? 0.3 : 0.7);
            if (cfg.hit2) {
                // JXS 1단계: 칠흑 실루엣만 드러남
                dummy.root.visible = true;
                stageApi.setSkin({ color: '#050508', eye: '#' + st.colors[0].getHexString(), glowEyes: true, smile: false });
            } else {
                reveal();
            }
        }
        if (st.stage === 1 && cfg.hit2 && time >= H2) {
            st.stage = 2;
            ctx.flash(2);
            hooks.shake(1.1);
            reveal();
        }
        function reveal() {
            dummy.root.visible = true;
            floor.visible = true;
            ctx.setAura(st.aura, { force: true });
            st.revealAt = time;
        }

        const view = ctx.getNormalView();
        const tgt = view.target;

        if (time < H) {
            /* ---------- 1. 별이 커지며 빨라짐 ---------- */
            const p = clamp01(time / H);
            const implode = clamp01((time - (H - 0.7)) / 0.7);
            st.spin += dt * (0.5 + p * p * 14);
            star.g.visible = !motif?.hideStar;
            star.g.rotation.z = st.spin;
            star.layers.forEach((l, i) => { l.rotation.z = (i % 2 ? -1 : 1) * st.spin * (0.4 + i * 0.3); });
            const grow = 0.15 + ease.in(p) * (tier === 'MYTHIC' ? 1.1 : 1.5);
            star.g.scale.setScalar(grow * (1 - ease.in(implode)) + 0.001);
            star.core.scale.setScalar(0.32 + Math.sin(time * 18) * 0.05 * p);
            if (tier === 'JXS') {
                star.layers.forEach(l => { l.position.set(rand(-1, 1) * 0.08 * p, rand(-1, 1) * 0.08 * p, 0); });
            }
            streaks.mesh.visible = true;
            streaks.update(dt, p + implode * 2, st.center);
            floorLight?.update(clamp01((p - 0.3) / 0.6));
            motif?.update(time, 'build', p, dt);

            // 카메라: 멀리서 천천히 다가가며 살짝 기울어짐
            const d = THREE.MathUtils.lerp(26, 11, ease.inOut(p)) - implode * 2.5;
            const a = Math.sin(p * 1.2) * 0.35;
            camera.position.set(Math.sin(a) * d, 3.5 + d * 0.12, Math.cos(a) * d);
            camera.lookAt(st.center);
            camera.rotateZ(Math.sin(time * 0.5) * 0.06 + p * 0.1);
            if (p > 0.72) hooks.shake(0.02 + (p - 0.72) * 0.35);
        } else if (cfg.hit2 && time < H2) {
            /* ---------- JXS 2. 각성 직전 (실루엣 + 더 큰 별) ---------- */
            const q = clamp01((time - H) / (H2 - H));
            const implode = clamp01((time - (H2 - 0.6)) / 0.6);
            st.spin += dt * (2 + q * q * 18);
            star.g.visible = true;
            star.g.position.set(0, 3.6, -3.5);
            star.g.rotation.z = -st.spin;
            star.layers.forEach((l, i) => { l.rotation.z = (i % 2 ? -1 : 1) * st.spin * (0.5 + i * 0.4); l.position.set(rand(-1, 1) * 0.15, rand(-1, 1) * 0.15, 0); });
            star.g.scale.setScalar((1.4 + ease.in(q) * 1.6) * (1 - ease.in(implode)) + 0.001);
            streaks.update(dt, 0.6 + q * 1.5 + implode * 2, st.center2 || (st.center2 = new THREE.Vector3(0, 3.6, -3.5)));
            floorLight?.update(Math.max(0, 1 - q * 3));
            motif?.update(time, 'phase2', q, dt);
            // 카메라: 실루엣 발밑에서 얼굴 쪽으로 천천히 돌며 올라감
            const a = THREE.MathUtils.lerp(-0.9, 0.5, ease.inOut(q));
            const d = THREE.MathUtils.lerp(view.dist * 0.6, view.dist * 0.85, q);
            camera.position.set(Math.sin(a) * d, THREE.MathUtils.lerp(0.8, tgt.y + 1.5, ease.inOut(q)), Math.cos(a) * d);
            camera.lookAt(0, tgt.y + 0.4, 0);
            camera.rotateZ(Math.sin(time * 0.8) * 0.05);
            hooks.shake(0.03 + q * 0.12);
        } else {
            /* ---------- 3. 공개: 아래에서 올려다보다가 평소 화면으로 ---------- */
            const r = clamp01((time - H2) / Math.max(0.5, T - H2));
            star.g.visible = false;
            streaks.mesh.visible = false;
            floorLight?.update(Math.max(0, 1 - r * 4));
            motif?.update(time, 'reveal', r, dt);
            const k = ease.inOut(clamp01(r / 0.85));
            const startD = view.dist * 0.78;
            const d = THREE.MathUtils.lerp(startD, view.dist, k);
            const a = THREE.MathUtils.lerp(-1.1, 0, k) + (tier === 'MYTHIC' ? 0 : Math.sin(time * 0.4) * 0.05 * (1 - k));
            const y = THREE.MathUtils.lerp(tgt.y - 1.6, tgt.y + view.dist * 0.14, k);
            camera.position.set(Math.sin(a) * d, y, Math.cos(a) * d);
            camera.lookAt(tgt);
            bloom.strength = THREE.MathUtils.lerp(1.3, st.bloomBase, k);
        }

        if (time >= T) {
            const done = st.resolve;
            cleanup();
            st = null;
            api.active = false;
            done();
        }
    };

    // 건너뛰기 등으로 즉시 끝낼 때
    api.stop = () => {
        if (!st) return;
        const done = st.resolve;
        if (!st.revealAt) { dummy.root.visible = true; floor.visible = true; ctx.setAura(st.aura, { force: true }); }
        cleanup();
        st = null;
        api.active = false;
        done();
    };

    return api;
}
