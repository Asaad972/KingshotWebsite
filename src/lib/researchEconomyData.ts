// Kingshot Research Tree -- Economy branch. REAL data extracted directly from
// kingshotdata.com/research (fetched 2026-08-18) via its own static DOM --
// each technology renders as a native <details class="ally-tech"> element
// whose per-level table (cost/time/power/effect%) is present in the page's
// HTML even while collapsed, so this was read directly rather than guessed.
//
// A few levels show no resource cost at all in the source (rendered as "-"
// there too, not just here) -- kept as 0 rather than invented, consistent
// with this project's practice of flagging source gaps instead of quietly
// filling them in. Affected: Bread Output VI Lv.1, Wood Output VI Lv.1.
//
// Costs above 999 are shown on the source itself in compact form (e.g.
// "16K", "1.4M") rather than exact digits -- those are carried through at
// that same source precision, not further approximated here.
//
// "category" groups the 44 techs into 8 branches (4 resources x
// output-rate / gathering-speed) purely for the tree's visual layout and
// icon choice -- it has no meaning in the game itself.

export type ResourceCost = { bread: number; wood: number; stone: number; iron: number; gold: number };

export type ResearchCategory =
  | 'bread-output'
  | 'bread-gathering'
  | 'wood-output'
  | 'wood-gathering'
  | 'stone-output'
  | 'stone-gathering'
  | 'iron-output'
  | 'iron-gathering';

export interface ResearchLevel {
  level: number;
  cost: ResourceCost;
  timeSeconds: number;
  power: number;
  effectPercent: number;
  /** Academy hall level required to unlock researching this level. */
  academyLevel: number;
}

export interface ResearchPrereq {
  techId: string;
  level: number;
}

export interface ResearchTech {
  id: string;
  name: string;
  category: ResearchCategory;
  desc: string;
  effectRange: string;
  maxLevel: number;
  unlockAcademyLevel: number;
  /** Other Economy techs (+ their level) that must be researched before this one unlocks. */
  prereqs: ResearchPrereq[];
  levels: ResearchLevel[];
}

export const ECONOMY_TECHS: ResearchTech[] = [
  {
    "id": "bread-output-i",
    "name": "Bread Output I",
    "category": "bread-output",
    "desc": "Enhances Bread Output in Mill",
    "effectRange": "Bread Output +4% to +13.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 1,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5400,
          "wood": 5400,
          "stone": 1000,
          "iron": 270,
          "gold": 320
        },
        "timeSeconds": 27,
        "power": 1040,
        "effectPercent": 4,
        "academyLevel": 1
      },
      {
        "level": 2,
        "cost": {
          "bread": 7500,
          "wood": 7500,
          "stone": 1500,
          "iron": 370,
          "gold": 440
        },
        "timeSeconds": 40,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 2
      },
      {
        "level": 3,
        "cost": {
          "bread": 16000,
          "wood": 16000,
          "stone": 3200,
          "iron": 810,
          "gold": 960
        },
        "timeSeconds": 60,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 3
      }
    ]
  },
  {
    "id": "bread-output-ii",
    "name": "Bread Output II",
    "category": "bread-output",
    "desc": "Enhances Bread Output in Mill",
    "effectRange": "Bread Output +4% to +13.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 8,
    "prereqs": [
      {
        "techId": "stone-gathering-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 54000,
          "wood": 54000,
          "stone": 10000,
          "iron": 2700,
          "gold": 640
        },
        "timeSeconds": 300,
        "power": 1040,
        "effectPercent": 4,
        "academyLevel": 8
      },
      {
        "level": 2,
        "cost": {
          "bread": 75000,
          "wood": 75000,
          "stone": 15000,
          "iron": 3700,
          "gold": 890
        },
        "timeSeconds": 420,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 9
      },
      {
        "level": 3,
        "cost": {
          "bread": 160000,
          "wood": 160000,
          "stone": 32000,
          "iron": 8100,
          "gold": 1900
        },
        "timeSeconds": 0,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 10
      }
    ]
  },
  {
    "id": "bread-output-iii",
    "name": "Bread Output III",
    "category": "bread-output",
    "desc": "Enhances Bread Output in Mill",
    "effectRange": "Bread Output +5.5% to +18%",
    "maxLevel": 3,
    "unlockAcademyLevel": 13,
    "prereqs": [
      {
        "techId": "iron-mining-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 170000,
          "wood": 170000,
          "stone": 34000,
          "iron": 8600,
          "gold": 1900
        },
        "timeSeconds": 0,
        "power": 1430,
        "effectPercent": 5.5,
        "academyLevel": 13
      },
      {
        "level": 2,
        "cost": {
          "bread": 240000,
          "wood": 240000,
          "stone": 48000,
          "iron": 12000,
          "gold": 2600
        },
        "timeSeconds": 1800,
        "power": 2860,
        "effectPercent": 11,
        "academyLevel": 14
      },
      {
        "level": 3,
        "cost": {
          "bread": 510000,
          "wood": 510000,
          "stone": 100000,
          "iron": 25000,
          "gold": 5700
        },
        "timeSeconds": 4800,
        "power": 4680,
        "effectPercent": 18,
        "academyLevel": 15
      }
    ]
  },
  {
    "id": "bread-output-iv",
    "name": "Bread Output IV",
    "category": "bread-output",
    "desc": "Enhances Bread Output in Mill",
    "effectRange": "Bread Output +7% to +22.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 18,
    "prereqs": [
      {
        "techId": "iron-mining-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 490000,
          "wood": 490000,
          "stone": 99000,
          "iron": 24000,
          "gold": 6400
        },
        "timeSeconds": 7980,
        "power": 1820,
        "effectPercent": 7,
        "academyLevel": 18
      },
      {
        "level": 2,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 8900
        },
        "timeSeconds": 12000,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 19
      },
      {
        "level": 3,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 290000,
          "iron": 74000,
          "gold": 19000
        },
        "timeSeconds": 31980,
        "power": 5850,
        "effectPercent": 22.5,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "bread-output-v",
    "name": "Bread Output V",
    "category": "bread-output",
    "desc": "Enhances Bread Output in Mill",
    "effectRange": "Bread Output +8% to +26%",
    "maxLevel": 3,
    "unlockAcademyLevel": 23,
    "prereqs": [
      {
        "techId": "iron-mining-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 49980,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 23
      },
      {
        "level": 2,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 61000,
          "gold": 35000
        },
        "timeSeconds": 75000,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 24
      },
      {
        "level": 3,
        "cost": {
          "bread": 2600000,
          "wood": 2600000,
          "stone": 530000,
          "iron": 130000,
          "gold": 76000
        },
        "timeSeconds": 199980,
        "power": 6760,
        "effectPercent": 26,
        "academyLevel": 25
      }
    ]
  },
  {
    "id": "bread-output-vi",
    "name": "Bread Output VI",
    "category": "bread-output",
    "desc": "Enhances Bread Output in Mill",
    "effectRange": "Bread Output +8% to +26%",
    "maxLevel": 3,
    "unlockAcademyLevel": 28,
    "prereqs": [
      {
        "techId": "iron-mining-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 240000,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 28
      },
      {
        "level": 2,
        "cost": {
          "bread": 4300000,
          "wood": 4300000,
          "stone": 870000,
          "iron": 210000,
          "gold": 71000
        },
        "timeSeconds": 360000,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 29
      },
      {
        "level": 3,
        "cost": {
          "bread": 9300000,
          "wood": 9300000,
          "stone": 1800000,
          "iron": 460000,
          "gold": 150000
        },
        "timeSeconds": 960000,
        "power": 6760,
        "effectPercent": 26,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "food-foraging-i",
    "name": "Food Foraging I",
    "category": "bread-gathering",
    "desc": "Enhances Bread Collection Speed",
    "effectRange": "Bread Gathering Speed +8% to +27%",
    "maxLevel": 3,
    "unlockAcademyLevel": 5,
    "prereqs": [
      {
        "techId": "wood-output-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 4000,
          "wood": 4000,
          "stone": 810,
          "iron": 200,
          "gold": 240
        },
        "timeSeconds": 27,
        "power": 1000,
        "effectPercent": 8,
        "academyLevel": 5
      },
      {
        "level": 2,
        "cost": {
          "bread": 5600,
          "wood": 5600,
          "stone": 1100,
          "iron": 280,
          "gold": 330
        },
        "timeSeconds": 40,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 6
      },
      {
        "level": 3,
        "cost": {
          "bread": 12000,
          "wood": 12000,
          "stone": 2400,
          "iron": 600,
          "gold": 720
        },
        "timeSeconds": 60,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 7
      }
    ]
  },
  {
    "id": "food-foraging-ii",
    "name": "Food Foraging II",
    "category": "bread-gathering",
    "desc": "Enhances Bread Collection Speed",
    "effectRange": "Bread Gathering Speed +8% to +27%",
    "maxLevel": 3,
    "unlockAcademyLevel": 11,
    "prereqs": [
      {
        "techId": "iron-output-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 40000,
          "wood": 40000,
          "stone": 8100,
          "iron": 2000,
          "gold": 480
        },
        "timeSeconds": 300,
        "power": 1000,
        "effectPercent": 8,
        "academyLevel": 11
      },
      {
        "level": 2,
        "cost": {
          "bread": 56000,
          "wood": 56000,
          "stone": 11000,
          "iron": 2800,
          "gold": 670
        },
        "timeSeconds": 420,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 12
      },
      {
        "level": 3,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 24000,
          "iron": 6000,
          "gold": 1400
        },
        "timeSeconds": 0,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 13
      }
    ]
  },
  {
    "id": "food-foraging-iii",
    "name": "Food Foraging III",
    "category": "bread-gathering",
    "desc": "Enhances Bread Collection Speed",
    "effectRange": "Bread Gathering Speed +11% to +36.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 16,
    "prereqs": [
      {
        "techId": "iron-output-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 25000,
          "iron": 6400,
          "gold": 1400
        },
        "timeSeconds": 0,
        "power": 1375,
        "effectPercent": 11,
        "academyLevel": 16
      },
      {
        "level": 2,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 36000,
          "iron": 9000,
          "gold": 2000
        },
        "timeSeconds": 1800,
        "power": 2750,
        "effectPercent": 22,
        "academyLevel": 17
      },
      {
        "level": 3,
        "cost": {
          "bread": 380000,
          "wood": 380000,
          "stone": 77000,
          "iron": 19000,
          "gold": 4300
        },
        "timeSeconds": 4800,
        "power": 4562,
        "effectPercent": 36.5,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "food-foraging-iv",
    "name": "Food Foraging IV",
    "category": "bread-gathering",
    "desc": "Enhances Bread Collection Speed",
    "effectRange": "Bread Gathering Speed +13.5% to +45%",
    "maxLevel": 3,
    "unlockAcademyLevel": 21,
    "prereqs": [
      {
        "techId": "iron-output-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 370000,
          "wood": 370000,
          "stone": 74000,
          "iron": 18000,
          "gold": 4800
        },
        "timeSeconds": 7980,
        "power": 1687,
        "effectPercent": 13.5,
        "academyLevel": 21
      },
      {
        "level": 2,
        "cost": {
          "bread": 520000,
          "wood": 520000,
          "stone": 100000,
          "iron": 26000,
          "gold": 6700
        },
        "timeSeconds": 12000,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 22
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 55000,
          "gold": 14000
        },
        "timeSeconds": 31980,
        "power": 5625,
        "effectPercent": 45,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "food-foraging-v",
    "name": "Food Foraging V",
    "category": "bread-gathering",
    "desc": "Enhances Bread Collection Speed",
    "effectRange": "Bread Gathering Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 26,
    "prereqs": [
      {
        "techId": "iron-output-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 660000,
          "wood": 660000,
          "stone": 130000,
          "iron": 33000,
          "gold": 19000
        },
        "timeSeconds": 49980,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 26
      },
      {
        "level": 2,
        "cost": {
          "bread": 920000,
          "wood": 920000,
          "stone": 180000,
          "iron": 46000,
          "gold": 26000
        },
        "timeSeconds": 75000,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 27
      },
      {
        "level": 3,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 390000,
          "iron": 99000,
          "gold": 57000
        },
        "timeSeconds": 199980,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 28
      }
    ]
  },
  {
    "id": "food-foraging-vi",
    "name": "Food Foraging VI",
    "category": "bread-gathering",
    "desc": "Enhances Bread Collection Speed",
    "effectRange": "Bread Gathering Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "iron-output-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 38000
        },
        "timeSeconds": 240000,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 3200000,
          "wood": 3200000,
          "stone": 650000,
          "iron": 160000,
          "gold": 53000
        },
        "timeSeconds": 360000,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 6900000,
          "wood": 6900000,
          "stone": 1300000,
          "iron": 340000,
          "gold": 110000
        },
        "timeSeconds": 960000,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "iron-mining-i",
    "name": "Iron Mining I",
    "category": "iron-gathering",
    "desc": "Accelerates Iron Gathering",
    "effectRange": "Iron Mining Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "food-foraging-ii",
        "level": 1
      },
      {
        "techId": "wood-gathering-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 10000,
          "wood": 10000,
          "stone": 2000,
          "iron": 500,
          "gold": 600
        },
        "timeSeconds": 60,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 12
      },
      {
        "level": 2,
        "cost": {
          "bread": 14000,
          "wood": 14000,
          "stone": 2800,
          "iron": 700,
          "gold": 840
        },
        "timeSeconds": 120,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 13
      },
      {
        "level": 3,
        "cost": {
          "bread": 30000,
          "wood": 30000,
          "stone": 6000,
          "iron": 1500,
          "gold": 1800
        },
        "timeSeconds": 360,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "iron-mining-ii",
    "name": "Iron Mining II",
    "category": "iron-gathering",
    "desc": "Accelerates Iron Gathering",
    "effectRange": "Iron Mining Speed +11% to +36.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "food-foraging-iii",
        "level": 1
      },
      {
        "techId": "stone-gathering-ii",
        "level": 1
      },
      {
        "techId": "wood-gathering-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 100000,
          "wood": 100000,
          "stone": 20000,
          "iron": 5000,
          "gold": 1200
        },
        "timeSeconds": 1020,
        "power": 1375,
        "effectPercent": 11,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 140000,
          "wood": 140000,
          "stone": 28000,
          "iron": 7000,
          "gold": 1600
        },
        "timeSeconds": 1560,
        "power": 2750,
        "effectPercent": 22,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 300000,
          "wood": 300000,
          "stone": 60000,
          "iron": 15000,
          "gold": 3600
        },
        "timeSeconds": 4200,
        "power": 4562,
        "effectPercent": 36.5,
        "academyLevel": 19
      }
    ]
  },
  {
    "id": "iron-mining-iii",
    "name": "Iron Mining III",
    "category": "iron-gathering",
    "desc": "Accelerates Iron Gathering",
    "effectRange": "Iron Mining Speed +13.5% to +45%",
    "maxLevel": 3,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "food-foraging-iv",
        "level": 1
      },
      {
        "techId": "stone-gathering-iii",
        "level": 1
      },
      {
        "techId": "wood-gathering-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 320000,
          "wood": 320000,
          "stone": 64000,
          "iron": 16000,
          "gold": 3600
        },
        "timeSeconds": 4200,
        "power": 1687,
        "effectPercent": 13.5,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 450000,
          "wood": 450000,
          "stone": 90000,
          "iron": 22000,
          "gold": 5000
        },
        "timeSeconds": 6300,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 970000,
          "wood": 970000,
          "stone": 190000,
          "iron": 48000,
          "gold": 10000
        },
        "timeSeconds": 16800,
        "power": 5625,
        "effectPercent": 45,
        "academyLevel": 24
      }
    ]
  },
  {
    "id": "iron-mining-iv",
    "name": "Iron Mining IV",
    "category": "iron-gathering",
    "desc": "Accelerates Iron Gathering",
    "effectRange": "Iron Mining Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "food-foraging-v",
        "level": 1
      },
      {
        "techId": "stone-gathering-iv",
        "level": 1
      },
      {
        "techId": "wood-gathering-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 930000,
          "wood": 930000,
          "stone": 180000,
          "iron": 46000,
          "gold": 12000
        },
        "timeSeconds": 27960,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 65000,
          "gold": 16000
        },
        "timeSeconds": 42000,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 28
      },
      {
        "level": 3,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 550000,
          "iron": 130000,
          "gold": 36000
        },
        "timeSeconds": 111960,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "iron-mining-v",
    "name": "Iron Mining V",
    "category": "iron-gathering",
    "desc": "Accelerates Iron Gathering",
    "effectRange": "Iron Mining Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "food-foraging-vi",
        "level": 1
      },
      {
        "techId": "stone-gathering-v",
        "level": 1
      },
      {
        "techId": "wood-gathering-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 48000
        },
        "timeSeconds": 174960,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 67000
        },
        "timeSeconds": 262500,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 4900000,
          "wood": 4900000,
          "stone": 990000,
          "iron": 240000,
          "gold": 140000
        },
        "timeSeconds": 699960,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "iron-output-i",
    "name": "Iron Output I",
    "category": "iron-output",
    "desc": "Enhances Iron Output at Ironworks",
    "effectRange": "Iron Output +8% to +27%",
    "maxLevel": 3,
    "unlockAcademyLevel": 10,
    "prereqs": [
      {
        "techId": "bread-output-ii",
        "level": 1
      },
      {
        "techId": "wood-output-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 13000,
          "wood": 13000,
          "stone": 2700,
          "iron": 670,
          "gold": 800
        },
        "timeSeconds": 120,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 10
      },
      {
        "level": 2,
        "cost": {
          "bread": 18000,
          "wood": 18000,
          "stone": 3700,
          "iron": 940,
          "gold": 1100
        },
        "timeSeconds": 180,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 11
      },
      {
        "level": 3,
        "cost": {
          "bread": 40000,
          "wood": 40000,
          "stone": 8100,
          "iron": 2000,
          "gold": 2400
        },
        "timeSeconds": 540,
        "power": 7020,
        "effectPercent": 27,
        "academyLevel": 12
      }
    ]
  },
  {
    "id": "iron-output-ii",
    "name": "Iron Output II",
    "category": "iron-output",
    "desc": "Enhances Iron Output at Ironworks",
    "effectRange": "Iron Output +5.5% to +18%",
    "maxLevel": 3,
    "unlockAcademyLevel": 15,
    "prereqs": [
      {
        "techId": "bread-output-iii",
        "level": 1
      },
      {
        "techId": "stone-output-ii",
        "level": 1
      },
      {
        "techId": "wood-output-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 130000,
          "wood": 130000,
          "stone": 27000,
          "iron": 6700,
          "gold": 1600
        },
        "timeSeconds": 1500,
        "power": 1430,
        "effectPercent": 5.5,
        "academyLevel": 15
      },
      {
        "level": 2,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 37000,
          "iron": 9400,
          "gold": 2200
        },
        "timeSeconds": 2220,
        "power": 2860,
        "effectPercent": 11,
        "academyLevel": 16
      },
      {
        "level": 3,
        "cost": {
          "bread": 400000,
          "wood": 400000,
          "stone": 81000,
          "iron": 20000,
          "gold": 4800
        },
        "timeSeconds": 6000,
        "power": 4680,
        "effectPercent": 18,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "iron-output-iii",
    "name": "Iron Output III",
    "category": "iron-output",
    "desc": "Enhances Iron Output at Ironworks",
    "effectRange": "Iron Output +7% to +22.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 20,
    "prereqs": [
      {
        "techId": "bread-output-iv",
        "level": 1
      },
      {
        "techId": "stone-output-iii",
        "level": 1
      },
      {
        "techId": "wood-output-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 430000,
          "wood": 430000,
          "stone": 86000,
          "iron": 21000,
          "gold": 4800
        },
        "timeSeconds": 6000,
        "power": 1820,
        "effectPercent": 7,
        "academyLevel": 20
      },
      {
        "level": 2,
        "cost": {
          "bread": 600000,
          "wood": 600000,
          "stone": 120000,
          "iron": 30000,
          "gold": 6700
        },
        "timeSeconds": 9000,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 21
      },
      {
        "level": 3,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 250000,
          "iron": 64000,
          "gold": 14000
        },
        "timeSeconds": 24000,
        "power": 5850,
        "effectPercent": 22.5,
        "academyLevel": 22
      }
    ]
  },
  {
    "id": "iron-output-iv",
    "name": "Iron Output IV",
    "category": "iron-output",
    "desc": "Enhances Iron Output at Ironworks",
    "effectRange": "Iron Output +7% to +22.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 25,
    "prereqs": [
      {
        "techId": "bread-output-v",
        "level": 1
      },
      {
        "techId": "stone-output-iv",
        "level": 1
      },
      {
        "techId": "wood-output-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 62000,
          "gold": 16000
        },
        "timeSeconds": 39960,
        "power": 1820,
        "effectPercent": 7,
        "academyLevel": 25
      },
      {
        "level": 2,
        "cost": {
          "bread": 1700000,
          "wood": 1700000,
          "stone": 340000,
          "iron": 86000,
          "gold": 22000
        },
        "timeSeconds": 60000,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 26
      },
      {
        "level": 3,
        "cost": {
          "bread": 3700000,
          "wood": 3700000,
          "stone": 740000,
          "iron": 180000,
          "gold": 48000
        },
        "timeSeconds": 159960,
        "power": 5850,
        "effectPercent": 22.5,
        "academyLevel": 27
      }
    ]
  },
  {
    "id": "iron-output-v",
    "name": "Iron Output V",
    "category": "iron-output",
    "desc": "Enhances Iron Output at Ironworks",
    "effectRange": "Iron Output +8% to +26%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "bread-output-vi",
        "level": 1
      },
      {
        "techId": "stone-output-v",
        "level": 1
      },
      {
        "techId": "wood-output-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2200000,
          "wood": 2200000,
          "stone": 440000,
          "iron": 110000,
          "gold": 64000
        },
        "timeSeconds": 249960,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 3000000,
          "wood": 3000000,
          "stone": 610000,
          "iron": 150000,
          "gold": 89000
        },
        "timeSeconds": 375000,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 6600000,
          "wood": 6600000,
          "stone": 1300000,
          "iron": 330000,
          "gold": 190000
        },
        "timeSeconds": 999960,
        "power": 6760,
        "effectPercent": 26,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "stone-gathering-i",
    "name": "Stone Gathering I",
    "category": "stone-gathering",
    "desc": "Enhances Stone Gathering Speed",
    "effectRange": "Stone Gathering Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 7,
    "prereqs": [
      {
        "techId": "stone-output-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 10000,
          "wood": 10000,
          "stone": 2000,
          "iron": 500,
          "gold": 600
        },
        "timeSeconds": 60,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 7
      },
      {
        "level": 2,
        "cost": {
          "bread": 14000,
          "wood": 14000,
          "stone": 2800,
          "iron": 700,
          "gold": 840
        },
        "timeSeconds": 120,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 8
      },
      {
        "level": 3,
        "cost": {
          "bread": 30000,
          "wood": 30000,
          "stone": 6000,
          "iron": 1500,
          "gold": 1800
        },
        "timeSeconds": 360,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 9
      }
    ]
  },
  {
    "id": "stone-gathering-ii",
    "name": "Stone Gathering II",
    "category": "stone-gathering",
    "desc": "Enhances Stone Gathering Speed",
    "effectRange": "Stone Gathering Speed +11% to +36.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 16,
    "prereqs": [
      {
        "techId": "iron-output-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 100000,
          "wood": 100000,
          "stone": 20000,
          "iron": 5000,
          "gold": 1200
        },
        "timeSeconds": 1020,
        "power": 1375,
        "effectPercent": 11,
        "academyLevel": 16
      },
      {
        "level": 2,
        "cost": {
          "bread": 140000,
          "wood": 140000,
          "stone": 28000,
          "iron": 7000,
          "gold": 1600
        },
        "timeSeconds": 1560,
        "power": 2750,
        "effectPercent": 22,
        "academyLevel": 17
      },
      {
        "level": 3,
        "cost": {
          "bread": 300000,
          "wood": 300000,
          "stone": 60000,
          "iron": 15000,
          "gold": 3600
        },
        "timeSeconds": 4200,
        "power": 4562,
        "effectPercent": 36.5,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "stone-gathering-iii",
    "name": "Stone Gathering III",
    "category": "stone-gathering",
    "desc": "Enhances Stone Gathering Speed",
    "effectRange": "Stone Gathering Speed +13.5% to +45%",
    "maxLevel": 3,
    "unlockAcademyLevel": 21,
    "prereqs": [
      {
        "techId": "iron-output-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 320000,
          "wood": 320000,
          "stone": 64000,
          "iron": 16000,
          "gold": 3600
        },
        "timeSeconds": 4200,
        "power": 1687,
        "effectPercent": 13.5,
        "academyLevel": 21
      },
      {
        "level": 2,
        "cost": {
          "bread": 450000,
          "wood": 450000,
          "stone": 90000,
          "iron": 22000,
          "gold": 5000
        },
        "timeSeconds": 6300,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 22
      },
      {
        "level": 3,
        "cost": {
          "bread": 970000,
          "wood": 970000,
          "stone": 190000,
          "iron": 48000,
          "gold": 10000
        },
        "timeSeconds": 16800,
        "power": 5625,
        "effectPercent": 45,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "stone-gathering-iv",
    "name": "Stone Gathering IV",
    "category": "stone-gathering",
    "desc": "Enhances Stone Gathering Speed",
    "effectRange": "Stone Gathering Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 26,
    "prereqs": [
      {
        "techId": "iron-output-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 930000,
          "wood": 930000,
          "stone": 180000,
          "iron": 46000,
          "gold": 12000
        },
        "timeSeconds": 27960,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 26
      },
      {
        "level": 2,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 65000,
          "gold": 16000
        },
        "timeSeconds": 42000,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 27
      },
      {
        "level": 3,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 550000,
          "iron": 130000,
          "gold": 36000
        },
        "timeSeconds": 111960,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 28
      }
    ]
  },
  {
    "id": "stone-gathering-v",
    "name": "Stone Gathering V",
    "category": "stone-gathering",
    "desc": "Enhances Stone Gathering Speed",
    "effectRange": "Stone Gathering Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "iron-output-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 48000
        },
        "timeSeconds": 174960,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 67000
        },
        "timeSeconds": 262500,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 4900000,
          "wood": 4900000,
          "stone": 990000,
          "iron": 240000,
          "gold": 140000
        },
        "timeSeconds": 699960,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "stone-output-i",
    "name": "Stone Output I",
    "category": "stone-output",
    "desc": "Enhances Quarry Speed",
    "effectRange": "Stone Output +8% to +27%",
    "maxLevel": 3,
    "unlockAcademyLevel": 6,
    "prereqs": [
      {
        "techId": "food-foraging-i",
        "level": 1
      },
      {
        "techId": "wood-gathering-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 13000,
          "wood": 13000,
          "stone": 2700,
          "iron": 670,
          "gold": 800
        },
        "timeSeconds": 120,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 6
      },
      {
        "level": 2,
        "cost": {
          "bread": 18000,
          "wood": 18000,
          "stone": 3700,
          "iron": 940,
          "gold": 1100
        },
        "timeSeconds": 180,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 7
      },
      {
        "level": 3,
        "cost": {
          "bread": 40000,
          "wood": 40000,
          "stone": 8100,
          "iron": 2000,
          "gold": 2400
        },
        "timeSeconds": 540,
        "power": 7020,
        "effectPercent": 27,
        "academyLevel": 8
      }
    ]
  },
  {
    "id": "stone-output-ii",
    "name": "Stone Output II",
    "category": "stone-output",
    "desc": "Enhances Quarry Speed",
    "effectRange": "Stone Output +5.5% to +18%",
    "maxLevel": 3,
    "unlockAcademyLevel": 13,
    "prereqs": [
      {
        "techId": "iron-mining-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 130000,
          "wood": 130000,
          "stone": 27000,
          "iron": 6700,
          "gold": 1600
        },
        "timeSeconds": 1500,
        "power": 1430,
        "effectPercent": 5.5,
        "academyLevel": 13
      },
      {
        "level": 2,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 37000,
          "iron": 9400,
          "gold": 2200
        },
        "timeSeconds": 2220,
        "power": 2860,
        "effectPercent": 11,
        "academyLevel": 14
      },
      {
        "level": 3,
        "cost": {
          "bread": 400000,
          "wood": 400000,
          "stone": 81000,
          "iron": 20000,
          "gold": 4800
        },
        "timeSeconds": 6000,
        "power": 4680,
        "effectPercent": 18,
        "academyLevel": 15
      }
    ]
  },
  {
    "id": "stone-output-iii",
    "name": "Stone Output III",
    "category": "stone-output",
    "desc": "Enhances Quarry Speed",
    "effectRange": "Stone Output +7% to +22.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 18,
    "prereqs": [
      {
        "techId": "iron-mining-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 430000,
          "wood": 430000,
          "stone": 86000,
          "iron": 21000,
          "gold": 4800
        },
        "timeSeconds": 6000,
        "power": 1820,
        "effectPercent": 7,
        "academyLevel": 18
      },
      {
        "level": 2,
        "cost": {
          "bread": 600000,
          "wood": 600000,
          "stone": 120000,
          "iron": 30000,
          "gold": 6700
        },
        "timeSeconds": 9000,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 19
      },
      {
        "level": 3,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 250000,
          "iron": 64000,
          "gold": 14000
        },
        "timeSeconds": 24000,
        "power": 5850,
        "effectPercent": 22.5,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "stone-output-iv",
    "name": "Stone Output IV",
    "category": "stone-output",
    "desc": "Enhances Quarry Speed",
    "effectRange": "Stone Output +8% to +26%",
    "maxLevel": 3,
    "unlockAcademyLevel": 23,
    "prereqs": [
      {
        "techId": "iron-mining-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 62000,
          "gold": 16000
        },
        "timeSeconds": 39960,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 23
      },
      {
        "level": 2,
        "cost": {
          "bread": 1700000,
          "wood": 1700000,
          "stone": 340000,
          "iron": 86000,
          "gold": 22000
        },
        "timeSeconds": 60000,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 24
      },
      {
        "level": 3,
        "cost": {
          "bread": 3700000,
          "wood": 3700000,
          "stone": 740000,
          "iron": 180000,
          "gold": 48000
        },
        "timeSeconds": 159960,
        "power": 6760,
        "effectPercent": 26,
        "academyLevel": 25
      }
    ]
  },
  {
    "id": "stone-output-v",
    "name": "Stone Output V",
    "category": "stone-output",
    "desc": "Enhances Quarry Speed",
    "effectRange": "Stone Output +8% to +26%",
    "maxLevel": 3,
    "unlockAcademyLevel": 28,
    "prereqs": [
      {
        "techId": "iron-mining-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2200000,
          "wood": 2200000,
          "stone": 440000,
          "iron": 110000,
          "gold": 64000
        },
        "timeSeconds": 249960,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 28
      },
      {
        "level": 2,
        "cost": {
          "bread": 3000000,
          "wood": 3000000,
          "stone": 610000,
          "iron": 150000,
          "gold": 89000
        },
        "timeSeconds": 375000,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 29
      },
      {
        "level": 3,
        "cost": {
          "bread": 6600000,
          "wood": 6600000,
          "stone": 1300000,
          "iron": 330000,
          "gold": 190000
        },
        "timeSeconds": 999960,
        "power": 6760,
        "effectPercent": 26,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "wood-gathering-i",
    "name": "Wood Gathering I",
    "category": "wood-gathering",
    "desc": "Enhances Wood Gathering Speed",
    "effectRange": "Wood Gathering Speed +8% to +27%",
    "maxLevel": 3,
    "unlockAcademyLevel": 5,
    "prereqs": [
      {
        "techId": "wood-output-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 4000,
          "wood": 4000,
          "stone": 810,
          "iron": 200,
          "gold": 240
        },
        "timeSeconds": 27,
        "power": 1000,
        "effectPercent": 8,
        "academyLevel": 5
      },
      {
        "level": 2,
        "cost": {
          "bread": 5600,
          "wood": 5600,
          "stone": 1100,
          "iron": 280,
          "gold": 330
        },
        "timeSeconds": 40,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 6
      },
      {
        "level": 3,
        "cost": {
          "bread": 12000,
          "wood": 12000,
          "stone": 2400,
          "iron": 600,
          "gold": 720
        },
        "timeSeconds": 60,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 7
      }
    ]
  },
  {
    "id": "wood-gathering-ii",
    "name": "Wood Gathering II",
    "category": "wood-gathering",
    "desc": "Enhances Wood Gathering Speed",
    "effectRange": "Wood Gathering Speed +8% to +27%",
    "maxLevel": 3,
    "unlockAcademyLevel": 11,
    "prereqs": [
      {
        "techId": "iron-output-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 40000,
          "wood": 40000,
          "stone": 8100,
          "iron": 2000,
          "gold": 480
        },
        "timeSeconds": 300,
        "power": 1000,
        "effectPercent": 8,
        "academyLevel": 11
      },
      {
        "level": 2,
        "cost": {
          "bread": 56000,
          "wood": 56000,
          "stone": 11000,
          "iron": 2800,
          "gold": 670
        },
        "timeSeconds": 420,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 12
      },
      {
        "level": 3,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 24000,
          "iron": 6000,
          "gold": 1400
        },
        "timeSeconds": 0,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 13
      }
    ]
  },
  {
    "id": "wood-gathering-iii",
    "name": "Wood Gathering III",
    "category": "wood-gathering",
    "desc": "Enhances Wood Gathering Speed",
    "effectRange": "Wood Gathering Speed +11% to +36.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 16,
    "prereqs": [
      {
        "techId": "iron-output-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 25000,
          "iron": 6400,
          "gold": 1400
        },
        "timeSeconds": 0,
        "power": 1375,
        "effectPercent": 11,
        "academyLevel": 16
      },
      {
        "level": 2,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 36000,
          "iron": 9000,
          "gold": 2000
        },
        "timeSeconds": 1800,
        "power": 2750,
        "effectPercent": 22,
        "academyLevel": 17
      },
      {
        "level": 3,
        "cost": {
          "bread": 380000,
          "wood": 380000,
          "stone": 77000,
          "iron": 19000,
          "gold": 4300
        },
        "timeSeconds": 4800,
        "power": 4562,
        "effectPercent": 36.5,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "wood-gathering-iv",
    "name": "Wood Gathering IV",
    "category": "wood-gathering",
    "desc": "Enhances Wood Gathering Speed",
    "effectRange": "Wood Gathering Speed +13.5% to +45%",
    "maxLevel": 3,
    "unlockAcademyLevel": 21,
    "prereqs": [
      {
        "techId": "iron-output-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 370000,
          "wood": 370000,
          "stone": 74000,
          "iron": 18000,
          "gold": 4800
        },
        "timeSeconds": 7980,
        "power": 1687,
        "effectPercent": 13.5,
        "academyLevel": 21
      },
      {
        "level": 2,
        "cost": {
          "bread": 520000,
          "wood": 520000,
          "stone": 100000,
          "iron": 26000,
          "gold": 6700
        },
        "timeSeconds": 12000,
        "power": 3375,
        "effectPercent": 27,
        "academyLevel": 22
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 55000,
          "gold": 14000
        },
        "timeSeconds": 31980,
        "power": 5625,
        "effectPercent": 45,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "wood-gathering-v",
    "name": "Wood Gathering V",
    "category": "wood-gathering",
    "desc": "Enhances Wood Gathering Speed",
    "effectRange": "Wood Gathering Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 26,
    "prereqs": [
      {
        "techId": "iron-output-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 660000,
          "wood": 660000,
          "stone": 130000,
          "iron": 33000,
          "gold": 19000
        },
        "timeSeconds": 49980,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 26
      },
      {
        "level": 2,
        "cost": {
          "bread": 920000,
          "wood": 920000,
          "stone": 180000,
          "iron": 46000,
          "gold": 26000
        },
        "timeSeconds": 75000,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 27
      },
      {
        "level": 3,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 390000,
          "iron": 99000,
          "gold": 57000
        },
        "timeSeconds": 199980,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 28
      }
    ]
  },
  {
    "id": "wood-gathering-vi",
    "name": "Wood Gathering VI",
    "category": "wood-gathering",
    "desc": "Enhances Wood Gathering Speed",
    "effectRange": "Wood Gathering Speed +16% to +53.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "iron-output-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 38000
        },
        "timeSeconds": 240000,
        "power": 0,
        "effectPercent": 16,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 3200000,
          "wood": 3200000,
          "stone": 650000,
          "iron": 160000,
          "gold": 53000
        },
        "timeSeconds": 360000,
        "power": 4000,
        "effectPercent": 32,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 6900000,
          "wood": 6900000,
          "stone": 1300000,
          "iron": 340000,
          "gold": 110000
        },
        "timeSeconds": 960000,
        "power": 6687,
        "effectPercent": 53.5,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "wood-output-i",
    "name": "Wood Output I",
    "category": "wood-output",
    "desc": "Enhances Wood Output in Sawmill",
    "effectRange": "Wood Output +4% to +13.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 3,
    "prereqs": [
      {
        "techId": "bread-output-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5400,
          "wood": 5400,
          "stone": 1000,
          "iron": 270,
          "gold": 320
        },
        "timeSeconds": 27,
        "power": 1040,
        "effectPercent": 4,
        "academyLevel": 3
      },
      {
        "level": 2,
        "cost": {
          "bread": 7500,
          "wood": 7500,
          "stone": 1500,
          "iron": 370,
          "gold": 440
        },
        "timeSeconds": 40,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 4
      },
      {
        "level": 3,
        "cost": {
          "bread": 16000,
          "wood": 16000,
          "stone": 3200,
          "iron": 810,
          "gold": 960
        },
        "timeSeconds": 60,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 5
      }
    ]
  },
  {
    "id": "wood-output-ii",
    "name": "Wood Output II",
    "category": "wood-output",
    "desc": "Enhances Wood Output in Sawmill",
    "effectRange": "Wood Output +4% to +13.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 8,
    "prereqs": [
      {
        "techId": "stone-gathering-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 54000,
          "wood": 54000,
          "stone": 10000,
          "iron": 2700,
          "gold": 640
        },
        "timeSeconds": 300,
        "power": 1040,
        "effectPercent": 4,
        "academyLevel": 8
      },
      {
        "level": 2,
        "cost": {
          "bread": 75000,
          "wood": 75000,
          "stone": 15000,
          "iron": 3700,
          "gold": 890
        },
        "timeSeconds": 420,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 9
      },
      {
        "level": 3,
        "cost": {
          "bread": 160000,
          "wood": 160000,
          "stone": 32000,
          "iron": 8100,
          "gold": 1900
        },
        "timeSeconds": 0,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 10
      }
    ]
  },
  {
    "id": "wood-output-iii",
    "name": "Wood Output III",
    "category": "wood-output",
    "desc": "Enhances Wood Output in Sawmill",
    "effectRange": "Wood Output +5.5% to +18%",
    "maxLevel": 3,
    "unlockAcademyLevel": 13,
    "prereqs": [
      {
        "techId": "iron-mining-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 170000,
          "wood": 170000,
          "stone": 34000,
          "iron": 8600,
          "gold": 1900
        },
        "timeSeconds": 0,
        "power": 1430,
        "effectPercent": 5.5,
        "academyLevel": 13
      },
      {
        "level": 2,
        "cost": {
          "bread": 240000,
          "wood": 240000,
          "stone": 48000,
          "iron": 12000,
          "gold": 2600
        },
        "timeSeconds": 1800,
        "power": 2860,
        "effectPercent": 11,
        "academyLevel": 14
      },
      {
        "level": 3,
        "cost": {
          "bread": 510000,
          "wood": 510000,
          "stone": 100000,
          "iron": 25000,
          "gold": 5700
        },
        "timeSeconds": 4800,
        "power": 4680,
        "effectPercent": 18,
        "academyLevel": 15
      }
    ]
  },
  {
    "id": "wood-output-iv",
    "name": "Wood Output IV",
    "category": "wood-output",
    "desc": "Enhances Wood Output in Sawmill",
    "effectRange": "Wood Output +7% to +22.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 18,
    "prereqs": [
      {
        "techId": "iron-mining-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 490000,
          "wood": 490000,
          "stone": 99000,
          "iron": 24000,
          "gold": 6400
        },
        "timeSeconds": 7980,
        "power": 1820,
        "effectPercent": 7,
        "academyLevel": 18
      },
      {
        "level": 2,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 8900
        },
        "timeSeconds": 12000,
        "power": 3510,
        "effectPercent": 13.5,
        "academyLevel": 19
      },
      {
        "level": 3,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 290000,
          "iron": 74000,
          "gold": 19000
        },
        "timeSeconds": 31980,
        "power": 5850,
        "effectPercent": 22.5,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "wood-output-v",
    "name": "Wood Output V",
    "category": "wood-output",
    "desc": "Enhances Wood Output in Sawmill",
    "effectRange": "Wood Output +8% to +26%",
    "maxLevel": 3,
    "unlockAcademyLevel": 23,
    "prereqs": [
      {
        "techId": "iron-mining-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 49980,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 23
      },
      {
        "level": 2,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 61000,
          "gold": 35000
        },
        "timeSeconds": 75000,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 24
      },
      {
        "level": 3,
        "cost": {
          "bread": 2600000,
          "wood": 2600000,
          "stone": 530000,
          "iron": 130000,
          "gold": 76000
        },
        "timeSeconds": 199980,
        "power": 6760,
        "effectPercent": 26,
        "academyLevel": 25
      }
    ]
  },
  {
    "id": "wood-output-vi",
    "name": "Wood Output VI",
    "category": "wood-output",
    "desc": "Enhances Wood Output in Sawmill",
    "effectRange": "Wood Output +8% to +26%",
    "maxLevel": 3,
    "unlockAcademyLevel": 28,
    "prereqs": [
      {
        "techId": "iron-mining-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 240000,
        "power": 2080,
        "effectPercent": 8,
        "academyLevel": 28
      },
      {
        "level": 2,
        "cost": {
          "bread": 4300000,
          "wood": 4300000,
          "stone": 870000,
          "iron": 210000,
          "gold": 71000
        },
        "timeSeconds": 360000,
        "power": 4160,
        "effectPercent": 16,
        "academyLevel": 29
      },
      {
        "level": 3,
        "cost": {
          "bread": 9300000,
          "wood": 9300000,
          "stone": 1800000,
          "iron": 460000,
          "gold": 150000
        },
        "timeSeconds": 960000,
        "power": 6760,
        "effectPercent": 26,
        "academyLevel": 0
      }
    ]
  }
];

export function getEconomyTech(id: string): ResearchTech | undefined {
  return ECONOMY_TECHS.find((t) => t.id === id);
}
