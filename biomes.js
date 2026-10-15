/* =========================================================
   🌦️ 바이옴 (biomes.js)
   - 1분마다 한 번씩 바이옴이 올지 굴림 (희귀한 것부터)
   - 바이옴 동안: 행운 ×luck, 그 바이옴과 어울리는 칭호는 확률 ×boost
   - 화면 효과는 3D 무대 위에 얇은 2D 캔버스로 덧그림 (BGM은 안 바꿈)
   ========================================================= */

export const BIOMES = [
    {
        id: 'windy', name: '바람', icon: '🍃', color: '#9ff5d8', chance: 12, duration: 120, luck: 1.5, boost: 3,
        msg: '거센 바람이 분다', auras: ['leg_storm_gaeun', 'legend_speed', 'unc_running', 'rare_bike_tv', 'ep_falconer_byungeun']
    },
    {
        id: 'snowy', name: '눈보라', icon: '❄️', color: '#bfe9ff', chance: 18, duration: 150, luck: 2, boost: 5,
        msg: '눈보라가 몰아친다', auras: ['ep_frozen_byungeun', 'anc_iceemperor_tv', 'myth_aurora_gaeun']
    },
    {
        id: 'sandstorm', name: '모래폭풍', icon: '🏜️', color: '#ffc46b', chance: 24, duration: 150, luck: 2, boost: 5,
        msg: '모래폭풍이 시야를 덮는다', auras: ['leg_desert_tv', 'leg_golem_jisung', 'abs_sunking_gunwoo', 'myth_midas_gaeun']
    },
    {
        id: 'storm', name: '뇌우', icon: '⛈️', color: '#8fb8ff', chance: 30, duration: 180, luck: 2.5, boost: 4,
        msg: '하늘이 갈라진다', auras: ['leg_storm_gaeun', 'myth_thunderbeast_minchae', 'abs_breaker_byungeun', 'js_lightning_jisung', 'myth_abyss_byungeun']
    },
    {
        id: 'starfall', name: '유성우', icon: '🌠', color: '#d7b8ff', chance: 60, duration: 120, luck: 3, boost: 5,
        msg: '별이 쏟아진다', auras: ['anc_nebula_jisung', 'myth_astro_jisung', 'myth_blackhole_byungeun', 'anc_extinct_minchae', 'gemini_basic']
    },
    {
        id: 'bloodmoon', name: '핏빛 달', icon: '🌕', color: '#ff4a5a', chance: 120, duration: 180, luck: 5, boost: 6,
        msg: '붉은 달이 떠올랐다', auras: ['abs_archdemon_tv', 'leg_necro_tv', 'jxs_darkestnight_minchae', 'jxs_felon', 'legend_gonjiam', 'ep_darkdragon_tv']
    },
    {
        id: 'void', name: '공허', icon: '🕳️', color: '#c46bff', chance: 450, duration: 90, luck: 10, boost: 10,
        msg: '세계가 무너진다', auras: ['js_void_king', 'abs_chaos_gaeun', 'ep_darkdragon_tv', 'jxs_sans_tv']
    },
    // 🎃 할로윈 이벤트 기간에만 옴 (event 가 켜져 있을 때)
    {
        id: 'halloween', event: 'halloween', name: '할로윈의 밤', icon: '🎃', color: '#ff8a1f', chance: 60, duration: 150, luck: 4, boost: 6,
        msg: '호박등에 불이 켜졌다', auras: ['legend_gonjiam', 'leg_necro_tv', 'abs_archdemon_tv', 'ep_mushroom_tv', 'ep_shadow_jisung', 'jxs_sans_tv', 'jxs_darkestnight_minchae']
    }
];
export const BIOME_BY_ID = Object.fromEntries(BIOMES.map(b => [b.id, b]));
export const BIOME_CHECK_MS = 60000;

// 이번 판정에서 올 바이옴 (없으면 null). mult: 확률 배율 (나침반 부적 등), events: 지금 열린 이벤트 이름들
const usable = events => BIOMES.filter(b => !b.event || events.includes(b.event));
export function rollBiome(mult = 1, events = []) {
    const list = usable(events).sort((a, b) => b.chance - a.chance);   // 희귀한 것부터
    for (const b of list) if (Math.random() < mult / b.chance) return b;
    return null;
}
// 바이옴 소환 물약: 흔한 바이옴일수록 잘 나옴
export function randomBiome(events = []) {
    const list = usable(events);
    const sum = list.reduce((s, b) => s + 1 / b.chance, 0);
    let r = Math.random() * sum;
    for (const b of list) { r -= 1 / b.chance; if (r <= 0) return b; }
    return list[0];
}

/* ---------- 화면 효과 ---------- */
export function createBiomeFx(canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, S = 1;
    let biome = null, raf = 0, last = 0, alpha = 0, target = 0;
    let parts = [];
    let bolt = null, boltT = 0, nextBolt = 0, glitch = [];
    const R = (a, b) => a + Math.random() * (b - a);

    function resize() {
        S = Math.min(window.devicePixelRatio || 1, 1.5);
        W = canvas.width = Math.round(innerWidth * S);
        H = canvas.height = Math.round(innerHeight * S);
    }
    addEventListener('resize', resize);
    resize();

    function spawn(id, init) {
        const p = { x: R(0, W), y: init ? R(0, H) : 0, life: R(0, 1) };
        switch (id) {
            case 'windy': p.x = init ? R(0, W) : R(-W * 0.3, 0); p.y = R(0, H); p.v = R(9, 16) * S; p.len = R(40, 120) * S; p.leaf = Math.random() < 0.25; p.r = R(0, 6); break;
            case 'snowy': p.y = init ? R(0, H) : -10; p.v = R(0.8, 2.2) * S; p.s = R(2, 5) * S; p.w = R(0, 6); p.dx = R(1.5, 3.5) * S; break;
            case 'sandstorm': p.x = init ? R(0, W) : -10; p.y = R(0, H); p.v = R(6, 13) * S; p.s = R(1.5, 3.5) * S; p.dy = R(-0.6, 0.6) * S; break;
            case 'storm': p.y = init ? R(0, H) : -40; p.v = R(18, 28) * S; p.len = R(14, 30) * S; break;
            case 'starfall': p.x = R(-W * 0.2, W * 1.1); p.y = init ? R(-H, H * 0.5) : R(-H * 0.6, -20); p.v = R(7, 14) * S; p.len = R(60, 160) * S; p.c = Math.random() < 0.5 ? '#ffffff' : '#d7b8ff'; break;
            case 'bloodmoon': p.y = init ? R(0, H) : H + 10; p.v = R(0.4, 1.3) * S; p.s = R(2, 4) * S; p.w = R(0, 6); break;
            case 'void': p.s = R(2, 7) * S; p.v = R(0.2, 0.9) * S; p.a = R(0, 6); break;
            case 'halloween':
                p.bat = Math.random() < 0.45; p.a = R(0, 6);
                if (p.bat) { p.x = init ? R(0, W) : -30; p.y = R(H * 0.05, H * 0.6); p.v = R(1.5, 3.5) * S; p.s = R(8, 14) * S; }
                else { p.y = init ? R(0, H) : H + 30; p.v = R(0.3, 0.8) * S; p.s = R(12, 22) * S; }
                break;
        }
        return p;
    }
    const COUNT = { windy: 46, snowy: 110, sandstorm: 150, storm: 120, starfall: 7, bloodmoon: 40, void: 60, halloween: 22 };

    function makeBolt() {
        const pts = [];
        let x = R(W * 0.15, W * 0.85), y = 0;
        while (y < H * R(0.45, 0.7)) { pts.push([x, y]); x += R(-40, 40) * S; y += R(30, 60) * S; }
        pts.push([x, y]);
        return pts;
    }

    function tint(id, t) {
        let g;
        switch (id) {
            case 'windy':
                g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(90,220,180,0.10)'); g.addColorStop(1, 'rgba(0,0,0,0)'); break;
            case 'snowy':
                g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(170,215,255,0.20)'); g.addColorStop(0.6, 'rgba(120,170,230,0.06)'); g.addColorStop(1, 'rgba(220,240,255,0.14)'); break;
            case 'sandstorm':
                g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(255,170,70,0.24)'); g.addColorStop(1, `rgba(190,110,40,${0.18 + Math.sin(t * 0.8) * 0.05})`); break;
            case 'storm':
                g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(10,16,40,0.45)'); g.addColorStop(1, 'rgba(20,30,60,0.15)'); break;
            case 'starfall':
                g = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H); g.addColorStop(0, 'rgba(150,100,255,0.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); break;
            case 'bloodmoon':
                g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.8); g.addColorStop(0, 'rgba(120,0,10,0.08)'); g.addColorStop(1, `rgba(150,0,20,${0.42 + Math.sin(t * 1.2) * 0.06})`); break;
            case 'void':
                g = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.75); g.addColorStop(0, 'rgba(40,0,60,0.10)'); g.addColorStop(1, 'rgba(10,0,20,0.6)'); break;
            case 'halloween':
                g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(70,20,110,0.38)'); g.addColorStop(0.6, 'rgba(30,10,40,0.08)'); g.addColorStop(1, `rgba(255,110,20,${0.22 + Math.sin(t * 1.5) * 0.05})`); break;
        }
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function draw(t, dt) {
        const id = biome.id;
        ctx.clearRect(0, 0, W, H);
        ctx.globalAlpha = alpha;
        tint(id, t);

        // 바이옴별 큰 그림
        if (id === 'bloodmoon') {
            const mx = W * 0.78, my = H * 0.16, ms = Math.min(W, H) * 0.13;
            const glow = ctx.createRadialGradient(mx, my, ms * 0.3, mx, my, ms * 2.4);
            glow.addColorStop(0, 'rgba(255,40,60,0.55)'); glow.addColorStop(1, 'rgba(255,0,30,0)');
            ctx.fillStyle = glow; ctx.fillRect(mx - ms * 2.5, my - ms * 2.5, ms * 5, ms * 5);
            ctx.fillStyle = '#d4162e'; ctx.fillRect(mx - ms / 2, my - ms / 2, ms, ms);
            ctx.fillStyle = '#9e0c20';
            ctx.fillRect(mx - ms * 0.25, my - ms * 0.2, ms * 0.18, ms * 0.18);
            ctx.fillRect(mx + ms * 0.12, my + ms * 0.1, ms * 0.22, ms * 0.22);
            ctx.fillRect(mx - ms * 0.1, my + ms * 0.28, ms * 0.12, ms * 0.12);
        }
        if (id === 'storm') {
            if (t > nextBolt) { bolt = makeBolt(); boltT = 0; nextBolt = t + R(3, 7); }
            if (bolt && boltT < 0.5) {
                boltT += dt;
                const k = 1 - boltT / 0.5;
                ctx.fillStyle = `rgba(200,220,255,${0.35 * k * (Math.random() < 0.7 ? 1 : 0.3)})`;
                ctx.fillRect(0, 0, W, H);
                ctx.strokeStyle = `rgba(230,240,255,${k})`; ctx.lineWidth = 3 * S;
                ctx.shadowColor = '#9fc4ff'; ctx.shadowBlur = 18 * S;
                ctx.beginPath(); bolt.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        if (id === 'halloween') {
            // 주황 보름달 + 지나가는 마녀 실루엣
            const mx = W * 0.22, my = H * 0.14, ms = Math.min(W, H) * 0.14;
            const glow = ctx.createRadialGradient(mx, my, ms * 0.3, mx, my, ms * 2.2);
            glow.addColorStop(0, 'rgba(255,170,60,0.5)'); glow.addColorStop(1, 'rgba(255,120,0,0)');
            ctx.fillStyle = glow; ctx.fillRect(mx - ms * 2.3, my - ms * 2.3, ms * 4.6, ms * 4.6);
            ctx.fillStyle = '#ffb347'; ctx.fillRect(mx - ms / 2, my - ms / 2, ms, ms);
            ctx.fillStyle = '#e8902a'; ctx.fillRect(mx - ms * 0.3, my - ms * 0.15, ms * 0.2, ms * 0.2); ctx.fillRect(mx + ms * 0.1, my + ms * 0.15, ms * 0.15, ms * 0.15);
            const wx = ((t * 0.07) % 1.4 - 0.2) * W, wy = H * 0.12 + Math.sin(t * 2) * 8 * S, u = 5 * S;
            ctx.fillStyle = '#120818';
            ctx.fillRect(wx - u * 5, wy + u, u * 9, u * 0.8);                // 빗자루
            ctx.fillRect(wx + u * 4, wy + u * 0.4, u * 2, u * 2);            // 솔
            ctx.fillRect(wx - u, wy - u * 2, u * 2.4, u * 3);                // 몸
            ctx.fillRect(wx - u * 1.6, wy - u * 2.4, u * 3.6, u * 0.7);      // 모자 챙
            ctx.fillRect(wx - u * 0.6, wy - u * 4, u * 1.4, u * 1.8);        // 모자
        }

        // 입자
        for (const p of parts) {
            switch (id) {
                case 'windy':
                    p.x += p.v; p.y += Math.sin(t * 2 + p.r) * 0.6 * S;
                    if (p.leaf) {
                        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(t * 3 + p.r);
                        ctx.fillStyle = 'rgba(120,230,140,0.85)'; ctx.fillRect(-4 * S, -4 * S, 8 * S, 8 * S); ctx.restore();
                    } else {
                        ctx.fillStyle = 'rgba(220,255,245,0.35)'; ctx.fillRect(p.x, p.y, p.len, 1.5 * S);
                    }
                    if (p.x > W + 130 * S) Object.assign(p, spawn(id, false));
                    break;
                case 'snowy':
                    p.y += p.v; p.x += Math.sin(t + p.w) * 0.6 * S + p.dx * 0.4;
                    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(p.x, p.y, p.s, p.s);
                    if (p.y > H + 10 || p.x > W + 10) { Object.assign(p, spawn(id, false)); p.x = R(-W * 0.3, W); }
                    break;
                case 'sandstorm':
                    p.x += p.v; p.y += p.dy + Math.sin(t * 3 + p.x * 0.01) * 0.8 * S;
                    ctx.fillStyle = 'rgba(255,200,120,0.55)'; ctx.fillRect(p.x, p.y, p.s * 2.4, p.s);
                    if (p.x > W + 10) Object.assign(p, spawn(id, false));
                    break;
                case 'storm':
                    p.y += p.v; p.x -= p.v * 0.18;
                    ctx.fillStyle = 'rgba(170,200,255,0.45)';
                    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(0.18); ctx.fillRect(0, 0, 1.5 * S, p.len); ctx.restore();
                    if (p.y > H) { Object.assign(p, spawn(id, false)); p.x = R(0, W * 1.2); }
                    break;
                case 'starfall': {
                    p.x -= p.v * 0.55; p.y += p.v;
                    const g = ctx.createLinearGradient(p.x, p.y, p.x + p.len * 0.55, p.y - p.len);
                    g.addColorStop(0, p.c); g.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.strokeStyle = g; ctx.lineWidth = 2.5 * S;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.len * 0.55, p.y - p.len); ctx.stroke();
                    ctx.fillStyle = '#fff'; ctx.fillRect(p.x - 2 * S, p.y - 2 * S, 4 * S, 4 * S);
                    if (p.y > H + 20 || p.x < -200) Object.assign(p, spawn(id, false));
                    break;
                }
                case 'bloodmoon':
                    p.y -= p.v; p.x += Math.sin(t * 1.3 + p.w) * 0.5 * S;
                    ctx.fillStyle = `rgba(255,${60 + 40 * Math.sin(t * 3 + p.w)},60,0.75)`; ctx.fillRect(p.x, p.y, p.s, p.s);
                    if (p.y < -10) Object.assign(p, spawn(id, false));
                    break;
                case 'halloween':
                    p.a += dt;
                    if (p.bat) {
                        p.x += p.v; p.y += Math.sin(p.a * 3) * 0.8 * S;
                        const f = Math.sin(p.a * 14) > 0 ? 1 : 0.3, s2 = p.s;
                        ctx.fillStyle = 'rgba(15,5,20,0.9)';
                        ctx.fillRect(p.x - s2 * 0.2, p.y - s2 * 0.15, s2 * 0.4, s2 * 0.3);
                        ctx.fillRect(p.x - s2 * 0.75, p.y - s2 * 0.3 * f, s2 * 0.55, s2 * 0.18);
                        ctx.fillRect(p.x + s2 * 0.2, p.y - s2 * 0.3 * f, s2 * 0.55, s2 * 0.18);
                        if (p.x > W + 40) Object.assign(p, spawn(id, false));
                    } else {
                        p.y -= p.v; p.x += Math.sin(p.a + p.s) * 0.4 * S;
                        const s2 = p.s;
                        ctx.globalAlpha = alpha * 0.75;
                        ctx.fillStyle = '#ff7a1a'; ctx.fillRect(p.x - s2 / 2, p.y - s2 / 2, s2, s2 * 0.85);
                        ctx.fillStyle = '#3a8c2a'; ctx.fillRect(p.x - s2 * 0.08, p.y - s2 * 0.7, s2 * 0.16, s2 * 0.22);
                        ctx.fillStyle = `rgba(255,${220 + Math.sin(p.a * 9) * 30},90,1)`;
                        ctx.fillRect(p.x - s2 * 0.3, p.y - s2 * 0.2, s2 * 0.18, s2 * 0.15); ctx.fillRect(p.x + s2 * 0.12, p.y - s2 * 0.2, s2 * 0.18, s2 * 0.15);
                        ctx.fillRect(p.x - s2 * 0.25, p.y + s2 * 0.08, s2 * 0.5, s2 * 0.1);
                        ctx.globalAlpha = alpha;
                        if (p.y < -30) Object.assign(p, spawn(id, false));
                    }
                    break;
                case 'void':
                    p.a += dt; p.y -= p.v; p.x += Math.sin(p.a * 2) * 0.4 * S;
                    ctx.fillStyle = (Math.floor(p.a * 4) % 2) ? 'rgba(200,120,255,0.8)' : 'rgba(0,0,0,0.9)';
                    ctx.fillRect(p.x, p.y, p.s, p.s);
                    if (p.y < -10) { Object.assign(p, spawn(id, true)); p.y = H + 5; }
                    break;
            }
        }

        // 공허: 화면이 가끔 가로로 찢어짐
        if (id === 'void') {
            if (Math.random() < 0.06) glitch = Array.from({ length: 3 + Math.floor(Math.random() * 4) }, () => ({ y: R(0, H), h: R(3, 22) * S, dx: R(-30, 30) * S, c: Math.random() < 0.5 ? 'rgba(255,40,90,0.35)' : 'rgba(80,220,255,0.3)', life: R(0.06, 0.18) }));
            glitch = glitch.filter(g => (g.life -= dt) > 0);
            for (const g of glitch) { ctx.fillStyle = g.c; ctx.fillRect(g.dx, g.y, W, g.h); }
        }
        ctx.globalAlpha = 1;
    }

    function frame(now) {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - (last || now)) / 1000);
        last = now;
        alpha += (target - alpha) * Math.min(1, dt * 1.5);
        if (!biome || (target === 0 && alpha < 0.01)) {
            ctx.clearRect(0, 0, W, H);
            if (target === 0) { biome = null; stop(); }
            return;
        }
        if (document.body.classList.contains('cine-on')) { ctx.clearRect(0, 0, W, H); return; }
        draw(now / 1000, dt);
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }

    return {
        set(b) {
            if (b && biome?.id === b.id) { target = 1; return; }
            if (b) {
                biome = b; alpha = 0; target = 1;
                parts = Array.from({ length: COUNT[b.id] || 40 }, () => spawn(b.id, true));
                nextBolt = performance.now() / 1000 + 1.2;
            } else target = 0;
            if (!raf && biome) raf = requestAnimationFrame(frame);
        }
    };
}
