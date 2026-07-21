const sleep = ms => new Promise(r => setTimeout(r, ms));

const AURA_DATA = [
    { id: "js_creator", name: "우주의 창조자 JS", grade: "JS", in: 50000000, color: "#ff0055", colorClass: "aura-js-1" },
    { id: "js_collector", name: "전설의 공병수집가 공병은", grade: "JS", in: 10000000, color: "#ffaa00", colorClass: "aura-js-2" },
    { id: "legend_gonjiam", name: "곤지암병은", grade: "JS", in: 9999999, color: "#ff1493", colorClass: "aura-js-3" },
    { id: "variant_haebeoji", name: "두개의 심장 박지성 : 해버지", grade: "JS", in: 6666666, color: "#ff8c00", colorClass: "aura-js-4" },
    { id: "divine_dim", name: "차원 지배자 공병은", grade: "DIVINE", in: 5000000, color: "#00c6ff", colorClass: "aura-divine-1" },
    { id: "var_simon", name: "MC병은 : 사이먼 도미닉", grade: "DIVINE", in: 898989, color: "#9b59b6", colorClass: "aura-divine-2" },
    { id: "divine_god", name: "초월자 김건우", grade: "DIVINE", in: 800000, color: "#3498db", colorClass: "aura-divine-3" },
    { id: "variant_abyss", name: "깜민채 : 형용할 수 없는 아득함", grade: "DIVINE", in: 555555, color: "#bdc3c7", colorClass: "aura-divine-4" },
    { id: "var_virtual", name: "100만 유튜버 김티비 : 버츄얼 모드", grade: "DIVINE", in: 545454, color: "#2ecc71", colorClass: "aura-divine-5" },
    { id: "mythic_heart", name: "두 개의 심장 박지성", grade: "MYTHIC", in: 100000, color: "#00ffff", colorClass: "aura-mythic-1" },
    { id: "var_gokpog", name: "폭주기관차 김민채 : 광폭", grade: "MYTHIC", in: 95555, color: "#e74c3c", colorClass: "aura-mythic-2" },
    { id: "mythic_tube", name: "100만 유튜버 김티비", grade: "MYTHIC", in: 45000, color: "#00bcd4", colorClass: "aura-mythic-3" },
    { id: "variant_lord", name: "파괴신 김건우 : 멸망의 군주", grade: "MYTHIC", in: 44444, color: "#cd853f", colorClass: "aura-mythic-4" },
    { id: "mythic_empress", name: "절대여제 김가은", grade: "MYTHIC", in: 15000, color: "#ff69b4", colorClass: "aura-mythic-5" },
    { id: "epic_monkey", name: "건숭이", grade: "MYTHIC", in: 13131, color: "#ba55d3", colorClass: "aura-mythic-6" },
    { id: "legend_knight", name: "빛의 기사 김가은", grade: "LEGEND", in: 8000, color: "#ff4500", colorClass: "aura-legend-1" },
    { id: "var_gebsin", name: "김가은두르 : 게브신", grade: "LEGEND", in: 7878, color: "#f1c40f", colorClass: "aura-legend-2" },
    { id: "legend_wizard", name: "대마법사 공병은", grade: "LEGEND", in: 3500, color: "#ff0000", colorClass: "aura-legend-3" },
    { id: "epic_kimmodi", name: "기모띠비", grade: "LEGEND", in: 2222, color: "#9370db", colorClass: "aura-legend-4" },
    { id: "legend_speed", name: "광속의 김민채", grade: "LEGEND", in: 1200, color: "#dc143c", colorClass: "aura-legend-5" },
    { id: "ep_mc_byungeun", name: "MC병은", grade: "EPIC", in: 888, color: "#8e44ad" },
    { id: "epic_emperor", name: "황제 박지성", grade: "EPIC", in: 800, color: "#8a2be2" },
    { id: "ep_crazykong", name: "크레이지콩", grade: "EPIC", in: 758, color: "#d35400" },
    { id: "ep_gaen_sujeo", name: "김가은수저", grade: "EPIC", in: 737, color: "#f39c12" },
    { id: "rare_gaedoor", name: "김가은두르", grade: "EPIC", in: 500, color: "#4682b4" },
    { id: "epic_destroy", name: "파괴신 김건우", grade: "EPIC", in: 300, color: "#9932cc" },
    { id: "unc_hospital", name: "박지성지병원", grade: "EPIC", in: 250, color: "#2e8b57" },
    { id: "epic_lucky", name: "운수 좋은 김티비", grade: "EPIC", in: 120, color: "#da70d6" },
    { id: "ep_baksisung", name: "밪지성", grade: "EPIC", in: 100, color: "#27ae60" },
    { id: "rare_algo", name: "알고리즘 김티비", grade: "RARE", in: 85, color: "#4169e1" },
    { id: "rare_train", name: "폭주기관차 김민채", grade: "RARE", in: 50, color: "#1e90ff" },
    { id: "rare_soldier", name: "예비군 공병은", grade: "RARE", in: 30, color: "#6495ed" },
    { id: "com_darkminchae", name: "깜민채", grade: "UNCOMMON", in: 25, color: "#2f4f4f" },
    { id: "unc_tired", name: "피곤한 박지성", grade: "UNCOMMON", in: 22, color: "#32cd32" },
    { id: "unc_angry", name: "조금 화난 김건우", grade: "UNCOMMON", in: 16, color: "#3cb371" },
    { id: "unc_running", name: "뛰어가는 김민채", grade: "UNCOMMON", in: 12, color: "#90ee90" },
    { id: "com_passerby", name: "지나가는 김민채", grade: "COMMON", in: 8, color: "#a9a9a9" },
    { id: "com_normal", name: "평범한 김티비", grade: "COMMON", in: 4, color: "#808080" },
    { id: "com_drum", name: "동네북 김가은", grade: "COMMON", in: 2, color: "#696969" }
];

const GRADES = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGEND", "MYTHIC", "DIVINE", "JS"];
const SHOP_ITEMS = [
    { id: "luck_1", name: "행운의 물약 1", price: 300, type: "luck", value: 0.15, duration: 120, desc: "+15% 행운 (2분)" },
    { id: "luck_2", name: "행운의 물약 2", price: 800, type: "luck", value: 0.30, duration: 120, desc: "+30% 행운 (2분)" },
    { id: "luck_3", name: "행운의 물약 3", price: 2000, type: "luck", value: 0.66, duration: 120, desc: "+66% 행운 (2분)" },
    { id: "speed_1", name: "속도의 물약 1", price: 500, type: "speed", value: 0.15, duration: 180, desc: "+15% 속도 (3분)" },
    { id: "speed_2", name: "속도의 물약 2", price: 1200, type: "speed", value: 0.30, duration: 180, desc: "+30% 속도 (3분)" },
    { id: "speed_3", name: "속도의 물약 3", price: 3000, type: "speed", value: 0.55, duration: 180, desc: "+55% 속도 (3분)" }
];

const CRAFT_ITEMS = [
    { id: "gear_beginner", name: "초보자의 운수대통 장갑", desc: "영구적으로 행운이 10% 증가합니다.", luckBonus: 0.1, speedBonus: 0, req: { "com_drum": 30, "com_normal": 15, "unc_tired": 5 } },
    { id: "gear_speed", name: "폭주기관차의 부츠", desc: "영구적으로 롤 속도와 쿨타임이 10% 단축됩니다.", luckBonus: 0, speedBonus: 0.1, req: { "rare_train": 8, "unc_running": 20, "com_passerby": 40 } },
    { id: "gear_crazykong_heart", name: "크레이지콩의 심장", desc: "영구적으로 행운 10%, 속도 30%가 증가합니다.", luckBonus: 0.1, speedBonus: 0.3, req: { "ep_crazykong": 5, "ep_baksisung": 10, "com_darkminchae": 44 } },
    { id: "gear_destroyer_fist", name: "파괴신의 주먹", desc: "영구적으로 행운 25%, 속도 15%가 증가합니다.", luckBonus: 0.25, speedBonus: 0.15, req: { "epic_destroy": 5, "rare_train": 10, "unc_angry": 50 } },
    { id: "gear_speedkong_heart", name: "광속의콩 심장", desc: "영구적으로 행운 25%, 속도 50%가 증가합니다.", luckBonus: 0.25, speedBonus: 0.5, req: { "legend_speed": 2, "ep_crazykong": 10, "ep_baksisung": 10, "rare_train": 20, "com_darkminchae": 55 } }
];

// 행운 + 속도 총합이 높을수록 위쪽에 오도록 정렬
CRAFT_ITEMS.sort((a, b) => (b.luckBonus + b.speedBonus) - (a.luckBonus + a.speedBonus));

let totalChance = 0;
for (let i = 0; i < AURA_DATA.length - 1; i++) { AURA_DATA[i].chance = 100 / AURA_DATA[i].in; AURA_DATA[i].jcValue = Math.max(1, Math.floor(AURA_DATA[i].in / 5)); totalChance += AURA_DATA[i].chance; }
const lastIdx = AURA_DATA.length - 1; AURA_DATA[lastIdx].chance = 100 - totalChance; AURA_DATA[lastIdx].in = Math.round(100 / AURA_DATA[lastIdx].chance); AURA_DATA[lastIdx].jcValue = Math.max(1, Math.floor(AURA_DATA[lastIdx].in / 5));

let gameState = { rolls: 0, luck: 1, jc: 0, inventory: {}, itemInventory: {}, autoDelete: {}, activeBuffs: { luckBonus: 0, speedBonus: 0, luckExpireTime: 0, speedExpireTime: 0 }, gear: null, craftedGears: [] };
let isRolling = false; let isAutoRolling = false; let disableSave = false; let backupGameState = null; let nextRollOverride = null;

const ui = {
    rollCount: document.getElementById('roll-count'), jcCount: document.getElementById('jc-count'),
    luckMultiplier: document.getElementById('luck-multiplier'), speedMultiplier: document.getElementById('speed-multiplier'),
    activeBuffs: document.getElementById('active-buffs'), display: document.getElementById('aura-display'), btn: document.getElementById('roll-btn'), btnText: document.getElementById('btn-text'), cooldownBar: document.getElementById('cooldown-bar'), autoRollBtn: document.getElementById('auto-roll-btn'),
    inventoryBtn: document.getElementById('inventory-btn'), inventoryModal: document.getElementById('inventory-modal'), closeInventory: document.getElementById('close-inventory'), inventoryGrid: document.getElementById('inventory-grid'),
    itemInvenBtn: document.getElementById('item-inven-btn'), itemInvenModal: document.getElementById('item-inven-modal'), closeItemInven: document.getElementById('close-item-inven'), itemInvenGrid: document.getElementById('item-inven-grid'),
    shopBtn: document.getElementById('shop-btn'), shopModal: document.getElementById('shop-modal'), closeShop: document.getElementById('close-shop'), shopGrid: document.getElementById('shop-grid'),
    indexBtn: document.getElementById('index-btn'), indexModal: document.getElementById('index-modal'), closeIndex: document.getElementById('close-index'), indexGrid: document.getElementById('index-grid'),
    autoDeleteBtn: document.getElementById('auto-delete-btn'), autoDeleteModal: document.getElementById('auto-delete-modal'), closeAutoDelete: document.getElementById('close-auto-delete'), autoDeleteOptions: document.getElementById('auto-delete-options'),
    devBtn: document.getElementById('dev-btn'), devModal: document.getElementById('dev-modal'), closeDev: document.getElementById('close-dev'),
    craftBtn: document.getElementById('craft-btn'), craftModal: document.getElementById('craft-modal'), closeCraft: document.getElementById('close-craft'), craftGrid: document.getElementById('craft-grid'),
    glowOverlay: document.getElementById('border-glow-overlay'), starOverlay: document.getElementById('star-cutscene-overlay'), cutsceneStarContainer: document.getElementById('cutscene-star-container'),
    sellModal: document.getElementById('sell-modal'), closeSell: document.getElementById('close-sell')
};

document.getElementById('game-start-btn').addEventListener('click', () => {
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('main-game').classList.remove('hidden');
});

function loadGame() {
    const savedData = localStorage.getItem('js_rng_save');
    if (savedData) { gameState = { ...gameState, ...JSON.parse(savedData) }; if(!gameState.craftedGears) gameState.craftedGears = []; }
    updateStatsUI(); buildShopUI(); buildAutoDeleteUI(); updateCraftUI();
}
function saveGame() { if (disableSave) return; localStorage.setItem('js_rng_save', JSON.stringify(gameState)); }

window.cheatJC = function() { gameState.jc += 1000000; updateStatsUI(); alert("100만 JC 지급!"); }
window.cheatLuck = function() { gameState.luck = 10000; updateStatsUI(); alert("운 10,000배!"); }
window.cheatItems = function() { AURA_DATA.forEach(a => { gameState.inventory[a.id] = (gameState.inventory[a.id] || 0) + 50; }); updateInventory(); updateCraftUI(); alert("칭호 50개씩 지급!"); }
window.setNextRoll = function() { nextRollOverride = document.getElementById('dev-aura-select').value; const auraInfo = AURA_DATA.find(a => a.id === nextRollOverride); alert(`🎯 다음 굴리기: [${auraInfo.grade}] ${auraInfo.name}`); }

ui.devBtn.addEventListener('click', () => {
    if (!disableSave) {
        const pwd = prompt("🛠️ 개발자 모드 접근\n비밀번호를 입력하세요:");
        if (pwd === "로블록스33") {
            disableSave = true; backupGameState = JSON.parse(JSON.stringify(gameState));
            alert("✅ [개발자 모드 ON] 지금부터의 플레이는 저장되지 않습니다.");
            const select = document.getElementById('dev-aura-select');
            if (select.children.length === 0) { AURA_DATA.forEach(a => { const opt = document.createElement('option'); opt.value = a.id; opt.innerText = `[${a.grade}] ${a.name}`; select.appendChild(opt); }); }
            ui.devModal.classList.remove('hidden');
        } else if (pwd !== null) alert("❌ 비밀번호가 틀렸습니다.");
    } else { ui.devModal.classList.remove('hidden'); }
});
ui.closeDev.addEventListener('click', () => { ui.devModal.classList.add('hidden'); });

window.exitDevMode = function() {
    if(!disableSave) return;
    gameState = JSON.parse(JSON.stringify(backupGameState)); disableSave = false; backupGameState = null; saveGame();
    updateStatsUI(); updateInventory(); updateCraftUI(); ui.devModal.classList.add('hidden'); alert("🚪 개발자 모드를 종료하고 본계정 데이터로 복구했습니다!");
}

function updateStatsUI() { 
    ui.rollCount.innerText = gameState.rolls; 
    ui.jcCount.innerText = gameState.jc.toLocaleString(); 
    
    let gearLuck = 0; let gearSpeed = 0;
    if(gameState.gear) { const equipped = CRAFT_ITEMS.find(g => g.id === gameState.gear); if(equipped) { gearLuck = equipped.luckBonus; gearSpeed = equipped.speedBonus; } }
    
    let currentLuck = (gameState.luck + gearLuck + (gameState.activeBuffs.luckBonus || 0)).toFixed(2);
    let currentSpeed = (1 + gearSpeed + (gameState.activeBuffs.speedBonus || 0)).toFixed(2);
    
    if(ui.luckMultiplier) ui.luckMultiplier.innerText = currentLuck; 
    if(ui.speedMultiplier) ui.speedMultiplier.innerText = currentSpeed;
}

setInterval(() => {
    const now = Date.now(); let updated = false;
    if (gameState.activeBuffs.luckExpireTime && now > gameState.activeBuffs.luckExpireTime) { gameState.activeBuffs.luckBonus = 0; gameState.activeBuffs.luckExpireTime = 0; updated = true; }
    if (gameState.activeBuffs.speedExpireTime && now > gameState.activeBuffs.speedExpireTime) { gameState.activeBuffs.speedBonus = 0; gameState.activeBuffs.speedExpireTime = 0; updated = true; }
    let buffTextArr = [];
    if (gameState.activeBuffs.luckExpireTime && now < gameState.activeBuffs.luckExpireTime) { let leftSec = Math.ceil((gameState.activeBuffs.luckExpireTime - now) / 1000); buffTextArr.push(`🧪 행운물약 (${leftSec}초)`); }
    if (gameState.activeBuffs.speedExpireTime && now < gameState.activeBuffs.speedExpireTime) { let leftSec = Math.ceil((gameState.activeBuffs.speedExpireTime - now) / 1000); buffTextArr.push(`🧪 속도물약 (${leftSec}초)`); }
    if(gameState.gear) { const equipped = CRAFT_ITEMS.find(g => g.id === gameState.gear); if(equipped) buffTextArr.push(`🔨 [${equipped.name}] 장착중`); }
    ui.activeBuffs.innerText = buffTextArr.join(" | "); if (updated) { updateStatsUI(); saveGame(); }
}, 1000);

ui.autoRollBtn.addEventListener('click', () => { isAutoRolling = !isAutoRolling; if (isAutoRolling) { ui.autoRollBtn.innerText = "오토: ON"; ui.autoRollBtn.classList.add('active'); if (!isRolling) startRoll(); } else { ui.autoRollBtn.innerText = "오토: OFF"; ui.autoRollBtn.classList.remove('active'); } });

function startRoll() {
    if (isRolling) return; isRolling = true;
    ui.btn.disabled = true; ui.btnText.innerText = "굴리는 중..."; ui.btn.classList.remove('cooldown-active'); 
    gameState.rolls++; updateStatsUI(); saveGame();
    let gearSpeed = gameState.gear ? (CRAFT_ITEMS.find(g => g.id === gameState.gear)?.speedBonus || 0) : 0;
    const speedBonus = (gameState.activeBuffs.speedBonus || 0) + gearSpeed;
    const maxTime = Math.max(400, 1200 * (1 - speedBonus)); const intervalTime = 60; let rollTime = 0; 
    
    const rollInterval = setInterval(() => {
        const randomFake = AURA_DATA[Math.floor(Math.random() * AURA_DATA.length)];
        const fakeClass = randomFake.colorClass || '';
        const fakeStyle = randomFake.colorClass ? '' : `color:${randomFake.color};`;
        ui.display.innerHTML = `<div class="rolling-text result-name ${fakeClass}" style="${fakeStyle}">${randomFake.name}</div>`;
        rollTime += intervalTime;
        if (rollTime >= maxTime) { clearInterval(rollInterval); finishRoll(); }
    }, intervalTime);
}

function playShakeGlowEffect(rolled) { 
    document.body.classList.add('screen-shake'); 
    ui.glowOverlay.style.boxShadow = `inset 0 0 50px 20px ${rolled.color}`; 
    ui.glowOverlay.classList.remove('hidden'); 
    setTimeout(() => { document.body.classList.remove('screen-shake'); ui.glowOverlay.classList.add('hidden'); }, 1500); 
}

async function playStarCutscene(rolled) { 
    ui.display.innerHTML = ''; 
    ui.starOverlay.classList.remove('hidden'); 
    ui.cutsceneStarContainer.style.color = rolled.color; 
    ui.cutsceneStarContainer.className = 'spin-zoom-accel'; 
    await sleep(3100); 
    ui.starOverlay.classList.add('flash-white'); 
    await sleep(400); 
    ui.starOverlay.classList.remove('flash-white'); 
    ui.starOverlay.classList.add('hidden'); 
    ui.cutsceneStarContainer.className = ''; 
}

async function finishRoll() {
    let rolled = AURA_DATA[AURA_DATA.length - 1]; 
    if (nextRollOverride) { rolled = AURA_DATA.find(a => a.id === nextRollOverride) || rolled; nextRollOverride = null; } else {
        let gearLuck = gameState.gear ? (CRAFT_ITEMS.find(g => g.id === gameState.gear)?.luckBonus || 0) : 0;
        const totalLuck = gameState.luck + gearLuck + (gameState.activeBuffs.luckBonus || 0);
        const rand = (Math.random() * 100) / totalLuck; let cumulative = 0; 
        for (let aura of AURA_DATA) { cumulative += aura.chance; if (rand <= cumulative) { rolled = aura; break; } }
    }

    if (rolled.grade === "DIVINE" || rolled.grade === "JS") { 
        await playStarCutscene(rolled); 
        playShakeGlowEffect(rolled); 
    } else if (rolled.grade === "LEGEND" || rolled.grade === "MYTHIC") { 
        playShakeGlowEffect(rolled); 
    }

    let autoSoldMsg = "";
    if (gameState.autoDelete[rolled.grade]) { gameState.jc += rolled.jcValue; autoSoldMsg = `<div style="font-size: 14px; color: #f1c40f; margin-top: 5px;">(자동 판매됨: +${rolled.jcValue.toLocaleString()} JC)</div>`; } else { if (!gameState.inventory[rolled.id]) gameState.inventory[rolled.id] = 1; else gameState.inventory[rolled.id]++; }
    saveGame(); updateStatsUI(); updateCraftUI();

    const nameClass = rolled.colorClass || '';
    const nameStyle = rolled.colorClass ? '' : `color: ${rolled.color};`;

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
    const highGrades = ["LEGEND", "MYTHIC", "DIVINE", "JS"]; if (highGrades.includes(auraInfo.grade)) { if (!window.confirm(`⚠️ [경고] ${auraInfo.grade} 등급 칭호입니다!\n정말로 ${sellAmount}개를 판매하시겠습니까?`)) return; } 
    gameState.inventory[currentSellId] -= sellAmount; if (gameState.inventory[currentSellId] === 0) delete gameState.inventory[currentSellId]; 
    const earnedJC = auraInfo.jcValue * sellAmount; gameState.jc += earnedJC; saveGame(); updateStatsUI(); updateInventory(); updateCraftUI(); 
    ui.sellModal.classList.add('hidden');
});

function updateInventory() { 
    ui.inventoryGrid.innerHTML = ''; 
    for (let id in gameState.inventory) { 
        const count = gameState.inventory[id]; const auraInfo = AURA_DATA.find(a => a.id === id); 
        if (auraInfo) { 
            const tile = document.createElement('div'); tile.className = 'inventory-tile'; 
            const borderColor = auraInfo.color; tile.style.borderColor = borderColor; 
            tile.innerHTML = `<div class="tile-grade" style="color:${borderColor};">[${auraInfo.grade}]</div><div class="tile-name">${auraInfo.name}</div><div class="tile-count">보유: ${count}개</div><button class="action-btn" onclick="openSellModal('${id}')">대량 판매</button>`; 
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

window.buyItem = function(itemId) { const item = SHOP_ITEMS.find(i => i.id === itemId); if (!item || gameState.jc < item.price) { alert("❌ JC가 부족합니다!"); return; } gameState.jc -= item.price; if (!gameState.itemInventory[itemId]) gameState.itemInventory[itemId] = 1; else gameState.itemInventory[itemId]++; saveGame(); updateStatsUI(); buildShopUI(); alert(`🎉 '${item.name}' 구매 완료!`); }

window.useItem = function(itemId) { 
    const item = SHOP_ITEMS.find(i => i.id === itemId); 
    if (!item || !gameState.itemInventory[itemId] || gameState.itemInventory[itemId] <= 0) return; 
    gameState.itemInventory[itemId]--; 
    if (gameState.itemInventory[itemId] === 0) delete gameState.itemInventory[itemId]; 
    
    const now = Date.now(); 
    const addDurationMs = item.duration * 1000;

    if (item.type === "luck") { 
        gameState.activeBuffs.luckBonus = item.value; 
        if (gameState.activeBuffs.luckExpireTime && gameState.activeBuffs.luckExpireTime > now) {
            gameState.activeBuffs.luckExpireTime += addDurationMs; 
        } else {
            gameState.activeBuffs.luckExpireTime = now + addDurationMs; 
        }
    } else if (item.type === "speed") { 
        gameState.activeBuffs.speedBonus = item.value; 
        if (gameState.activeBuffs.speedExpireTime && gameState.activeBuffs.speedExpireTime > now) {
            gameState.activeBuffs.speedExpireTime += addDurationMs; 
        } else {
            gameState.activeBuffs.speedExpireTime = now + addDurationMs; 
        }
    } 
    saveGame(); updateStatsUI(); updateItemInventory(); alert(`✨ '${item.name}' 사용! 시간이 누적되었습니다.`); 
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
            tile.className = 'item-tile'; 
            const borderColor = item.type === "luck" ? "#2ecc71" : "#3498db";
            tile.style.borderColor = borderColor; 
            tile.innerHTML = `<div class="tile-name" style="color:${borderColor};">${item.name}</div><div class="tile-desc">${item.desc}</div><div class="tile-count">보유: ${count}개</div><button class="action-btn use" onclick="useItem('${itemId}')">사용하기</button>`; 
            ui.itemInvenGrid.appendChild(tile); 
        } 
    } 
}

function buildShopUI() { 
    ui.shopGrid.innerHTML = ''; 
    for (let item of SHOP_ITEMS) { 
        const tile = document.createElement('div'); 
        tile.className = 'shop-tile'; 
        const borderColor = item.type === "luck" ? "#2ecc71" : "#3498db";
        tile.style.borderColor = borderColor; 
        tile.innerHTML = `<div class="tile-name" style="color:${borderColor};">${item.name}</div><div class="tile-desc">${item.desc}</div><div class="tile-count" style="font-weight:bold;">${item.price.toLocaleString()} JC</div><button class="action-btn buy" onclick="buyItem('${item.id}')">구매하기</button>`; 
        ui.shopGrid.appendChild(tile); 
    } 
}

function updateIndex() { 
    ui.indexGrid.innerHTML = ''; 
    for (let aura of AURA_DATA) { 
        const item = document.createElement('div'); 
        item.className = 'index-item'; 
        const displayColor = aura.color; 
        
        if (gameState.inventory[aura.id] || (gameState.autoDelete[aura.grade])) { 
            item.style.borderColor = displayColor; 
            item.innerHTML = `
                <div style="color:${displayColor}; font-weight:bold;">[${aura.grade}]</div>
                <div style="font-size:12px; margin:4px 0; word-break:keep-all;">${aura.name}</div>
                <div class="index-chance">1 in ${aura.in.toLocaleString()}</div>
            `; 
        } else { 
            item.style.borderColor = "#444";
            item.innerHTML = `
                <div class="unknown" style="font-weight:bold;">???</div>
                <div class="index-chance">1 in ${aura.in.toLocaleString()}</div>
            `; 
        } 
        ui.indexGrid.appendChild(item); 
    } 
}

function buildAutoDeleteUI() { ui.autoDeleteOptions.innerHTML = ''; for (let grade of GRADES) { const row = document.createElement('div'); row.className = 'auto-delete-row'; row.innerHTML = `<span style="font-weight:bold;">[${grade}] 자동 판매</span><input type="checkbox" id="auto-del-${grade}" ${gameState.autoDelete[grade] ? 'checked' : ''}>`; ui.autoDeleteOptions.appendChild(row); document.getElementById(`auto-del-${grade}`).addEventListener('change', (e) => { gameState.autoDelete[grade] = e.target.checked; saveGame(); }); } }

ui.btn.addEventListener('click', startRoll);
ui.inventoryBtn.addEventListener('click', () => { updateInventory(); ui.inventoryModal.classList.remove('hidden'); }); ui.closeInventory.addEventListener('click', () => { ui.inventoryModal.classList.add('hidden'); });
ui.itemInvenBtn.addEventListener('click', () => { updateItemInventory(); ui.itemInvenModal.classList.remove('hidden'); }); ui.closeItemInven.addEventListener('click', () => { ui.itemInvenModal.classList.add('hidden'); });
ui.shopBtn.addEventListener('click', () => { ui.shopModal.classList.remove('hidden'); }); ui.closeShop.addEventListener('click', () => { ui.shopModal.classList.add('hidden'); });
ui.indexBtn.addEventListener('click', () => { updateIndex(); ui.indexModal.classList.remove('hidden'); }); ui.closeIndex.addEventListener('click', () => { ui.indexModal.classList.add('hidden'); });
ui.autoDeleteBtn.addEventListener('click', () => { ui.autoDeleteModal.classList.remove('hidden'); }); ui.closeAutoDelete.addEventListener('click', () => { ui.autoDeleteModal.classList.add('hidden'); });
ui.craftBtn.addEventListener('click', () => { updateCraftUI(); ui.craftModal.classList.remove('hidden'); }); ui.closeCraft.addEventListener('click', () => { ui.craftModal.classList.add('hidden'); });

loadGame();
