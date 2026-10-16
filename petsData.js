/* =========================================================
   🐾 펫 데이터 (petsData.js)
   - 알을 부화시켜 얻음. 같은 펫이 또 나오면 레벨 업 (최대 Lv.5)
   - 효과는 레벨마다 +25%씩 커짐 (Lv.5 = 기본의 2배)
   - 한 번에 한 마리만 데리고 다님
   ========================================================= */

export const PET_TIERS = ['COMMON', 'RARE', 'EPIC', 'LEGEND', 'MYTHIC'];

export const PETS = [
    { id: 'pet_slime', name: '꼬마 슬라임', tier: 'COMMON', luck: 0.05, desc: '말랑말랑 통통 튀어요' },
    { id: 'pet_puppy', name: '네모 강아지', tier: 'COMMON', speed: 0.03, desc: '꼬리를 흔들며 졸졸 따라와요' },
    { id: 'pet_cat', name: '픽셀 고양이', tier: 'RARE', luck: 0.12, desc: '가끔 하품을 해요' },
    { id: 'pet_penguin', name: '아기 펭귄', tier: 'RARE', speed: 0.06, desc: '뒤뚱뒤뚱 날개를 파닥여요' },
    { id: 'pet_fox', name: '불꽃 여우', tier: 'EPIC', luck: 0.25, speed: 0.05, desc: '꼬리 끝에서 불꽃이 일렁여요' },
    { id: 'pet_owl', name: '번개 부엉이', tier: 'EPIC', speed: 0.1, desc: '날갯짓마다 번개가 튀어요' },
    { id: 'pet_dragon', name: '크리스탈 드래곤', tier: 'LEGEND', luck: 0.6, desc: '수정 날개로 하늘을 날아요' },
    { id: 'pet_whale', name: '우주 고래', tier: 'LEGEND', luck: 0.4, speed: 0.1, desc: '별을 품고 허공을 헤엄쳐요' },
    { id: 'pet_phoenix', name: '황금 불사조', tier: 'MYTHIC', luck: 1.2, speed: 0.12, desc: '불꽃 꼬리를 남기며 날아요' }
];
export const PET_BY_ID = Object.fromEntries(PETS.map(p => [p.id, p]));

// 알: 등급별로 어떤 펫 등급이 나오는지 (가중치)
export const EGGS = [
    { id: 'egg_basic', name: '평범한 알', price: 30000, color: '#d8d2c0', spot: '#9aa0ad', odds: { COMMON: 70, RARE: 25, EPIC: 5 } },
    { id: 'egg_rare', name: '반짝이는 알', price: 200000, color: '#9fd8ff', spot: '#4da3ff', odds: { RARE: 55, EPIC: 35, LEGEND: 9, MYTHIC: 1 } },
    { id: 'egg_legend', name: '전설의 알', price: 1200000, color: '#ffd23a', spot: '#ff7a1a', odds: { EPIC: 50, LEGEND: 42, MYTHIC: 8 } }
];

export const PET_MAX_LV = 5;
export const petMult = lv => 1 + 0.25 * (Math.max(1, lv) - 1);
