import { AURA_DATA } from './auras.js';
import { CRAFT_ITEMS } from './craftItems.js';

/* =========================================================
   📦 게임 데이터
   ========================================================= */

const GRADES = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGEND", "MYTHIC", "DIVINE", "COSMIC", "JS"];
const GRADE_ODDS = {
    COMMON: "1 in 2 ~ 10",
    UNCOMMON: "1 in 11 ~ 25",
    RARE: "1 in 26 ~ 99",
    EPIC: "1 in 100 ~ 499",
    LEGEND: "1 in 500 ~ 9,999",
    MYTHIC: "1 in 10,000 ~ 999,999",
    DIVINE: "1 in 1,000,000 ~ 19,999,999",
    COSMIC: "1 in 20,000,000 ~ 99,999,999",
    JS: "1 in 100,000,000+"
};
const HIGH_GRADES = ["LEGEND", "MYTHIC", "DIVINE", "COSMIC", "JS"];
const CUTSCENE_GRADES = ["DIVINE", "COSMIC", "JS"];

const SHOP_ITEMS = [
    { id: "luck_1", name: "행운의 물약 1", price: 300, type: "luck", level: 1, value: 0.15, duration: 120, desc: "+15% 행운 (2분)", border: "border-green" },
    { id: "luck_2", name: "행운의 물약 2", price: 800, type: "luck", level: 2, value: 0.30, duration: 120, desc: "+30% 행운 (2분)", border: "border-green" },
    { id: "luck_3", name: "행운의 물약 3", price: 2000, type: "luck", level: 3, value: 0.66, duration: 120, desc: "+66% 행운 (2분)", border: "border-green" },
    { id: "speed_1", name: "속도의 물약 1", price: 500, type: "speed", level: 1, value: 0.15, duration: 180, desc: "+15% 속도 (3분)", border: "border-blue" },
    { id: "speed_2", name: "속도의 물약 2", price: 1200, type: "speed", level: 2, value: 0.30, duration: 180, desc: "+30% 속도 (3분)", border: "border-blue" },
    { id: "speed_3", name: "속도의 물약 3", price: 3000, type: "speed", level: 3, value: 0.55, duration: 180, desc: "+55% 속도 (3분)", border: "border-blue" },
    { id: "limit_potion", name: "한계의 물약", price: 40000, type: "luck_mult", value: 5000, maxUses: 3, desc: "×5,000 행운 (3회)", border: "border-limit" },
    { id: "overcome_potion", name: "극복의 물약", price: 250000, type: "luck_mult", value: 50000, maxUses: 2, desc: "×50,000 행운 (2회)", border: "border-overcome" },
    { id: "heaven_potion", name: "천상의 물약", price: 400000, type: "luck_mult", value: 150000, maxUses: 1, desc: "×150,000 행운 (1회)", border: "border-heaven" },
    { id: "void_potion", name: "공허의 물약", price: 2000000, type: "luck_mult", value: 700000, maxUses: 1, desc: "×700,000 행운 (1회)", border: "border-void" }
];

const QUEST_DATA = [
    {
        id: "quest_swift", name: "신속하게", repeatable: false,
        desc: "빠른 롤을 쓸 자격을 증명하세요.",
        rewardDesc: "빠른 롤 해금 + 천상의 물약 5개",
        reward: { unlockQuickRoll: true, items: { heaven_potion: 5 } },
        targets: { rolls: 5000, divine: 15, cosmic: 5, jc: 3000000, shopPurchases: 20 }
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
    divine: n => `DIVINE ${n}개 뽑기`,
    cosmic: n => `COSMIC ${n}개 뽑기`,
    jc: n => `${fmt(n)} JC 모으기`,
    shopPurchases: n => `상점 아이템 ${n}개 구매`
};

const COUPONS = {
    RANKING: { items: { void_potion: 1 }, msg: "🧪 공허의 물약 1개" },
    PROFILE: { jc: 1000000, items: { overcome_potion: 2 }, msg: "🪙 100만 JC + 🧪 극복의 물약 2개" },
    QUEST1: { jc: 1000000, items: { limit_potion: 5, overcome_potion: 1 }, msg: "🪙 100만 JC + 🧪 한계의 물약 5개 + 극복의 물약 1개" },
    SPEEEED: { items: { heaven_potion: 3 }, msg: "🧪 천상의 물약 3개" }
};

const DEV_PASSWORD = "3699";
const SAVE_KEY = 'js_rng_demo_save';   // 데모 버전: 예전 기록과 따로 새로 시작
const SOUND_KEY = 'js_rng_sound';

// 칭호 확률·판매가 계산
AURA_DATA.sort((a, b) => a.in - b.in);
for (const aura of AURA_DATA) {
    aura.chance = 100 / aura.in;
    let baseJc = Math.max(1, Math.floor(aura.in / 5));
    if (["MYTHIC", "DIVINE", "COSMIC", "JS"].includes(aura.grade)) baseJc = Math.floor(baseJc * 0.5);
    if (["DIVINE", "COSMIC", "JS"].includes(aura.grade)) baseJc = Math.floor(baseJc * 0.6);
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

function auraNameHtml(aura) {
    const style = aura.class ? '' : `color:${aura.color};`;
    return `<span class="${aura.class || ''}" style="${style}">${aura.name}</span>`;
}

function getAuraBorderClass(aura) {
    if (!aura) return 'border-common';
    const special = {
        js_170kg_minchae: 'border-170kg-minchae',
        js_heinous_criminal: 'border-heinous-criminal',
        js_monkey_liberator: 'border-monkey-liberator',
        js_false_theatre_tv: 'border-false-theatre',
        js_demon_minchae: 'border-demon-minchae',
        js_lightning_jisung: 'border-lightning',
        divine_angel_gaen: 'border-holy-gold'
    };
    return special[aura.id] || `border-${aura.grade.toLowerCase()}`;
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
    lobbyBgm: new Audio('lobby_bgm.mp3'),
    mainBgm: new Audio('main_bgm.mp3'),
    click: new Audio('click.mp3'),
    dropLegend: new Audio('drop_legend.mp3'),
    dropMythic: new Audio('drop_mythic.mp3'),
    divine_all: new Audio('divine_full.mp3'),
    cosmic_all: new Audio('cosmic_full.mp3'),
    js_all: new Audio('js_full.mp3')
};
audioFiles.lobbyBgm.loop = true;
audioFiles.mainBgm.loop = true;

let currentBgm = null;
function updateBgmVolume() {
    if (currentBgm) currentBgm.volume = soundSettings.enabled ? soundSettings.master * soundSettings.bgm : 0;
}
function playBgm(type) {
    stopBgm();
    currentBgm = type === 'lobby' ? audioFiles.lobbyBgm : audioFiles.mainBgm;
    updateBgmVolume();
    if (soundSettings.enabled) currentBgm.play().catch(() => {});
}
function stopBgm() {
    if (currentBgm) { currentBgm.pause(); currentBgm.currentTime = 0; currentBgm = null; }
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
    if (currentBgm && currentBgm.paused && soundSettings.enabled) currentBgm.play().catch(() => {});
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

    // 특수 배수 물약이 켜져 있으면 행운보다 흔한 칭호는 후보에서 제외
    let pool = AURA_DATA;
    if (multBonus > 0) {
        const filtered = AURA_DATA.filter(a => a.in >= totalLuck);
        if (filtered.length) pool = filtered;
    }

    // 가장 희귀한 칭호부터 차례로 판정
    for (let i = pool.length - 1; i >= 0; i--) {
        if (Math.random() < totalLuck / pool[i].in) return pool[i];
    }
    return pool[0];
}

async function finishRoll() {
    const rolled = pickAura();

    const gradeKey = rolled.grade.toLowerCase();
    if (["legend", "mythic", "divine", "cosmic"].includes(gradeKey)) trackQuestProgress(gradeKey);

    if (gameState.activeMultBuffs.length) {
        gameState.activeMultBuffs.forEach(b => b.uses--);
        gameState.activeMultBuffs = gameState.activeMultBuffs.filter(b => b.uses > 0);
    }

    const isNew = !gameState.discoveredAuras.includes(rolled.id);
    if (isNew) gameState.discoveredAuras.push(rolled.id);

    if (CUTSCENE_GRADES.includes(rolled.grade)) {
        await playStarCutscene(rolled);
        playShakeGlow(rolled);
    } else if (rolled.grade === "LEGEND" || rolled.grade === "MYTHIC") {
        playShakeGlow(rolled);
        setTimeout(() => playDropSound(rolled.grade), 50);
    }

    if (currentBgm && soundSettings.enabled) { updateBgmVolume(); currentBgm.play().catch(() => {}); }

    let soldHtml = "";
    if (gameState.autoDelete[rolled.grade]) {
        gameState.jc += rolled.jcValue;
        soldHtml = `<div class="result-sold">자동 판매 +${fmt(rolled.jcValue)} JC</div>`;
    } else {
        gameState.inventory[rolled.id] = (gameState.inventory[rolled.id] || 0) + 1;
        const equipped = AURA_BY_ID[gameState.equippedAura];
        if (!equipped || rolled.in > equipped.in) {
            gameState.equippedAura = rolled.id;
            applyEquippedAura();
            soldHtml = `<div class="result-equip">아우라 장착</div>`;
        }
    }
    saveGame();
    renderStats();

    stage3d?.setRolling(false);
    const glow = HIGH_GRADES.includes(rolled.grade) && !rolled.class ? `text-shadow:0 0 14px ${rolled.color}aa;` : '';
    ui.display.innerHTML = `
        <div class="result-pop">
            <div class="result-grade ${gradeCol(rolled.grade)}">${rolled.grade}${isNew ? '<span class="new-tag">NEW</span>' : ''}</div>
            <div class="result-name"><span class="${rolled.class || ''}" style="${rolled.class ? '' : `color:${rolled.color};${glow}`}">${rolled.name}</span></div>
            <div class="result-chance">1 in ${fmt(rolled.in)}</div>
            ${soldHtml}
        </div>`;

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

/* ---------- 연출 ---------- */
function playShakeGlow(rolled) {
    stage3d?.shake(CUTSCENE_GRADES.includes(rolled.grade) ? 0.6 : 0.35);
    ui.glowOverlay.style.boxShadow = `inset 0 0 70px 25px ${rolled.color || "#f1c40f"}`;
    ui.glowOverlay.classList.remove('hidden');
    setTimeout(() => { ui.glowOverlay.classList.add('hidden'); }, 1500);
}

const CUTSCENE_BG_CLASSES = ['cutscene-bg-cosmic', 'cutscene-bg-js', 'cutscene-bg-angel', 'cutscene-bg-false-theatre', 'cutscene-bg-lightning', 'cutscene-bg-monkey', 'cutscene-bg-demon'];
const JS_SPECIAL_BG = {
    js_false_theatre_tv: 'cutscene-bg-false-theatre',
    divine_angel_gaen: 'cutscene-bg-angel',
    js_lightning_jisung: 'cutscene-bg-lightning',
    js_monkey_liberator: 'cutscene-bg-monkey',
    js_demon_minchae: 'cutscene-bg-demon'
};
const JS_COLORS = {
    js_170kg_minchae: ['#00e676', '#1b5e20', 'rgba(0, 230, 118, 0.3)', '#00e676'],
    js_heinous_criminal: ['#8b0000', '#004d40', 'rgba(139, 0, 0, 0.3)', '#ff0033'],
    default: ['#6a0000', '#200000', 'rgba(255,0,0,0.15)', '#ff0000']
};

function playStarCutscene(rolled) {
    const ov = ui.starOverlay;
    ui.display.innerHTML = '';
    ov.classList.remove('hidden', ...CUTSCENE_BG_CLASSES);
    if (currentBgm) currentBgm.pause();

    ui.starContainer.style.color = rolled.color;
    ui.starContainer.className = 'spin-zoom-accel';

    let soundKey = 'divine_all';
    if (rolled.grade === "JS") {
        soundKey = 'js_all';
        if (JS_SPECIAL_BG[rolled.id]) {
            ov.classList.add(JS_SPECIAL_BG[rolled.id]);
        } else {
            const [c, m, r, g] = JS_COLORS[rolled.id] || JS_COLORS.default;
            ov.style.setProperty('--js-center-col', c);
            ov.style.setProperty('--js-mid-col', m);
            ov.style.setProperty('--js-ray-col', r);
            ov.style.setProperty('--js-glow-col', g);
            ov.classList.add('cutscene-bg-js');
        }
    } else if (rolled.grade === "COSMIC") {
        soundKey = 'cosmic_all';
        ov.classList.add('cutscene-bg-cosmic');
    }

    stopCutsceneAudio();
    cutsceneAudio = playClip(soundKey, soundSettings.master * soundSettings.cutscene);

    return new Promise(resolve => {
        let resolved = false;
        const finish = skipped => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timer);
            ui.skipBtn.removeEventListener('click', onSkip);
            if (skipped) {
                // 스킵하면 마지막 '쾅' 부분(9.5초)부터 재생
                stopCutsceneAudio();
                cutsceneAudio = playClip(soundKey, soundSettings.master * soundSettings.cutscene);
                if (cutsceneAudio) cutsceneAudio.currentTime = 9.5;
            }
            ov.classList.add('flash-white');
            setTimeout(() => {
                ov.classList.remove('flash-white', ...CUTSCENE_BG_CLASSES);
                ov.classList.add('hidden');
                ui.starContainer.className = '';
                resolve();
            }, 500);
        };
        const onSkip = () => finish(true);
        ui.skipBtn.addEventListener('click', onSkip);
        const timer = setTimeout(() => finish(false), 9500);
    });
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
    glowOverlay: $('border-glow-overlay'), starOverlay: $('star-cutscene-overlay'),
    starContainer: $('cutscene-star-container'), skipBtn: $('skip-cutscene-btn'),
    inventoryGrid: $('inventory-grid'), potionGrid: $('potion-grid'),
    craftGrid: $('craft-grid'), shopGrid: $('shop-grid'), questList: $('quest-list'),
    indexGrid: $('index-grid'), indexProgress: $('index-progress'),
    autoSellGrid: $('auto-sell-grid'), gradeTable: $('grade-table'),
    mainDevBtn: $('main-dev-btn')
};

/* =========================================================
   🎨 렌더링
   ========================================================= */

function renderStats() {
    ui.rollCount.textContent = fmt(gameState.rolls);
    ui.jcCount.textContent = fmt(gameState.jc);
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
            html += `
            <div class="card ${getAuraBorderClass(a)}">
                <div class="card-name">${auraNameHtml(a)}</div>
                <div class="card-have">×${fmt(gameState.inventory[a.id])}</div>
                <div class="card-meta">개당 ${fmt(a.jcValue)} JC</div>
                <div class="card-actions">
                    ${gameState.equippedAura === a.id
                        ? `<button class="btn btn-sm" disabled>장착 중</button>`
                        : `<button class="btn btn-sm btn-primary" data-equip-aura="${a.id}">장착</button>`}
                    <button class="btn btn-sm" data-sell="${a.id}">판매</button>
                </div>
            </div>`;
        }
    }
    ui.inventoryGrid.className = 'card-grid';
    ui.inventoryGrid.innerHTML = html || `<div class="empty">아직 칭호가 없습니다.<br>ROLL로 첫 칭호를 뽑아 보세요.</div>`;
}

function renderPotions() {
    const ids = Object.keys(gameState.itemInventory).filter(id => SHOP_BY_ID[id] && gameState.itemInventory[id] > 0);
    ui.potionGrid.className = 'card-grid';
    ui.potionGrid.innerHTML = ids.length ? ids.map(id => {
        const item = SHOP_BY_ID[id];
        return `
        <div class="card ${item.border}">
            <div class="card-name">${item.name}</div>
            <div class="card-desc">${item.desc}</div>
            <div class="card-have">×${fmt(gameState.itemInventory[id])}</div>
            <button class="btn btn-sm btn-green" data-use="${id}">사용</button>
        </div>`;
    }).join('') : `<div class="empty">물약이 없습니다.<br>상점에서 구매할 수 있어요.</div>`;
}

let craftTab = "gauntlet";
function renderCraft() {
    const items = CRAFT_ITEMS.filter(g => (g.category || "gauntlet") === craftTab);
    ui.craftGrid.className = 'list';
    ui.craftGrid.innerHTML = items.map(gear => {
        const equipped = gear.category === "amulet" ? gameState.amulet === gear.id : gameState.gear === gear.id;
        const owned = gameState.craftedGears.includes(gear.id);
        let canCraft = true;
        let reqHtml = '';
        if (!owned) {
            for (const reqId in gear.req) {
                const a = AURA_BY_ID[reqId];
                const need = gear.req[reqId], have = gameState.inventory[reqId] || 0;
                const met = have >= need;
                if (!met) canCraft = false;
                reqHtml += `
                <div class="req ${met ? 'met' : ''}">
                    <div class="req-top">
                        <span class="req-name">${a ? `<span class="${gradeCol(a.grade)}">[${a.grade}]</span> ${a.name}` : reqId}</span>
                        <span class="req-num">${fmt(have)} / ${fmt(need)}</span>
                    </div>
                    <div class="req-bar"><div style="width:${Math.min(100, have / need * 100)}%"></div></div>
                </div>`;
            }
        }
        const badge = equipped ? '<span class="badge on">장착 중</span>' : owned ? '<span class="badge owned">보유</span>' : '';
        const btn = equipped
            ? `<button class="btn btn-block" data-unequip="${gear.id}">해제</button>`
            : owned
                ? `<button class="btn btn-block btn-primary" data-equip="${gear.id}">장착</button>`
                : `<button class="btn btn-block btn-gold" data-craft="${gear.id}" ${canCraft ? '' : 'disabled'}>제작</button>`;
        return `
        <div class="list-card ${equipped ? 'equipped' : ''}">
            <div class="list-head"><span class="list-title">${gear.name}</span>${badge}</div>
            <div class="list-effect">${gear.desc}</div>
            ${owned ? '' : `<div class="req-list">${reqHtml}</div>`}
            ${btn}
        </div>`;
    }).join('');
}

function renderShop() {
    ui.shopGrid.className = 'card-grid';
    ui.shopGrid.innerHTML = SHOP_ITEMS.map(item => `
        <div class="card ${item.border}">
            <div class="card-name">${item.name}</div>
            <div class="card-desc">${item.desc}</div>
            <div class="shop-price">${fmt(item.price)} JC</div>
            <button class="btn btn-sm btn-gold" data-buy="${item.id}" ${gameState.jc < item.price ? 'disabled' : ''}>구매</button>
        </div>`).join('');
}

function questState(quest) {
    const p = gameState.questProgress[quest.id] || {};
    const rows = Object.entries(quest.targets).filter(([, n]) => n > 0).map(([key, need]) => {
        const have = Math.min(need, key === 'jc' ? gameState.jc : (p[key] || 0));
        return { key, need, have, met: have >= need };
    });
    return { rows, canClaim: rows.every(r => r.met) };
}

function renderQuests() {
    ui.questList.className = 'list';
    ui.questList.innerHTML = QUEST_DATA.map(q => {
        const done = !q.repeatable && gameState.completedQuests.includes(q.id);
        const active = gameState.activeQuest === q.id;
        const { rows, canClaim } = questState(q);

        const badge = done ? '<span class="badge done">완료</span>'
            : active ? '<span class="badge ing">진행 중</span>'
            : q.repeatable ? '<span class="badge repeat">반복</span>' : '';

        let btn;
        if (done) btn = `<button class="btn btn-block" disabled>완료됨</button>`;
        else if (active && canClaim) btn = `<button class="btn btn-block btn-green" data-claim="${q.id}">🎉 보상 받기</button>`;
        else if (active) btn = `<button class="btn btn-block" disabled>진행 중…</button>`;
        else btn = `<button class="btn btn-block btn-primary" data-quest="${q.id}">진행하기</button>`;

        const reqHtml = done ? '' : `<div class="req-list">${rows.map(r => `
            <div class="req ${r.met ? 'met' : ''}">
                <div class="req-top"><span class="req-name">${QUEST_TARGET_LABELS[r.key](r.need)}</span><span class="req-num">${fmt(r.have)} / ${fmt(r.need)}</span></div>
                <div class="req-bar"><div style="width:${r.have / r.need * 100}%"></div></div>
            </div>`).join('')}</div>`;

        return `
        <div class="list-card ${done ? 'done' : active ? 'active-quest' : ''}">
            <div class="list-head"><span class="list-title">${q.name}</span>${badge}</div>
            <div class="list-desc">${q.desc}</div>
            ${reqHtml}
            <div class="reward">🎁 ${q.rewardDesc}</div>
            ${btn}
        </div>`;
    }).join('') + `<div class="list-desc" style="text-align:center;margin-top:4px;">퀘스트는 한 번에 하나만 진행됩니다. 바꿔도 진행도는 유지돼요.</div>`;
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
                ? `<div class="index-cell ${getAuraBorderClass(a)}"><div class="card-name">${auraNameHtml(a)}</div><div class="card-meta">1 in ${fmt(a.in)}</div></div>`
                : `<div class="index-cell unknown"><div class="card-name">?</div><div class="card-meta">1 in ${fmt(a.in)}</div></div>`;
        }
    }
    ui.indexGrid.innerHTML = html + '</div>';
}

function renderAutoSell() {
    ui.autoSellGrid.innerHTML = GRADES.map(g =>
        `<button class="sell-chip ${gradeCol(g)} border-${g.toLowerCase()} ${gameState.autoDelete[g] ? 'on' : ''}" data-autosell="${g}">${g}${gameState.autoDelete[g] ? ' ✓' : ''}</button>`
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

function openSheet(id) {
    SHEET_RENDER[id]?.();
    $(id).classList.remove('hidden');
}
function closeSheet(id) { $(id).classList.add('hidden'); }

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
});
bindTabs('craft-tabs', tab => { craftTab = tab; renderCraft(); });

/* =========================================================
   🎮 동작
   ========================================================= */

$('game-start-btn').addEventListener('click', () => {
    initSynthAudio();
    $('lobby-screen').classList.add('hidden');
    $('main-game').classList.remove('hidden');
    stage3d?.resize();
    applyEquippedAura();
    playBgm('main');
});

ui.rollBtn.addEventListener('click', startRoll);

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
    const eq = e.target.dataset.equipAura;
    if (eq) {
        gameState.equippedAura = eq;
        saveGame(); applyEquippedAura(); renderInventory();
        toast(`${AURA_BY_ID[eq].name} 장착`, 'good');
        return;
    }
    const id = e.target.dataset.sell;
    if (!id) return;
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
});

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
    saveGame(); renderStats(); renderBuffs(); renderCraft();
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

function applyEquippedAura() {
    const aura = AURA_BY_ID[gameState.equippedAura] || null;
    stage3d?.setAura(aura);
    document.documentElement.style.setProperty('--aura', aura ? aura.color : '#5b4dff');
    const inGame = !$('main-game').classList.contains('hidden');
    if (aura && inGame) {
        nametag.innerHTML = auraNameHtml(aura);
        nametag.classList.remove('hidden');
    } else {
        nametag.classList.add('hidden');
    }
}

import('./aura3d.js?v=5')
    .then(({ createAuraStage }) => {
        stage3d = createAuraStage($('stage3d'), {
            getStageRect: () => {
                const r = ui.stage.getBoundingClientRect();
                return r.height > 0 ? r : null;
            },
            onLabel: (x, y) => { nametag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`; }
        });
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
renderGradeTable();
renderAll();
if (gameState.rolls > 0) {
    $('lobby-save-info').textContent = `${fmt(gameState.rolls)} ROLLS`;
}
playBgm('lobby');
