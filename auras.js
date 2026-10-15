/* =========================================================
   🌟 칭호 데이터 (88개)

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
    { id: "unc_lunch_gunwoo", name: "급식실 김건우", grade: "UNCOMMON", in: 13, color: "#8be36b",
      fx: { particles: 12, rise: 0.6, glow: 0.4 } },
    { id: "unc_late_gaeun", name: "지각한 김가은", grade: "UNCOMMON", in: 22, color: "#5ad1a0",
      fx: { particles: 16, rise: 1.6, glow: 0.45 } },

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
    { id: "rare_president_byungeun", name: "반장 공병은", grade: "RARE", in: 33, color: "#5b8cff",
      fx: { particles: 16, rise: 0.8, orbit: 2, rings: 1, glow: 0.65 } },
    { id: "rare_karaoke_minchae", name: "노래방 김민채", grade: "RARE", in: 77, color: "#ff6fd8",
      fx: { colors: ["#ff6fd8", "#6fe3ff", "#ffe36f"], particles: 22, rise: 1.2, orbit: 4, glow: 0.75 } },
    { id: "rare_cvs_jisung", name: "편의점 알바 박지성", grade: "RARE", in: 40, color: "#4fc3a1",
      fx: { particles: 16, rise: 0.7, orbit: 2, rings: 1, glow: 0.6 } },
    { id: "rare_bike_tv", name: "자전거 타는 김티비", grade: "RARE", in: 58, color: "#5ab0ff",
      fx: { particles: 24, rise: 2.4, rings: 1, glow: 0.65 } },
    { id: "rare_drum_byungeun", name: "드럼 치는 공병은", grade: "RARE", in: 92, color: "#ff9f43",
      fx: { colors: ["#ff9f43", "#ffe066"], particles: 18, rise: 1.0, orbit: 4, glow: 0.7 } },
    { id: "rare_relay_gunwoo", name: "체육대회 계주 김건우", grade: "RARE", in: 36, color: "#3fd0ff",
      fx: { colors: ["#3fd0ff", "#ffffff"], particles: 26, rise: 2.6, rings: 1, glow: 0.65 } },
    { id: "rare_chicken_jisung", name: "치킨 배달 박지성", grade: "RARE", in: 81, color: "#ffb547",
      fx: { colors: ["#ffb547", "#ff5a3c"], particles: 20, rise: 1.2, orbit: 3, glow: 0.7 } },

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
    { id: "ep_blackbelt_gunwoo", name: "검은 띠 김건우", grade: "EPIC", in: 150, color: "#e8e8f0",
      fx: { colors: ["#e8e8f0", "#ff3b3b"], particles: 26, rise: 1.4, orbit: 4, rings: 1, glow: 1.0 } },
    { id: "ep_mushroom_tv", name: "독버섯 김티비", grade: "EPIC", in: 313, color: "#b04dff",
      fx: { colors: ["#b04dff", "#6dff4d"], particles: 32, rise: 0.5, orbit: 5, rings: 1, glow: 1.0 } },
    { id: "ep_magician_gunwoo", name: "마술사 김건우", grade: "EPIC", in: 190, color: "#c084ff",
      fx: { colors: ["#c084ff", "#ffd34d"], particles: 26, rise: 1.0, orbit: 6, rings: 1, glow: 1.0 } },
    { id: "ep_cyborg_gaeun", name: "사이보그 김가은", grade: "EPIC", in: 270, color: "#59f0ff",
      fx: { colors: ["#59f0ff", "#ff3b6b"], particles: 24, rise: 1.6, orbit: 4, rings: 2, glow: 1.0 } },
    { id: "ep_lava_tv", name: "용암 김티비", grade: "EPIC", in: 420, color: "#ff4a1f",
      fx: { colors: ["#ff4a1f", "#ffb02e"], particles: 40, rise: 1.8, rings: 1, glow: 1.1 } },
    { id: "ep_shadow_jisung", name: "그림자 사냥꾼 박지성", grade: "EPIC", in: 199, color: "#a05bff",
      fx: { signature: "shadowHunter", colors: ["#a05bff", "#ff3bd4"], particles: 18, rise: 0.6, glow: 0.7 } },
    { id: "ep_neon_gaeun", name: "네온 라이더 김가은", grade: "EPIC", in: 377, color: "#ff3bd4",
      fx: { signature: "neonRider", colors: ["#ff3bd4", "#ffb02e"], particles: 16, rise: 0.8, glow: 0.9 } },
    { id: "ep_falconer_byungeun", name: "독수리 조련사 공병은", grade: "EPIC", in: 240, color: "#e8b06a",
      fx: { signature: "falconer", colors: ["#e8b06a", "#ffffff"], particles: 14, rise: 0.7, glow: 0.7 } },
    { id: "ep_sakura_gaeun", name: "벚꽃 무희 김가은", grade: "EPIC", in: 333, color: "#ff9ec7",
      fx: { colors: ["#ff9ec7", "#ffffff", "#ff5a8a"], particles: 40, rise: 0.5, orbit: 6, rings: 1, glow: 1.0 } },

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
    { id: "leg_ninja_jisung", name: "닌자 박지성", grade: "LEGEND", in: 2222, color: "#9b7bff",
      fx: { signature: "ninja", colors: ["#9b7bff", "#e0e0ff", "#2a1a4a"], glow: 0.8 } },
    { id: "leg_pirate_byungeun", name: "해적선장 공병은", grade: "LEGEND", in: 8888, color: "#ffb347",
      fx: { signature: "pirate", colors: ["#ffb347", "#d63b2b", "#f2e6c9"], glow: 0.9 } },
    { id: "leg_swordsman_byungeun", name: "검객 공병은", grade: "LEGEND", in: 3333, color: "#ff5a8a",
      fx: { signature: "swordsman", colors: ["#ff5a8a", "#ffffff", "#ffc2d6"], glow: 0.8 } },
    { id: "leg_dj_tv", name: "DJ 김티비", grade: "LEGEND", in: 5555, color: "#7c4dff",
      fx: { signature: "dj", colors: ["#7c4dff", "#00e5ff", "#ff3bd4"], glow: 0.9 } },
    { id: "leg_necro_tv", name: "강령술사 김티비", grade: "LEGEND", in: 4747, color: "#5dff8a",
      fx: { signature: "necromancer", colors: ["#5dff8a", "#b6ffcf"], glow: 0.8 } },
    { id: "leg_mechangel_minchae", name: "기계 천사 김민채", grade: "LEGEND", in: 7777, color: "#7fe8ff",
      fx: { signature: "mechAngel", colors: ["#7fe8ff", "#ffd34d"], glow: 0.9 } },
    { id: "leg_desert_tv", name: "사막의 공주 김티비", grade: "LEGEND", in: 3030, color: "#ffc857",
      fx: { signature: "desertPrince", colors: ["#ffc857", "#3de0ff"], glow: 0.8 } },
    { id: "leg_golem_jisung", name: "강철 골렘 박지성", grade: "LEGEND", in: 6006, color: "#ff8a3d",
      fx: { signature: "golem", colors: ["#ff8a3d", "#ffd23f"], glow: 0.8 } },

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
    { id: "myth_midas_gaeun", name: "황금손 김가은", grade: "MYTHIC", in: 77777, color: "#ffd34d", line: "손끝이 닿는 모든 것이 금이 된다",
      fx: { signature: "midas", colors: ["#ffd34d", "#fff2b0", "#c28a00"], glow: 1.0 } },
    { id: "myth_time_minchae", name: "시간여행자 김민채", grade: "MYTHIC", in: 250000, color: "#7affd1", line: "어제의 나와 내일의 나가 함께 걷는다",
      fx: { signature: "timeTraveler", colors: ["#7affd1", "#c7a6ff", "#ffffff"], glow: 1.0 } },
    { id: "myth_astro_jisung", name: "우주비행사 박지성", grade: "MYTHIC", in: 99999, color: "#9ad1ff", line: "중력은 그를 붙잡지 못했다",
      fx: { signature: "astronaut", colors: ["#9ad1ff", "#ff9a3c", "#ffffff"], glow: 0.8 } },
    { id: "myth_dragonknight_minchae", name: "용기사 김민채", grade: "MYTHIC", in: 444444, color: "#3ddc84", line: "용이 등을 내어준 단 한 사람",
      fx: { signature: "dragonKnight", colors: ["#3ddc84", "#ff7a1a", "#1b5e3a"], glow: 1.0 } },
    { id: "myth_blackhole_byungeun", name: "블랙홀 공병은", grade: "MYTHIC", in: 131313, color: "#ff9a3c", line: "빛조차 빠져나가지 못한다",
      fx: { signature: "blackHole", colors: ["#ff9a3c", "#8a5cff"], glow: 0.8 } },
    { id: "myth_phoenix_gaeun", name: "불사조 김가은", grade: "MYTHIC", in: 515151, color: "#ff6a1f", line: "재 속에서 다시 날아오른다",
      fx: { signature: "phoenix", colors: ["#ff6a1f", "#ffd23f"], glow: 1.0 } },
    { id: "myth_aurora_gaeun", name: "오로라 여왕 김가은", grade: "MYTHIC", in: 222222, color: "#6bffb8", line: "밤하늘이 그녀를 위해 춤춘다",
      fx: { signature: "auroraQueen", colors: ["#6bffb8", "#9b7bff", "#ffffff"], glow: 0.8 } },
    { id: "myth_thunderbeast_minchae", name: "벼락 신수 김민채", grade: "MYTHIC", in: 666666, color: "#7cc8ff", line: "울음소리 한 번에 하늘이 갈라진다",
      fx: { signature: "thunderBeast", colors: ["#7cc8ff", "#fff27a"], glow: 0.9 } },

    // 7. ANCIENT
    { id: "divine_god", name: "초월자 김건우", grade: "ANCIENT", in: 5000000, color: "#ffe14d", line: "한계를 넘어선 자",
      fx: { signature: "transcend", colors: ["#ffe14d", "#ffffff", "#ffb800"], glow: 1.2 } },
    { id: "divine_knight_gaen_sword", name: "빛의 기사 김가은 : 성검의 소유자", grade: "ANCIENT", in: 6780000, color: "#fff176", line: "빛이 검을 선택했다",
      fx: { signature: "holySword", colors: ["#fff6b0", "#9fe8ff", "#ffffff"], glow: 1.0 } },
    { id: "anc_extinct_minchae", name: "멸종의 김민채", grade: "ANCIENT", in: 6700000, color: "#ff5a1f", line: "하늘에서 마지막 별이 떨어진다",
      fx: { signature: "extinction", colors: ["#ff5a1f", "#ffb02e", "#4a1a0a"], glow: 1.0 } },
    { id: "anc_taichi_jisung", name: "태극권 박지성", grade: "ANCIENT", in: 7900000, color: "#e8f4ff", line: "부드러움이 강함을 이긴다",
      fx: { signature: "taichi", colors: ["#e8f4ff", "#ff3b4a", "#2a6bff"], glow: 0.5 } },
    { id: "anc_nebula_jisung", name: "성운의 주인 박지성", grade: "ANCIENT", in: 3333333, color: "#ff7ad9", line: "별은 그의 손끝에서 태어난다",
      fx: { signature: "nebula", colors: ["#ff7ad9", "#6aa8ff", "#fff1b8"], glow: 0.8 } },
    { id: "anc_iceemperor_tv", name: "얼음 여제 김티비", grade: "ANCIENT", in: 12121212, color: "#9fe6ff", line: "이 땅의 겨울은 끝나지 않는다",
      fx: { signature: "iceEmperor", colors: ["#9fe6ff", "#5ad1ff", "#b48cff"], glow: 0.8 } },
    { id: "anc_fate_gunwoo", name: "운명의 직조자 김건우", grade: "ANCIENT", in: 9999999, color: "#ffd98a", line: "모든 운명은 그의 손끝에서 엮인다",
      fx: { signature: "fateWeaver", colors: ["#ffd98a", "#ff8ad8", "#8ad8ff"], glow: 0.8 } },
    { id: "anc_honor_minchae", name: "명예와 영광 김민채", grade: "ANCIENT", in: 19999999, color: "#ffc94d", line: "내 뒤에 서라. 이 방패가 무너질 일은 없다",
      fx: { signature: "crusader", colors: ["#ffc94d", "#7fd6ff", "#d9dde6"], glow: 0.8 } },
    { id: "anc_empress_gaen", name: "절대여제 김가은", grade: "ANCIENT", in: 17171717, color: "#c77dff", line: "무릎 꿇어라",
      fx: { signature: "empress", colors: ["#c77dff", "#ffd34d", "#ff6ad5"], glow: 1.2 } },

    // 8. ABSOLUTE
    { id: "legend_gonjiam", name: "곤지암병은", grade: "ABSOLUTE", in: 29999999, color: "#00e676", line: "...거기 누구 있어요?",
      fx: { signature: "haunted", colors: ["#00e676", "#8affc1"], glow: 0.9 } },
    { id: "abs_archdemon_tv", name: "대악마 김티비", grade: "ABSOLUTE", in: 38383838, color: "#ff1f3d", line: "지옥의 문은 안쪽에서 열린다",
      fx: { signature: "archdemon", colors: ["#ff1f3d", "#ff8a00", "#ff5a7a"], glow: 1.0 } },
    { id: "abs_chaos_gaeun", name: "혼돈의 신 김가은", grade: "ABSOLUTE", in: 44444444, color: "#d34dff", line: "질서란 잠깐의 착각일 뿐",
      fx: { signature: "chaosGod", colors: ["#d34dff", "#3dfcff", "#ff4d8d"], glow: 0.8 } },
    { id: "abs_breaker_byungeun", name: "폭풍의 눈 공병은", grade: "ABSOLUTE", in: 55555555, color: "#8fd3ff", line: "모든 폭풍의 한가운데는 고요하다",
      fx: { signature: "stormEye", colors: ["#8fd3ff", "#fff27a"], glow: 0.7 } },
    { id: "abs_juggernaut_minchae", name: "저거너트 김민채", grade: "ABSOLUTE", in: 88000000, color: "#ff2a2a", line: "멈출 수 없는 것은, 멈추지 않는다",
      fx: { signature: "juggernaut", colors: ["#ff2a2a", "#ff8a3d", "#ffb3a0"], glow: 0.7 } },
    { id: "abs_sunking_gunwoo", name: "태양왕 김건우", grade: "ABSOLUTE", in: 77777777, color: "#ffb02e", line: "태양은 오직 한 사람을 위해 뜬다",
      fx: { signature: "sunKing", colors: ["#ffb02e", "#ff5a1f", "#fff1b8"], glow: 0.9 } },
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
    ,{ id: "jxs_sans_tv", name: "샌즈. 김티비", grade: "JXS", in: 440000000, color: "#4fc3ff", line: "* 오늘 너는 아주 끔찍한 시간을 보내게 될 거야.", frame: "sans",
      fx: { signature: "sans", colors: ["#4fc3ff", "#ffe14d", "#ffffff"], particles: 6, rise: 0.4, glow: 0.25 } },
    { id: "jxs_darkestnight_minchae", name: "가장 어두운 밤 김민채", grade: "JXS", in: 444444444, color: "#5cf2ff", line: "모든 영혼은 결국 나에게 온다", frame: "hades",
      fx: { signature: "hades", colors: ["#5cf2ff", "#2a7bff", "#c9a24a"], particles: 30, rise: 0.6, glow: 0.6 } }
];
