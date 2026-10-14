/* =========================================================
   🌟 칭호 데이터 (42개)

   in    : 1 in N 확률
   line  : 컷씬 마지막에 칭호 아래 뜨는 한 줄 (MYTHIC 이상)
   frame : 그 칭호만의 고유 카드 테두리 (rarity.css 의 .fr-u-이름), 없으면 등급 테두리
   color : 칭호 대표 색 (아우라 기본 색)
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
     signature 고급 칭호 전용 연출 이름 (auraSignatures.js)
               → 이게 있으면 위 효과들 대신 그 칭호만의 연출이 나옴
   ========================================================= */

export const AURA_DATA = [
    // 1. COMMON
    { id: "com_normal", name: "평범한 김티비", grade: "COMMON", in: 2, color: "#9aa0ad",
      fx: { particles: 4, rise: 0.5 } },
    { id: "com_sleepy_jisung", name: "하품하는 박지성", grade: "COMMON", in: 4, color: "#8fa3b8",
      fx: { particles: 6, rise: 0.35 } },
    { id: "com_just_byungeun", name: "그저 공병은", grade: "COMMON", in: 6, color: "#b0b6c2",
      fx: { particles: 8, rise: 0.6 } },
    { id: "com_gunwoo", name: "김건우", grade: "COMMON", in: 8, color: "#a7b0c4",
      fx: { particles: 8, rise: 0.5 } },
    { id: "com_hungry_gaeun", name: "배고픈 김가은", grade: "COMMON", in: 3, color: "#c8a98a",
      fx: { particles: 5, rise: 0.4 } },
    { id: "com_phone_tv", name: "폰만 보는 김티비", grade: "COMMON", in: 9, color: "#8a9bb5",
      fx: { particles: 6, rise: 0.45 } },

    // 2. UNCOMMON
    { id: "unc_running", name: "뛰어가는 김민채", grade: "UNCOMMON", in: 12, color: "#5fe08a",
      fx: { particles: 14, rise: 1.2, glow: 0.4 } },
    { id: "unc_tired", name: "피곤한 박지성", grade: "UNCOMMON", in: 20, color: "#3cbf6a",
      fx: { particles: 12, rise: 0.4, glow: 0.4 } },
    { id: "unc_tvideo", name: "김티비디오", grade: "UNCOMMON", in: 21, color: "#7fe0ff",
      fx: { signature: "tvStatic", colors: ["#7fe0ff", "#ff5fd2"], particles: 10, rise: 0.6, glow: 0.4 } },
    { id: "unc_walk_byungeun", name: "산책하는 공병은", grade: "UNCOMMON", in: 15, color: "#7be0a0",
      fx: { particles: 12, rise: 0.8, glow: 0.4 } },
    { id: "unc_pc_jisung", name: "PC방 박지성", grade: "UNCOMMON", in: 24, color: "#48e0d0",
      fx: { particles: 14, rise: 0.7, orbit: 2, glow: 0.45 } },

    // 3. RARE
    { id: "rare_soldier", name: "예비군 공병은", grade: "RARE", in: 28, color: "#6495ed",
      fx: { particles: 16, rise: 0.8, rings: 1, glow: 0.6 } },
    { id: "rare_train", name: "폭주기관차 김민채", grade: "RARE", in: 45, color: "#1e90ff",
      fx: { particles: 26, rise: 2.2, rings: 1, glow: 0.7 } },
    { id: "rare_new_jisung", name: "축구공 차는 박지성", grade: "RARE", in: 75, color: "#2f9bff",
      fx: { particles: 16, rise: 0.9, orbit: 3, glow: 0.7 } },
    { id: "rare_cow_minchae", name: "김민채소로날유혹해", grade: "RARE", in: 87, color: "#ff7eb6",
      fx: { signature: "cowCharm", colors: ["#ff7eb6", "#ffffff"], particles: 12, rise: 0.7, glow: 0.6 } },
    { id: "rare_captain_minchae", name: "축구부 주장 김민채", grade: "RARE", in: 55, color: "#3d8bff",
      fx: { particles: 18, rise: 1.0, orbit: 3, rings: 1, glow: 0.7 } },
    { id: "rare_escape_tv", name: "야자 탈출 김티비", grade: "RARE", in: 66, color: "#8c7bff",
      fx: { particles: 20, rise: 1.8, rings: 1, glow: 0.7 } },

    // 4. EPIC
    { id: "ep_baksisung", name: "밪지성", grade: "EPIC", in: 100, color: "#2ecc71",
      fx: { particles: 22, rise: 1, orbit: 4, rings: 1, glow: 1 } },
    { id: "epic_destroy", name: "파괴신 김건우", grade: "EPIC", in: 350, color: "#b44dff",
      fx: { colors: ["#b44dff", "#ff3b6b"], particles: 30, rise: 1.6, orbit: 6, rings: 1, glow: 1.1 } },
    { id: "ep_frozen_byungeun", name: "꽁꽁병은", grade: "EPIC", in: 343, color: "#9fe6ff",
      fx: { signature: "frozen", colors: ["#9fe6ff", "#ffffff", "#5ab8ff"], particles: 20, rise: 0.35, glow: 0.9 } },
    { id: "ep_fire_jisung", name: "불꽃 슛 박지성", grade: "EPIC", in: 222, color: "#ff6b2b",
      fx: { colors: ["#ff6b2b", "#ffd23f"], particles: 34, rise: 2.2, orbit: 5, rings: 1, glow: 1.1 } },
    { id: "ep_darkdragon_tv", name: "흑염룡 김티비", grade: "EPIC", in: 444, color: "#8a3bff",
      fx: { colors: ["#8a3bff", "#ff2bd6"], particles: 28, rise: 1.2, orbit: 6, rings: 2, void: true, glow: 1.1 } },

    // 5. LEGEND
    { id: "ep_crazykong", name: "크레이지콩", grade: "LEGEND", in: 758, color: "#ff7a1a",
      fx: { signature: "crazyBounce", colors: ["#ff7a1a", "#ffd23f"], glow: 0.8 } },
    { id: "legend_speed", name: "광속의 김민채", grade: "LEGEND", in: 1200, color: "#ff2a4a",
      fx: { signature: "lightspeed", colors: ["#ff2a4a", "#ffc300"], glow: 0.9 } },
    { id: "legend_wizard", name: "대마법사 공병은", grade: "LEGEND", in: 3500, color: "#ff2b2b",
      fx: { signature: "archmage", colors: ["#ff2b2b", "#9b4dff"], glow: 1.0 } },
    { id: "leg_gunwoo_tribe", name: "김건우족을보았다", grade: "LEGEND", in: 6666, color: "#ff9a3c",
      fx: { signature: "gunwooTribe", colors: ["#ff9a3c", "#ffdd55", "#c23b22"], glow: 1.0 } },
    { id: "leg_storm_gaeun", name: "폭풍의 김가은", grade: "LEGEND", in: 4444, color: "#7fd4ff",
      fx: { signature: "stormDancer", colors: ["#7fd4ff", "#ffffff", "#4a6cff"], glow: 0.9 } },

    // 6. MYTHIC
    { id: "gemini_basic", name: "김민제미나이", grade: "MYTHIC", in: 10101, color: "#00ffff", line: "계산은 이미 끝났다",
      fx: { signature: "gemini", colors: ["#00ffff", "#2a7bff"], glow: 1.0 } },
    { id: "epic_monkey", name: "건숭이", grade: "MYTHIC", in: 13131, color: "#ffb02e", line: "구름을 타고 하늘을 가른다",
      fx: { signature: "monkeyKing", colors: ["#ffb02e", "#ff3b1f"], glow: 0.8 } },
    { id: "mythic_heart", name: "두 개의 심장 박지성", grade: "MYTHIC", in: 100000, color: "#00fa9a", line: "두 개의 심장이 동시에 뛴다",
      fx: { signature: "twoHearts", colors: ["#00fa9a", "#ff3b5c"], glow: 0.9 } },
    { id: "mythic_170kg", name: "170KG OOO", grade: "MYTHIC", in: 333333, color: "#c0ff3e", line: "지구가 그 무게를 견디지 못한다",
      fx: { signature: "heavy170", colors: ["#c0ff3e", "#ffde3e", "#5a7d1a"], glow: 1.0 } },
    { id: "myth_abyss_byungeun", name: "심해의 공병은", grade: "MYTHIC", in: 55555, color: "#1fb8ff", line: "빛이 닿지 않는 곳에서 올라왔다",
      fx: { signature: "deepSea", colors: ["#1fb8ff", "#00ffd5", "#0a2a6b"], glow: 0.8 } },

    // 7. ANCIENT
    { id: "divine_god", name: "초월자 김건우", grade: "ANCIENT", in: 5000000, color: "#ffe14d", line: "한계를 넘어선 자",
      fx: { signature: "transcend", colors: ["#ffe14d", "#ffffff", "#ffb800"], glow: 1.2 } },
    { id: "divine_knight_gaen_sword", name: "빛의 기사 김가은 : 성검의 소유자", grade: "ANCIENT", in: 6780000, color: "#fff176", line: "빛이 검을 선택했다",
      fx: { signature: "holySword", colors: ["#fff6b0", "#9fe8ff", "#ffffff"], glow: 1.0 } },
    { id: "anc_extinct_minchae", name: "멸종의 김민채", grade: "ANCIENT", in: 6700000, color: "#ff5a1f", line: "하늘에서 마지막 별이 떨어진다",
      fx: { signature: "extinction", colors: ["#ff5a1f", "#ffb02e", "#4a1a0a"], glow: 1.0 } },
    { id: "anc_empress_gaen", name: "절대여제 김가은", grade: "ANCIENT", in: 17171717, color: "#c77dff", line: "무릎 꿇어라",
      fx: { signature: "empress", colors: ["#c77dff", "#ffd34d", "#ff6ad5"], glow: 1.2 } },

    // 8. ABSOLUTE
    { id: "legend_gonjiam", name: "곤지암병은", grade: "ABSOLUTE", in: 29999999, color: "#00e676", line: "...거기 누구 있어요?",
      fx: { signature: "haunted", colors: ["#00e676", "#8affc1"], glow: 0.9 } },
    { id: "abs_last_conductor", name: "마지막 기관사 김건우", grade: "ABSOLUTE", in: 66666666, color: "#ffb347", line: "종착역은 없다. 이 열차는 멈추지 않는다",
      fx: { signature: "lastConductor", colors: ["#ffb347", "#ff4d2e", "#ffe2a0"], glow: 0.9 } },
    { id: "cosmic_steel_emperor", name: "강철검 공병은 : 강철검제", grade: "ABSOLUTE", in: 99999999, color: "#00b0ff", line: "만 개의 검이 단 하나의 주인을 따른다",
      fx: { signature: "steelEmperor", colors: ["#80d8ff", "#00b0ff"], glow: 1.0 } },

    // 9. JXS
    { id: "js_void_king", name: "공허왕 공허병은", grade: "JXS", in: 111111111, color: "#ff0040", line: "모든 것은 공허로 돌아간다", frame: "void",
      fx: { signature: "voidKing", colors: ["#ff0040", "#2b00ff", "#ff6a00"], glow: 1.1 } },
    { id: "jxs_felon", name: "흉악범", grade: "JXS", in: 222222222, color: "#ff1744", line: "오늘 밤, 당신의 운명을 훔쳐 가겠습니다", frame: "rose",
      fx: { signature: "phantomRose", colors: ["#ff1744", "#ffd34d", "#ff8fa8"], particles: 30, rise: 0.8, glow: 0.8 } },
    { id: "js_lightning_jisung", name: "번개의 좌 박지성", grade: "JXS", in: 300000000, color: "#00ffff", line: "하늘이 그의 이름을 부른다", frame: "zeus",
      fx: { signature: "thunderThrone", colors: ["#00ffff", "#7c4dff", "#ffffff"], particles: 28, rise: 1.4, glow: 1.0 } }
];
