import { AURA_DATA } from './auras.js?v=21';
import { CRAFT_ITEMS } from './craftItems.js?v=21';
import { createMusicPlayer, coverArt } from './music.js?v=21';

/* =========================================================
   📦 게임 데이터
   ========================================================= */

const GRADES = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGEND", "MYTHIC", "ANCIENT", "ABSOLUTE", "JXS"];
const GRADE_ODDS = {
    COMMON: "1 in 2 ~ 10",
    UNCOMMON: "1 in 11 ~ 25",
    RARE: "1 in 26 ~ 99",
    EPIC: "1 in 100 ~ 499",
    LEGEND: "1 in 500 ~ 9,999",
    MYTHIC: "1 in 10,000 ~ 999,999",
    ANCIENT: "1 in 1,000,000 ~ 19,999,999",
    ABSOLUTE: "1 in 20,000,000 ~ 99,999,999",
    JXS: "1 in 100,000,000+"
};
const HIGH_GRADES = ["LEGEND", "MYTHIC", "ANCIENT", "ABSOLUTE", "JXS"];
const CUTSCENE_GRADES = ["ANCIENT", "ABSOLUTE", "JXS"];

const SHOP_ITEMS = [
    { id: "luck_1", name: "행운의 물약 1", price: 300, type: "luck", level: 1, value: 0.15, duration: 120, desc: "+15% 행운 (2분)", frame: "UNCOMMON", color: "#5fe08a" },
    { id: "luck_2", name: "행운의 물약 2", price: 800, type: "luck", level: 2, value: 0.30, duration: 120, desc: "+30% 행운 (2분)", frame: "UNCOMMON", color: "#5fe08a" },
    { id: "luck_3", name: "행운의 물약 3", price: 2000, type: "luck", level: 3, value: 0.66, duration: 120, desc: "+66% 행운 (2분)", frame: "UNCOMMON", color: "#5fe08a" },
    { id: "speed_1", name: "속도의 물약 1", price: 500, type: "speed", level: 1, value: 0.15, duration: 180, desc: "+15% 속도 (3분)", frame: "RARE", color: "#4da3ff" },
    { id: "speed_2", name: "속도의 물약 2", price: 1200, type: "speed", level: 2, value: 0.30, duration: 180, desc: "+30% 속도 (3분)", frame: "RARE", color: "#4da3ff" },
    { id: "speed_3", name: "속도의 물약 3", price: 3000, type: "speed", level: 3, value: 0.55, duration: 180, desc: "+55% 속도 (3분)", frame: "RARE", color: "#4da3ff" },
    { id: "limit_potion", name: "한계의 물약", price: 40000, type: "luck_mult", value: 5000, maxUses: 3, desc: "×5,000 행운 (3회)", frame: "LEGEND", color: "#ff7a1a" },
    { id: "overcome_potion", name: "극복의 물약", price: 250000, type: "luck_mult", value: 50000, maxUses: 2, desc: "×50,000 행운 (2회)", frame: "MYTHIC", color: "#00e5ff", color2: "#6a5cff" },
    { id: "heaven_potion", name: "천상의 물약", price: 400000, type: "luck_mult", value: 150000, maxUses: 1, desc: "×150,000 행운 (1회)", frame: "ANCIENT", color: "#ffe39a" },
    { id: "void_potion", name: "공허의 물약", price: 2000000, type: "luck_mult", value: 700000, maxUses: 1, desc: "×700,000 행운 (1회)", frame: "JXS", unique: "voidpotion", color: "#b026ff", color2: "#ff2d55" }
];

const QUEST_DATA = [
    {
        id: "quest_swift", name: "신속하게", repeatable: false,
        desc: "빠른 롤을 쓸 자격을 증명하세요.",
        rewardDesc: "빠른 롤 해금 + 천상의 물약 5개",
        reward: { unlockQuickRoll: true, items: { heaven_potion: 5 } },
        targets: { rolls: 5000, ancient: 15, absolute: 5, jc: 3000000, shopPurchases: 20 }
    },
    {
        id: "quest_repeat_overcome", name: "극복의 시련", repeatable: true,
        desc: "지속적인 시련을 극복하고 성장의 기반을 다지세요.",
        rewardDesc: "🧪 극복의 물약 1개 + 🪙 100,000 JC",
        reward: { items: { overcome_potion: 1 }, jc: 100000 },
        targets: { rolls: 500, legend: 5, mythic: 3 }
    },
    {
        id: "quest_repeat_heaven", name: "천상의 시련", repeatable: true,
        desc: "천상에 도달하기 위한 극한의 운명을 테스트하세요.",
        rewardDesc: "🧪 천상의 물약 1개 + 🪙 200,000 JC",
        reward: { items: { heaven_potion: 1 }, jc: 200000 },
        targets: { rolls: 1000, legend: 7, mythic: 5 }
    }
];
const QUEST_TARGET_LABELS = {
    rolls: n => `롤 ${fmt(n)}번 하기`,
    legend: n => `LEGEND ${n}개 뽑기`,
    mythic: n => `MYTHIC ${n}개 뽑기`,
    ancient: n => `ANCIENT ${n}개 뽑기`,
    absolute: n => `ABSOLUTE ${n}개 뽑기`,
    jc: n => `${fmt(n)} JC 모으기`,
    shopPurchases: n => `상점 아이템 ${n}개 구매`
};

const COUPONS = {
    'JSRNG2.0': { jc: 500000, items: { limit_potion: 3, overcome_potion: 1, heaven_potion: 1 }, msg: "🪙 50만 JC + 🧪 한계의 물약 3개 + 극복의 물약 1개 + 천상의 물약 1개" }
};

const DEV_PASSWORD = "3699";
const SAVE_KEY = 'js_rng_demo_save';   // 데모 버전: 예전 기록과 따로 새로 시작
const SOUND_KEY = 'js_rng_sound';

// 칭호 확률·판매가 계산
AURA_DATA.sort((a, b) => a.in - b.in);
for (const aura of AURA_DATA) {
    aura.chance = 100 / aura.in;
    let baseJc = Math.max(1, Math.floor(aura.in / 5));
    if (["MYTHIC", "ANCIENT", "ABSOLUTE", "JXS"].includes(aura.grade)) baseJc = Math.floor(baseJc * 0.5);
    if (["ANCIENT", "ABSOLUTE", "JXS"].includes(aura.grade)) baseJc = Math.floor(baseJc * 0.6);
    aura.jcValue = Math.max(1, baseJc);
}
const AURA_BY_ID = Object.fromEntries(AURA_DATA.map(a => [a.id, a]));
const SHOP_BY_ID = Object.fromEntries(SHOP_ITEMS.map(i => [i.id, i]));
const CRAFT_BY_ID = Object.fromEntries(CRAFT_ITEMS.map(i => [i.id, i]));

/* =========================================================
   🛠️ 작은 도우미
   ========================================================= */

const $ = id => document.getElementById(id);
const fmt = n => Number(n || 0).toLocaleString();
const gradeCol = g => `col-${g.toLowerCase()}`;

// 칭호 색 3개 (아우라 색 그대로)
function auraColors(aura) {
    const c = aura.fx?.colors || [aura.color];
    return [c[0], c[1] || c[0], c[2] || c[1] || c[0]];
}
function colorVars(c) { return `--c1:${c[0]};--c2:${c[1]};--c3:${c[2]};`; }

// 칭호 이름 (등급마다 다른 글자 연출: rarity.css 의 .nm-<등급>)
function auraNameHtml(aura) {
    return `<span class="nm nm-${aura.grade.toLowerCase()}" style="${colorVars(auraColors(aura))}">${aura.name}</span>`;
}

// 카드 테두리 (rarity.css 의 .fr-<등급>). JXS는 번개 SVG를 같이 넣음
function frameAttrs(grade, colors, unique) {
    return `class="fr fr-${grade.toLowerCase()}${unique ? ` fr-u-${unique}` : ''}" style="${colorVars(colors)}"`;
}
function boltSvg() {
    const edge = side => {
        // 테두리 한 변을 따라 지그재그
        let d = '', n = 7;
        const start = Math.random() * 40, len = 35 + Math.random() * 30;
        for (let i = 0; i <= n; i++) {
            const along = start + (len * i) / n, off = (Math.random() - 0.5) * 9;
            const [x, y] = side === 0 ? [along, off + 2] : side === 1 ? [98 + off, along] : side === 2 ? [100 - along, 98 + off] : [off + 2, 100 - along];
            d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
        }
        return `<path d="${d}"/>`;
    };
    return `<svg class="fr-bolts" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${[0, 1, 2, 3].map(edge).join('')}</svg>`;
}
// 고유 테두리 장식
function voidCracks() {
    const crack = (x, y, a) => {
        let d = `M${x} ${y}`, px = x, py = y;
        for (let i = 0; i < 4; i++) { a += (Math.random() - 0.5) * 1.2; px += Math.cos(a) * 7; py += Math.sin(a) * 7; d += ` L${px.toFixed(1)} ${py.toFixed(1)}`; }
        return `<path d="${d}"/>`;
    };
    return `<svg class="fr-deco" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${crack(0, 20, 0.3)}${crack(100, 70, Math.PI - 0.3)}${crack(30, 100, -1.3)}${crack(80, 0, 1.9)}</svg>`;
}
function roseDeco() {
    const rose = (x, y) => `<g class="rose">${[0, 1, 2, 3].map(i => `<rect x="${x - 5 + i * 1.2}" y="${y - 5 + i * 1.2}" width="${10 - i * 2.4}" height="${10 - i * 2.4}" fill="hsl(350,100%,${30 + i * 9}%)" transform="rotate(${i * 22} ${x} ${y})"/>`).join('')}</g>`;
    const petal = x => `<rect class="petal" x="${x}" y="0" width="3" height="2" fill="#ff3d63"/>`;
    return `<svg class="fr-deco" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${rose(4, 4)}${rose(96, 96)}${petal(20)}${petal(50)}${petal(75)}${petal(35)}</svg>`;
}
function sansDeco() {
    const bone = x => `<g class="bone"><rect x="${x}" y="82" width="2.4" height="16" fill="#fff"/><rect x="${x - 1}" y="80" width="2" height="3" fill="#fff"/><rect x="${x + 1.4}" y="80" width="2" height="3" fill="#fff"/></g>`;
    const heart = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'].map((row, r) => [...row].map((c, k) => c === '1' ? `<rect x="${4 + k * 1.1}" y="${5 + r * 1.1}" width="1.1" height="1.1" fill="#ff1a1a"/>` : '').join('')).join('');
    return `<svg class="fr-deco" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${[14, 30, 46, 62, 78, 90].map(bone).join('')}<g class="soul">${heart}</g><rect class="eye" x="90" y="5" width="4" height="4"/></svg>`;
}
function hadesDeco() {
    // 위아래 금빛 그리스 무늬(네모 소용돌이) + 바닥에서 피어오르는 푸른 불꽃
    let key = '';
    for (let x = 0; x < 100; x += 10) key += `<path d="M${x} 3 h8 v4 h-5 v-2 h2" fill="none" stroke="#c9a24a" stroke-width="1"/><path d="M${x} 97 h8 v-4 h-5 v2 h2" fill="none" stroke="#c9a24a" stroke-width="1"/>`;
    const flame = x => `<rect class="hf" x="${x}" y="78" width="3" height="14" fill="#5cf2ff"/>`;
    return `<svg class="fr-deco" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${key}${[8, 22, 37, 52, 66, 80, 92].map(flame).join('')}</svg>`;
}
function frameDeco(grade, unique) {
    if (unique === 'void') return voidCracks();
    if (unique === 'hades') return hadesDeco();
    if (unique === 'sans') return sansDeco();
    if (unique === 'rose') return roseDeco();
    if (unique === 'voidpotion') return '';
    return grade === 'JXS' ? boltSvg() : '';
}

function addItems(items) {
    for (const id in items) gameState.itemInventory[id] = (gameState.itemInventory[id] || 0) + items[id];
}

/* ---------- 토스트 ---------- */
function toast(msg, type = '') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    const wrap = $('toast-wrap');
    while (wrap.children.length >= 2) wrap.firstChild.remove();
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ---------- 확인 / 입력 다이얼로그 ---------- */
function ask({ title, message = '', input = false, okText = '확인', danger = false }) {
    return new Promise(resolve => {
        const dlg = $('ask-dialog'), inp = $('ask-input'), ok = $('ask-ok');
        $('ask-title').textContent = title;
        $('ask-msg').textContent = message;
        ok.textContent = okText;
        ok.className = `btn ${danger ? 'btn-red' : 'btn-primary'}`;
        inp.classList.toggle('hidden', !input);
        inp.value = '';
        dlg.classList.remove('hidden');
        if (input) setTimeout(() => inp.focus(), 50);

        const done = val => {
            dlg.classList.add('hidden');
            dlg.removeEventListener('click', onClick);
            inp.removeEventListener('keydown', onKey);
            resolve(val);
        };
        const onClick = e => {
            const act = e.target.dataset.ask;
            if (act === 'ok') done(input ? inp.value : true);
            else if (act === 'cancel' || e.target === dlg) done(input ? null : false);
        };
        const onKey = e => { if (e.key === 'Enter') done(inp.value); };
        dlg.addEventListener('click', onClick);
        inp.addEventListener('keydown', onKey);
    });
}

/* ---------- 수량 선택 다이얼로그 (판매/구매/사용 공용) ---------- */
const qty = { max: 1, min: 1, priceEach: 0, totalLabel: '', onConfirm: null };

function openQtyDialog({ title, sub = '', max, min = 1, initial, priceEach = 0, totalLabel = '', okText = '확인', onConfirm }) {
    Object.assign(qty, { max, min, priceEach, totalLabel, onConfirm });
    $('qty-title').textContent = title;
    $('qty-sub').textContent = sub;
    $('qty-confirm').textContent = okText;
    const slider = $('qty-slider');
    slider.min = min; slider.max = Math.max(min, max);
    setQty(initial ?? min);
    $('qty-dialog').classList.remove('hidden');
}

function setQty(v) {
    v = parseInt(v);
    if (isNaN(v)) v = qty.min;
    v = Math.min(qty.max, Math.max(qty.min, v));
    $('qty-slider').value = v;
    $('qty-input').value = v;
    $('qty-total').textContent = qty.priceEach ? `${qty.totalLabel} ${fmt(v * qty.priceEach)} JC` : '';
    return v;
}

$('qty-slider').addEventListener('input', e => setQty(e.target.value));
$('qty-input').addEventListener('change', e => setQty(e.target.value));
$('qty-dialog').addEventListener('click', async e => {
    const t = e.target;
    if (t.dataset.step) {
        const cur = parseInt($('qty-input').value) || qty.min;
        setQty(t.dataset.step === 'max' ? qty.max : cur + parseInt(t.dataset.step));
    } else if (t.dataset.qty === 'cancel' || t === $('qty-dialog')) {
        $('qty-dialog').classList.add('hidden');
    } else if (t.dataset.qty === 'ok') {
        const v = setQty($('qty-input').value);
        $('qty-dialog').classList.add('hidden');
        if (qty.onConfirm) await qty.onConfirm(v);
    }
});

/* =========================================================
   💾 상태 & 저장 (이 기기 localStorage)
   ========================================================= */

function createInitialGameState() {
    return {
        rolls: 0, luck: 1, jc: 0,
        inventory: {}, itemInventory: {}, discoveredAuras: [],
        autoDelete: {},
        activeBuffs: { luckBonus: 0, speedBonus: 0, luckExpireTime: 0, speedExpireTime: 0, luckLevel: 0, speedLevel: 0 },
        activeMultBuffs: [],
        gear: null, amulet: null, amuletStack: 0, craftedGears: [], usedCodes: [],
        completedQuests: [], activeQuest: null, questProgress: {}, quickRollUnlocked: false,
        equippedAura: null
    };
}

let gameState = createInitialGameState();
let backupGameState = null;   // 개발자 모드 중 원본 보관
let nextRollOverride = null;

function saveGame() {
    if (backupGameState !== null) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function loadGame() {
    const base = createInitialGameState();
    try {
        const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
        if (saved) {
            gameState = { ...base, ...saved, activeBuffs: { ...base.activeBuffs, ...(saved.activeBuffs || {}) } };
        }
    } catch (e) { gameState = base; }
    for (const id in gameState.inventory) {
        if (!gameState.discoveredAuras.includes(id)) gameState.discoveredAuras.push(id);
    }
}

window.addEventListener('beforeunload', () => {
    if (backupGameState !== null) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(backupGameState));
    }
});

/* =========================================================
   🔊 사운드
   ========================================================= */

let soundSettings = { enabled: true, master: 1.0, bgm: 0.7, cutscene: 0.5, click: 1.0, roll: 1.0 };
try { soundSettings = { ...soundSettings, ...JSON.parse(localStorage.getItem(SOUND_KEY) || '{}') }; } catch (e) {}
const saveSoundSettings = () => localStorage.setItem(SOUND_KEY, JSON.stringify(soundSettings));

const audioFiles = {
    click: new Audio('click.mp3'),
    dropLegend: new Audio('drop_legend.mp3'),
    dropMythic: new Audio('drop_mythic.mp3'),
    divine_all: new Audio('divine_full.mp3'),
    cosmic_all: new Audio('cosmic_full.mp3'),
    js_all: new Audio('js_full.mp3')
};
const music = createMusicPlayer({
    getVolume: () => soundSettings.master * soundSettings.bgm,
    isEnabled: () => soundSettings.enabled
});
function updateBgmVolume() { music.updateVolume(); }
function playBgm(type) { music.start(type); }
function stopBgm() {
    music.stop();
}

let audioCtx = null;
function initSynthAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playTone(freq, type, vol, attack, release) {
    if (!soundSettings.enabled) return;
    try {
        initSynthAudio();
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        const t = audioCtx.currentTime;
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(soundSettings.master * vol, t + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, t + attack + release);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(t + attack + release);
    } catch (e) {}
}
const playRollTick = () => playTone(150, 'triangle', 0.15 * soundSettings.roll, 0.01, 0.08);
const playNormalDrop = () => playTone(600, 'sine', 0.2 * soundSettings.cutscene, 0.02, 0.4);

function playClip(key, volume) {
    if (!soundSettings.enabled || !audioFiles[key]) return null;
    const clip = audioFiles[key].cloneNode();
    clip.volume = volume;
    clip.play().catch(() => {});
    return clip;
}

function playDropSound(grade) {
    const vol = soundSettings.master * soundSettings.cutscene;
    if (grade === "MYTHIC") playClip('dropMythic', vol);
    else if (grade === "LEGEND") playClip('dropLegend', vol);
    else if (!CUTSCENE_GRADES.includes(grade)) playNormalDrop();
}

let cutsceneAudio = null;
function stopCutsceneAudio() {
    if (cutsceneAudio) { cutsceneAudio.pause(); cutsceneAudio = null; }
}

document.body.addEventListener('click', () => {
    initSynthAudio();
    music.unlock();
}, { once: true });

document.body.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn && btn.id !== 'roll-btn' && btn.id !== 'skip-cutscene-btn') {
        playClip('click', soundSettings.master * soundSettings.click);
    }
});

/* =========================================================
   🍀 행운 / 속도 계산
   ========================================================= */

function getGear() { return gameState.gear ? CRAFT_BY_ID[gameState.gear] : null; }
function getAmuletMult() {
    if (gameState.amulet === "amulet_drum") return 2;
    if (gameState.amulet === "amulet_commander") return 5;
    return 0;
}
function getMultBonus() {
    return (gameState.activeMultBuffs || []).reduce((s, b) => s + b.bonus, 0);
}
function getSpeedBonus() {
    return (gameState.activeBuffs.speedBonus || 0) + (getGear()?.speedBonus || 0);
}
function getBaseLuck() {
    return gameState.luck + (getGear()?.luckBonus || 0) + (gameState.activeBuffs.luckBonus || 0);
}
// 화면 표시용 (다음 롤 기준)
function getDisplayLuck() {
    let luck = getBaseLuck();
    const am = getAmuletMult();
    if (am && gameState.amuletStack >= 10) luck *= am;
    return luck + getMultBonus();
}

/* =========================================================
   🎲 뽑기
   ========================================================= */

let isRolling = false, isAutoRolling = false, isQuickRollActive = false;
let resultSettleTimer = 0;

const workerBlob = new Blob([`
    let timer = null;
    self.onmessage = e => {
        if (e.data.command === 'start') { clearInterval(timer); timer = setInterval(() => self.postMessage('tick'), e.data.interval || 100); }
        else { clearInterval(timer); timer = null; }
    };
`], { type: 'application/javascript' });
const autoWorker = new Worker(URL.createObjectURL(workerBlob));
autoWorker.onmessage = e => { if (e.data === 'tick' && isAutoRolling && !isRolling) startRoll(); };
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isAutoRolling && !isRolling) startRoll();
});

function trackQuestProgress(type, amount = 1) {
    const qId = gameState.activeQuest;
    if (!qId) return;
    if (!gameState.questProgress[qId]) gameState.questProgress[qId] = {};
    gameState.questProgress[qId][type] = (gameState.questProgress[qId][type] || 0) + amount;
}

function startRoll() {
    if (isRolling) return;
    isRolling = true;
    ui.rollBtn.disabled = true;
    ui.rollBtn.classList.remove('cooldown-active');
    gameState.rolls++;
    trackQuestProgress("rolls");
    renderStats();
    saveGame();

    stage3d?.setRolling(true);
    if (isQuickRollActive && gameState.quickRollUnlocked) { finishRoll(); return; }

    const maxTime = Math.max(400, 1200 * (1 - getSpeedBonus()));
    const step = 60;
    let elapsed = 0;
    const timer = setInterval(() => {
        playRollTick();
        const fake = AURA_DATA[Math.floor(Math.random() * AURA_DATA.length)];
        ui.display.innerHTML = `<div class="rolling-text result-name">${auraNameHtml(fake)}</div>`;
        elapsed += step;
        if (elapsed >= maxTime) { clearInterval(timer); finishRoll(); }
    }, step);
}

function pickAura() {
    if (nextRollOverride) {
        const forced = AURA_BY_ID[nextRollOverride];
        nextRollOverride = null;
        if (forced) return forced;
    }

    let baseLuck = getBaseLuck();
    const am = getAmuletMult();
    if (am) {
        if (gameState.amuletStack >= 10) { baseLuck *= am; gameState.amuletStack = 0; }
        else gameState.amuletStack = (gameState.amuletStack || 0) + 1;
    }

    const multBonus = getMultBonus();
    const totalLuck = baseLuck + multBonus;

    // 솔스 RNG 방식: 가장 희귀한 칭호부터 '행운 ÷ N' 확률로 판정.
    // 배수 물약은 행운만 크게 올려 줌 → 희귀 칭호 확률이 행운만큼 올라가고,
    // 행운보다 흔한 칭호 중 가장 희귀한 것이 바닥(보장)이 됨.
    // (예전엔 행운보다 흔한 칭호를 통째로 빼서 특정 칭호 하나만 쏟아지던 버그)
    for (let i = AURA_DATA.length - 1; i >= 0; i--) {
        if (Math.random() < totalLuck / AURA_DATA[i].in) return AURA_DATA[i];
    }
    return AURA_DATA[0];
}

async function finishRoll() {
    const rolled = pickAura();

    const gradeKey = rolled.grade.toLowerCase();
    if (["legend", "mythic", "ancient", "absolute"].includes(gradeKey)) trackQuestProgress(gradeKey);

    if (gameState.activeMultBuffs.length) {
        gameState.activeMultBuffs.forEach(b => b.uses--);
        gameState.activeMultBuffs = gameState.activeMultBuffs.filter(b => b.uses > 0);
    }

    const isNew = !gameState.discoveredAuras.includes(rolled.id);
    if (isNew) gameState.discoveredAuras.push(rolled.id);

    if (CUT_CFG[rolled.grade] && stage3d) {
        await playCinematic(rolled);
    } else if (CUTSCENE_GRADES.includes(rolled.grade)) {
        // 3D를 못 쓰는 기기: 소리 + 화면 가장자리 빛만
        playClip(CUT_CFG[rolled.grade].sound, soundSettings.master * soundSettings.cutscene);
        playShakeGlow(rolled);
    } else if (rolled.grade === "LEGEND" || rolled.grade === "MYTHIC") {
        playShakeGlow(rolled);
        setTimeout(() => playDropSound(rolled.grade), 50);
    }

    music.unduck();

    let soldHtml = "";
    if (gameState.autoDelete[rolled.grade]) {
        gameState.jc += rolled.jcValue;
        soldHtml = `<div class="result-sold">자동 판매 +${fmt(rolled.jcValue)} JC</div>`;
    } else {
        gameState.inventory[rolled.id] = (gameState.inventory[rolled.id] || 0) + 1;
        const equipped = AURA_BY_ID[gameState.equippedAura];
        // 처음 뽑은 칭호만 자동 장착 (두 번째부터는 그대로)
        if (isNew && (!equipped || rolled.in > equipped.in)) {
            gameState.equippedAura = rolled.id;
            applyEquippedAura();
            soldHtml = `<div class="result-equip">아우라 장착</div>`;
        }
    }
    saveGame();
    renderStats();

    stage3d?.setRolling(false);
    ui.display.innerHTML = `
        <div class="result-pop" style="--res:${rolled.color}">
            <div class="result-grade ${gradeCol(rolled.grade)}">${rolled.grade}${isNew ? '<span class="new-tag">NEW</span>' : ''}</div>
            <div class="result-name">${auraNameHtml(rolled)}</div>
            <div class="result-chance">1 in ${fmt(rolled.in)}</div>
            ${soldHtml}
        </div>`;

    // 결과를 잠깐 크게 보여 줬다가 작게 물러나게
    document.body.classList.add('result-fresh');
    clearTimeout(resultSettleTimer);
    const pop = ui.display.querySelector('.result-pop');
    resultSettleTimer = setTimeout(() => { pop?.classList.add('settled'); document.body.classList.remove('result-fresh'); }, HIGH_GRADES.includes(rolled.grade) ? 4000 : 2200);

    const cooldown = Math.max(300, (isAutoRolling ? 2000 : 1000) * (1 - getSpeedBonus()));
    ui.rollBtn.classList.remove('cooldown-active');
    void ui.cooldownBar.offsetWidth;
    ui.cooldownBar.style.animationDuration = `${cooldown}ms`;
    ui.rollBtn.classList.add('cooldown-active');

    setTimeout(() => {
        ui.rollBtn.classList.remove('cooldown-active');
        ui.rollBtn.disabled = false;
        isRolling = false;
        renderStats();
        if (isAutoRolling) startRoll();
    }, cooldown);
}

/* ---------- 3D 컷씬 ----------
   사운드 길이와 터지는 지점에 맞춤 (ffprobe로 잰 값)
     divine_full.mp3  19.6초, 9.5초에 쾅
     cosmic_full.mp3  18.6초, 10.25초에 쾅
     js_full.mp3      22.8초, 9.5초에 1차 / 16초에 2차 클라이맥스
   MYTHIC은 솔스처럼 짧은 별 뽑기 (등장음은 터질 때)
*/
const CUT_CFG = {
    MYTHIC:   { tier: 'MYTHIC',   hit: 2.3,  total: 4.4,  sound: null },
    ANCIENT:  { tier: 'ANCIENT',  hit: 9.5,  total: 19.6, sound: 'divine_all' },
    ABSOLUTE: { tier: 'ABSOLUTE', hit: 10.25, total: 18.6, sound: 'cosmic_all' },
    JXS:      { tier: 'JXS',      hit: 9.5,  hit2: 16.0, total: 22.8, sound: 'js_all' }
};

const cine = {
    el: $('cine'),
    flash: document.querySelector('.cine-flash'),
    crack: document.querySelector('.cine-crack'),
    title: document.querySelector('.cine-title'),
    grade: document.querySelector('.cine-grade'),
    name: document.querySelector('.cine-name'),
    chance: document.querySelector('.cine-chance'),
    line: document.querySelector('.cine-line'),
    skip: document.querySelector('.cine-skip')
};

// 짧은 상승음 (MYTHIC 별 뽑기용)
function playRiser(sec) {
    if (!soundSettings.enabled) return;
    try {
        initSynthAudio();
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + sec);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.08 * soundSettings.master * soundSettings.cutscene, t + sec * 0.9);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + sec);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(t + sec);
    } catch (e) {}
}

// 화면 깨짐: 터진 지점에서 사방으로 금
function drawCrack(color) {
    const cx = 50 + (Math.random() - 0.5) * 8, cy = 40 + (Math.random() - 0.5) * 8;
    let paths = '';
    for (let i = 0; i < 14; i++) {
        let a = (i / 14) * Math.PI * 2 + Math.random() * 0.3, x = cx, y = cy, d = `M${x} ${y}`;
        for (let k = 0; k < 6; k++) {
            a += (Math.random() - 0.5) * 0.7;
            const len = 6 + Math.random() * 12;
            x += Math.cos(a) * len; y += Math.sin(a) * len;
            d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        paths += `<path d="${d}"/>`;
    }
    let rings = '';
    for (let r = 6; r < 40; r += 9 + Math.random() * 6) {
        const pts = Array.from({ length: 9 }, (_, k) => {
            const a = (k / 8) * Math.PI * 2, rr = r * (0.8 + Math.random() * 0.4);
            return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
        }).join(' ');
        rings += `<polyline points="${pts}"/>`;
    }
    cine.crack.innerHTML = `<g stroke="${color}" fill="none" stroke-width="0.35" vector-effect="non-scaling-stroke">${paths}${rings}</g>`;
    cine.crack.classList.remove('show'); void cine.crack.getBoundingClientRect(); cine.crack.classList.add('show');
}

function cineFlash(strong) {
    cine.flash.classList.remove('go', 'strong');
    void cine.flash.offsetWidth;
    cine.flash.classList.add('go');
    if (strong) cine.flash.classList.add('strong');
}

async function playCinematic(rolled) {
    const cfg = CUT_CFG[rolled.grade];
    const finalHit = cfg.hit2 || cfg.hit;

    // 칭호 공개 글자 준비
    cine.grade.textContent = rolled.grade;
    cine.grade.className = `cine-grade ${gradeCol(rolled.grade)}`;
    cine.name.innerHTML = auraNameHtml(rolled);
    cine.chance.textContent = `1 in ${fmt(rolled.in)}`;
    cine.line.textContent = rolled.line || '';
    cine.el.className = `tier-${cfg.tier.toLowerCase()}`;
    cine.title.classList.remove('show', 'pre');
    cine.crack.classList.remove('show');
    document.body.classList.add('cine-on');
    music.duck();

    // 시계 (사운드와 같이 감)
    const t0 = performance.now();
    let offset = 0;
    const getTime = () => (performance.now() - t0) / 1000 + offset;

    stopCutsceneAudio();
    if (cfg.sound) cutsceneAudio = playClip(cfg.sound, soundSettings.master * soundSettings.cutscene);
    else playRiser(cfg.hit);

    let done = false;
    const onSkip = () => {
        const now = getTime();
        if (now < finalHit - 0.3) {
            // 터지는 순간 바로 앞으로 건너뜀
            offset += (finalHit - 0.25) - now;
            if (cutsceneAudio) cutsceneAudio.currentTime = finalHit - 0.25;
        } else {
            offset += cfg.total - now;   // 바로 끝
        }
    };
    cine.skip.addEventListener('click', onSkip);

    // 화면 효과 (섬광, 깨짐, 글자)를 시간에 맞춰
    const fired = {};
    const loop = () => {
        if (done) return;
        const t = getTime();
        if (!fired.hit && t >= cfg.hit) {
            fired.hit = true;
            cineFlash(true);
            if (cfg.tier === 'MYTHIC') playDropSound('MYTHIC');
            if (cfg.tier === 'ABSOLUTE' || (cfg.tier === 'JXS' && !cfg.hit2)) drawCrack('#ffffff');
            if (cfg.hit2) { drawCrack(rolled.color); cine.title.classList.add('pre'); }
        }
        if (cfg.hit2 && !fired.hit2 && t >= cfg.hit2) {
            fired.hit2 = true;
            cineFlash(true);
            drawCrack('#ffffff');
            cine.title.classList.remove('pre');
        }
        if (!fired.title && t >= finalHit + 0.35) {
            fired.title = true;
            cine.title.classList.add('show');
        }
        if (!fired.out && t >= cfg.total - 0.7) {
            fired.out = true;
            cine.el.classList.add('closing');
        }
        requestAnimationFrame(loop);
    };
    cine.el.classList.remove('hidden');
    requestAnimationFrame(loop);

    await stage3d.playCutscene(rolled, cfg, getTime);

    done = true;
    cine.skip.removeEventListener('click', onSkip);
    if (cutsceneAudio && getTime() < cfg.total - 0.5) {
        // 건너뛰어서 일찍 끝났으면 소리를 부드럽게 줄임
        const a = cutsceneAudio, v0 = a.volume;
        let k = 0;
        const fade = setInterval(() => { k += 0.1; a.volume = Math.max(0, v0 * (1 - k)); if (k >= 1) { clearInterval(fade); a.pause(); } }, 40);
    }
    cine.el.classList.add('hidden');
    cine.el.classList.remove('closing');
    document.body.classList.remove('cine-on');
}

/* ---------- 연출 ---------- */
function playShakeGlow(rolled) {
    stage3d?.shake(CUTSCENE_GRADES.includes(rolled.grade) ? 0.6 : 0.35);
    ui.glowOverlay.style.boxShadow = `inset 0 0 70px 25px ${rolled.color || "#f1c40f"}`;
    ui.glowOverlay.classList.remove('hidden');
    setTimeout(() => { ui.glowOverlay.classList.add('hidden'); }, 1500);
}

/* =========================================================
   🖥️ UI 참조
   ========================================================= */

const ui = {
    rollCount: $('roll-count'), jcCount: $('jc-count'),
    luck: $('luck-multiplier'), speed: $('speed-multiplier'), buffs: $('active-buffs'),
    display: $('aura-display'), stage: document.querySelector('.stage'),
    rollBtn: $('roll-btn'), btnSub: $('btn-sub-text'), cooldownBar: $('cooldown-bar'),
    autoBtn: $('auto-roll-btn'), quickBtn: $('quick-roll-btn'),
    glowOverlay: $('border-glow-overlay'),
    inventoryGrid: $('inventory-grid'), potionGrid: $('potion-grid'),
    craftGrid: $('craft-grid'), shopGrid: $('shop-grid'), questList: $('quest-list'),
    indexGrid: $('index-grid'), indexProgress: $('index-progress'),
    autoSellGrid: $('auto-sell-grid'), gradeTable: $('grade-table'),
    mainDevBtn: $('main-dev-btn')
};

/* =========================================================
   🎨 렌더링
   ========================================================= */

function setNum(el, text) {
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}

function renderStats() {
    setNum(ui.rollCount, fmt(gameState.rolls));
    setNum(ui.jcCount, fmt(gameState.jc));
    ui.luck.textContent = fmt(Math.round(getDisplayLuck() * 100) / 100);
    ui.speed.textContent = (1 + getSpeedBonus()).toFixed(2);

    const am = getAmuletMult();
    ui.btnSub.classList.toggle('hidden', !am);
    if (am) {
        ui.btnSub.textContent = gameState.amuletStack >= 10 ? `다음 롤 행운 ×${am}!` : `부적 ${gameState.amuletStack} / 10`;
        ui.btnSub.style.color = gameState.amuletStack >= 10 ? 'var(--gold)' : '';
    }
}

function renderBuffs() {
    const now = Date.now();
    const b = gameState.activeBuffs;
    const pills = [];
    if (b.luckExpireTime > now) pills.push(`<span class="buff">행운 물약 ${b.luckLevel}  ${Math.ceil((b.luckExpireTime - now) / 1000)}s</span>`);
    if (b.speedExpireTime > now) pills.push(`<span class="buff">속도 물약 ${b.speedLevel}  ${Math.ceil((b.speedExpireTime - now) / 1000)}s</span>`);
    gameState.activeMultBuffs.forEach(m => pills.push(`<span class="buff mult">${m.name} ×${m.uses}</span>`));
    const gear = getGear();
    if (gear) pills.push(`<span class="buff gear">${gear.name}</span>`);
    if (gameState.amulet) pills.push(`<span class="buff gear">${CRAFT_BY_ID[gameState.amulet]?.name || ''}</span>`);
    ui.buffs.innerHTML = pills.join('');
}

function renderRollToggles() {
    ui.autoBtn.classList.toggle('active', isAutoRolling);
    ui.autoBtn.textContent = 'AUTO';
    ui.quickBtn.disabled = !gameState.quickRollUnlocked;
    ui.quickBtn.classList.toggle('active', isQuickRollActive);
    ui.quickBtn.textContent = gameState.quickRollUnlocked ? 'QUICK' : 'QUICK 🔒';
}

function gradeHeader(grade, extra = '') {
    return `<div class="grade-header ${gradeCol(grade)}">${grade}${extra ? ` <span class="count">${extra}</span>` : ''}</div>`;
}

function renderInventory() {
    let html = '';
    for (const grade of GRADES) {
        const owned = AURA_DATA.filter(a => a.grade === grade && gameState.inventory[a.id]);
        if (!owned.length) continue;
        html += gradeHeader(grade);
        for (const a of owned) {
            const on = gameState.equippedAura === a.id;
            html += `
            <button type="button" ${frameAttrs(a.grade, auraColors(a), a.frame).replace('class="', `class="card bag-card ${on ? 'is-on' : ''} `)} data-aura="${a.id}">${frameDeco(a.grade, a.frame)}
                ${on ? '<span class="eq-tag">장착 중</span>' : ''}
                <div class="card-name">${auraNameHtml(a)}</div>
                <div class="card-have">×${fmt(gameState.inventory[a.id])}</div>
            </button>`;
        }
    }
    ui.inventoryGrid.classList.add('card-grid');
    ui.inventoryGrid.innerHTML = html || `<div class="empty">아직 칭호가 없습니다.<br>ROLL로 첫 칭호를 뽑아 보세요.</div>`;
}

function renderPotions() {
    const ids = Object.keys(gameState.itemInventory).filter(id => SHOP_BY_ID[id] && gameState.itemInventory[id] > 0);
    ui.potionGrid.classList.add('row-list');
    ui.potionGrid.innerHTML = ids.length ? ids.map(id => {
        const item = SHOP_BY_ID[id];
        return `
        <div ${frameAttrs(item.frame, [item.color, item.color2 || item.color, item.color], item.unique).replace('class="', 'class="row ')}>${frameDeco(item.frame, item.unique)}
            ${vialHtml(item)}
            <div class="row-main">
                <div class="row-name">${item.name}</div>
                <div class="row-desc">${item.desc}</div>
            </div>
            <div class="row-side">
                <div class="row-have">×${fmt(gameState.itemInventory[id])}</div>
                <button class="btn btn-sm btn-green" data-use="${id}">사용</button>
            </div>
        </div>`;
    }).join('') : `<div class="empty">물약이 없습니다.<br>상점에서 구매할 수 있어요.</div>`;
}

// 네모 물약병 아이콘
function vialHtml(item) {
    return `<div class="vial" style="--c1:${item.color};--c2:${item.color2 || item.color}"><i class="vial-neck"></i><i class="vial-body"><i class="vial-liquid"></i></i></div>`;
}

let craftTab = "gauntlet";
const AMULET_MULT = { amulet_drum: 2, amulet_commander: 5 };
// 제작창 3D 미리보기 (three.js 가 준비된 뒤에 불러옴)
let gearPreviews = null, gearPreviewLoading = false;
function attachGearPreviews() {
    if (gearPreviews) { gearPreviews.attach(ui.craftGrid); return; }
    if (gearPreviewLoading || !stage3d) return;
    gearPreviewLoading = true;
    import('./gearPreview.js?v=21').then(({ createGearPreviews }) => {
        gearPreviews = createGearPreviews(stage3d.getRenderer());
        if (!$('sheet-craft').classList.contains('hidden')) gearPreviews.attach(ui.craftGrid);
    }).catch(err => console.warn('장비 미리보기를 켤 수 없어요', err));
}

function renderCraft() {
    const items = CRAFT_ITEMS.filter(g => (g.category || "gauntlet") === craftTab);
    ui.craftGrid.classList.add('list');
    ui.craftGrid.innerHTML = items.map(gear => {
        const equipped = gear.category === "amulet" ? gameState.amulet === gear.id : gameState.gear === gear.id;
        const owned = gameState.craftedGears.includes(gear.id);
        let canCraft = true, metN = 0, reqN = 0;
        let reqHtml = '';
        if (!owned) {
            for (const reqId in gear.req) {
                const a = AURA_BY_ID[reqId];
                const need = gear.req[reqId], have = gameState.inventory[reqId] || 0;
                const met = have >= need;
                reqN++; if (met) metN++; else canCraft = false;
                reqHtml += `
                <div class="creq ${met ? 'met' : ''}">
                    <i class="creq-dot" style="background:${a ? a.color : '#888'}"></i>
                    <span class="creq-name">${a ? a.name : reqId}</span>
                    <span class="creq-num">${fmt(Math.min(have, need))}<small>/${fmt(need)}</small></span>
                    <div class="creq-bar"><div style="width:${Math.min(100, have / need * 100)}%"></div></div>
                </div>`;
            }
        }
        const chips = [];
        if (gear.luckBonus) chips.push(`<span class="chip luck">행운 +${Math.round(gear.luckBonus * 100)}%</span>`);
        if (gear.speedBonus) chips.push(`<span class="chip speed">속도 +${Math.round(gear.speedBonus * 100)}%</span>`);
        if (AMULET_MULT[gear.id]) chips.push(`<span class="chip amulet">10롤마다 행운 ×${AMULET_MULT[gear.id]}</span>`);
        const state = equipped ? '<span class="cstate on">장착 중</span>' : owned ? '<span class="cstate owned">보유</span>' : `<span class="cstate">${metN}/${reqN}</span>`;
        const btn = equipped
            ? `<button class="btn btn-block" data-unequip="${gear.id}">해제</button>`
            : owned
                ? `<button class="btn btn-block btn-primary" data-equip="${gear.id}">장착</button>`
                : `<button class="btn btn-block btn-gold" data-craft="${gear.id}" ${canCraft ? '' : 'disabled'}>${canCraft ? '제작하기' : '재료 부족'}</button>`;
        return `
        <div class="craft-card ${equipped ? 'equipped' : ''} ${owned ? 'owned' : ''}">
            <div class="craft-top">
                <div class="craft-view"><canvas data-gear="${gear.id}" aria-hidden="true"></canvas>${state}</div>
                <div class="craft-info">
                    <div class="craft-name">${gear.name}</div>
                    <div class="chips">${chips.join('')}</div>
                    <div class="craft-desc">${gear.category === 'amulet' ? '왼팔에 매다는 부적' : '오른팔에 끼는 건틀렛'}</div>
                </div>
            </div>
            ${owned ? '' : `<div class="creq-list">${reqHtml}</div>`}
            ${btn}
        </div>`;
    }).join('');
    attachGearPreviews();
}

function renderShop() {
    ui.shopGrid.classList.add('row-list');
    ui.shopGrid.innerHTML = SHOP_ITEMS.map(item => {
        const have = gameState.itemInventory[item.id] || 0;
        return `
        <div ${frameAttrs(item.frame, [item.color, item.color2 || item.color, item.color], item.unique).replace('class="', 'class="row ')}>${frameDeco(item.frame, item.unique)}
            ${vialHtml(item)}
            <div class="row-main">
                <div class="row-name">${item.name}</div>
                <div class="row-desc">${item.desc}${have ? ` · 보유 ${fmt(have)}` : ''}</div>
            </div>
            <div class="row-side">
                <div class="row-price">${fmt(item.price)} <small>JC</small></div>
                <button class="btn btn-sm btn-gold" data-buy="${item.id}" ${gameState.jc < item.price ? 'disabled' : ''}>구매</button>
            </div>
        </div>`;
    }).join('');
}

function questState(quest) {
    const p = gameState.questProgress[quest.id] || {};
    const rows = Object.entries(quest.targets).filter(([, n]) => n > 0).map(([key, need]) => {
        const have = Math.min(need, key === 'jc' ? gameState.jc : (p[key] || 0));
        return { key, need, have, met: have >= need };
    });
    return { rows, canClaim: rows.every(r => r.met) };
}

function questRewardHtml(q) {
    const chips = [];
    if (q.reward.unlockQuickRoll) chips.push(`<span class="rw rw-unlock">⚡ 빠른 롤 해금</span>`);
    for (const id in q.reward.items || {}) {
        const item = SHOP_BY_ID[id];
        if (item) chips.push(`<span class="rw">${vialHtml(item)}<span>${item.name} <b>×${q.reward.items[id]}</b></span></span>`);
    }
    if (q.reward.jc) chips.push(`<span class="rw rw-jc"><i class="coin"></i><span><b>${fmt(q.reward.jc)}</b> JC</span></span>`);
    return chips.join('');
}

function renderQuests() {
    ui.questList.classList.add('list');
    ui.questList.innerHTML = QUEST_DATA.map(q => {
        const done = !q.repeatable && gameState.completedQuests.includes(q.id);
        const active = gameState.activeQuest === q.id;
        const { rows, canClaim } = questState(q);
        const pct = done ? 100 : Math.round(rows.reduce((s, r) => s + Math.min(1, r.have / r.need), 0) / rows.length * 100);

        const status = done ? '<span class="qstate done">완료</span>'
            : active && canClaim ? '<span class="qstate ready">보상 대기</span>'
            : active ? '<span class="qstate ing">진행 중</span>' : '';

        let btn;
        if (done) btn = `<button class="btn btn-block" disabled>완료됨</button>`;
        else if (active && canClaim) btn = `<button class="btn btn-block btn-green q-claim" data-claim="${q.id}">보상 받기</button>`;
        else if (active) btn = '';
        else btn = `<button class="btn btn-block btn-primary" data-quest="${q.id}">이 퀘스트 진행하기</button>`;

        const goals = done ? '' : `<div class="qgoals">${rows.map(r => `
            <div class="qgoal ${r.met ? 'met' : ''}">
                <div class="qgoal-top"><span>${QUEST_TARGET_LABELS[r.key](r.need)}</span><i class="qcheck"></i></div>
                <div class="qgoal-num">${fmt(r.have)}<small> / ${fmt(r.need)}</small></div>
                <div class="qgoal-bar"><div style="width:${r.have / r.need * 100}%"></div></div>
            </div>`).join('')}</div>`;

        return `
        <div class="qcard ${done ? 'done' : ''} ${active ? 'active' : ''} ${active && canClaim ? 'ready' : ''}">
            <div class="qhead">
                <div>
                    <div class="qkind">${q.repeatable ? 'REPEAT' : 'ONCE'}</div>
                    <div class="qtitle">${q.name}</div>
                </div>
                <div class="qpct" style="--p:${pct}">
                    <svg viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" class="qpct-bg"/><rect x="3" y="3" width="34" height="34" class="qpct-fg" pathLength="100"/></svg>
                    <span>${pct}<small>%</small></span>
                </div>
            </div>
            <div class="qdesc">${q.desc} ${status}</div>
            ${goals}
            <div class="qreward"><div class="qreward-label">REWARD</div><div class="qreward-items">${questRewardHtml(q)}</div></div>
            ${btn}
        </div>`;
    }).join('') + `<div class="qnote">퀘스트는 한 번에 하나만 진행돼요. 바꿔도 진행도는 남아요.</div>`;
}

function renderIndex() {
    const found = new Set([...gameState.discoveredAuras, ...Object.keys(gameState.inventory)]);
    const total = AURA_DATA.length;
    const foundCount = AURA_DATA.filter(a => found.has(a.id)).length;
    ui.indexProgress.textContent = `${foundCount} / ${total}`;

    let html = `<div class="index-bar"><div style="width:${foundCount / total * 100}%"></div></div><div class="index-grid">`;
    for (const grade of GRADES) {
        const list = AURA_DATA.filter(a => a.grade === grade);
        const gFound = list.filter(a => found.has(a.id)).length;
        html += gradeHeader(grade, `${gFound}/${list.length}`);
        for (const a of list) {
            html += found.has(a.id)
                ? `<div ${frameAttrs(a.grade, auraColors(a), a.frame).replace('class="', 'class="index-cell ')}>${frameDeco(a.grade, a.frame)}<div class="card-name">${auraNameHtml(a)}</div><div class="card-meta">1 in ${fmt(a.in)}</div></div>`
                : `<div class="index-cell unknown"><div class="card-name">?</div><div class="card-meta">1 in ${fmt(a.in)}</div></div>`;
        }
    }
    ui.indexGrid.innerHTML = html + '</div>';
}

function renderAutoSell() {
    ui.autoSellGrid.innerHTML = GRADES.map(g =>
        `<button class="sell-chip ${gradeCol(g)} ${gameState.autoDelete[g] ? 'on' : ''}" data-autosell="${g}">${g}${gameState.autoDelete[g] ? ' ✓' : ''}</button>`
    ).join('');
}

function renderGradeTable() {
    ui.gradeTable.innerHTML = GRADES.map(g => `
        <div class="grade-row"><span class="${gradeCol(g)}">${g}</span><span class="grade-odds">${GRADE_ODDS[g]}</span></div>`).join('');
}

function renderSoundUI() {
    for (const key of ['master', 'bgm', 'cutscene', 'click', 'roll']) {
        const v = Math.round((soundSettings[key] ?? 1) * 100);
        $(`vol-${key}`).value = v;
        $(`vol-${key}-val`).textContent = v;
    }
    const btn = $('sound-toggle-btn');
    btn.textContent = soundSettings.enabled ? '사운드 켜짐' : '사운드 꺼짐';
    btn.className = `btn btn-block ${soundSettings.enabled ? 'btn-green' : 'btn-red'}`;
}

function renderAll() {
    renderStats(); renderBuffs(); renderRollToggles();
    renderInventory(); renderPotions(); renderCraft(); renderShop(); renderQuests(); renderIndex();
    renderAutoSell();
}

/* =========================================================
   📂 시트 열고 닫기
   ========================================================= */

const SHEET_RENDER = {
    'sheet-bag': () => { renderInventory(); renderPotions(); },
    'sheet-craft': renderCraft,
    'sheet-shop': renderShop,
    'sheet-quest': renderQuests,
    'sheet-index': renderIndex,
    'sheet-settings': () => { renderSoundUI(); renderAutoSell(); }
};

function stagger(el) {
    if (!el) return;
    el.classList.remove('stagger');
    [...el.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 24)));
    void el.offsetWidth;
    el.classList.add('stagger');
    clearTimeout(el._staggerT);
    el._staggerT = setTimeout(() => el.classList.remove('stagger'), 1400);
}
const SHEET_LIST = {
    'sheet-bag': () => [ui.inventoryGrid, ui.potionGrid],
    'sheet-craft': () => [ui.craftGrid],
    'sheet-shop': () => [ui.shopGrid],
    'sheet-quest': () => [ui.questList],
    'sheet-index': () => [ui.indexGrid.querySelector('.index-grid')],
    'sheet-settings': () => [$('sheet-settings').querySelector('.sheet-body')]
};

function openSheet(id) {
    SHEET_RENDER[id]?.();
    const el = $(id);
    el.classList.remove('hidden', 'closing');
    (SHEET_LIST[id]?.() || []).forEach(stagger);
    stage3d?.setLowPower(true);
    document.querySelectorAll(`[data-sheet="${id}"]`).forEach(b => b.classList.add('open'));
}
function closeSheet(id) {
    const el = $(id);
    if (el.classList.contains('hidden')) return;
    if (id === 'sheet-craft') gearPreviews?.stop();
    el.classList.add('closing');
    document.querySelectorAll(`[data-sheet="${id}"]`).forEach(b => b.classList.remove('open'));
    setTimeout(() => {
        el.classList.add('hidden'); el.classList.remove('closing');
        if (!document.querySelector('.sheet-backdrop:not(.hidden)')) stage3d?.setLowPower(false);
    }, 210);
}

document.querySelectorAll('[data-sheet]').forEach(btn => btn.addEventListener('click', () => openSheet(btn.dataset.sheet)));
document.querySelectorAll('.sheet-backdrop').forEach(bd => {
    bd.addEventListener('click', e => {
        if (e.target === bd || e.target.closest('[data-close]')) closeSheet(bd.id);
    });
});
$('settings-btn').addEventListener('click', () => openSheet('sheet-settings'));
ui.mainDevBtn.addEventListener('click', () => openSheet('sheet-dev'));

function bindTabs(containerId, onChange) {
    const box = $(containerId);
    box.addEventListener('click', e => {
        const tab = e.target.closest('.tab');
        if (!tab) return;
        box.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
        onChange(tab.dataset.tab);
    });
}
bindTabs('bag-tabs', tab => {
    ui.inventoryGrid.classList.toggle('hidden', tab !== 'aura');
    ui.potionGrid.classList.toggle('hidden', tab !== 'potion');
    stagger(tab === 'aura' ? ui.inventoryGrid : ui.potionGrid);
});
bindTabs('craft-tabs', tab => { craftTab = tab; renderCraft(); stagger(ui.craftGrid); });

/* =========================================================
   🎮 동작
   ========================================================= */

$('game-start-btn').addEventListener('click', () => {
    initSynthAudio();
    const lobby = $('lobby-screen'), main = $('main-game');
    lobby.classList.add('leaving');
    setTimeout(() => {
        lobby.classList.add('hidden');
        lobby.classList.remove('leaving');
        main.classList.remove('hidden');
        main.classList.add('entering');
        setTimeout(() => main.classList.remove('entering'), 1300);
        stage3d?.resize();
        applyEquippedAura();
    }, 420);
    playBgm('main');
});

ui.rollBtn.addEventListener('click', () => {
    ui.rollBtn.classList.remove('pressed'); void ui.rollBtn.offsetWidth; ui.rollBtn.classList.add('pressed');
    startRoll();
});

ui.autoBtn.addEventListener('click', () => {
    isAutoRolling = !isAutoRolling;
    autoWorker.postMessage({ command: isAutoRolling ? 'start' : 'stop', interval: 100 });
    renderRollToggles();
    if (isAutoRolling && !isRolling) startRoll();
});

ui.quickBtn.addEventListener('click', () => {
    if (!gameState.quickRollUnlocked) return;
    isQuickRollActive = !isQuickRollActive;
    renderRollToggles();
});

/* ---------- 판매 ---------- */
ui.inventoryGrid.addEventListener('click', e => {
    const card = e.target.closest('[data-aura]');
    if (card) openAuraDialog(card.dataset.aura);
});

// 칭호를 누르면 뜨는 창: 정보 + 장착 / 판매
let auraDlgId = null;
function openAuraDialog(id) {
    const a = AURA_BY_ID[id];
    if (!a || !gameState.inventory[id]) return;
    auraDlgId = id;
    const on = gameState.equippedAura === id;
    $('ad-card').innerHTML = `<div ${frameAttrs(a.grade, auraColors(a), a.frame).replace('class="', 'class="ad-preview ')}>${frameDeco(a.grade, a.frame)}
        <div class="ad-grade ${gradeCol(a.grade)}">${a.grade}</div>
        <div class="ad-name">${auraNameHtml(a)}</div>
        ${a.line ? `<div class="ad-line">${a.line}</div>` : ''}
    </div>`;
    $('ad-odds').textContent = `1 in ${fmt(a.in)}`;
    $('ad-have').textContent = `×${fmt(gameState.inventory[id])}`;
    $('ad-value').textContent = `${fmt(a.jcValue)} JC`;
    const eq = $('ad-equip');
    eq.disabled = on;
    eq.textContent = on ? '장착 중' : '장착';
    $('aura-dialog').classList.remove('hidden');
}
function closeAuraDialog() { $('aura-dialog').classList.add('hidden'); auraDlgId = null; }
$('aura-dialog').addEventListener('click', e => {
    if (e.target.id === 'aura-dialog' || e.target.closest('[data-ad="close"]')) { closeAuraDialog(); return; }
    const id = auraDlgId;
    if (!id) return;
    if (e.target.closest('#ad-equip')) {
        gameState.equippedAura = id;
        saveGame(); applyEquippedAura(); renderInventory();
        ui.inventoryGrid.querySelector(`[data-aura="${id}"]`)?.classList.add('just-equipped');
        toast(`${AURA_BY_ID[id].name} 장착`, 'good');
        closeAuraDialog();
    } else if (e.target.closest('#ad-sell')) {
        closeAuraDialog();
        sellAura(id);
    }
});

function sellAura(id) {
    const a = AURA_BY_ID[id], count = gameState.inventory[id];
    if (!a || !count) return;
    openQtyDialog({
        title: `${a.name}`,
        sub: `${a.grade} 칭호 판매 (보유 ${fmt(count)}개)`,
        max: count, initial: count,
        priceEach: a.jcValue, totalLabel: '받는 금액',
        okText: '판매',
        onConfirm: async n => {
            if (HIGH_GRADES.includes(a.grade)) {
                const ok = await ask({ title: `${a.grade} 칭호를 판매할까요?`, message: `${a.name} ${fmt(n)}개`, okText: '판매', danger: true });
                if (!ok) return;
            }
            gameState.inventory[id] -= n;
            if (gameState.inventory[id] <= 0) {
                delete gameState.inventory[id];
                if (gameState.equippedAura === id) { gameState.equippedAura = null; applyEquippedAura(); }
            }
            gameState.jc += a.jcValue * n;
            saveGame(); renderStats(); renderInventory();
            toast(`${fmt(n)}개 판매  +${fmt(a.jcValue * n)} JC`, 'gold');
        }
    });
}

/* ---------- 구매 ---------- */
ui.shopGrid.addEventListener('click', e => {
    const id = e.target.dataset.buy;
    if (!id) return;
    const item = SHOP_BY_ID[id];
    const max = Math.floor(gameState.jc / item.price);
    if (max < 1) { toast('JC가 부족해요', 'bad'); return; }
    openQtyDialog({
        title: `${item.name}`,
        sub: `${item.desc}\n보유 JC ${fmt(gameState.jc)}`,
        max, initial: 1,
        priceEach: item.price, totalLabel: '총',
        okText: '구매',
        onConfirm: n => {
            const cost = n * item.price;
            if (gameState.jc < cost) { toast('JC가 부족해요', 'bad'); return; }
            gameState.jc -= cost;
            addItems({ [id]: n });
            trackQuestProgress("shopPurchases", n);
            saveGame(); renderStats(); renderShop();
            toast(`${item.name} ${n}개 구매`, 'good');
        }
    });
});

/* ---------- 물약 사용 ---------- */
ui.potionGrid.addEventListener('click', e => {
    const id = e.target.dataset.use;
    if (!id) return;
    const item = SHOP_BY_ID[id], count = gameState.itemInventory[id];
    if (!item || !count) return;

    const b = gameState.activeBuffs, now = Date.now();
    if (item.type === 'luck' && b.luckExpireTime > now && b.luckLevel !== item.level) {
        toast(`이미 행운의 물약 ${b.luckLevel}을(를) 쓰는 중이에요`, 'bad'); return;
    }
    if (item.type === 'speed' && b.speedExpireTime > now && b.speedLevel !== item.level) {
        toast(`이미 속도의 물약 ${b.speedLevel}을(를) 쓰는 중이에요`, 'bad'); return;
    }

    openQtyDialog({
        title: `${item.name} 사용`,
        sub: `${item.desc}\n보유 ${fmt(count)}개. 여러 개 쓰면 시간이나 횟수가 늘어납니다.`,
        max: count, initial: 1, okText: '사용',
        onConfirm: n => {
            if ((gameState.itemInventory[id] || 0) < n) return;
            gameState.itemInventory[id] -= n;
            if (gameState.itemInventory[id] <= 0) delete gameState.itemInventory[id];
            const now = Date.now();
            if (item.type === 'luck' || item.type === 'speed') {
                const k = item.type;
                gameState.activeBuffs[`${k}Bonus`] = item.value;
                gameState.activeBuffs[`${k}Level`] = item.level;
                const expire = gameState.activeBuffs[`${k}ExpireTime`];
                gameState.activeBuffs[`${k}ExpireTime`] = Math.max(now, expire || 0) + item.duration * 1000 * n;
            } else if (item.type === 'luck_mult') {
                gameState.activeMultBuffs.push({ name: item.name, bonus: item.value, uses: item.maxUses * n });
            }
            saveGame(); renderStats(); renderBuffs(); renderPotions();
            toast(`${item.name} ${n}개 사용`, 'good');
        }
    });
});

/* ---------- 제작 / 장착 ---------- */
ui.craftGrid.addEventListener('click', e => {
    const d = e.target.dataset;
    if (d.craft) {
        const gear = CRAFT_BY_ID[d.craft];
        for (const r in gear.req) {
            if ((gameState.inventory[r] || 0) < gear.req[r]) { toast('재료가 부족해요', 'bad'); return; }
        }
        for (const r in gear.req) {
            gameState.inventory[r] -= gear.req[r];
            if (gameState.inventory[r] <= 0) delete gameState.inventory[r];
        }
        gameState.craftedGears.push(gear.id);
        equip(gear);
        toast(`${gear.name} 제작 완료, 장착했습니다`, 'good');
    } else if (d.equip) {
        equip(CRAFT_BY_ID[d.equip]);
    } else if (d.unequip) {
        const item = CRAFT_BY_ID[d.unequip];
        if (item.category === "amulet") { gameState.amulet = null; gameState.amuletStack = 0; }
        else gameState.gear = null;
    } else return;
    saveGame(); renderStats(); renderBuffs(); renderCraft(); applyGear();
});

function equip(item) {
    if (item.category === "amulet") { gameState.amulet = item.id; gameState.amuletStack = 0; }
    else gameState.gear = item.id;
}

/* ---------- 퀘스트 ---------- */
ui.questList.addEventListener('click', e => {
    const d = e.target.dataset;
    if (d.quest) {
        gameState.activeQuest = d.quest;
        if (!gameState.questProgress[d.quest]) gameState.questProgress[d.quest] = {};
        saveGame(); renderQuests();
    } else if (d.claim) {
        const q = QUEST_DATA.find(x => x.id === d.claim);
        if (!q || !questState(q).canClaim) return;
        if (!q.repeatable) gameState.completedQuests.push(q.id);
        gameState.activeQuest = null;
        delete gameState.questProgress[q.id];
        if (q.reward.unlockQuickRoll) gameState.quickRollUnlocked = true;
        if (q.reward.items) addItems(q.reward.items);
        if (q.reward.jc) gameState.jc += q.reward.jc;
        saveGame(); renderStats(); renderQuests(); renderRollToggles();
        toast(`퀘스트 완료\n${q.rewardDesc}`, 'gold');
    }
});

/* ---------- 설정 ---------- */
for (const key of ['master', 'bgm', 'cutscene', 'click', 'roll']) {
    $(`vol-${key}`).addEventListener('input', e => {
        soundSettings[key] = e.target.value / 100;
        $(`vol-${key}-val`).textContent = e.target.value;
        updateBgmVolume();
        if (cutsceneAudio) cutsceneAudio.volume = soundSettings.master * soundSettings.cutscene;
        saveSoundSettings();
    });
}
$('sound-toggle-btn').addEventListener('click', () => {
    soundSettings.enabled = !soundSettings.enabled;
    saveSoundSettings(); renderSoundUI();
    if (!soundSettings.enabled) stopBgm();
    else playBgm($('lobby-screen').classList.contains('hidden') ? 'main' : 'lobby');
});

ui.autoSellGrid.addEventListener('click', e => {
    const g = e.target.dataset.autosell;
    if (!g) return;
    gameState.autoDelete[g] = !gameState.autoDelete[g];
    saveGame(); renderAutoSell();
});

$('submit-code-btn').addEventListener('click', redeemCode);
$('code-input').addEventListener('keydown', e => { if (e.key === 'Enter') redeemCode(); });
function redeemCode() {
    const code = $('code-input').value.trim().toUpperCase();
    if (!code) return;
    if (gameState.usedCodes.includes(code)) { toast('이미 사용한 쿠폰이에요', 'bad'); return; }
    const c = COUPONS[code];
    if (!c) { toast('없는 쿠폰 코드예요', 'bad'); return; }
    gameState.usedCodes.push(code);
    if (c.jc) gameState.jc += c.jc;
    if (c.items) addItems(c.items);
    saveGame(); renderStats();
    $('code-input').value = '';
    toast(`🎁 ${code} 쿠폰 사용!\n${c.msg}`, 'gold');
}

/* ---------- 개발자 모드 ---------- */
$('dev-btn').addEventListener('click', async () => {
    if (backupGameState !== null) { openSheet('sheet-dev'); return; }
    const pwd = await ask({ title: '개발자 모드', message: '비밀번호를 입력하세요', input: true });
    if (pwd === null) return;
    if (pwd !== DEV_PASSWORD) { toast('비밀번호가 틀렸어요', 'bad'); return; }
    backupGameState = JSON.parse(JSON.stringify(gameState));
    ui.mainDevBtn.classList.remove('hidden');
    const sel = $('dev-aura-select');
    if (!sel.children.length) {
        sel.innerHTML = AURA_DATA.map(a => `<option value="${a.id}">[${a.grade}] ${a.name}</option>`).join('');
    }
    closeSheet('sheet-settings');
    openSheet('sheet-dev');
    toast('개발자 모드 ON. 끌 때까지 저장되지 않습니다.', 'gold');
});

$('sheet-dev').addEventListener('click', e => {
    const act = e.target.dataset.dev;
    if (!act) return;
    if (act === 'jc') { gameState.jc += 1000000; toast('+100만 JC'); }
    else if (act === 'luck') { gameState.luck = 10000; toast('기본 행운 10,000배'); }
    else if (act === 'auras') {
        AURA_DATA.forEach(a => {
            gameState.inventory[a.id] = (gameState.inventory[a.id] || 0) + 50;
            if (!gameState.discoveredAuras.includes(a.id)) gameState.discoveredAuras.push(a.id);
        });
        toast('모든 칭호 50개씩 지급');
    } else if (act === 'quests') {
        QUEST_DATA.forEach(q => {
            gameState.questProgress[q.id] = { ...q.targets };
        });
        gameState.quickRollUnlocked = true;
        toast('모든 퀘스트 조건 달성');
    } else if (act === 'crafts') {
        CRAFT_ITEMS.forEach(i => { if (!gameState.craftedGears.includes(i.id)) gameState.craftedGears.push(i.id); });
        toast('모든 제작템 획득');
    } else if (act === 'next') {
        nextRollOverride = $('dev-aura-select').value;
        const a = AURA_BY_ID[nextRollOverride];
        toast(`다음 롤: [${a.grade}] ${a.name}`);
    } else if (act === 'exit') {
        gameState = backupGameState;
        backupGameState = null;
        nextRollOverride = null;
        saveGame();
        ui.mainDevBtn.classList.add('hidden');
        closeSheet('sheet-dev');
        toast('개발자 모드 OFF. 원래 데이터로 복구했습니다.', 'good');
    }
    renderAll();
    applyEquippedAura();
});

/* =========================================================
   ⏱️ 버프 타이머 (1초마다)
   ========================================================= */

setInterval(() => {
    const now = Date.now(), b = gameState.activeBuffs;
    let expired = false;
    if (b.luckExpireTime && now > b.luckExpireTime) { b.luckBonus = 0; b.luckExpireTime = 0; b.luckLevel = 0; expired = true; }
    if (b.speedExpireTime && now > b.speedExpireTime) { b.speedBonus = 0; b.speedExpireTime = 0; b.speedLevel = 0; expired = true; }
    if (expired) { renderStats(); saveGame(); }
    renderBuffs();
}, 1000);

/* =========================================================
   ✨ 별 배경 (천천히 떠다니며 반짝임)
   ========================================================= */

function startStarfield2D() {
    const cv = $('starfield'), ctx = cv.getContext('2d');
    cv.classList.remove('hidden');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr, stars = [];
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = cv.width = innerWidth * dpr;
        h = cv.height = innerHeight * dpr;
        const count = Math.round(innerWidth * innerHeight / 3200);
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h,
            r: (Math.random() ** 3 * 1.4 + 0.3) * dpr,
            a: Math.random() * 0.6 + 0.2,
            t: Math.random() * Math.PI * 2,
            s: Math.random() * 0.012 + 0.004,
            v: (Math.random() * 0.06 + 0.02) * dpr
        }));
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (const st of stars) {
            st.t += st.s;
            st.y -= st.v;
            if (st.y < -2) { st.y = h + 2; st.x = Math.random() * w; }
            ctx.globalAlpha = st.a * (0.55 + 0.45 * Math.sin(st.t));
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
        }
        if (!reduce) requestAnimationFrame(draw);
    }
    addEventListener('resize', resize);
    resize(); draw();
}

/* =========================================================
   🧊 3D 아우라 무대
   ========================================================= */

let stage3d = null;
const nametag = $('nametag');

// 화질 설정
const QUALITY_KEY = 'js_rng_quality';
let qualityMode = 'auto';
try { qualityMode = localStorage.getItem(QUALITY_KEY) || 'auto'; } catch (e) {}
function applyQuality() {
    stage3d?.setQualityMode(qualityMode);
    document.querySelectorAll('#quality-seg button').forEach(b => b.classList.toggle('on', b.dataset.q === qualityMode));
}
$('quality-seg').addEventListener('click', e => {
    const q = e.target.dataset.q;
    if (!q) return;
    qualityMode = q;
    try { localStorage.setItem(QUALITY_KEY, q); } catch (err) {}
    applyQuality();
});
applyQuality();

// 건틀렛/부적을 3D 캐릭터 팔에 끼움
function applyGear() {
    stage3d?.setGear({ gauntlet: gameState.gear, amulet: gameState.amulet, visible: gameState.showGear !== false });
    const btn = $('gear-toggle-btn');
    if (btn) btn.textContent = gameState.showGear !== false ? '장비 보이기 켜짐' : '장비 보이기 꺼짐';
}
$('gear-toggle-btn').addEventListener('click', () => {
    gameState.showGear = gameState.showGear === false;
    saveGame(); applyGear();
});

function applyEquippedAura() {
    applyGear();
    const aura = AURA_BY_ID[gameState.equippedAura] || null;
    stage3d?.setAura(aura);
    document.documentElement.style.setProperty('--aura', aura ? aura.color : '#5b4dff');
    const inGame = !$('main-game').classList.contains('hidden');
    if (aura && inGame) {
        if (nametag.dataset.id !== aura.id) {
            nametag.dataset.id = aura.id;
            nametag.innerHTML = auraNameHtml(aura);
            nametag.classList.remove('swap'); void nametag.offsetWidth; nametag.classList.add('swap');
        }
        nametag.classList.remove('hidden');
    } else {
        nametag.classList.add('hidden');
    }
}

import('./aura3d.js?v=21')
    .then(({ createAuraStage }) => {
        stage3d = createAuraStage($('stage3d'), {
            getStageRect: () => {
                const r = ui.stage.getBoundingClientRect();
                return r.height > 0 ? r : null;
            },
            onLabel: (x, y) => { nametag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`; }
        });
        applyQuality();
        applyEquippedAura();
    })
    .catch(err => {
        console.warn('3D를 켤 수 없어 2D 배경으로 대신합니다:', err);
        $('stage3d').remove();
        startStarfield2D();
    });

/* =========================================================
   🔄 새 버전 자동 확인
   index.html의 ?v= 숫자와 version.json이 다르면
   브라우저에 남은 예전 화면 대신 새 버전으로 다시 연다
   ========================================================= */

const APP_VERSION = new URL(import.meta.url).searchParams.get('v') || '0';
fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' })
    .then(r => r.json())
    .then(({ v }) => {
        const tried = sessionStorage.getItem('js_rng_reload');
        if (String(v) !== APP_VERSION && tried !== String(v)) {
            sessionStorage.setItem('js_rng_reload', String(v));
            location.replace(`${location.pathname}?v=${v}`);
        }
    })
    .catch(() => {});

/* =========================================================
   🚀 시작
   ========================================================= */

loadGame();
renderSoundUI();
/* =========================================================
   🎧 뮤직 플레이어 UI
   ========================================================= */
const fmtTime = sec => {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60), ss = Math.floor(sec % 60);
    return `${m}:${String(ss).padStart(2, '0')}`;
};
let seeking = false;
function renderMusic(kind) {
    const t = music.current, el = music.el;
    const frac = el.duration ? el.currentTime / el.duration : 0;
    $('mp-progress-fill').style.transform = `scaleX(${frac})`;
    if (!seeking) $('np-seek').value = Math.round(frac * 1000);
    $('np-cur').textContent = fmtTime(el.currentTime);
    $('np-dur').textContent = fmtTime(el.duration);
    $('np-seek').style.setProperty('--p', `${frac * 100}%`);
    if (kind === 'time') return;

    const cover = coverArt(t);
    for (const id of ['mp-cover', 'np-cover']) if ($(id).getAttribute('src') !== cover) $(id).src = cover;
    $('mp-title').textContent = t.title; $('mp-artist').textContent = t.artist;
    $('np-title').textContent = t.title; $('np-artist').textContent = t.artist;
    // 제목이 길면 흘러가게
    const box = $('mp-title').parentElement;
    box.classList.toggle('scroll', $('mp-title').scrollWidth > box.clientWidth + 2);

    const playing = music.playing;
    document.querySelectorAll('.mini-player, .np').forEach(n => n.classList.toggle('playing', playing));
    $('np-shuffle').classList.toggle('on', music.state.shuffle);
    $('np-repeat').classList.toggle('on', music.state.repeat !== 'off');
    $('np-repeat').classList.toggle('one', music.state.repeat === 'one');

    const q = $('queue-list');
    q.innerHTML = music.state.tracks.map(tr => `
        <div class="q-item ${tr.id === t.id ? 'current' : ''}" data-id="${tr.id}">
            <img class="q-cover" src="${coverArt(tr)}" alt="">
            <div class="q-meta"><div class="q-title">${escapeHtml(tr.title)}</div><div class="q-artist">${escapeHtml(tr.artist)}</div></div>
            ${tr.id === t.id ? `<div class="mp-eq ${playing ? '' : 'stop'}"><i></i><i></i><i></i><i></i></div>` : ''}
            ${tr.builtin ? '' : `<button class="q-del" data-del="${tr.id}" aria-label="삭제">✕</button>`}
        </div>`).join('');
}
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
music.on(renderMusic);

$('mini-player').addEventListener('click', e => {
    if (e.target.closest('#mp-play')) { music.toggle(); return; }
    if (e.target.closest('#mp-next')) { music.next(); return; }
    openSheet('sheet-music');
});
$('np-play').addEventListener('click', () => music.toggle());
$('np-next').addEventListener('click', () => music.next());
$('np-prev').addEventListener('click', () => music.prev());
$('np-shuffle').addEventListener('click', () => music.setShuffle());
$('np-repeat').addEventListener('click', () => {
    music.cycleRepeat();
    toast(music.state.repeat === 'all' ? '🔁 전체 반복' : music.state.repeat === 'one' ? '🔂 한 곡 반복' : '반복 끔');
});
$('np-seek').addEventListener('input', e => {
    seeking = true;
    const el = music.el;
    $('np-cur').textContent = fmtTime((e.target.value / 1000) * (el.duration || 0));
    $('np-seek').style.setProperty('--p', `${e.target.value / 10}%`);
});
$('np-seek').addEventListener('change', e => { music.seek(e.target.value / 1000); seeking = false; });
$('queue-list').addEventListener('click', e => {
    const del = e.target.closest('[data-del]');
    if (del) { music.remove(del.dataset.del); return; }
    const item = e.target.closest('.q-item');
    if (item) music.play(item.dataset.id);
});
$('music-file').addEventListener('change', async e => {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    const n = await music.addFiles(files);
    toast(n ? `🎵 ${n}곡 추가됨` : '오디오 파일만 추가할 수 있어요');
});
$('open-music-btn').addEventListener('click', () => { closeSheet('sheet-settings'); setTimeout(() => openSheet('sheet-music'), 220); });
renderMusic();

renderGradeTable();
renderAll();
if (gameState.rolls > 0) {
    $('lobby-save-info').textContent = `${fmt(gameState.rolls)} ROLLS`;
}
playBgm('lobby');
