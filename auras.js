/* =========================================================
   🌟 칭호 데이터 (데모 버전, 22개)

   in    : 1 in N 확률
   color : 칭호 대표 색 (아우라 기본 색)
   class : 칭호 글자 연출 (effects.css)
   fx    : 3D 아우라 모양 — 전부 네모 블록으로 만들어짐
     colors    아우라에 쓰는 색들 (없으면 color 하나)
     glow      캐릭터 테두리/조명 세기 (0 ~ 3)
     particles 위로 떠오르는 작은 큐브 수
     rise      큐브가 떠오르는 속도
     orbit     몸 주위를 도는 큐브 수
     rings     발밑에서 도는 네모 링 수
     halo      머리 위 네모 후광
     pillar    바닥에서 솟는 빛기둥
     wings     등 뒤 블록 날개
     shards    주위를 떠다니는 큰 크리스탈 큐브 수
     lightning 번개 블록
     void      검은 큐브가 빨려드는 공허 효과
   ========================================================= */

export const AURA_DATA = [
    // 1. COMMON
    { id: "com_normal", name: "평범한 김티비", grade: "COMMON", in: 2, color: "#9aa0ad",
      fx: { particles: 4, rise: 0.5 } },
    { id: "com_sleepy_jisung", name: "하품하는 박지성", grade: "COMMON", in: 4, color: "#8fa3b8",
      fx: { particles: 6, rise: 0.35 } },
    { id: "com_just_byungeun", name: "그저 공병은", grade: "COMMON", in: 6, color: "#b0b6c2",
      fx: { particles: 8, rise: 0.6 } },

    // 2. UNCOMMON
    { id: "unc_running", name: "뛰어가는 김민채", grade: "UNCOMMON", in: 12, color: "#5fe08a",
      fx: { particles: 14, rise: 1.2, glow: 0.4 } },
    { id: "unc_tired", name: "피곤한 박지성", grade: "UNCOMMON", in: 20, color: "#3cbf6a",
      fx: { particles: 12, rise: 0.4, glow: 0.4 } },

    // 3. RARE
    { id: "rare_soldier", name: "예비군 공병은", grade: "RARE", in: 28, color: "#6495ed",
      fx: { particles: 16, rise: 0.8, rings: 1, glow: 0.6 } },
    { id: "rare_train", name: "폭주기관차 김민채", grade: "RARE", in: 45, color: "#1e90ff",
      fx: { particles: 26, rise: 2.2, rings: 1, glow: 0.7 } },
    { id: "rare_new_jisung", name: "축구공 차는 박지성", grade: "RARE", in: 75, color: "#2f9bff",
      fx: { particles: 16, rise: 0.9, orbit: 3, glow: 0.7 } },

    // 4. EPIC
    { id: "ep_baksisung", name: "밪지성", grade: "EPIC", in: 100, color: "#2ecc71",
      fx: { particles: 22, rise: 1, orbit: 4, rings: 1, glow: 1 } },
    { id: "epic_destroy", name: "파괴신 김건우", grade: "EPIC", in: 350, color: "#b44dff",
      fx: { colors: ["#b44dff", "#ff3b6b"], particles: 30, rise: 1.6, orbit: 6, rings: 1, glow: 1.1 } },

    // 5. LEGEND
    { id: "ep_crazykong", name: "크레이지콩", grade: "LEGEND", in: 758, color: "#ff7a1a",
      fx: { colors: ["#ff7a1a", "#ffd23f"], particles: 36, rise: 1.4, orbit: 6, rings: 2, halo: true, glow: 1.4 } },
    { id: "legend_speed", name: "광속의 김민채", grade: "LEGEND", in: 1200, color: "#ff2a4a", class: "aura-legend-1",
      fx: { colors: ["#ff2a4a", "#ffc300"], particles: 50, rise: 3.2, orbit: 8, rings: 2, halo: true, glow: 1.5 } },
    { id: "legend_wizard", name: "대마법사 공병은", grade: "LEGEND", in: 3500, color: "#ff2b2b", class: "aura-legend-3",
      fx: { colors: ["#ff2b2b", "#7a2bff"], particles: 40, rise: 1, orbit: 6, rings: 2, halo: true, shards: 3, glow: 1.6 } },

    // 6. MYTHIC
    { id: "gemini_basic", name: "김민제미나이", grade: "MYTHIC", in: 10101, color: "#00ffff", class: "aura-mythic-1",
      fx: { colors: ["#00ffff", "#2a7bff"], particles: 50, rise: 1.3, orbit: 8, rings: 2, halo: true, shards: 4, pillar: true, glow: 1.8 } },
    { id: "epic_monkey", name: "건숭이", grade: "MYTHIC", in: 13131, color: "#ffb02e", class: "aura-mythic-2",
      fx: { colors: ["#ffb02e", "#ff4d2e"], particles: 56, rise: 1.8, orbit: 10, rings: 3, halo: true, shards: 4, glow: 1.9 } },
    { id: "mythic_heart", name: "두 개의 심장 박지성", grade: "MYTHIC", in: 100000, color: "#00fa9a", class: "aura-mythic-1",
      fx: { colors: ["#00fa9a", "#ff3b5c"], particles: 60, rise: 1.5, orbit: 10, rings: 3, halo: true, shards: 6, pillar: true, glow: 2 } },

    // 7. DIVINE
    { id: "divine_god", name: "초월자 김건우", grade: "DIVINE", in: 5000000, color: "#ffe14d", class: "aura-transcendent-gunwoo",
      fx: { colors: ["#ffe14d", "#ffffff", "#ffb800"], particles: 70, rise: 1.6, orbit: 10, rings: 3, halo: true, shards: 6, pillar: true, wings: true, glow: 2.4 } },
    { id: "divine_knight_gaen_sword", name: "빛의 기사 김가은 : 성검의 소유자", grade: "DIVINE", in: 6780000, color: "#fff176", class: "aura-holy-sword",
      fx: { colors: ["#fff6b0", "#9fe8ff", "#ffffff"], particles: 70, rise: 1.2, orbit: 8, rings: 3, halo: true, shards: 8, pillar: true, wings: true, glow: 2.4 } },

    // 8. COSMIC
    { id: "legend_gonjiam", name: "곤지암병은", grade: "COSMIC", in: 29999999, color: "#00e676", class: "aura-gonjiam-spooky",
      fx: { colors: ["#00e676", "#004d40", "#00b0ff"], particles: 80, rise: 0.7, orbit: 12, rings: 4, halo: true, shards: 8, pillar: true, void: true, glow: 2.6 } },
    { id: "cosmic_steel_emperor", name: "강철검 공병은 : 강철검제", grade: "COSMIC", in: 99999999, color: "#00b0ff", class: "aura-steel-emperor",
      fx: { colors: ["#80d8ff", "#00b0ff", "#e0f7ff"], particles: 90, rise: 2, orbit: 14, rings: 4, halo: true, shards: 10, pillar: true, wings: true, glow: 2.8 } },

    // 9. JS
    { id: "js_void_king", name: "공허왕 공허병은", grade: "JS", in: 111111111, color: "#ff0040", class: "aura-js-void",
      fx: { colors: ["#ff0040", "#2b00ff", "#ffffff"], particles: 100, rise: 1.2, orbit: 14, rings: 5, halo: true, shards: 12, pillar: true, wings: true, void: true, glow: 3 } },
    { id: "js_lightning_jisung", name: "번개의 좌 박지성", grade: "JS", in: 300000000, color: "#00ffff", class: "aura-lightning",
      fx: { colors: ["#00ffff", "#7c4dff", "#ffffff"], particles: 100, rise: 3, orbit: 14, rings: 5, halo: true, shards: 10, pillar: true, wings: true, lightning: true, glow: 3 } }
];
