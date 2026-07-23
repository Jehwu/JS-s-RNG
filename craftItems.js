export const CRAFT_ITEMS = [
    // 🥊 건틀렛 아이템
    { 
        id: "gear_beginner", 
        category: "gauntlet", 
        name: "초보자의 운수대통 건틀렛", 
        desc: "영구적으로 행운이 10% 증가합니다.", 
        luckBonus: 0.1, 
        speedBonus: 0, 
        req: { "com_drum": 30, "com_normal": 15, "unc_tired": 5 } 
    },
    { 
        id: "gear_speed", 
        category: "gauntlet", 
        name: "폭주기관차의 건틀렛", 
        desc: "영구적으로 롤 속도와 쿨타임이 10% 단축됩니다.", 
        luckBonus: 0, 
        speedBonus: 0.1, 
        req: { "rare_train": 8, "unc_running": 20, "com_passerby": 40 } 
    },
    { 
        id: "gear_crazykong_heart", 
        category: "gauntlet", 
        name: "크레이지콩 건틀렛", 
        desc: "영구적으로 행운 10%, 속도 20%가 증가합니다.", 
        luckBonus: 0.1, 
        speedBonus: 0.2, 
        req: { "ep_crazykong": 5, "ep_baksisung": 10, "com_darkminchae": 44 } 
    },
    { 
        id: "gear_destroyer_fist", 
        category: "gauntlet", 
        name: "파괴신의 건틀렛", 
        desc: "영구적으로 행운 25%, 속도 15%가 증가합니다.", 
        luckBonus: 0.25, 
        speedBonus: 0.15, 
        req: { "epic_destroy": 7, "rare_train": 14, "unc_angry": 70 } 
    },
    { 
        id: "gear_speedkong_heart", 
        category: "gauntlet", 
        name: "광속의콩 건틀렛", 
        desc: "영구적으로 행운 25%, 속도 35%가 증가합니다.", 
        luckBonus: 0.25, 
        speedBonus: 0.35, 
        req: { "legend_speed": 2, "ep_crazykong": 10, "ep_baksisung": 10, "rare_train": 20, "com_darkminchae": 55 } 
    },
    { 
        id: "gear_gold_button", 
        category: "gauntlet", 
        name: "골드버튼 건틀렛", 
        desc: "영구적으로 행운 50%, 속도 20%가 증가합니다.", 
        luckBonus: 0.5, 
        speedBonus: 0.2, 
        req: { "mythic_tube": 2, "epic_kimmodi": 3, "ep_mc_byungeun": 10, "epic_lucky": 15, "com_normal": 100 } 
    },
    { 
        id: "gear_pacifist_heart", 
        category: "gauntlet", 
        name: "불살의 건틀렛", 
        desc: "영구적으로 행운 100%, 속도 20%가 증가합니다.", 
        luckBonus: 1.0, 
        speedBonus: 0.2, 
        req: { "mythic_pacifist_jisung": 3, "com_steel_gaen": 10, "unc_hospital": 20, "com_drum": 300 } 
    },

    // 📜 부적 아이템
    { 
        id: "amulet_drum", 
        category: "amulet", 
        name: "동네북의 부적", 
        desc: "롤을 10회 돌리면 다음 1회 롤에 행운이 2배로 증가합니다.", 
        luckBonus: 0, 
        speedBonus: 0, 
        req: { "com_drum": 500 } 
    }
];
