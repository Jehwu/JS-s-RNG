/* =========================================================
   🕺 칭호별 포즈 (poses.js)
   매 프레임 pose(t, d, rolling) 가 불려서 캐릭터 관절을 정함.
   d = { root, head, torso, armL, armR, legL, legR } (각각 rotation/position 있음)

   방향 메모 (캐릭터는 화면 쪽 +z 를 봄)
     팔 rotation.x 가 음수  → 팔이 앞으로 (-1.57 이면 앞으로 쭉)
     armR.rotation.z 가 양수 / armL.rotation.z 가 음수 → 팔을 옆으로 벌림 (±1.57 수평, ±2.9 위로)
     다리 rotation.x 음수 → 다리가 앞으로
     root.rotation.x 양수 → 몸이 앞으로 숙여짐
   ========================================================= */

const S = Math.sin, C = Math.cos;
const set = (o, x = 0, y = 0, z = 0) => o.rotation.set(x, y, z);
// 0~1 사이를 부드럽게 오가는 주기 (period 초마다 한 번, 0~dur 구간에 1까지 올라갔다 내려옴)
const pulse = (t, period, dur, offset = 0) => {
    const k = ((t + offset) % period) / dur;
    return k < 1 ? S(k * Math.PI) : 0;
};
const mix = (a, b, k) => a + (b - a) * k;

export const POSES = {
    /* ---------- COMMON ---------- */
    // 평범한 김티비: 가만히 서서 두리번
    com_normal(t, d) {
        d.head.rotation.y = S(t * 0.6) * 0.45;
        set(d.armL, 0, 0, -0.06); set(d.armR, 0, 0, 0.06);
    },
    // 하품하는 박지성: 4초마다 기지개 + 고개 젖힘
    com_sleepy_jisung(t, d) {
        const k = pulse(t, 5, 1.8);
        set(d.armL, 0, 0, -0.08 - k * 2.7); set(d.armR, 0, 0, 0.08 + k * 2.7);
        d.head.rotation.x = -k * 0.4 + (1 - k) * 0.15;
        d.root.rotation.x = 0.05 - k * 0.08;
    },
    // 그저 공병은: 주머니에 손, 짝다리
    com_just_byungeun(t, d) {
        set(d.armL, 0.12, 0, 0.04); set(d.armR, 0.12, 0, -0.04);
        d.root.rotation.z = 0.05 + S(t * 0.8) * 0.02;
        set(d.legL, 0, 0, -0.08);
        d.head.rotation.z = -0.08;
    },

    /* ---------- UNCOMMON ---------- */
    // 뛰어가는 김민채: 제자리 달리기
    unc_running(t, d) {
        const s = S(t * 9);
        set(d.legL, s * 0.8); set(d.legR, -s * 0.8);
        set(d.armL, -s * 0.9, 0, -0.1); set(d.armR, s * 0.9, 0, 0.1);
        d.root.rotation.x = 0.12;
        d.root.position.y += Math.abs(S(t * 9)) * 0.15;
    },
    // 피곤한 박지성: 구부정, 고개 푹, 가끔 꾸벅
    unc_tired(t, d) {
        const nod = pulse(t, 4.5, 1.2);
        d.root.rotation.x = 0.15;
        d.head.rotation.x = 0.45 + nod * 0.35;
        set(d.armL, -0.15, 0, 0.05); set(d.armR, -0.15, 0, -0.05);
        d.root.rotation.z = S(t * 0.7) * 0.04;
    },

    /* ---------- RARE ---------- */
    // 예비군 공병은: 경례
    rare_soldier(t, d) {
        set(d.armR, -2.35, 0, -0.75);
        set(d.armL, 0, 0, -0.02);
        d.root.rotation.x = -0.04;
        d.head.rotation.x = -0.05;
    },
    // 폭주기관차 김민채: 숙이고 전력질주
    rare_train(t, d) {
        const s = S(t * 14);
        set(d.legL, s * 1.0); set(d.legR, -s * 1.0);
        set(d.armL, -s * 1.1, 0, -0.1); set(d.armR, s * 1.1, 0, 0.1);
        d.root.rotation.x = 0.3;
        d.root.position.y += Math.abs(S(t * 14)) * 0.18;
    },
    // 축구공 차는 박지성: 오른발 킥
    rare_new_jisung(t, d) {
        const k = (t % 2.2) / 2.2;
        const kick = k < 0.45 ? mix(0, 0.9, k / 0.45) : k < 0.6 ? mix(0.9, -1.5, (k - 0.45) / 0.15) : mix(-1.5, 0, (k - 0.6) / 0.4);
        set(d.legR, kick); set(d.legL, 0);
        set(d.armL, 0.3, 0, -0.7); set(d.armR, -0.4, 0, 0.6);
        d.root.rotation.x = -kick * 0.08;
    },

    /* ---------- EPIC ---------- */
    // 밪지성: 근육 자랑 (팔 수평으로 들고 펌핑)
    ep_baksisung(t, d) {
        const p = S(t * 3) * 0.2;
        set(d.armL, 0, 0, -1.5 - p); set(d.armR, 0, 0, 1.5 + p);
        d.head.rotation.x = -0.1;
    },
    // 파괴신 김건우: 넓은 자세, 주먹 쥐고 3초마다 쿵
    epic_destroy(t, d) {
        const k = pulse(t, 3, 0.5);
        set(d.legL, 0, 0, -0.22); set(d.legR, 0, 0, 0.22);
        set(d.armL, -0.3 - k * 1.2, 0, -0.45); set(d.armR, -0.3 - k * 1.2, 0, 0.45);
        d.root.position.y -= k * 0.15;
        d.root.rotation.x = 0.1 + k * 0.1;
    },

    /* ---------- LEGEND ---------- */
    // 크레이지콩: 미친 춤
    ep_crazykong(t, d) {
        const a = S(t * 6), b = S(t * 6 + Math.PI);
        set(d.armL, 0, 0, -0.4 - (a * 0.5 + 0.5) * 2.4); set(d.armR, 0, 0, 0.4 + (b * 0.5 + 0.5) * 2.4);
        set(d.legL, S(t * 12) * 0.5); set(d.legR, -S(t * 12) * 0.5);
        d.root.rotation.y += S(t * 3) * 0.5;
        d.head.rotation.z = S(t * 6) * 0.25;
        d.root.position.y += Math.abs(S(t * 6)) * 0.3;
    },
    // 광속의 김민채: 나루토 달리기 (팔 뒤로, 몸 숙임)
    legend_speed(t, d) {
        const s = S(t * 16);
        set(d.legL, s * 1.1); set(d.legR, -s * 1.1);
        set(d.armL, 1.35, 0, -0.15); set(d.armR, 1.35, 0, 0.15);
        d.root.rotation.x = 0.55;
        d.head.rotation.x = -0.45;
        d.root.position.y += Math.abs(S(t * 16)) * 0.12;
    },
    // 대마법사 공병은: 한 손 높이, 다른 손 앞으로. 4초마다 주문을 던짐
    legend_wizard(t, d) {
        const k = pulse(t, 4, 0.7);
        set(d.armR, -k * 1.9, 0, mix(2.7, 0.3, k));
        set(d.armL, -1.3 + S(t * 2) * 0.1, 0, -0.25);
        d.head.rotation.x = -0.15 + k * 0.2;
        d.root.rotation.x = k * 0.12;
    },

    /* ---------- MYTHIC ---------- */
    // 김민제미나이: 공중 명상 (책상다리, 손은 무릎 위)
    gemini_basic(t, d) {
        set(d.legL, -1.45, 0.35, 0.55); set(d.legR, -1.45, -0.35, -0.55);
        set(d.armL, -0.75, 0, -0.35); set(d.armR, -0.75, 0, 0.35);
        d.root.position.y += 0.9 + S(t * 1.2) * 0.15;
        d.root.rotation.y += t * 0.25;
        d.head.rotation.x = 0.12;
    },
    // 건숭이: 손차양 하고 멀리 살핌, 한쪽 다리 들고
    epic_monkey(t, d) {
        set(d.armR, -2.75, 0, -0.85);
        set(d.armL, -0.4, 0, -0.55);
        set(d.legL, -0.7, 0, -0.1);
        d.root.rotation.x = 0.12;
        d.head.rotation.y = S(t * 0.8) * 0.6;
    },
    // 두 개의 심장 박지성: 두 손을 가슴에
    mythic_heart(t, d) {
        const beat = pulse(t, 0.9, 0.18) + pulse(t, 0.9, 0.18, -0.22) * 0.7;
        set(d.armL, -1.2, 0, 0.62); set(d.armR, -1.2, 0, -0.62);
        d.root.rotation.x = -beat * 0.06;
        d.head.rotation.x = -0.1 - beat * 0.08;
    },

    /* ---------- ANCIENT ---------- */
    // 초월자 김건우: 두 팔 하늘로, 고개 들고 승천
    divine_god(t, d) {
        const open = 2.35 + S(t * 0.8) * 0.15;
        set(d.armL, 0, 0, -open); set(d.armR, 0, 0, open);
        d.head.rotation.x = -0.4;
        set(d.legL, 0.15, 0, 0.04); set(d.legR, 0.15, 0, -0.04);
        d.root.rotation.y += S(t * 0.3) * 0.3;
    },
    // 성검의 소유자: 왼손 가슴(맹세), 오른손 칼자루 쪽. 6초마다 오른손을 하늘로
    divine_knight_gaen_sword(t, d) {
        const k = pulse(t, 6, 1.6);
        set(d.armL, -1.25, 0, 0.6);
        set(d.armR, -k * 2.8, 0, mix(0.55, 0.15, k));
        d.head.rotation.x = 0.1 - k * 0.45;
        d.root.rotation.y = -0.25;
    },

    /* ---------- ABSOLUTE ---------- */
    // 곤지암병은: 꺾인 목, 앞으로 뻗은 뻣뻣한 팔, 축 늘어진 다리, 가끔 경련
    legend_gonjiam(t, d) {
        const twitch = (S(t * 37) > 0.97 ? 1 : 0) + (S(t * 23 + 1) > 0.985 ? -1 : 0);
        d.head.rotation.set(0.25 + twitch * 0.2, twitch * 0.3, 0.8 + S(t * 0.7) * 0.08 + twitch * 0.25);
        set(d.armL, -1.5 + S(t * 1.3) * 0.05 + twitch * 0.2, 0, 0.05);
        set(d.armR, -1.45 + S(t * 1.1) * 0.05 - twitch * 0.2, 0, -0.05);
        set(d.legL, 0.25 + S(t * 0.9) * 0.06, 0, 0.03); set(d.legR, 0.3 - S(t * 0.9) * 0.06, 0, -0.03);
        d.root.rotation.z = S(t * 0.5) * 0.06 + twitch * 0.06;
        d.root.position.y += 0.5;
    },
    // 강철검제: 오른손을 앞으로 뻗어 명령, 왼손은 뒷짐. 일제사격 때 크게 휘두름
    cosmic_steel_emperor(t, d) {
        const k = pulse(t, 3.2, 0.5, 0.1);
        set(d.armR, -1.55 + k * 0.4, 0, mix(-0.1, 1.2, k));
        set(d.armL, 0.45, 0, 0.05);
        d.head.rotation.x = -0.18;
        d.root.rotation.y = mix(-0.2, -0.45, k);
        set(d.legL, 0, 0, -0.12); set(d.legR, 0, 0, 0.12);
    },

    /* ---------- JXS ---------- */
    // 공허왕 공병은: 공중에서 내려다보며 두 팔을 펼침. 5초마다 팔을 크게 들어 공허를 부름
    js_void_king(t, d) {
        const k = pulse(t, 5, 2.2);
        const open = mix(0.8, 1.9, k);
        set(d.armL, -0.25 - k * 0.4, 0, -open); set(d.armR, -0.25 - k * 0.4, 0, open);
        d.head.rotation.x = mix(0.22, -0.25, k);
        set(d.legL, 0.18, 0, 0.05); set(d.legR, 0.22, 0, -0.05);
        d.root.rotation.y = S(t * 0.25) * 0.15;
    },
    // 번개의 좌 박지성 (제우스): 떠서 번개를 높이 듦 → 팔을 뒤로 젖히며 몸을 비틀어 힘을 모음 → 앞으로 내던짐
    js_lightning_jisung(t, d, _r, sig) {
        const w = sig?.windK ?? 0, k = sig?.throwK ?? 0;
        const idleSway = S(t * 1.1) * 0.06;
        // 오른팔: 위로 → 뒤로 젖힘 → 앞으로 휘두름
        const rx = mix(mix(0, 0.95, w), -1.95, k);
        const rz = mix(mix(2.85 + idleSway, 2.25, w), 0.75, k);
        set(d.armR, rx, 0, rz);
        // 왼팔: 평소엔 아래로 위엄, 모을 땐 목표를 가리킴, 던지면 뒤로
        set(d.armL, mix(mix(-0.6, -1.55, w), 0.6, k), 0, mix(mix(-0.55, -0.25, w), -0.9, k));
        // 몸: 비틀기와 숙임
        d.root.rotation.y = mix(mix(-0.15 + S(t * 0.5) * 0.08, 0.6, w), -0.5, k);
        d.root.rotation.x = mix(mix(-0.05, -0.18, w), 0.32, k);
        d.root.rotation.z = mix(0, 0.08, w) - k * 0.06;
        // 다리: 던질 때 앞으로 내딛음
        set(d.legL, mix(mix(-0.25, 0.1, w), -0.75, k), 0, -0.12);
        set(d.legR, mix(mix(0.15, -0.2, w), 0.55, k), 0, 0.12);
        d.head.rotation.set(mix(-0.15, 0.1, k), mix(0, -0.4, w) + k * 0.3, 0);
        d.root.position.y += 0.35 + S(t * 1.4) * 0.12 - k * 0.15;
    },

    /* ---------- 새 칭호 ---------- */
    // 김건우: 팔짱 끼고 발 까딱
    com_gunwoo(t, d) {
        set(d.armL, -0.95, 0, 0.55); set(d.armR, -0.85, 0, -0.55);
        set(d.legR, -Math.max(0, S(t * 5)) * 0.15);
        d.head.rotation.y = S(t * 0.4) * 0.2;
    },
    // 김티비디오: 두 손으로 카메라 들고 촬영 중
    unc_tvideo(t, d) {
        set(d.armL, -1.5, 0, 0.32); set(d.armR, -1.6, 0, -0.32);
        d.head.rotation.set(0.05, 0, S(t * 0.9) * 0.08);
        d.root.rotation.y = S(t * 0.5) * 0.35;
        d.root.position.y += Math.abs(S(t * 2.4)) * 0.04;
    },
    // 김민채소로날유혹해: 한 손 허리, 한 손 머리 뒤, 골반 흔들기 (옆의 소를 향해)
    rare_cow_minchae(t, d) {
        set(d.armL, 0.35, 0, -0.5);
        set(d.armR, -2.5, 0, -0.75);
        d.root.rotation.z = S(t * 2.2) * 0.09;
        d.root.rotation.y = 0.45 + S(t * 1.1) * 0.1;
        d.head.rotation.set(-0.08, 0, 0.18);
        set(d.legL, 0, 0, -0.06); set(d.legR, -0.15, 0, 0.1);
    },
    // 꽁꽁병은: 몸을 감싸 쥐고 오들오들
    ep_frozen_byungeun(t, d) {
        const sh = S(t * 45) * 0.025;
        set(d.armL, -1.15, 0, 0.6 + sh); set(d.armR, -1.15, 0, -0.6 - sh);
        set(d.legL, 0, 0, 0.05); set(d.legR, 0, 0, -0.05);
        d.head.rotation.set(0.3, sh * 2, 0);
        d.root.position.x += sh * 0.6;
    },
    // 김건우족을보았다: 부족장의 의식 춤 (팔을 번갈아 하늘로, 발 구르기)
    leg_gunwoo_tribe(t, d) {
        const a = S(t * 4);
        set(d.armL, -0.2, 0, -1.6 - a * 0.9); set(d.armR, -0.2, 0, 1.6 - a * 0.9);
        set(d.legL, Math.max(0, S(t * 4)) * -0.6); set(d.legR, Math.max(0, -S(t * 4)) * -0.6);
        d.root.position.y += Math.abs(S(t * 4)) * 0.25;
        d.head.rotation.x = -0.25 + Math.abs(a) * 0.15;
        d.root.rotation.y = S(t * 1) * 0.5;
    },
    // 170KG OOO: 바벨을 머리 위로 들었다가 바닥에 내리찍음
    mythic_170kg(t, d, _r, sig) {
        const up = sig?.liftK ?? 1;   // 1 = 머리 위, 0 = 바닥
        set(d.armL, -0.15 * (1 - up), 0, -mix(0.35, 2.85, up)); set(d.armR, -0.15 * (1 - up), 0, mix(0.35, 2.85, up));
        set(d.legL, mix(-0.8, 0, up), 0, -0.22); set(d.legR, mix(-0.8, 0, up), 0, 0.22);
        d.root.rotation.x = mix(0.45, -0.05, up);
        d.root.position.y += mix(-0.55, 0, up);
        d.head.rotation.x = mix(0.2, -0.25, up);
    },
    // 절대여제 김가은: 한 손 허리, 한 손에 홀을 높이. 가끔 홀로 바닥을 내리침
    anc_empress_gaen(t, d, _r, sig) {
        const k = sig?.slamK ?? 0;
        set(d.armR, mix(-2.35, -1.2, k), 0, mix(0.35, 0.1, k));
        set(d.armL, 0.35, 0, -0.45);
        d.head.rotation.x = mix(-0.22, 0.05, k);
        d.root.rotation.y = S(t * 0.35) * 0.25;
        set(d.legL, 0, 0, -0.04); set(d.legR, -0.12, 0, 0.08);
    },
    // 흉악범: 인사(모자 들고 허리 숙임) ↔ 두 팔을 활짝 펼치는 마술 공개
    jxs_felon(t, d, _r, sig) {
        const bow = sig?.bowK ?? 0, reveal = sig?.revealK ?? 0;
        set(d.armR, mix(mix(-0.4, -1.25, bow), -0.35, reveal), 0, mix(mix(0.2, -0.65, bow), 2.25, reveal));
        set(d.armL, mix(mix(0.25, 0.55, bow), -0.35, reveal), 0, mix(-0.25, -2.25, reveal));
        d.root.rotation.x = mix(0, 0.45, bow) - reveal * 0.12;
        d.root.rotation.y = S(t * 0.6) * 0.2 + mix(0, -0.3, bow);
        d.head.rotation.x = mix(0, 0.3, bow) - reveal * 0.2;
        set(d.legL, mix(0, -0.35, bow), 0, -0.06); set(d.legR, mix(0, 0.25, bow), 0, 0.06);
        d.root.position.y += 0.25 + S(t * 1.6) * 0.1 + reveal * 0.4;
    }
};
