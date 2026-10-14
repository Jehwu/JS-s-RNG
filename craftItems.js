export const CRAFT_ITEMS = [
    // 🥊 건틀렛 (영구 행운/속도)
    {
        id: "gear_beginner",
        category: "gauntlet",
        name: "초보자의 운수대통 건틀렛",
        desc: "영구적으로 행운이 10% 증가합니다.",
        luckBonus: 0.1,
        speedBonus: 0,
        req: { "com_normal": 15, "com_sleepy_jisung": 10, "unc_tired": 3 }
    },
    {
        id: "gear_speed",
        category: "gauntlet",
        name: "폭주기관차의 건틀렛",
        desc: "영구적으로 롤 속도와 쿨타임이 10% 단축됩니다.",
        luckBonus: 0,
        speedBonus: 0.1,
        req: { "rare_train": 5, "unc_running": 15, "com_just_byungeun": 20 }
    },
    {
        id: "gear_destroyer_fist",
        category: "gauntlet",
        name: "파괴신의 건틀렛",
        desc: "영구적으로 행운 25%, 속도 15%가 증가합니다.",
        luckBonus: 0.25,
        speedBonus: 0.15,
        req: { "epic_destroy": 3, "ep_baksisung": 6, "rare_new_jisung": 10, "unc_tired": 30 }
    },
    {
        id: "gear_crazykong_heart",
        category: "gauntlet",
        name: "크레이지콩 건틀렛",
        desc: "영구적으로 행운 50%, 속도 20%가 증가합니다.",
        luckBonus: 0.5,
        speedBonus: 0.2,
        req: { "ep_crazykong": 2, "epic_destroy": 5, "rare_soldier": 25 }
    },
    {
        id: "gear_wizard",
        category: "gauntlet",
        name: "대마법사의 건틀렛",
        desc: "영구적으로 행운 100%, 속도 25%가 증가합니다.",
        luckBonus: 1.0,
        speedBonus: 0.25,
        req: { "legend_wizard": 1, "legend_speed": 2, "ep_crazykong": 4, "epic_destroy": 10 }
    },
    {
        id: "gear_two_hearts",
        category: "gauntlet",
        name: "두 심장의 건틀렛",
        desc: "영구적으로 행운 250%, 속도 30%가 증가합니다.",
        luckBonus: 2.5,
        speedBonus: 0.3,
        req: { "mythic_heart": 1, "epic_monkey": 2, "gemini_basic": 2, "legend_wizard": 4 }
    },

    // 📜 부적 (10롤마다 다음 1롤 행운 배수)
    {
        id: "amulet_drum",
        category: "amulet",
        name: "평범함의 부적",
        desc: "롤을 10회 돌리면 다음 1회 롤에 행운이 2배로 증가합니다.",
        luckBonus: 0,
        speedBonus: 0,
        req: { "com_normal": 300 }
    },
    {
        id: "amulet_commander",
        category: "amulet",
        name: "미나이의 부적",
        desc: "롤을 10회 돌리면 다음 1회 롤에 행운이 5배로 증가합니다.",
        luckBonus: 0,
        speedBonus: 0,
        req: { "gemini_basic": 2, "legend_speed": 4, "rare_soldier": 50, "com_just_byungeun": 300 }
    }
];
