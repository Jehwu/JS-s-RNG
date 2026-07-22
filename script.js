const sleep = ms => new Promise(r => setTimeout(r, ms));

let soundSettings = { 
    enabled: true, 
    master: 1.0, 
    bgm: 0.7, 
    cutscene: 0.5, 
    drop: 0.5, 
    click: 1.0,
    roll: 1.0 
};

function loadSoundSettings() {
    const saved = localStorage.getItem('js_rng_sound');
    if (saved) {
        soundSettings = { ...soundSettings, ...JSON.parse(saved) };
    }
}
function saveSoundSettings() {
    localStorage.setItem('js_rng_sound', JSON.stringify(soundSettings));
}

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
    if (currentBgm) {
        currentBgm.volume = soundSettings.enabled ? (soundSettings.master * soundSettings.bgm) : 0;
    }
}

function playBgm(type) {
    stopBgm();
    if (type === 'lobby') {
        currentBgm = audioFiles.lobbyBgm;
    } else if (type === 'main') {
        currentBgm = audioFiles.mainBgm;
    }
    if (currentBgm) {
        updateBgmVolume();
        currentBgm.play().catch(e => {});
    }
}

function stopBgm() {
    if (currentBgm) {
        currentBgm.pause();
        currentBgm.currentTime = 0;
        currentBgm = null;
    }
}

let audioCtx = null;
function initSynthAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSynthesizedTone(freq, type, volCategoryMultiplier, attack, release) {
    if (!soundSettings.enabled) return;
    try {
        initSynthAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        const finalVol = soundSettings.master * volCategoryMultiplier;
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(finalVol, audioCtx.currentTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + attack + release);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + attack + release);
    } catch(e) {}
}

function playRollTickSound() {
    playSynthesizedTone(150, 'triangle', 0.15 * soundSettings.roll, 0.01, 0.08);
}

function playNormalDropSound() {
    playSynthesizedTone(600, 'sine', 0.2 * soundSettings.cutscene, 0.02, 0.4);
}

function playUIClick() {
    if (!soundSettings.enabled) return;
    const snd = audioFiles['click'];
    if (snd) {
        const clone = snd.cloneNode();
        clone.volume = soundSettings.master * soundSettings.click;
        clone.play().catch(e => {});
    }
}

function playDropSound(grade) {
    if (!soundSettings.enabled) return;
    let soundKey = '';
    if (grade === "MYTHIC") soundKey = 'dropMythic';
    else if (grade === "LEGEND") soundKey = 'dropLegend';

    if (soundKey && audioFiles[soundKey]) {
        const clone = audioFiles[soundKey].cloneNode();
        clone.volume = soundSettings.master * soundSettings.cutscene;
        clone.play().catch(e => {});
    } else if (grade !== "DIVINE" && grade !== "COSMIC" && grade !== "JS") {
        playNormalDropSound();
    }
}

let activeCutsceneAudio = null;
let skipAudioPlayer = null;

function playIntegratedSound(soundName) {
    if (!soundSettings.enabled) return;
    const snd = audioFiles[soundName];
    if (snd) {
        activeCutsceneAudio = snd.cloneNode();
        activeCutsceneAudio.volume = soundSettings.master * soundSettings.cutscene;
        activeCutsceneAudio.currentTime = 0; // 평소에는 처음(0초)부터 정상 재생
        activeCutsceneAudio.play().catch(e => {});
    }
}

function playSkipSoundAt95(soundName) {
    if (!soundSettings.enabled) return;
    stopIntegratedSound(); // 기존 컷씬 노래 끄기
    const snd = audioFiles[soundName];
    if (snd) {
        skipAudioPlayer = snd.cloneNode();
        skipAudioPlayer.volume = soundSettings.master * soundSettings.cutscene;
        skipAudioPlayer.currentTime = 9.5; // 스킵 시 새로운 사운드를 9.5초부터 재생
        skipAudioPlayer.play().catch(e => {});
    }
}

function stopIntegratedSound() {
    if (activeCutsceneAudio) {
        activeCutsceneAudio.pause();
        activeCutsceneAudio.currentTime = 0;
        activeCutsceneAudio = null;
    }
    if (skipAudioPlayer) {
        skipAudioPlayer.pause();
        skipAudioPlayer.currentTime = 0;
        skipAudioPlayer = null;
    }
}

document.body.addEventListener('click', () => {
    initSynthAudio();
    if (currentBgm && currentBgm.paused) {
        currentBgm.play().catch(e => {});
    }
}, { once: true });

document.body.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) {
        if (e.target.id !== 'roll-btn' && e.target.id !== 'btn-text' && e.target.id !== 'skip-cutscene-btn') {
            playUIClick();
        }
    }
});

const AURA_DATA = [
    { id: "com_drum", name: "동네북 김가은", grade: "COMMON", in: 2, color: "#696969" },
    { id: "com_normal", name: "평범한 김티비", grade: "COMMON", in: 4, color: "#808080" },
    { id: "com_passerby", name: "지나가는 김민채", grade: "COMMON", in: 7, color: "#a9a9a9" },
    { id: "unc_stretching", name: "스트레칭하는 김티비", grade: "COMMON", in: 10, color: "#2ecc71" },
    { id: "unc_running", name: "뛰어가는 김민채", grade: "UNCOMMON", in: 12, color: "#90ee90" },
    { id: "unc_angry", name: "조금 화난 김건우", grade: "UNCOMMON", in: 16, color: "#3cb371" },
    { id: "unc_tired", name: "피곤한 박지성", grade: "UNCOMMON", in: 20, color: "#32cd32" },
    { id: "com_darkminchae", name: "깜민채", grade: "UNCOMMON", in: 25, color: "#2f4f4f" },
    { id: "rare_soldier", name: "예비군 공병은", grade: "RARE", in: 28, color: "#6495ed" },
    { id: "com_yellow_butt", name: "노랭덩이", grade: "RARE", in: 33, color: "#d4ac0d" },
    { id: "rare_train", name: "폭주기관차 김민채", grade: "RARE", in: 45, color: "#1e90ff" },
    { id: "rare_gunwoo_tribe", name: "김건우족을보았다", grade: "RARE", in: 56, color: "#3498db" },
    { id: "rare_algo", name: "알고리즘 김티비", grade: "RARE", in: 85, color: "#4169e1" },
    { id: "ep_baksisung", name: "밪지성", grade: "EPIC", in: 100, color: "#27ae60" },
    { id: "epic_lucky", name: "운수 좋은 김티비", grade: "EPIC", in: 150, color: "#da70d6" },
    { id: "unc_hospital", name: "박지성지병원", grade: "EPIC", in: 250, color: "#2e8b57" },
    { id: "epic_destroy", name: "파괴신 김건우", grade: "EPIC", in: 350, color: "#9932cc" },
    { id: "ep_psychopath_gunwoo", name: "싸이코패스 김건우", grade: "EPIC", in: 444, color: "#b03a2e" },
    { id: "rare_gaedoor", name: "김가은두르", grade: "LEGEND", in: 500, color: "#4682b4" },
    { id: "ep_poop_tv", name: "똥먹방 김티비", grade: "LEGEND", in: 645, color: "#8d6e63" },
    { id: "ep_gaen_sujeo", name: "김가은수저", grade: "LEGEND", in: 737, color: "#f39c12" },
    { id: "ep_crazykong", name: "크레이지콩", grade: "LEGEND", in: 758, color: "#d35400" },
    { id: "epic_emperor", name: "황제 박지성", grade: "LEGEND", in: 800, color: "#8a2be2" },
    { id: "ep_mc_byungeun", name: "MC병은", grade: "LEGEND", in: 888, color: "#8e44ad" },
    { id: "legend_speed", name: "광속의 김민채", grade: "LEGEND", in: 1200, color: "#dc143c", class: "aura-legend-1" },
    { id: "epic_kimmodi", name: "기모띠비", grade: "LEGEND", in: 2222, color: "#9370db", class: "aura-legend-2" },
    { id: "legend_wizard", name: "대마법사 공병은", grade: "LEGEND", in: 3500, color: "#ff0000", class: "aura-legend-3" },
    { id: "var_gebsin", name: "김가은두르 : 게브신", grade: "LEGEND", in: 7878, color: "#f1c40f", class: "aura-legend-4" },
    { id: "legend_knight", name: "빛의 기사 김가은", grade: "LEGEND", in: 8000, color: "#ff4500", class: "aura-legend-5" },
    { id: "com_steel_gaen", name: "동네북 김가은 : 강철맷집", grade: "LEGEND", in: 8888, color: "#ff6347", class: "aura-legend-1" },
    { id: "gemini_basic", name: "김민제미나이", grade: "MYTHIC", in: 10101, color: "#00ffff", class: "aura-mythic-1" },
    { id: "epic_monkey", name: "건숭이", grade: "MYTHIC", in: 13131, color: "#ba55d3", class: "aura-mythic-2" },
    { id: "mythic_empress", name: "절대여제 김가은", grade: "MYTHIC", in: 15000, color: "#ff69b4", class: "aura-mythic-3" },
    { id: "un_sleep_jisung", name: "피곤한 박지성 : 눈을 뜬", grade: "MYTHIC", in: 22330, color: "#e74c3c", class: "aura-mythic-4" },
    { id: "variant_lord", name: "파괴신 김건우 : 멸망의 군주", grade: "MYTHIC", in: 44444, color: "#cd853f", class: "aura-mythic-5" },
    { id: "mythic_tube", name: "100만 유튜버 김티비", grade: "MYTHIC", in: 45000, color: "#00bcd4", class: "aura-mythic-6" },
    { id: "var_gokpog", name: "폭주기관차 김민채 : 광폭", grade: "MYTHIC", in: 95555, color: "#ff4500", class: "aura-mythic-2" },
    { id: "mythic_heart", name: "두 개의 심장 박지성", grade: "MYTHIC", in: 100000, color: "#00fa9a", class: "aura-mythic-1" },
    { id: "cosmic_black_butt", name: "노랭덩이 : 흑덩이", grade: "MYTHIC", in: 89898, color: "#212121", class: "aura-cosmic-2" },
    { id: "kim_crazy_kim_77", name: "기모띠비 : 앙기모띠", grade: "MYTHIC", in: 777777, color: "#ff1493", class: "aura-mythic-3" },
    { id: "gemini_pro", name: "김민제미나이 : 프로", grade: "DIVINE", in: 1010101, color: "#9b59b6", class: "aura-divine-1" },
    { id: "div_absolute_gaen", name: "절대여제 김가은 : 범접불가", grade: "DIVINE", in: 1515151, color: "#a55fea", class: "aura-divine-2" },
    { id: "var_virtual", name: "100만 유튜버 김티비 : 버츄얼 모드", grade: "DIVINE", in: 2545454, color: "#2ecc71", class: "aura-divine-3" },
    { id: "variant_abyss", name: "깜민채 : 형용할 수 없는 아득함", grade: "DIVINE", in: 3555555, color: "#bdc3c7", class: "aura-divine-4" },
    { id: "cosmic_psycho_mode", name: "싸이코패스 김건우 : 무감정 모드", grade: "DIVINE", in: 4040404, color: "#581845", class: "aura-cosmic-1" },
    { id: "divine_god", name: "초월자 김건우", grade: "DIVINE", in: 5000000, color: "#3498db", class: "aura-divine-5" },
    { id: "var_simon", name: "MC병은 : 사이먼 도미닉", grade: "DIVINE", in: 8898989, color: "#8e44ad", class: "aura-divine-1" },
    { id: "divine_dim", name: "차원 지배자 공병은", grade: "DIVINE", in: 12000000, color: "#00c6ff", class: "aura-divine-2" },
    { id: "variant_haebeoji", name: "두개의 심장 박지성 : 해버지", grade: "COSMIC", in: 26666666, color: "#ff8c00", class: "aura-cosmic-1" },
    { id: "legend_gonjiam", name: "곤지암병은", grade: "COSMIC", in: 29999999, color: "#ff1493", class: "aura-cosmic-2" },
    { id: "js_collector", name: "전설의 공병수집가 공병은", grade: "COSMIC", in: 36363636, color: "#ffaa00", class: "aura-cosmic-3" },
    { id: "js_creator", name: "우주의 대거악 김민채", grade: "COSMIC", in: 50000000, color: "#ff0055", class: "aura-cosmic-4" },
    { id: "cosmic_diarrhea_tv", name: "똥먹방 김티비 : 설사먹방", grade: "COSMIC", in: 64564564, color: "#795548", class: "aura-cosmic-3" },
    { id: "divine_angel_gaen", name: "환희의 대천사 김가은", grade: "JS", in: 150000000, color: "#ffeb3b", class: "aura-holy-angel" },
    { id: "js_void_king", name: "공허왕 공허병은", grade: "JS", in: 111111111, color: "#ff0000", class: "aura-js-void" },
    { id: "js_lightning_jisung", name: "번개의 좌 박지성", grade: "JS", in: 300000000, color: "#00ffff", class: "aura-lightning" }
];

AURA_DATA.sort((a, b) => a.in - b.in);

const GRADES = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGEND", "MYTHIC", "DIVINE", "COSMIC", "JS"];

const SHOP_ITEMS = [
    { id: "luck_1", name: "행운의 물약 1", price: 300, type: "luck", value: 0.15, duration: 120, desc: "+15% 행운 (2분)", border: "border-green" },
    { id: "luck_2", name: "행운의 물약 2", price: 800, type: "luck", value: 0.30, duration: 120, desc: "+30% 행운 (2분)", border: "border-green" },
    { id: "luck_3", name: "행운의 물약 3", price: 2000, type: "luck", value: 0.66, duration: 120, desc: "+66% 행운 (2분)", border: "border-green" },
    { id: "speed_1", name: "속도의 물약 1", price: 500, type: "speed", value: 0.15, duration: 180, desc: "+15% 속도 (3분)", border: "border-blue" },
    { id: "speed_2", name: "속도의 물약 2", price: 1200, type: "speed", value: 0.30, duration: 180, desc: "+30% 속도 (3분)", border: "border-blue" },
    { id: "speed_3", name: "속도의 물약 3", price: 3000, type: "speed", value: 0.55, duration: 180, desc: "+55% 속도 (3분)", border: "border-blue" },
    { id: "limit_potion", name: "한계의 물약", price: 43333, type: "luck_mult", value: 5000, maxUses: 3, desc: "×5000배 행운 (3회 소모)", border: "border-green" },
    { id: "overcome_potion", name: "극복의 물약", price: 195000, type: "luck_mult", value: 50000, maxUses: 2, desc: "×50000배 행운 (2회 소모)", border: "border-blue" },
    { id: "heaven_potion", name: "천상의 물약", price: 300000, type: "luck_mult", value: 150000, maxUses: 1, desc: "×150000배 행운 (1회 소모)", border: "border-epic" }
];

const CRAFT_ITEMS = [
    { id: "gear_beginner", name: "초보자의 운수대통 장갑", desc: "영구적으로 행운이 10% 증가합니다.", luckBonus: 0.1, speedBonus: 0, req: { "com_drum": 30, "com_normal": 15, "unc_tired": 5 } },
    { id: "gear_speed", name: "폭주기관차의 부츠", desc: "영구적으로 롤 속도와 쿨타임이 10% 단축됩니다.", luckBonus: 0, speedBonus: 0.1, req: { "rare_train": 8, "unc_running": 20, "com_passerby": 40 } },
    { id: "gear_crazykong_heart", name: "크레이지콩의 심장", desc: "영구적으로 행운 10%, 속도 30%가 증가합니다.", luckBonus: 0.1, speedBonus: 0.3, req: { "ep_crazykong": 5, "ep_baksisung": 10, "com_darkminchae": 44 } },
    { id: "gear_destroyer_fist", name: "파괴신의 주먹", desc: "영구적으로 행운 25%, 속도 15%가 증가합니다.", luckBonus: 0.25, speedBonus: 0.15, req: { "epic_destroy": 5, "rare_train": 10, "unc_angry": 50 } },
    { id: "gear_speedkong_heart", name: "광속의콩 심장", desc: "영구적으로 행운 25%, 속도 50%가 증가합니다.", luckBonus: 0.25, speedBonus: 0.5, req: { "legend_speed": 2, "ep_crazykong": 10, "ep_baksisung": 10, "rare_train": 20, "com_darkminchae": 55 } },
    { id: "gear_gold_button", name: "골드버튼", desc: "영구적으로 행운 50%, 속도 30%가 증가합니다.", luckBonus: 0.5, speedBonus: 0.3, req: { "mythic_tube": 2, "epic_kimmodi": 3, "ep_mc_byungeun": 10, "epic_lucky": 15, "com_normal": 100 } }
];

CRAFT_ITEMS.sort((a, b) => (a.luckBonus + a.speedBonus) - (b.luckBonus + b.speedBonus));

for (let i = 0; i < AURA_DATA.length; i++) { 
    AURA_DATA[i].chance = 100 / AURA_DATA[i].in; 
    let baseJc = Math.max(1, Math.floor(AURA_DATA[i].in / 5)); 
    if (["MYTHIC", "DIVINE", "COSMIC", "JS"].includes(AURA_DATA[i].grade)) {
        baseJc = Math.floor(baseJc * 0.5); 
    }
    if (["DIVINE", "COSMIC", "JS"].includes(AURA_DATA[i].grade)) {
        baseJc = Math.floor(baseJc * 0.6);
    }
    AURA_DATA[i].jcValue = Math.max(1, baseJc);
}

let gameState = { 
    rolls: 0, luck: 1, jc: 0, 
    inventory: {}, itemInventory: {}, discoveredAuras: [], 
    autoDelete: {}, activeBuffs: { luckBonus: 0, speedBonus: 0, luckExpireTime: 0, speedExpireTime: 0 }, 
    activeMultBuffs: [], gear: null, craftedGears: [], usedCodes: [] 
};

let isRolling = false; let isAutoRolling = false; let disableSave = false; let backupGameState = null; let nextRollOverride = null;

const ui = {
    rollCount: document.getElementById('roll-count'), jcCount: document.getElementById('jc-count'),
    luckMultiplier: document.getElementById('luck-multiplier'), speedMultiplier: document.getElementById('speed-multiplier'),
    activeBuffs: document.getElementById('active-buffs'), display: document.getElementById('aura-display'), btn: document.getElementById('roll-btn'), btnText: document.getElementById('btn-text'), cooldownBar: document.getElementById('cooldown-bar'), autoRollBtn: document.getElementById('auto-roll-btn'),
    inventoryBtn: document.getElementById('inventory-btn'), inventoryModal: document.getElementById('inventory-modal'), closeInventory: document.getElementById('close-inventory'), inventoryGrid: document.getElementById('inventory-grid'),
    itemInvenBtn: document.getElementById('item-inven-btn'), itemInvenModal: document.getElementById('item-inven-modal'), closeItemInven: document.getElementById('close-item-inven'), itemInvenGrid: document.getElementById('item-inven-grid'),
    shopBtn: document.getElementById('shop-btn'), shopModal: document.getElementById('shop-modal'), closeShop: document.getElementById('close-shop'), shopGrid: document.getElementById('shop-grid'),
    indexBtn: document.getElementById('index-btn'), indexModal: document.getElementById('index-modal'), closeIndex: document.getElementById('close-index'), indexGrid: document.getElementById('index-grid'),
    settingsHubBtn: document.getElementById('settings-hub-btn'), settingsHubModal: document.getElementById('settings-hub-modal'), closeSettingsHub: document.getElementById('close-settings-hub'),
    devBtn: document.getElementById('dev-btn'), mainDevBtn: document.getElementById('main-dev-btn'), devModal: document.getElementById('dev-modal'), closeDev: document.getElementById('close-dev'),
    craftBtn: document.getElementById('craft-btn'), craftModal: document.getElementById('craft-modal'), closeCraft: document.getElementById('close-craft'), craftGrid: document.getElementById('craft-grid'),
    submitCodeBtn: document.getElementById('submit-code-btn'), codeInput: document.getElementById('code-input'),
    exportSaveBtn: document.getElementById('export-save-btn'), importSaveBtn: document.getElementById('import-save-btn'), saveCodeTextarea: document.getElementById('save-code-textarea'),
    glowOverlay: document.getElementById('border-glow-overlay'), starOverlay: document.getElementById('star-cutscene-overlay'), skipCutsceneBtn: document.getElementById('skip-cutscene-btn'), cutsceneStarContainer: document.getElementById('cutscene-star-container'),
    glitchTextContainer: document.getElementById('glitch-text-container'),
    sellModal: document.getElementById('sell-modal'), closeSell: document.getElementById('close-sell'),
    buyModal: document.getElementById('buy-modal'), closeBuy: document.getElementById('close-buy'),
    usePotionModal: document.getElementById('use-potion-modal'), closeUse: document.getElementById('close-use'),
    soundSettingsBtn: document.getElementById('sound-settings-btn'), soundModal: document.getElementById('sound-modal'), closeSound: document.getElementById('close-sound'),
    volMaster: document.getElementById('vol-master'), volMasterVal: document.getElementById('vol-master-val'),
    volBgm: document.getElementById('vol-bgm'), volBgmVal: document.getElementById('vol-bgm-val'),
    volCutscene: document.getElementById('vol-cutscene'), volCutsceneVal: document.getElementById('vol-cutscene-val'),
    volClick: document.getElementById('vol-click'), volClickVal: document.getElementById('vol-click-val'),
    volRoll: document.getElementById('vol-roll'), volRollVal: document.getElementById('vol-roll-val'),
    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    gradeTableBtn: document.getElementById('grade-table-btn'), gradeTableModal: document.getElementById('grade-table-modal'), closeGradeTable: document.getElementById('close-grade-table'),
    autoDeleteOptions: document.getElementById('auto-delete-options')
};

loadSoundSettings();
applySoundSettingsToUI();
playBgm('lobby');

document.getElementById('game-start-btn').addEventListener('click', () => {
    initSynthAudio();
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('main-game').classList.remove('hidden');
    playBgm('main');
});

ui.gradeTableBtn.addEventListener('click', () => { ui.gradeTableModal.classList.remove('hidden'); });
ui.closeGradeTable.addEventListener('click', () => { ui.gradeTableModal.classList.add('hidden'); });
ui.soundSettingsBtn.addEventListener('click', () => { ui.soundModal.classList.remove('hidden'); });
ui.closeSound.addEventListener('click', () => { ui.soundModal.classList.add('hidden'); });

ui.settingsHubBtn.addEventListener('click', () => { ui.settingsHubModal.classList.remove('hidden'); });
ui.closeSettingsHub.addEventListener('click', () => { ui.settingsHubModal.classList.add('hidden'); });

ui.exportSaveBtn.addEventListener('click', () => {
    const saveString = JSON.stringify(gameState);
    const encoded = btoa(encodeURIComponent(saveString));
    ui.saveCodeTextarea.value = encoded;
    ui.saveCodeTextarea.select();
    navigator.clipboard.writeText(encoded).then(() => {
        alert("📋 세이브 코드가 클립보드에 복사되었습니다!");
    }).catch(err => {
        alert("복사 완료! 텍스트 박스 안의 코드를 직접 복사해주세요.");
    });
});

ui.importSaveBtn.addEventListener('click', () => {
    const code = ui.saveCodeTextarea.value.trim();
    if (!code) {
        alert("❌ 불러올 세이브 코드를 입력해주세요!");
        return;
    }
    try {
        const decoded = decodeURIComponent(atob(code));
        const parsedData = JSON.parse(decoded);
        if (parsedData && typeof parsedData.rolls === 'number' && parsedData.inventory) {
            gameState = { ...gameState, ...parsedData };
            saveGame();
            updateStatsUI();
            buildShopUI();
            buildAutoDeleteUI();
            updateCraftUI();
            ui.settingsHubModal.classList.add('hidden');
            alert("🎉 세이브 데이터를 성공적으로 불러왔습니다!");
        } else {
            alert("❌ 유효하지 않은 세이브 코드 형식입니다.");
        }
    } catch (e) {
        alert("❌ 코드가 손상되었거나 올바르지 않습니다.");
    }
});

ui.submitCodeBtn.addEventListener('click', () => {
    const codeVal = ui.codeInput.value.trim().toUpperCase();
    if (!gameState.usedCodes) gameState.usedCodes = [];

    if (codeVal === "HELPME!") {
        if (gameState.usedCodes.includes("HELPME!")) {
            alert("❌ 이미 사용한 쿠폰입니다! (계정당 1회 제한)");
            return;
        }
        gameState.usedCodes.push("HELPME!");
        gameState.jc += 1000000;
        saveGame();
        updateStatsUI();
        ui.codeInput.value = '';
        ui.settingsHubModal.classList.add('hidden');
        alert("🎉 [HELPME! 쿠폰 성공!] 100만 JC가 지급되었습니다!");
    } else if (codeVal === "NEWUPDATE") {
        if (gameState.usedCodes.includes("NEWUPDATE")) {
            alert("❌ 이미 사용한 쿠폰입니다! (계정당 1회 제한)");
            return;
        }
        gameState.usedCodes.push("NEWUPDATE");
        gameState.itemInventory["luck_2"] = (gameState.itemInventory["luck_2"] || 0) + 5;
        gameState.itemInventory["speed_2"] = (gameState.itemInventory["speed_2"] || 0) + 5;
        gameState.itemInventory["overcome_potion"] = (gameState.itemInventory["overcome_potion"] || 0) + 1;
        saveGame();
        ui.codeInput.value = '';
        ui.settingsHubModal.classList.add('hidden');
        alert("🎉 [쿠폰 성공!] 행운의 물약 2 (5개), 속도의 물약 2 (5개), 극복의 물약 (1개)이 지급되었습니다!");
    } else if (codeVal === "SORRYBRO") {
        if (gameState.usedCodes.includes("SORRYBRO")) {
            alert("❌ 이미 사용한 쿠폰입니다! (계정당 1회 제한)");
            return;
        }
        gameState.usedCodes.push("SORRYBRO");
        gameState.itemInventory["limit_potion"] = (gameState.itemInventory["limit_potion"] || 0) + 2;
        gameState.itemInventory["overcome_potion"] = (gameState.itemInventory["overcome_potion"] || 0) + 2;
        gameState.itemInventory["heaven_potion"] = (gameState.itemInventory["heaven_potion"] || 0) + 2;
        saveGame();
        ui.codeInput.value = '';
        ui.settingsHubModal.classList.add('hidden');
        alert("🎉 [SORRYBRO 쿠폰 성공!] 한계의 물약 2개, 극복의 물약 2개, 천상의 물약 2개가 지급되었습니다!");
    } else {
        alert("❌ 존재하지 않거나 잘못된 코드입니다.");
    }
});

function applySoundSettingsToUI() {
    ui.volMaster.value = soundSettings.master * 100; ui.volMasterVal.innerText = Math.round(soundSettings.master * 100);
    ui.volBgm.value = soundSettings.bgm * 100; ui.volBgmVal.innerText = Math.round(soundSettings.bgm * 100);
    ui.volCutscene.value = soundSettings.cutscene * 100; ui.volCutsceneVal.innerText = Math.round(soundSettings.cutscene * 100);
    ui.volClick.value = soundSettings.click * 100; ui.volClickVal.innerText = Math.round(soundSettings.click * 100);
    ui.volRoll.value = (soundSettings.roll !== undefined ? soundSettings.roll : 1.0) * 100; ui.volRollVal.innerText = Math.round((soundSettings.roll !== undefined ? soundSettings.roll : 1.0) * 100);

    ui.soundToggleBtn.style.background = soundSettings.enabled ? "#27ae60" : "#c0392b";
    ui.soundToggleBtn.innerText = soundSettings.enabled ? "사운드 전체 켜짐 (ON)" : "사운드 전체 꺼짐 (OFF)";
}

ui.volMaster.addEventListener('input', (e) => { soundSettings.master = e.target.value / 100; ui.volMasterVal.innerText = e.target.value; updateBgmVolume(); saveSoundSettings(); });
ui.volBgm.addEventListener('input', (e) => { soundSettings.bgm = e.target.value / 100; ui.volBgmVal.innerText = e.target.value; updateBgmVolume(); saveSoundSettings(); });
ui.volCutscene.addEventListener('input', (e) => { 
    soundSettings.cutscene = e.target.value / 100; 
    soundSettings.drop = soundSettings.cutscene; 
    ui.volCutsceneVal.innerText = e.target.value; 
    if (activeCutsceneAudio) activeCutsceneAudio.volume = soundSettings.master * soundSettings.cutscene;
    if (skipAudioPlayer) skipAudioPlayer.volume = soundSettings.master * soundSettings.cutscene;
    saveSoundSettings(); 
});
ui.volClick.addEventListener('input', (e) => { soundSettings.click = e.target.value / 100; ui.volClickVal.innerText = e.target.value; saveSoundSettings(); });
ui.volRoll.addEventListener('input', (e) => { soundSettings.roll = e.target.value / 100; ui.volRollVal.innerText = e.target.value; saveSoundSettings(); });

ui.soundToggleBtn.addEventListener('click', () => {
    soundSettings.enabled = !soundSettings.enabled;
    applySoundSettingsToUI();
    saveSoundSettings();
    if (!soundSettings.enabled) stopBgm();
    else playBgm(document.getElementById('lobby-screen').classList.contains('hidden') ? 'main' : 'lobby');
});

function loadGame() {
    const savedData = localStorage.getItem('js_rng_save');
    if (savedData) { 
        gameState = { ...gameState, ...JSON.parse(savedData) }; 
        if(!gameState.craftedGears) gameState.craftedGears = []; 
        if(!gameState.usedCodes) gameState.usedCodes = [];
        if(!gameState.activeMultBuffs) gameState.activeMultBuffs = [];
        if(!gameState.discoveredAuras) gameState.discoveredAuras = [];

        for(let auraId in gameState.inventory) {
            if(!gameState.discoveredAuras.includes(auraId)) {
                gameState.discoveredAuras.push(auraId);
            }
        }
    }
    updateStatsUI(); buildShopUI(); buildAutoDeleteUI(); updateCraftUI();
}
function saveGame() { if (disableSave) return; localStorage.setItem('js_rng_save', JSON.stringify(gameState)); }

window.cheatJC = function() { gameState.jc += 1000000; updateStatsUI(); alert("100만 JC 지급!"); }
window.cheatLuck = function() { gameState.luck = 10000; updateStatsUI(); alert("운 10,000배!"); }
window.cheatItems = function() { AURA_DATA.forEach(a => { gameState.inventory[a.id] = (gameState.inventory[a.id] || 0) + 50; if(!gameState.discoveredAuras.includes(a.id)) gameState.discoveredAuras.push(a.id); }); updateInventory(); updateCraftUI(); alert("칭호 50개씩 지급 및 도감 등록!"); }
window.setNextRoll = function() { nextRollOverride = document.getElementById('dev-aura-select').value; const auraInfo = AURA_DATA.find(a => a.id === nextRollOverride); alert(`🎯 다음 굴리기: [${auraInfo.grade}] ${auraInfo.name}`); }

ui.devBtn.addEventListener('click', () => {
    if (!disableSave) {
        const pwd = prompt("🛠️ 개발자 모드 접근\n비밀번호를 입력하세요:");
        if (pwd === "로블록스33") {
            disableSave = true; backupGameState = JSON.parse(JSON.stringify(gameState));
            ui.mainDevBtn.classList.remove('hidden'); 
            ui.settingsHubModal.classList.add('hidden');
            alert("✅ [개발자 모드 ON] 메인 화면에 '개발자 패널' 버튼이 추가되었습니다.");
            const select = document.getElementById('dev-aura-select');
            if (select.children.length === 0) { AURA_DATA.forEach(a => { const opt = document.createElement('option'); opt.value = a.id; opt.innerText = `[${a.grade}] ${a.name}`; select.appendChild(opt); }); }
            ui.devModal.classList.remove('hidden');
        } else if (pwd !== null) alert("❌ 비밀번호가 틀렸습니다.");
    } else { ui.devModal.classList.remove('hidden'); }
});

ui.mainDevBtn.addEventListener('click', () => {
    ui.devModal.classList.remove('hidden');
});

ui.closeDev.addEventListener('click', () => { ui.devModal.classList.add('hidden'); });

window.exitDevMode = function() {
    if(!disableSave) return;
    gameState = JSON.parse(JSON.stringify(backupGameState)); disableSave = false; backupGameState = null; saveGame();
    ui.mainDevBtn.classList.add('hidden'); 
    updateStatsUI(); updateInventory(); updateCraftUI(); ui.devModal.classList.add('hidden'); alert("🚪 개발자 모드를 종료하고 본계정 데이터로 복구했습니다!");
}

function getTotalMultBonus() {
    if (!gameState.activeMultBuffs || gameState.activeMultBuffs.length === 0) return 0;
    let maxBonus = 0;
    gameState.activeMultBuffs.forEach(buff => {
        if (buff.bonus > maxBonus) maxBonus = buff.bonus;
    });
    return maxBonus;
}

function updateStatsUI() { 
    ui.rollCount.innerText = gameState.rolls; 
    ui.jcCount.innerText = gameState.jc.toLocaleString(); 
    
    let gearLuck = 0; let gearSpeed = 0;
    if(gameState.gear) { const equipped = CRAFT_ITEMS.find(g => g.id === gameState.gear); if(equipped) { gearLuck = equipped.luckBonus; gearSpeed = equipped.speedBonus; } }
    
    let baseTotalLuck = gameState.luck + gearLuck + (gameState.activeBuffs.luckBonus || 0);
    let multBonus = getTotalMultBonus();
    let finalLuck = baseTotalLuck + multBonus;

    let currentSpeed = (1 + gearSpeed + (gameState.activeBuffs.speedBonus || 0)).toFixed(2);
    
    if(ui.luckMultiplier) ui.luckMultiplier.innerText = finalLuck.toLocaleString(); 
    if(ui.speedMultiplier) ui.speedMultiplier.innerText = currentSpeed;
}

setInterval(() => {
    const now = Date.now(); let updated = false;
    if (gameState.activeBuffs.luckExpireTime && now > gameState.activeBuffs.luckExpireTime) { gameState.activeBuffs.luckBonus = 0; gameState.activeBuffs.luckExpireTime = 0; updated = true; }
    if (gameState.activeBuffs.speedExpireTime && now > gameState.activeBuffs.speedExpireTime) { gameState.activeBuffs.speedBonus = 0; gameState.activeBuffs.speedExpireTime = 0; updated = true; }
    
    let buffTextArr = [];
    if (gameState.activeBuffs.luckExpireTime && now < gameState.activeBuffs.luckExpireTime) { let leftSec = Math.ceil((gameState.activeBuffs.luckExpireTime - now) / 1000); buffTextArr.push(`🧪 행운물약 (${leftSec}초)`); }
    if (gameState.activeBuffs.speedExpireTime && now < gameState.activeBuffs.speedExpireTime) { let leftSec = Math.ceil((gameState.activeBuffs.speedExpireTime - now) / 1000); buffTextArr.push(`🧪 속도물약 (${leftSec}초)`); }
    
    if (gameState.activeMultBuffs && gameState.activeMultBuffs.length > 0) {
        let totalBonus = getTotalMultBonus();
        let listStr = gameState.activeMultBuffs.map(b => `${b.name} (${b.uses}회)`).join(" / ");
        buffTextArr.push(`⚡ 특수배수 (+${totalBonus.toLocaleString()}배) [${listStr}]`);
    }

    if(gameState.gear) { const equipped = CRAFT_ITEMS.find(g => g.id === gameState.gear); if(equipped) buffTextArr.push(`🔨 [${equipped.name}] 장착중`); }
    
    ui.activeBuffs.innerText = buffTextArr.join(" | "); 
    if (updated) { updateStatsUI(); saveGame(); }
}, 1000);

ui.autoRollBtn.addEventListener('click', () => { isAutoRolling = !isAutoRolling; if (isAutoRolling) { ui.autoRollBtn.innerText = "오토: ON"; ui.autoRollBtn.classList.add('active'); if (!isRolling) startRoll(); } else { ui.autoRollBtn.innerText = "오토: OFF"; ui.autoRollBtn.classList.remove('active'); } });

function startRoll() {
    if (isRolling) return; isRolling = true;
    ui.btn.disabled = true; ui.btnText.innerText = "굴리는 중..."; ui.btn.classList.remove('cooldown-active'); 
    gameState.rolls++; 

    updateStatsUI(); saveGame();
    let gearSpeed = gameState.gear ? (CRAFT_ITEMS.find(g => g.id === gameState.gear)?.speedBonus || 0) : 0;
    const speedBonus = (gameState.activeBuffs.speedBonus || 0) + gearSpeed;
    const maxTime = Math.max(400, 1200 * (1 - speedBonus)); const intervalTime = 60; let rollTime = 0; 
    
    const rollInterval = setInterval(() => {
        playRollTickSound();
        const randomFake = AURA_DATA[Math.floor(Math.random() * AURA_DATA.length)];
        const fakeStyle = randomFake.class ? '' : `color:${randomFake.color};`;
        ui.display.innerHTML = `<div class="rolling-text result-name ${randomFake.class || ''}" style="${fakeStyle}">${randomFake.name}</div>`;
        rollTime += intervalTime;
        if (rollTime >= maxTime) { clearInterval(rollInterval); finishRoll(); }
    }, intervalTime);
}

function playShakeGlowEffect(rolled) { 
    document.body.classList.add('screen-shake'); 
    const glowColor = rolled.color || "#f1c40f";
    ui.glowOverlay.style.boxShadow = `inset 0 0 70px 25px ${glowColor}`; 
    ui.glowOverlay.classList.remove('hidden'); 
    setTimeout(() => { document.body.classList.remove('screen-shake'); ui.glowOverlay.classList.add('hidden'); }, 1500); 
}

async function playStarCutscene(rolled) { 
    ui.display.innerHTML = ''; 
    ui.starOverlay.classList.remove('hidden'); 
    ui.starOverlay.classList.remove('cutscene-bg-cosmic', 'cutscene-bg-js');

    if (currentBgm) currentBgm.pause();

    ui.cutsceneStarContainer.style.color = rolled.color;
    ui.cutsceneStarContainer.className = 'spin-zoom-accel';

    let soundKey = 'divine_all';
    if (rolled.grade === "JS") {
        if (rolled.id === "divine_angel_gaen") {
            ui.starOverlay.style.setProperty('--js-center-col', '#fff176'); 
            ui.starOverlay.style.setProperty('--js-mid-col', '#cddc39'); 
            ui.starOverlay.style.setProperty('--js-ray-col', 'rgba(255, 235, 59, 0.2)'); 
            ui.starOverlay.style.setProperty('--js-glow-col', '#ffff00'); 
            soundKey = 'js_all';
        } else if (rolled.id === "js_lightning_jisung") {
            ui.starOverlay.style.setProperty('--js-center-col', '#00ffff'); 
            ui.starOverlay.style.setProperty('--js-mid-col', '#1a237e'); 
            ui.starOverlay.style.setProperty('--js-ray-col', 'rgba(0, 255, 255, 0.25)'); 
            ui.starOverlay.style.setProperty('--js-glow-col', '#00e5ff'); 
            soundKey = 'js_all';
        } else {
            ui.starOverlay.style.setProperty('--js-center-col', '#6a0000');
            ui.starOverlay.style.setProperty('--js-mid-col', '#200000');
            ui.starOverlay.style.setProperty('--js-ray-col', 'rgba(255,0,0,0.15)');
            ui.starOverlay.style.setProperty('--js-glow-col', '#ff0000');
            soundKey = 'js_all';
        }
        ui.starOverlay.classList.add('cutscene-bg-js');
    } else if (rolled.grade === "COSMIC") {
        ui.starOverlay.classList.add('cutscene-bg-cosmic');
        soundKey = 'cosmic_all';
    }

    // 1. 컷씬 시작 시 노래를 처음(0초)부터 정상 재생
    playIntegratedSound(soundKey);

    return new Promise((resolve) => {
        let isResolved = false;
        let wasSkipped = false;

        const finish = () => {
            if (isResolved) return;
            isResolved = true;
            clearTimeout(cutsceneTimer);
            
            if (wasSkipped) {
                // 스킵 버튼을 누른 경우: 기존 컷씬 노래는 꺼지고 9.5초부터 시작하는 새로운 사운드 재생
                playSkipSoundAt95(soundKey);
            } else {
                // 자연 종료된 경우: 기존 컷씬 노래 종료
                stopIntegratedSound();
            }

            ui.skipCutsceneBtn.removeEventListener('click', skipHandler);
            ui.starOverlay.classList.add('flash-white');
            setTimeout(() => {
                ui.starOverlay.classList.remove('flash-white');
                ui.starOverlay.classList.add('hidden');
                ui.starOverlay.classList.remove('cutscene-bg-cosmic', 'cutscene-bg-js');
                ui.cutsceneStarContainer.className = '';
                resolve();
            }, 500);
        };

        const skipHandler = () => {
            wasSkipped = true;
            finish();
        };

        ui.skipCutsceneBtn.addEventListener('click', skipHandler, { once: true });
        const cutsceneTimer = setTimeout(finish, 10000);
    });
}

async function finishRoll() {
    let rolled = AURA_DATA[0]; 
    if (nextRollOverride) { 
        rolled = AURA_DATA.find(a => a.id === nextRollOverride) || rolled; 
        nextRollOverride = null; 
    } else {
        let gearLuck = gameState.gear ? (CRAFT_ITEMS.find(g => g.id === gameState.gear)?.luckBonus || 0) : 0;
        let baseTotalLuck = gameState.luck + gearLuck + (gameState.activeBuffs.luckBonus || 0);
        let multBonus = getTotalMultBonus();
        const totalLuck = baseTotalLuck + multBonus;

        let pool = AURA_DATA;
        if (multBonus > 0) {
            let filtered = AURA_DATA.filter(a => a.in >= totalLuck);
            if (filtered.length > 0) {
                pool = filtered;
            }
        }

        let found = false;
        for (let i = pool.length - 1; i >= 0; i--) {
            const aura = pool[i];
            let rawChance = totalLuck / aura.in;
            if (rawChance >= 1.0 || Math.random() < Math.min(1.0, rawChance)) {
                rolled = aura;
                found = true;
                break;
            }
        }
        if (!found) {
            rolled = pool[0];
        }
    }

    if (gameState.activeMultBuffs && gameState.activeMultBuffs.length > 0) {
        for (let i = 0; i < gameState.activeMultBuffs.length; i++) {
            gameState.activeMultBuffs[i].uses--;
        }
        gameState.activeMultBuffs = gameState.activeMultBuffs.filter(b => b.uses > 0);
    }

    if (!gameState.discoveredAuras) gameState.discoveredAuras = [];
    if (!gameState.discoveredAuras.includes(rolled.id)) {
        gameState.discoveredAuras.push(rolled.id);
    }

    if (rolled.grade === "DIVINE" || rolled.grade === "COSMIC" || rolled.grade === "JS") { 
        await playStarCutscene(rolled); 
        playShakeGlowEffect(rolled); 
    } else if (rolled.grade === "LEGEND" || rolled.grade === "MYTHIC") { 
        playShakeGlowEffect(rolled);
        setTimeout(() => {
            playDropSound(rolled.grade);
        }, 50);
    }

    if (currentBgm && soundSettings.enabled) {
        updateBgmVolume();
        currentBgm.play().catch(e => {});
    }

    let autoSoldMsg = "";
    if (gameState.autoDelete[rolled.grade]) { 
        gameState.jc += rolled.jcValue; 
        autoSoldMsg = `<div style="font-size: 14px; color: #f1c40f; margin-top: 5px;">(자동 판매됨: +${rolled.jcValue.toLocaleString()} JC)</div>`; 
    } else { 
        if (!gameState.inventory[rolled.id]) gameState.inventory[rolled.id] = 1; 
        else gameState.inventory[rolled.id]++; 
    }
    saveGame(); updateStatsUI(); updateCraftUI();

    let shadowStyle = "";
    if (["LEGEND", "MYTHIC", "DIVINE", "COSMIC", "JS"].includes(rolled.grade)) {
        shadowStyle = `text-shadow: 0 0 12px ${rolled.color}aa;`;
    }
    const nameClass = rolled.class || '';
    const nameStyle = rolled.class ? '' : `color: ${rolled.color}; ${shadowStyle}`;
    
    ui.display.innerHTML = `<div class="result-pop"><div class="result-grade">[${rolled.grade}]</div><div class="result-name ${nameClass}" style="${nameStyle}">${rolled.name}</div><div class="result-chance">확률: 1 in ${rolled.in.toLocaleString()}</div>${autoSoldMsg}</div>`;

    let gearSpeed = gameState.gear ? (CRAFT_ITEMS.find(g => g.id === gameState.gear)?.speedBonus || 0) : 0;
    const speedBonus = (gameState.activeBuffs.speedBonus || 0) + gearSpeed;
    const baseCooldown = isAutoRolling ? 2000 : 1000; const cooldownTime = Math.max(300, baseCooldown * (1 - speedBonus));

    ui.btnText.innerText = "쿨타임..."; ui.cooldownBar.style.transitionDuration = `${cooldownTime}ms`; ui.cooldownBar.style.animationDuration = `${cooldownTime}ms`; ui.btn.classList.add('cooldown-active');
    setTimeout(() => { ui.btn.classList.remove('cooldown-active'); ui.btn.disabled = false; ui.btnText.innerText = "ROLL (굴리기)"; isRolling = false; if (isAutoRolling) startRoll(); }, cooldownTime); 
}

let currentSellId = null; let currentSellMax = 0; let currentSellPrice = 0;

window.openSellModal = function(id) {
    const count = gameState.inventory[id]; const auraInfo = AURA_DATA.find(a => a.id === id); if(!count || !auraInfo) return;
    currentSellId = id; currentSellMax = count; currentSellPrice = auraInfo.jcValue;
    document.getElementById('sell-item-name').innerText = `[${auraInfo.grade}] ${auraInfo.name} (보유: ${count}개)`;
    const slider = document.getElementById('sell-slider'); const input = document.getElementById('sell-input');
    slider.max = count; slider.value = count; input.max = count; input.value = count;
    document.getElementById('sell-total-jc').innerText = (count * currentSellPrice).toLocaleString();
    ui.sellModal.classList.remove('hidden');
}

ui.closeSell.addEventListener('click', () => { ui.sellModal.classList.add('hidden'); });

document.getElementById('sell-slider').addEventListener('input', (e) => { document.getElementById('sell-input').value = e.target.value; document.getElementById('sell-total-jc').innerText = (e.target.value * currentSellPrice).toLocaleString(); });
document.getElementById('sell-input').addEventListener('input', (e) => { let val = parseInt(e.target.value); if (val > currentSellMax) val = currentSellMax; if (val < 1 || isNaN(val)) val = 1; e.target.value = val; document.getElementById('sell-slider').value = val; document.getElementById('sell-total-jc').innerText = (val * currentSellPrice).toLocaleString(); });

document.getElementById('confirm-sell-btn').addEventListener('click', () => {
    if (!currentSellId) return; const sellAmount = parseInt(document.getElementById('sell-input').value); const auraInfo = AURA_DATA.find(a => a.id === currentSellId);
    const highGrades = ["LEGEND", "MYTHIC", "DIVINE", "COSMIC", "JS"];
    if (highGrades.includes(auraInfo.grade)) { if (!window.confirm(`⚠️ [경고] ${auraInfo.grade} 등급 칭호입니다!\n정말로 ${sellAmount}개를 판매하시겠습니까?`)) return; } 
    gameState.inventory[currentSellId] -= sellAmount; if (gameState.inventory[currentSellId] === 0) delete gameState.inventory[currentSellId]; 
    const earnedJC = auraInfo.jcValue * sellAmount; gameState.jc += earnedJC; saveGame(); updateStatsUI(); updateInventory(); updateCraftUI(); 
    ui.sellModal.classList.add('hidden');
});

let currentBuyId = null; let currentBuyMax = 0; let currentBuyPrice = 0;

window.openBuyModal = function(id) {
    const item = SHOP_ITEMS.find(i => i.id === id); if(!item) return;
    
    currentBuyId = id; 
    currentBuyPrice = item.price;
    currentBuyMax = Math.floor(gameState.jc / item.price);

    document.getElementById('buy-item-name').innerText = `🛒 [${item.name}] (구매가능: 최대 ${currentBuyMax}개)`;
    const slider = document.getElementById('buy-slider'); const input = document.getElementById('buy-input');
    
    let startVal = currentBuyMax > 0 ? 1 : 0;
    slider.max = Math.max(1, currentBuyMax); slider.value = startVal; 
    input.max = Math.max(1, currentBuyMax); input.value = startVal;
    document.getElementById('buy-total-jc').innerText = (startVal * currentBuyPrice).toLocaleString();
    
    ui.buyModal.classList.remove('hidden');
}

ui.closeBuy.addEventListener('click', () => { ui.buyModal.classList.add('hidden'); });

document.getElementById('buy-slider').addEventListener('input', (e) => { document.getElementById('buy-input').value = e.target.value; document.getElementById('buy-total-jc').innerText = (e.target.value * currentBuyPrice).toLocaleString(); });
document.getElementById('buy-input').addEventListener('input', (e) => { let val = parseInt(e.target.value); if (val > currentBuyMax) val = currentBuyMax; if (val < 0 || isNaN(val)) val = 0; e.target.value = val; document.getElementById('buy-slider').value = val; document.getElementById('buy-total-jc').innerText = (val * currentBuyPrice).toLocaleString(); });

document.getElementById('confirm-buy-btn').addEventListener('click', () => {
    if (!currentBuyId) return; 
    const buyAmount = parseInt(document.getElementById('buy-input').value); 
    
    if (buyAmount <= 0) { alert("❌ 구매할 개수를 1개 이상 선택해주세요."); return; }

    const item = SHOP_ITEMS.find(i => i.id === currentBuyId);
    const totalPrice = buyAmount * item.price;

    if (gameState.jc < totalPrice) { alert("❌ JC가 부족합니다!"); return; }
    
    gameState.jc -= totalPrice; 
    if (!gameState.itemInventory[currentBuyId]) gameState.itemInventory[currentBuyId] = buyAmount;
    else gameState.itemInventory[currentBuyId] += buyAmount;

    saveGame(); updateStatsUI(); buildShopUI();
    ui.buyModal.classList.add('hidden');
    alert(`🎉 '${item.name}' ${buyAmount}개 구매 완료!`);
});

let currentUseId = null;

window.openUseModal = function(itemId) {
    const count = gameState.itemInventory[itemId];
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!count || !item) return;

    currentUseId = itemId;
    document.getElementById('use-potion-name').innerText = `🧪 [${item.name}] (보유: ${count}개)`;
    const slider = document.getElementById('use-slider');
    const input = document.getElementById('use-input');
    slider.max = count; slider.value = 1;
    input.max = count; input.value = 1;
    ui.usePotionModal.classList.remove('hidden');
}

ui.closeUse.addEventListener('click', () => { ui.usePotionModal.classList.add('hidden'); });

document.getElementById('use-slider').addEventListener('input', (e) => {
    document.getElementById('use-input').value = e.target.value;
});
document.getElementById('use-input').addEventListener('input', (e) => {
    let val = parseInt(e.target.value);
    const maxVal = parseInt(e.target.max) || 1;
    if (val > maxVal) val = maxVal;
    if (val < 1 || isNaN(val)) val = 1;
    e.target.value = val;
    document.getElementById('use-slider').value = val;
});

document.getElementById('confirm-use-btn').addEventListener('click', () => {
    if (!currentUseId) return;
    const amount = parseInt(document.getElementById('use-input').value);
    const item = SHOP_ITEMS.find(i => i.id === currentUseId);
    if (!item || !gameState.itemInventory[currentUseId] || gameState.itemInventory[currentUseId] < amount) {
        alert("❌ 물약 수량이 부족합니다!");
        return;
    }

    gameState.itemInventory[currentUseId] -= amount;
    if (gameState.itemInventory[currentUseId] === 0) delete gameState.itemInventory[currentUseId];

    const now = Date.now();
    if (item.type === "luck") {
        gameState.activeBuffs.luckBonus = item.value;
        const addDurationMs = item.duration * 1000 * amount;
        if (gameState.activeBuffs.luckExpireTime && gameState.activeBuffs.luckExpireTime > now) {
            gameState.activeBuffs.luckExpireTime += addDurationMs;
        } else {
            gameState.activeBuffs.luckExpireTime = now + addDurationMs;
        }
    } else if (item.type === "speed") {
        gameState.activeBuffs.speedBonus = item.value;
        const addDurationMs = item.duration * 1000 * amount;
        if (gameState.activeBuffs.speedExpireTime && gameState.activeBuffs.speedExpireTime > now) {
            gameState.activeBuffs.speedExpireTime += addDurationMs;
        } else {
            gameState.activeBuffs.speedExpireTime = now + addDurationMs;
        }
    } else if (item.type === "luck_mult") {
        if (!gameState.activeMultBuffs) gameState.activeMultBuffs = [];
        gameState.activeMultBuffs.push({ name: item.name, bonus: item.value, uses: item.maxUses * amount });
    }

    saveGame();
    updateStatsUI();
    updateItemInventory();
    ui.usePotionModal.classList.add('hidden');
    alert(`✨ '${item.name}' ${amount}개 사용 완료!`);
});

function updateInventory() { 
    ui.inventoryGrid.innerHTML = ''; 
    for (let id in gameState.inventory) { 
        const count = gameState.inventory[id]; const auraInfo = AURA_DATA.find(a => a.id === id); 
        if (auraInfo) { 
            const tile = document.createElement('div'); 
            const isJS = auraInfo.grade === "JS";
            const isCosmic = auraInfo.grade === "COSMIC";
            const isHolyAngel = (id === "divine_angel_gaen");
            const isLightning = (id === "js_lightning_jisung");

            let borderClass = '';
            if (isLightning) borderClass = 'border-lightning';
            else if (isHolyAngel) borderClass = 'border-holy-gold';
            else if (isJS) borderClass = 'border-js';
            else if (isCosmic) borderClass = 'border-cosmic';

            tile.className = `inventory-tile ${borderClass}`; 
            tile.style.borderColor = auraInfo.color;
            tile.innerHTML = `
                <div class="tile-grade" style="color:${auraInfo.color}">[${auraInfo.grade}]</div>
                <div class="tile-name ${auraInfo.class || ''}" style="${auraInfo.class ? '' : `color:${auraInfo.color}`}">${auraInfo.name}</div>
                <div class="tile-count">보유: ${count}개</div>
                <button class="action-btn" onclick="openSellModal('${id}')">판매</button>
            `; 
            ui.inventoryGrid.appendChild(tile); 
        } 
    } 
}

window.craftGear = function(gearId) { const gear = CRAFT_ITEMS.find(g => g.id === gearId); for(let reqId in gear.req) { const needed = gear.req[reqId]; const have = gameState.inventory[reqId] || 0; if(have < needed) { alert("재료가 부족합니다!"); return; } } for(let reqId in gear.req) { gameState.inventory[reqId] -= gear.req[reqId]; if(gameState.inventory[reqId] === 0) delete gameState.inventory[reqId]; } gameState.craftedGears.push(gearId); gameState.gear = gearId; saveGame(); updateStatsUI(); updateInventory(); updateCraftUI(); alert(`🎉 '${gear.name}' 제작 완료!`); }
window.equipGear = function(gearId) { gameState.gear = gearId; saveGame(); updateStatsUI(); updateCraftUI(); }
window.unequipGear = function() { gameState.gear = null; saveGame(); updateStatsUI(); updateCraftUI(); }

function updateCraftUI() {
    ui.craftGrid.innerHTML = '';
    for(let gear of CRAFT_ITEMS) {
        const isEquipped = (gameState.gear === gear.id); const isOwned = gameState.craftedGears.includes(gear.id);
        const itemDiv = document.createElement('div'); itemDiv.className = 'craft-item';
        let reqHtml = ''; let canCraft = true;
        for(let reqId in gear.req) { const auraInfo = AURA_DATA.find(a => a.id === reqId); const needed = gear.req[reqId]; const have = gameState.inventory[reqId] || 0; const isMet = have >= needed; if(!isMet) canCraft = false; reqHtml += `<div class="craft-req-item ${isMet ? 'met' : 'unmet'}">- [${auraInfo.grade}] ${auraInfo.name} : ${have} / ${needed}</div>`; }
        let btnHtml = '';
        if (isEquipped) { btnHtml = `<button class="action-btn craft" style="background:#555;" onclick="unequipGear()">해제하기</button>`; } else if (isOwned) { btnHtml = `<button class="action-btn craft" style="background:#2980b9;" onclick="equipGear('${gear.id}')">장착하기</button>`; } else { btnHtml = `<button class="action-btn craft" onclick="craftGear('${gear.id}')" ${canCraft ? '' : 'disabled style="opacity:0.5; cursor:not-allowed;"'}>제작하기</button>`; }
        itemDiv.innerHTML = `<div class="craft-title">${gear.name}</div><div class="craft-desc">${gear.desc}</div>${isOwned ? '<div style="color:#f1c40f; font-size:12px; margin-bottom:10px;">✅ 소유함</div>' : `<div class="craft-req-list">${reqHtml}</div>`}${btnHtml}`; ui.craftGrid.appendChild(itemDiv);
    }
}

function updateItemInventory() { 
    ui.itemInvenGrid.innerHTML = ''; 
    if (Object.keys(gameState.itemInventory).length === 0) { 
        ui.itemInvenGrid.innerHTML = `<p style="color:#777; grid-column: span 2;">물약이 없습니다.</p>`; 
        return; 
    } 
    for (let itemId in gameState.itemInventory) { 
        const count = gameState.itemInventory[itemId]; 
        const item = SHOP_ITEMS.find(i => i.id === itemId); 
        if (item) { 
            const tile = document.createElement('div'); 
            tile.className = `item-tile ${item.border || 'border-rare'}`; 
            tile.innerHTML = `<div class="tile-name">${item.name}</div><div class="tile-desc">${item.desc}</div><div class="tile-count">보유: ${count}개</div><button class="action-btn use" onclick="openUseModal('${itemId}')">사용하기</button>`; 
            ui.itemInvenGrid.appendChild(tile); 
        } 
    } 
}

function buildShopUI() { 
    ui.shopGrid.innerHTML = ''; 
    for (let item of SHOP_ITEMS) { 
        const tile = document.createElement('div'); 
        tile.className = `shop-tile ${item.border || 'border-legend'}`; 
        tile.innerHTML = `<div class="tile-name">${item.name}</div><div class="tile-desc">${item.desc}</div><div class="tile-count" style="font-weight:bold;">${item.price.toLocaleString()} JC</div><button class="action-btn buy" onclick="openBuyModal('${item.id}')">구매하기</button>`; 
        ui.shopGrid.appendChild(tile); 
    } 
}

function updateIndex() { 
    ui.indexGrid.innerHTML = ''; 
    if(!gameState.discoveredAuras) gameState.discoveredAuras = [];

    for (let aura of AURA_DATA) { 
        const item = document.createElement('div'); 
        const isDiscovered = gameState.discoveredAuras.includes(aura.id) || gameState.inventory[aura.id] || gameState.autoDelete[aura.grade];
        const isJS = aura.grade === "JS";
        const isCosmic = aura.grade === "COSMIC";
        const isHolyAngel = (aura.id === "divine_angel_gaen");
        const isLightning = (aura.id === "js_lightning_jisung");

        if (isDiscovered) { 
            let borderClass = '';
            if (isLightning) borderClass = 'border-lightning';
            else if (isHolyAngel) borderClass = 'border-holy-gold';
            else if (isJS) borderClass = 'border-js';
            else if (isCosmic) borderClass = 'border-cosmic';

            item.className = `index-item ${borderClass}`; 
            item.style.borderColor = aura.color;
            item.innerHTML = `
                <div style="font-weight:bold; color:${aura.color}">[${aura.grade}]</div>
                <div class="${aura.class || ''}" style="font-size:14px; font-weight:bold; margin:4px 0; ${aura.class ? '' : `color:${aura.color}`}">${aura.name}</div>
                <div class="index-chance" style="font-size:12px; color:#aaa;">1 in ${aura.in.toLocaleString()}</div>
            `; 
        } else { 
            item.className = 'index-item unknown'; 
            item.innerHTML = `
                <div style="font-weight:bold;">???</div>
                <div class="index-chance" style="font-size:12px;">1 in ${aura.in.toLocaleString()}</div>
            `; 
        } 
        ui.indexGrid.appendChild(item); 
    } 
}

function buildAutoDeleteUI() { 
    ui.autoDeleteOptions.innerHTML = ''; 
    for (let grade of GRADES) { 
        const row = document.createElement('div'); 
        row.className = 'auto-delete-row'; 
        row.innerHTML = `<span style="font-weight:bold; font-size:13px;">[${grade}] 자동 판매</span><input type="checkbox" id="auto-del-${grade}" ${gameState.autoDelete[grade] ? 'checked' : ''}>`; 
        ui.autoDeleteOptions.appendChild(row); 
        document.getElementById(`auto-del-${grade}`).addEventListener('change', (e) => { 
            gameState.autoDelete[grade] = e.target.checked; 
            saveGame(); 
        }); 
    } 
}

ui.btn.addEventListener('click', startRoll);
ui.inventoryBtn.addEventListener('click', () => { updateInventory(); ui.inventoryModal.classList.remove('hidden'); }); ui.closeInventory.addEventListener('click', () => { ui.inventoryModal.classList.add('hidden'); });
ui.itemInvenBtn.addEventListener('click', () => { updateItemInventory(); ui.itemInvenModal.classList.remove('hidden'); }); ui.closeItemInven.addEventListener('click', () => { ui.itemInvenModal.classList.add('hidden'); });
ui.shopBtn.addEventListener('click', () => { ui.shopModal.classList.remove('hidden'); }); ui.closeShop.addEventListener('click', () => { ui.shopModal.classList.add('hidden'); });
ui.indexBtn.addEventListener('click', () => { updateIndex(); ui.indexModal.classList.remove('hidden'); }); ui.closeIndex.addEventListener('click', () => { ui.indexModal.classList.add('hidden'); });
ui.craftBtn.addEventListener('click', () => { updateCraftUI(); ui.craftModal.classList.remove('hidden'); }); ui.closeCraft.addEventListener('click', () => { ui.craftModal.classList.add('hidden'); });

loadGame();
