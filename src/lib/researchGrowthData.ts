// Kingshot Research Tree -- Growth branch (Development in the source data)
// REAL data extracted directly from kingshotdata.com/research (fetched
// 2026-08-18) via its own static DOM -- each technology renders as a native
// <details class="ally-tech"> element whose per-level table is present in
// the page's HTML even while collapsed, so this was read directly rather
// than guessed. See researchTypes.ts for the shared shape.

import type { ResearchTech } from './researchTypes';

export const GROWTH_TECHS: ResearchTech[] = [
  {
    "id": "bandaging-i",
    "name": "Bandaging I",
    "category": "Bandaging",
    "desc": "Enhances Healing Speed of wounded soldiers",
    "effectRange": "Healing Speed +4.6% to +15.2%",
    "maxLevel": 3,
    "unlockAcademyLevel": 2,
    "prereqs": [
      {
        "techId": "tool-enhancement-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 6700,
          "wood": 6700,
          "stone": 1300,
          "iron": 330,
          "gold": 400
        },
        "timeSeconds": 60,
        "power": 4600,
        "effectValue": 4.6,
        "effectIsPercent": true,
        "academyLevel": 2
      },
      {
        "level": 2,
        "cost": {
          "bread": 9400,
          "wood": 9400,
          "stone": 1800,
          "iron": 470,
          "gold": 560
        },
        "timeSeconds": 120,
        "power": 9200,
        "effectValue": 9.2,
        "effectIsPercent": true,
        "academyLevel": 3
      },
      {
        "level": 3,
        "cost": {
          "bread": 20000,
          "wood": 20000,
          "stone": 4000,
          "iron": 1000,
          "gold": 1200
        },
        "timeSeconds": 360,
        "power": 15200,
        "effectValue": 15.2,
        "effectIsPercent": true,
        "academyLevel": 4
      }
    ]
  },
  {
    "id": "bandaging-ii",
    "name": "Bandaging II",
    "category": "Bandaging",
    "desc": "Enhances Healing Speed of wounded soldiers",
    "effectRange": "Healing Speed +9% to +30%",
    "maxLevel": 3,
    "unlockAcademyLevel": 8,
    "prereqs": [
      {
        "techId": "tool-enhancement-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 67000,
          "wood": 67000,
          "stone": 13000,
          "iron": 3300,
          "gold": 800
        },
        "timeSeconds": 1020,
        "power": 9000,
        "effectValue": 9,
        "effectIsPercent": true,
        "academyLevel": 8
      },
      {
        "level": 2,
        "cost": {
          "bread": 94000,
          "wood": 94000,
          "stone": 18000,
          "iron": 4700,
          "gold": 1100
        },
        "timeSeconds": 1560,
        "power": 18000,
        "effectValue": 18,
        "effectIsPercent": true,
        "academyLevel": 9
      },
      {
        "level": 3,
        "cost": {
          "bread": 200000,
          "wood": 200000,
          "stone": 40000,
          "iron": 10000,
          "gold": 2400
        },
        "timeSeconds": 4200,
        "power": 30000,
        "effectValue": 30,
        "effectIsPercent": true,
        "academyLevel": 10
      }
    ]
  },
  {
    "id": "bandaging-iii",
    "name": "Bandaging III",
    "category": "Bandaging",
    "desc": "Enhances Healing Speed of wounded soldiers",
    "effectRange": "Healing Speed +13.4% to +44.8%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "tool-enhancement-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 210000,
          "wood": 210000,
          "stone": 43000,
          "iron": 10000,
          "gold": 2400
        },
        "timeSeconds": 4200,
        "power": 13400,
        "effectValue": 13.4,
        "effectIsPercent": true,
        "academyLevel": 12
      },
      {
        "level": 2,
        "cost": {
          "bread": 300000,
          "wood": 300000,
          "stone": 60000,
          "iron": 15000,
          "gold": 3300
        },
        "timeSeconds": 6300,
        "power": 26800,
        "effectValue": 26.8,
        "effectIsPercent": true,
        "academyLevel": 13
      },
      {
        "level": 3,
        "cost": {
          "bread": 640000,
          "wood": 640000,
          "stone": 120000,
          "iron": 32000,
          "gold": 7200
        },
        "timeSeconds": 16800,
        "power": 44800,
        "effectValue": 44.8,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "bandaging-iv",
    "name": "Bandaging IV",
    "category": "Bandaging",
    "desc": "Enhances Healing Speed of wounded soldiers",
    "effectRange": "Healing Speed +18% to +60%",
    "maxLevel": 3,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "tool-enhancement-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 620000,
          "wood": 620000,
          "stone": 120000,
          "iron": 31000,
          "gold": 8000
        },
        "timeSeconds": 27960,
        "power": 18000,
        "effectValue": 18,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 860000,
          "wood": 860000,
          "stone": 170000,
          "iron": 43000,
          "gold": 11000
        },
        "timeSeconds": 42000,
        "power": 36000,
        "effectValue": 36,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 370000,
          "iron": 93000,
          "gold": 24000
        },
        "timeSeconds": 111960,
        "power": 60000,
        "effectValue": 60,
        "effectIsPercent": true,
        "academyLevel": 19
      }
    ]
  },
  {
    "id": "bandaging-v",
    "name": "Bandaging V",
    "category": "Bandaging",
    "desc": "Enhances Healing Speed of wounded soldiers",
    "effectRange": "Healing Speed +22.4% to +74.8%",
    "maxLevel": 3,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "tool-enhancement-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 55000,
          "gold": 32000
        },
        "timeSeconds": 174960,
        "power": 22400,
        "effectValue": 22.4,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 300000,
          "iron": 77000,
          "gold": 44000
        },
        "timeSeconds": 262500,
        "power": 44800,
        "effectValue": 44.8,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 3300000,
          "wood": 3300000,
          "stone": 660000,
          "iron": 160000,
          "gold": 96000
        },
        "timeSeconds": 699960,
        "power": 74800,
        "effectValue": 74.8,
        "effectIsPercent": true,
        "academyLevel": 24
      }
    ]
  },
  {
    "id": "bandaging-vi",
    "name": "Bandaging VI",
    "category": "Bandaging",
    "desc": "Enhances Healing Speed of wounded soldiers",
    "effectRange": "Healing Speed +27% to +90%",
    "maxLevel": 3,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "tool-enhancement-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 3800000,
          "wood": 3800000,
          "stone": 770000,
          "iron": 190000,
          "gold": 64000
        },
        "timeSeconds": 840000,
        "power": 27000,
        "effectValue": 27,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 5400000,
          "wood": 5400000,
          "stone": 1000000,
          "iron": 270000,
          "gold": 89000
        },
        "timeSeconds": 1260000,
        "power": 54000,
        "effectValue": 54,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 3,
        "cost": {
          "bread": 11000000,
          "wood": 11000000,
          "stone": 2300000,
          "iron": 580000,
          "gold": 190000
        },
        "timeSeconds": 3360000,
        "power": 90000,
        "effectValue": 90,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "bandaging-vii",
    "name": "Bandaging VII",
    "category": "Bandaging",
    "desc": "Enhances Healing Speed of wounded soldiers",
    "effectRange": "Healing Speed +27% to +90%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "tool-enhancement-vii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 7700000,
          "wood": 7700000,
          "stone": 1500000,
          "iron": 380000,
          "gold": 120000
        },
        "timeSeconds": 2940000,
        "power": 27000,
        "effectValue": 27,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 10000000,
          "wood": 10000000,
          "stone": 2100000,
          "iron": 540000,
          "gold": 160000
        },
        "timeSeconds": 4410000,
        "power": 54000,
        "effectValue": 54,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 23000000,
          "wood": 23000000,
          "stone": 4600000,
          "iron": 1100000,
          "gold": 360000
        },
        "timeSeconds": 11760000,
        "power": 90000,
        "effectValue": 90,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "camp-expansion-i",
    "name": "Camp Expansion I",
    "category": "Camp Expansion",
    "desc": "Increases the number of Squads that can be trained at a single time",
    "effectRange": "Training Capacity +2 to +7",
    "maxLevel": 3,
    "unlockAcademyLevel": 1,
    "prereqs": [
      {
        "techId": "tooling-up-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2000,
          "wood": 2000,
          "stone": 400,
          "iron": 100,
          "gold": 120
        },
        "timeSeconds": 27,
        "power": 1300,
        "effectValue": 2,
        "effectIsPercent": false,
        "academyLevel": 1
      },
      {
        "level": 2,
        "cost": {
          "bread": 2800,
          "wood": 2800,
          "stone": 560,
          "iron": 140,
          "gold": 160
        },
        "timeSeconds": 40,
        "power": 2600,
        "effectValue": 4,
        "effectIsPercent": false,
        "academyLevel": 2
      },
      {
        "level": 3,
        "cost": {
          "bread": 6000,
          "wood": 6000,
          "stone": 1200,
          "iron": 300,
          "gold": 360
        },
        "timeSeconds": 60,
        "power": 4550,
        "effectValue": 7,
        "effectIsPercent": false,
        "academyLevel": 3
      }
    ]
  },
  {
    "id": "camp-expansion-ii",
    "name": "Camp Expansion II",
    "category": "Camp Expansion",
    "desc": "Increases the number of Squads that can be trained at a single time",
    "effectRange": "Training Capacity +4 to +15",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "tooling-up-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 20000,
          "wood": 20000,
          "stone": 4000,
          "iron": 1000,
          "gold": 240
        },
        "timeSeconds": 300,
        "power": 2600,
        "effectValue": 4,
        "effectIsPercent": false,
        "academyLevel": 4
      },
      {
        "level": 2,
        "cost": {
          "bread": 28000,
          "wood": 28000,
          "stone": 5600,
          "iron": 1400,
          "gold": 330
        },
        "timeSeconds": 420,
        "power": 5850,
        "effectValue": 9,
        "effectIsPercent": false,
        "academyLevel": 5
      },
      {
        "level": 3,
        "cost": {
          "bread": 60000,
          "wood": 60000,
          "stone": 12000,
          "iron": 3000,
          "gold": 720
        },
        "timeSeconds": 0,
        "power": 9750,
        "effectValue": 15,
        "effectIsPercent": false,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "camp-expansion-iii",
    "name": "Camp Expansion III",
    "category": "Camp Expansion",
    "desc": "Increases the number of Squads that can be trained at a single time",
    "effectRange": "Training Capacity +7 to +23",
    "maxLevel": 3,
    "unlockAcademyLevel": 10,
    "prereqs": [
      {
        "techId": "tooling-up-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 64000,
          "wood": 64000,
          "stone": 12000,
          "iron": 3200,
          "gold": 720
        },
        "timeSeconds": 0,
        "power": 4550,
        "effectValue": 7,
        "effectIsPercent": false,
        "academyLevel": 10
      },
      {
        "level": 2,
        "cost": {
          "bread": 90000,
          "wood": 90000,
          "stone": 18000,
          "iron": 4500,
          "gold": 1000
        },
        "timeSeconds": 1800,
        "power": 9100,
        "effectValue": 14,
        "effectIsPercent": false,
        "academyLevel": 11
      },
      {
        "level": 3,
        "cost": {
          "bread": 190000,
          "wood": 190000,
          "stone": 38000,
          "iron": 9700,
          "gold": 2100
        },
        "timeSeconds": 4800,
        "power": 14900,
        "effectValue": 23,
        "effectIsPercent": false,
        "academyLevel": 12
      }
    ]
  },
  {
    "id": "camp-expansion-iv",
    "name": "Camp Expansion IV",
    "category": "Camp Expansion",
    "desc": "Increases the number of Squads that can be trained at a single time",
    "effectRange": "Training Capacity +9 to +30",
    "maxLevel": 3,
    "unlockAcademyLevel": 15,
    "prereqs": [
      {
        "techId": "tooling-up-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 37000,
          "iron": 9300,
          "gold": 2400
        },
        "timeSeconds": 7980,
        "power": 5850,
        "effectValue": 9,
        "effectIsPercent": false,
        "academyLevel": 15
      },
      {
        "level": 2,
        "cost": {
          "bread": 260000,
          "wood": 260000,
          "stone": 52000,
          "iron": 13000,
          "gold": 3300
        },
        "timeSeconds": 12000,
        "power": 11700,
        "effectValue": 18,
        "effectIsPercent": false,
        "academyLevel": 16
      },
      {
        "level": 3,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 7200
        },
        "timeSeconds": 31980,
        "power": 19500,
        "effectValue": 30,
        "effectIsPercent": false,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "camp-expansion-v",
    "name": "Camp Expansion V",
    "category": "Camp Expansion",
    "desc": "Increases the number of Squads that can be trained at a single time",
    "effectRange": "Training Capacity +11 to +37",
    "maxLevel": 3,
    "unlockAcademyLevel": 20,
    "prereqs": [
      {
        "techId": "tooling-up-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 330000,
          "wood": 330000,
          "stone": 66000,
          "iron": 16000,
          "gold": 9600
        },
        "timeSeconds": 49980,
        "power": 7150,
        "effectValue": 11,
        "effectIsPercent": false,
        "academyLevel": 20
      },
      {
        "level": 2,
        "cost": {
          "bread": 460000,
          "wood": 460000,
          "stone": 92000,
          "iron": 23000,
          "gold": 13000
        },
        "timeSeconds": 75000,
        "power": 14300,
        "effectValue": 22,
        "effectIsPercent": false,
        "academyLevel": 21
      },
      {
        "level": 3,
        "cost": {
          "bread": 990000,
          "wood": 990000,
          "stone": 190000,
          "iron": 49000,
          "gold": 28000
        },
        "timeSeconds": 199980,
        "power": 24100,
        "effectValue": 37,
        "effectIsPercent": false,
        "academyLevel": 22
      }
    ]
  },
  {
    "id": "camp-expansion-vi",
    "name": "Camp Expansion VI",
    "category": "Camp Expansion",
    "desc": "Increases the number of Squads that can be trained at a single time",
    "effectRange": "Training Capacity +14 to +46",
    "maxLevel": 3,
    "unlockAcademyLevel": 25,
    "prereqs": [
      {
        "techId": "tooling-up-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 230000,
          "iron": 58000,
          "gold": 19000
        },
        "timeSeconds": 240000,
        "power": 9100,
        "effectValue": 14,
        "effectIsPercent": false,
        "academyLevel": 25
      },
      {
        "level": 2,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 320000,
          "iron": 81000,
          "gold": 26000
        },
        "timeSeconds": 360000,
        "power": 18200,
        "effectValue": 28,
        "effectIsPercent": false,
        "academyLevel": 26
      },
      {
        "level": 3,
        "cost": {
          "bread": 3400000,
          "wood": 3400000,
          "stone": 690000,
          "iron": 170000,
          "gold": 57000
        },
        "timeSeconds": 960000,
        "power": 29900,
        "effectValue": 46,
        "effectIsPercent": false,
        "academyLevel": 27
      }
    ]
  },
  {
    "id": "camp-expansion-vii",
    "name": "Camp Expansion VII",
    "category": "Camp Expansion",
    "desc": "Increases the number of Squads that can be trained at a single time",
    "effectRange": "Training Capacity +14 to +46",
    "maxLevel": 3,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "tooling-up-vii",
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
          "gold": 36000
        },
        "timeSeconds": 840000,
        "power": 9100,
        "effectValue": 14,
        "effectIsPercent": false,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 3200000,
          "wood": 3200000,
          "stone": 650000,
          "iron": 160000,
          "gold": 50000
        },
        "timeSeconds": 1260000,
        "power": 18200,
        "effectValue": 28,
        "effectIsPercent": false,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 6900000,
          "wood": 6900000,
          "stone": 1300000,
          "iron": 340000,
          "gold": 100000
        },
        "timeSeconds": 3360000,
        "power": 29900,
        "effectValue": 46,
        "effectIsPercent": false,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "command-tactics-i",
    "name": "Command Tactics I",
    "category": "Command Tactics",
    "desc": "Increases the number of Expedition armies that can be deployed at the same time",
    "effectRange": "March Queue +1",
    "maxLevel": 1,
    "unlockAcademyLevel": 2,
    "prereqs": [
      {
        "techId": "bandaging-i",
        "level": 1
      },
      {
        "techId": "trainer-tools-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 6700,
          "wood": 6700,
          "stone": 1300,
          "iron": 330,
          "gold": 400
        },
        "timeSeconds": 240,
        "power": 2700,
        "effectValue": 1,
        "effectIsPercent": false,
        "academyLevel": 2
      }
    ]
  },
  {
    "id": "command-tactics-ii",
    "name": "Command Tactics II",
    "category": "Command Tactics",
    "desc": "Increases the number of Expedition armies that can be deployed at the same time",
    "effectRange": "March Queue +1",
    "maxLevel": 1,
    "unlockAcademyLevel": 13,
    "prereqs": [
      {
        "techId": "bandaging-iii",
        "level": 1
      },
      {
        "techId": "trainer-tools-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 67000,
          "wood": 67000,
          "stone": 13000,
          "iron": 3300,
          "gold": 800
        },
        "timeSeconds": 3000,
        "power": 2700,
        "effectValue": 1,
        "effectIsPercent": false,
        "academyLevel": 13
      }
    ]
  },
  {
    "id": "command-tactics-iii",
    "name": "Command Tactics III",
    "category": "Command Tactics",
    "desc": "Increases the number of Expedition armies that can be deployed at the same time",
    "effectRange": "March Queue +1",
    "maxLevel": 1,
    "unlockAcademyLevel": 18,
    "prereqs": [
      {
        "techId": "bandaging-iv",
        "level": 1
      },
      {
        "techId": "trainer-tools-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 210000,
          "wood": 210000,
          "stone": 43000,
          "iron": 10000,
          "gold": 2400
        },
        "timeSeconds": 12000,
        "power": 2700,
        "effectValue": 1,
        "effectIsPercent": false,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "tool-enhancement-i",
    "name": "Tool Enhancement I",
    "category": "Tool Enhancement",
    "desc": "Enhances Academy's Research Speed",
    "effectRange": "Research Speed +0.4% to +1.3%",
    "maxLevel": 3,
    "unlockAcademyLevel": 1,
    "prereqs": [
      {
        "techId": "ward-expansion-i",
        "level": 1
      },
      {
        "techId": "camp-expansion-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2200,
          "wood": 2200,
          "stone": 450,
          "iron": 110,
          "gold": 140
        },
        "timeSeconds": 35,
        "power": 0,
        "effectValue": 0.4,
        "effectIsPercent": true,
        "academyLevel": 1
      },
      {
        "level": 2,
        "cost": {
          "bread": 3200,
          "wood": 3200,
          "stone": 640,
          "iron": 160,
          "gold": 190
        },
        "timeSeconds": 52,
        "power": 4000,
        "effectValue": 0.8,
        "effectIsPercent": true,
        "academyLevel": 2
      },
      {
        "level": 3,
        "cost": {
          "bread": 6800,
          "wood": 6800,
          "stone": 1300,
          "iron": 340,
          "gold": 420
        },
        "timeSeconds": 120,
        "power": 6500,
        "effectValue": 1.3,
        "effectIsPercent": true,
        "academyLevel": 3
      }
    ]
  },
  {
    "id": "tool-enhancement-ii",
    "name": "Tool Enhancement II",
    "category": "Tool Enhancement",
    "desc": "Enhances Academy's Research Speed",
    "effectRange": "Research Speed +0.6% to +2.2%",
    "maxLevel": 3,
    "unlockAcademyLevel": 6,
    "prereqs": [
      {
        "techId": "ward-expansion-ii",
        "level": 1
      },
      {
        "techId": "camp-expansion-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 22000,
          "wood": 22000,
          "stone": 4500,
          "iron": 1100,
          "gold": 280
        },
        "timeSeconds": 360,
        "power": 3000,
        "effectValue": 0.6,
        "effectIsPercent": true,
        "academyLevel": 6
      },
      {
        "level": 2,
        "cost": {
          "bread": 32000,
          "wood": 32000,
          "stone": 6400,
          "iron": 1600,
          "gold": 390
        },
        "timeSeconds": 540,
        "power": 6000,
        "effectValue": 1.2,
        "effectIsPercent": true,
        "academyLevel": 7
      },
      {
        "level": 3,
        "cost": {
          "bread": 68000,
          "wood": 68000,
          "stone": 13000,
          "iron": 3400,
          "gold": 840
        },
        "timeSeconds": 1560,
        "power": 11000,
        "effectValue": 2.2,
        "effectIsPercent": true,
        "academyLevel": 8
      }
    ]
  },
  {
    "id": "tool-enhancement-iii",
    "name": "Tool Enhancement III",
    "category": "Tool Enhancement",
    "desc": "Enhances Academy's Research Speed",
    "effectRange": "Research Speed +1% to +3%",
    "maxLevel": 3,
    "unlockAcademyLevel": 11,
    "prereqs": [
      {
        "techId": "ward-expansion-iii",
        "level": 1
      },
      {
        "techId": "camp-expansion-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 73000,
          "wood": 73000,
          "stone": 14000,
          "iron": 3600,
          "gold": 840
        },
        "timeSeconds": 1560,
        "power": 5000,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 11
      },
      {
        "level": 2,
        "cost": {
          "bread": 100000,
          "wood": 100000,
          "stone": 20000,
          "iron": 5100,
          "gold": 1100
        },
        "timeSeconds": 2340,
        "power": 10000,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 12
      },
      {
        "level": 3,
        "cost": {
          "bread": 220000,
          "wood": 220000,
          "stone": 44000,
          "iron": 11000,
          "gold": 2500
        },
        "timeSeconds": 6240,
        "power": 15000,
        "effectValue": 3,
        "effectIsPercent": true,
        "academyLevel": 13
      }
    ]
  },
  {
    "id": "tool-enhancement-iv",
    "name": "Tool Enhancement IV",
    "category": "Tool Enhancement",
    "desc": "Enhances Academy's Research Speed",
    "effectRange": "Research Speed +1.2% to +3.9%",
    "maxLevel": 3,
    "unlockAcademyLevel": 16,
    "prereqs": [
      {
        "techId": "ward-expansion-iv",
        "level": 1
      },
      {
        "techId": "camp-expansion-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 210000,
          "wood": 210000,
          "stone": 42000,
          "iron": 10000,
          "gold": 2800
        },
        "timeSeconds": 10380,
        "power": 6000,
        "effectValue": 1.2,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 2,
        "cost": {
          "bread": 290000,
          "wood": 290000,
          "stone": 59000,
          "iron": 14000,
          "gold": 3900
        },
        "timeSeconds": 15600,
        "power": 12000,
        "effectValue": 2.4,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 3,
        "cost": {
          "bread": 630000,
          "wood": 630000,
          "stone": 120000,
          "iron": 31000,
          "gold": 8400
        },
        "timeSeconds": 41580,
        "power": 19500,
        "effectValue": 3.9,
        "effectIsPercent": true,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "tool-enhancement-v",
    "name": "Tool Enhancement V",
    "category": "Tool Enhancement",
    "desc": "Enhances Academy's Research Speed",
    "effectRange": "Research Speed +1.6% to +5.2%",
    "maxLevel": 3,
    "unlockAcademyLevel": 21,
    "prereqs": [
      {
        "techId": "ward-expansion-v",
        "level": 1
      },
      {
        "techId": "camp-expansion-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 370000,
          "wood": 370000,
          "stone": 75000,
          "iron": 18000,
          "gold": 11000
        },
        "timeSeconds": 64980,
        "power": 8000,
        "effectValue": 1.6,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 2,
        "cost": {
          "bread": 520000,
          "wood": 520000,
          "stone": 100000,
          "iron": 26000,
          "gold": 15000
        },
        "timeSeconds": 97500,
        "power": 16000,
        "effectValue": 3.2,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 33000
        },
        "timeSeconds": 259980,
        "power": 26000,
        "effectValue": 5.2,
        "effectIsPercent": true,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "tool-enhancement-vi",
    "name": "Tool Enhancement VI",
    "category": "Tool Enhancement",
    "desc": "Enhances Academy's Research Speed",
    "effectRange": "Research Speed +1.8% to +6.1%",
    "maxLevel": 3,
    "unlockAcademyLevel": 26,
    "prereqs": [
      {
        "techId": "ward-expansion-vi",
        "level": 1
      },
      {
        "techId": "camp-expansion-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 66000,
          "gold": 22000
        },
        "timeSeconds": 312000,
        "power": 9000,
        "effectValue": 1.8,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 2,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 370000,
          "iron": 92000,
          "gold": 31000
        },
        "timeSeconds": 468000,
        "power": 18000,
        "effectValue": 3.6,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 3,
        "cost": {
          "bread": 3900000,
          "wood": 3900000,
          "stone": 790000,
          "iron": 190000,
          "gold": 67000
        },
        "timeSeconds": 1248000,
        "power": 30500,
        "effectValue": 6.1,
        "effectIsPercent": true,
        "academyLevel": 28
      }
    ]
  },
  {
    "id": "tool-enhancement-vii",
    "name": "Tool Enhancement VII",
    "category": "Tool Enhancement",
    "desc": "Enhances Academy's Research Speed",
    "effectRange": "Research Speed +1.8% to +6.1%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "ward-expansion-vii",
        "level": 1
      },
      {
        "techId": "camp-expansion-vii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2600000,
          "wood": 2600000,
          "stone": 520000,
          "iron": 130000,
          "gold": 42000
        },
        "timeSeconds": 1092000,
        "power": 9000,
        "effectValue": 1.8,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 3700000,
          "wood": 3700000,
          "stone": 740000,
          "iron": 180000,
          "gold": 58000
        },
        "timeSeconds": 1638000,
        "power": 18000,
        "effectValue": 3.6,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 7900000,
          "wood": 7900000,
          "stone": 1500000,
          "iron": 390000,
          "gold": 120000
        },
        "timeSeconds": 4368000,
        "power": 30500,
        "effectValue": 6.1,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "tooling-up-i",
    "name": "Tooling Up I",
    "category": "Tooling Up",
    "desc": "Enhances Construction Speed",
    "effectRange": "Construction Speed +0.4% to +1.3%",
    "maxLevel": 3,
    "unlockAcademyLevel": 1,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 2700,
          "wood": 2700,
          "stone": 540,
          "iron": 130,
          "gold": 160
        },
        "timeSeconds": 2,
        "power": 0,
        "effectValue": 0.4,
        "effectIsPercent": true,
        "academyLevel": 1
      },
      {
        "level": 2,
        "cost": {
          "bread": 3700,
          "wood": 3700,
          "stone": 750,
          "iron": 180,
          "gold": 220
        },
        "timeSeconds": 40,
        "power": 4000,
        "effectValue": 0.8,
        "effectIsPercent": true,
        "academyLevel": 2
      },
      {
        "level": 3,
        "cost": {
          "bread": 8100,
          "wood": 8100,
          "stone": 1600,
          "iron": 400,
          "gold": 480
        },
        "timeSeconds": 60,
        "power": 6500,
        "effectValue": 1.3,
        "effectIsPercent": true,
        "academyLevel": 3
      }
    ]
  },
  {
    "id": "tooling-up-ii",
    "name": "Tooling Up II",
    "category": "Tooling Up",
    "desc": "Enhances Construction Speed",
    "effectRange": "Construction Speed +0.6% to +2.2%",
    "maxLevel": 3,
    "unlockAcademyLevel": 2,
    "prereqs": [
      {
        "techId": "command-tactics-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 27000,
          "wood": 27000,
          "stone": 5400,
          "iron": 1300,
          "gold": 320
        },
        "timeSeconds": 300,
        "power": 3000,
        "effectValue": 0.6,
        "effectIsPercent": true,
        "academyLevel": 2
      },
      {
        "level": 2,
        "cost": {
          "bread": 37000,
          "wood": 37000,
          "stone": 7500,
          "iron": 1800,
          "gold": 440
        },
        "timeSeconds": 420,
        "power": 6000,
        "effectValue": 1.2,
        "effectIsPercent": true,
        "academyLevel": 3
      },
      {
        "level": 3,
        "cost": {
          "bread": 81000,
          "wood": 81000,
          "stone": 16000,
          "iron": 4000,
          "gold": 960
        },
        "timeSeconds": 0,
        "power": 11000,
        "effectValue": 2.2,
        "effectIsPercent": true,
        "academyLevel": 4
      }
    ]
  },
  {
    "id": "tooling-up-iii",
    "name": "Tooling Up III",
    "category": "Tooling Up",
    "desc": "Enhances Construction Speed",
    "effectRange": "Construction Speed +1% to +3%",
    "maxLevel": 3,
    "unlockAcademyLevel": 9,
    "prereqs": [
      {
        "techId": "bandaging-ii",
        "level": 1
      },
      {
        "techId": "trainer-tools-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 86000,
          "wood": 86000,
          "stone": 17000,
          "iron": 4300,
          "gold": 960
        },
        "timeSeconds": 0,
        "power": 5000,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 9
      },
      {
        "level": 2,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 24000,
          "iron": 6000,
          "gold": 1300
        },
        "timeSeconds": 1800,
        "power": 10000,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 10
      },
      {
        "level": 3,
        "cost": {
          "bread": 250000,
          "wood": 250000,
          "stone": 51000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 4800,
        "power": 15000,
        "effectValue": 3,
        "effectIsPercent": true,
        "academyLevel": 11
      }
    ]
  },
  {
    "id": "tooling-up-iv",
    "name": "Tooling Up IV",
    "category": "Tooling Up",
    "desc": "Enhances Construction Speed",
    "effectRange": "Construction Speed +1.2% to +3.9%",
    "maxLevel": 3,
    "unlockAcademyLevel": 14,
    "prereqs": [
      {
        "techId": "command-tactics-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 240000,
          "wood": 240000,
          "stone": 49000,
          "iron": 12000,
          "gold": 3200
        },
        "timeSeconds": 7980,
        "power": 6000,
        "effectValue": 1.2,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 2,
        "cost": {
          "bread": 340000,
          "wood": 340000,
          "stone": 69000,
          "iron": 17000,
          "gold": 4400
        },
        "timeSeconds": 12000,
        "power": 12000,
        "effectValue": 2.4,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 3,
        "cost": {
          "bread": 740000,
          "wood": 740000,
          "stone": 140000,
          "iron": 37000,
          "gold": 9600
        },
        "timeSeconds": 31980,
        "power": 19500,
        "effectValue": 3.9,
        "effectIsPercent": true,
        "academyLevel": 16
      }
    ]
  },
  {
    "id": "tooling-up-v",
    "name": "Tooling Up V",
    "category": "Tooling Up",
    "desc": "Enhances Construction Speed",
    "effectRange": "Construction Speed +1.6% to +5.2%",
    "maxLevel": 3,
    "unlockAcademyLevel": 19,
    "prereqs": [
      {
        "techId": "command-tactics-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 440000,
          "wood": 440000,
          "stone": 88000,
          "iron": 22000,
          "gold": 12000
        },
        "timeSeconds": 49980,
        "power": 8000,
        "effectValue": 1.6,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 2,
        "cost": {
          "bread": 610000,
          "wood": 610000,
          "stone": 120000,
          "iron": 30000,
          "gold": 17000
        },
        "timeSeconds": 75000,
        "power": 16000,
        "effectValue": 3.2,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 3,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 66000,
          "gold": 38000
        },
        "timeSeconds": 199980,
        "power": 26000,
        "effectValue": 5.2,
        "effectIsPercent": true,
        "academyLevel": 21
      }
    ]
  },
  {
    "id": "tooling-up-vi",
    "name": "Tooling Up VI",
    "category": "Tooling Up",
    "desc": "Enhances Construction Speed",
    "effectRange": "Construction Speed +1.8% to +6.1%",
    "maxLevel": 3,
    "unlockAcademyLevel": 24,
    "prereqs": [
      {
        "techId": "bandaging-v",
        "level": 1
      },
      {
        "techId": "trainer-tools-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 310000,
          "iron": 77000,
          "gold": 25000
        },
        "timeSeconds": 240000,
        "power": 9000,
        "effectValue": 1.8,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 2,
        "cost": {
          "bread": 2100000,
          "wood": 2100000,
          "stone": 430000,
          "iron": 100000,
          "gold": 35000
        },
        "timeSeconds": 360000,
        "power": 18000,
        "effectValue": 3.6,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 3,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 960000,
        "power": 30500,
        "effectValue": 6.1,
        "effectIsPercent": true,
        "academyLevel": 26
      }
    ]
  },
  {
    "id": "tooling-up-vii",
    "name": "Tooling Up VII",
    "category": "Tooling Up",
    "desc": "Enhances Construction Speed",
    "effectRange": "Construction Speed +1.8% to +6.1%",
    "maxLevel": 3,
    "unlockAcademyLevel": 28,
    "prereqs": [
      {
        "techId": "bandaging-vi",
        "level": 1
      },
      {
        "techId": "trainer-tools-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 3100000,
          "wood": 3100000,
          "stone": 620000,
          "iron": 150000,
          "gold": 48000
        },
        "timeSeconds": 840000,
        "power": 9000,
        "effectValue": 1.8,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 2,
        "cost": {
          "bread": 4300000,
          "wood": 4300000,
          "stone": 870000,
          "iron": 210000,
          "gold": 67000
        },
        "timeSeconds": 1260000,
        "power": 18000,
        "effectValue": 3.6,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 3,
        "cost": {
          "bread": 9300000,
          "wood": 9300000,
          "stone": 1800000,
          "iron": 460000,
          "gold": 140000
        },
        "timeSeconds": 3360000,
        "power": 30500,
        "effectValue": 6.1,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "trainer-tools-i",
    "name": "Trainer Tools I",
    "category": "Trainer Tools",
    "desc": "Enhances Training Speed of Squads",
    "effectRange": "+2.2% to +7.4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 2,
    "prereqs": [
      {
        "techId": "tool-enhancement-i",
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
        "timeSeconds": 60,
        "power": 3960,
        "effectValue": 2.2,
        "effectIsPercent": true,
        "academyLevel": 2
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
        "timeSeconds": 120,
        "power": 7920,
        "effectValue": 4.4,
        "effectIsPercent": true,
        "academyLevel": 3
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
        "timeSeconds": 300,
        "power": 13300,
        "effectValue": 7.4,
        "effectIsPercent": true,
        "academyLevel": 4
      }
    ]
  },
  {
    "id": "trainer-tools-ii",
    "name": "Trainer Tools II",
    "category": "Trainer Tools",
    "desc": "Enhances Training Speed of Squads",
    "effectRange": "+4.6% to +15.2%",
    "maxLevel": 3,
    "unlockAcademyLevel": 8,
    "prereqs": [
      {
        "techId": "tool-enhancement-ii",
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
        "timeSeconds": 900,
        "power": 8280,
        "effectValue": 4.6,
        "effectIsPercent": true,
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
        "timeSeconds": 1320,
        "power": 16600,
        "effectValue": 9.2,
        "effectIsPercent": true,
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
        "timeSeconds": 3600,
        "power": 27400,
        "effectValue": 15.2,
        "effectIsPercent": true,
        "academyLevel": 10
      }
    ]
  },
  {
    "id": "trainer-tools-iii",
    "name": "Trainer Tools III",
    "category": "Trainer Tools",
    "desc": "Enhances Training Speed of Squads",
    "effectRange": "+6.8% to +22.6%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "tool-enhancement-iii",
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
        "timeSeconds": 3600,
        "power": 12200,
        "effectValue": 6.8,
        "effectIsPercent": true,
        "academyLevel": 12
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
        "timeSeconds": 5400,
        "power": 24500,
        "effectValue": 13.6,
        "effectIsPercent": true,
        "academyLevel": 13
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
        "timeSeconds": 14400,
        "power": 40700,
        "effectValue": 22.6,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "trainer-tools-iv",
    "name": "Trainer Tools IV",
    "category": "Trainer Tools",
    "desc": "Enhances Training Speed of Squads",
    "effectRange": "+9% to +30%",
    "maxLevel": 3,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "tool-enhancement-iv",
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
        "timeSeconds": 24000,
        "power": 16200,
        "effectValue": 9,
        "effectIsPercent": true,
        "academyLevel": 17
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
        "timeSeconds": 36000,
        "power": 32400,
        "effectValue": 18,
        "effectIsPercent": true,
        "academyLevel": 18
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
        "timeSeconds": 96000,
        "power": 54000,
        "effectValue": 30,
        "effectIsPercent": true,
        "academyLevel": 19
      }
    ]
  },
  {
    "id": "trainer-tools-v",
    "name": "Trainer Tools V",
    "category": "Trainer Tools",
    "desc": "Enhances Training Speed of Squads",
    "effectRange": "+11.2% to +37.4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "tool-enhancement-v",
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
        "timeSeconds": 150000,
        "power": 20200,
        "effectValue": 11.2,
        "effectIsPercent": true,
        "academyLevel": 22
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
        "timeSeconds": 225000,
        "power": 40300,
        "effectValue": 22.4,
        "effectIsPercent": true,
        "academyLevel": 23
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
        "timeSeconds": 600000,
        "power": 67300,
        "effectValue": 37.4,
        "effectIsPercent": true,
        "academyLevel": 24
      }
    ]
  },
  {
    "id": "trainer-tools-vi",
    "name": "Trainer Tools VI",
    "category": "Trainer Tools",
    "desc": "Enhances Training Speed of Squads",
    "effectRange": "+13.4% to +44.8%",
    "maxLevel": 3,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "tool-enhancement-vi",
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
        "timeSeconds": 720000,
        "power": 24100,
        "effectValue": 13.4,
        "effectIsPercent": true,
        "academyLevel": 27
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
        "timeSeconds": 1080000,
        "power": 48200,
        "effectValue": 26.8,
        "effectIsPercent": true,
        "academyLevel": 28
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
        "timeSeconds": 2880000,
        "power": 80600,
        "effectValue": 44.8,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "trainer-tools-vii",
    "name": "Trainer Tools VII",
    "category": "Trainer Tools",
    "desc": "Enhances Training Speed of Squads",
    "effectRange": "+13.4% to +44.8%",
    "maxLevel": 3,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "tool-enhancement-vii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 6200000,
          "wood": 6200000,
          "stone": 1200000,
          "iron": 310000,
          "gold": 96000
        },
        "timeSeconds": 2520000,
        "power": 24100,
        "effectValue": 13.4,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 8700000,
          "wood": 8700000,
          "stone": 1700000,
          "iron": 430000,
          "gold": 130000
        },
        "timeSeconds": 3780000,
        "power": 48200,
        "effectValue": 26.8,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 18000000,
          "wood": 18000000,
          "stone": 3700000,
          "iron": 930000,
          "gold": 280000
        },
        "timeSeconds": 10080000,
        "power": 80600,
        "effectValue": 44.8,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "ward-expansion-i",
    "name": "Ward Expansion I",
    "category": "Ward Expansion",
    "desc": "Enhances Infirmary Capacity",
    "effectRange": "Infirmary Capacity +540 to +1,800",
    "maxLevel": 3,
    "unlockAcademyLevel": 1,
    "prereqs": [
      {
        "techId": "tooling-up-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 670,
          "wood": 670,
          "stone": 130,
          "iron": 30,
          "gold": 40
        },
        "timeSeconds": 13,
        "power": 1080,
        "effectValue": 540,
        "effectIsPercent": false,
        "academyLevel": 1
      },
      {
        "level": 2,
        "cost": {
          "bread": 940,
          "wood": 940,
          "stone": 180,
          "iron": 40,
          "gold": 50
        },
        "timeSeconds": 20,
        "power": 2160,
        "effectValue": 1080,
        "effectIsPercent": false,
        "academyLevel": 2
      },
      {
        "level": 3,
        "cost": {
          "bread": 2000,
          "wood": 2000,
          "stone": 400,
          "iron": 100,
          "gold": 120
        },
        "timeSeconds": 54,
        "power": 3600,
        "effectValue": 1800,
        "effectIsPercent": false,
        "academyLevel": 3
      }
    ]
  },
  {
    "id": "ward-expansion-ii",
    "name": "Ward Expansion II",
    "category": "Ward Expansion",
    "desc": "Enhances Infirmary Capacity",
    "effectRange": "Infirmary Capacity +1,100 to +3,600",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "tooling-up-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 6700,
          "wood": 6700,
          "stone": 1300,
          "iron": 330,
          "gold": 80
        },
        "timeSeconds": 120,
        "power": 2200,
        "effectValue": 1100,
        "effectIsPercent": false,
        "academyLevel": 4
      },
      {
        "level": 2,
        "cost": {
          "bread": 9400,
          "wood": 9400,
          "stone": 1800,
          "iron": 470,
          "gold": 110
        },
        "timeSeconds": 180,
        "power": 4400,
        "effectValue": 2200,
        "effectIsPercent": false,
        "academyLevel": 5
      },
      {
        "level": 3,
        "cost": {
          "bread": 20000,
          "wood": 20000,
          "stone": 4000,
          "iron": 1000,
          "gold": 240
        },
        "timeSeconds": 600,
        "power": 7200,
        "effectValue": 3600,
        "effectIsPercent": false,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "ward-expansion-iii",
    "name": "Ward Expansion III",
    "category": "Ward Expansion",
    "desc": "Enhances Infirmary Capacity",
    "effectRange": "Infirmary Capacity +2,200 to +7,300",
    "maxLevel": 3,
    "unlockAcademyLevel": 10,
    "prereqs": [
      {
        "techId": "tooling-up-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 21000,
          "wood": 21000,
          "stone": 4300,
          "iron": 1000,
          "gold": 240
        },
        "timeSeconds": 600,
        "power": 4400,
        "effectValue": 2200,
        "effectIsPercent": false,
        "academyLevel": 10
      },
      {
        "level": 2,
        "cost": {
          "bread": 30000,
          "wood": 30000,
          "stone": 6000,
          "iron": 1500,
          "gold": 330
        },
        "timeSeconds": 900,
        "power": 8800,
        "effectValue": 4400,
        "effectIsPercent": false,
        "academyLevel": 11
      },
      {
        "level": 3,
        "cost": {
          "bread": 64000,
          "wood": 64000,
          "stone": 12000,
          "iron": 3200,
          "gold": 720
        },
        "timeSeconds": 2400,
        "power": 14600,
        "effectValue": 7300,
        "effectIsPercent": false,
        "academyLevel": 12
      }
    ]
  },
  {
    "id": "ward-expansion-iv",
    "name": "Ward Expansion IV",
    "category": "Ward Expansion",
    "desc": "Enhances Infirmary Capacity",
    "effectRange": "Infirmary Capacity +4,300 to +14.4K",
    "maxLevel": 3,
    "unlockAcademyLevel": 15,
    "prereqs": [
      {
        "techId": "tooling-up-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 62000,
          "wood": 62000,
          "stone": 12000,
          "iron": 3100,
          "gold": 800
        },
        "timeSeconds": 3960,
        "power": 8600,
        "effectValue": 4300,
        "effectIsPercent": false,
        "academyLevel": 15
      },
      {
        "level": 2,
        "cost": {
          "bread": 86000,
          "wood": 86000,
          "stone": 17000,
          "iron": 4300,
          "gold": 1100
        },
        "timeSeconds": 6000,
        "power": 17200,
        "effectValue": 8600,
        "effectIsPercent": false,
        "academyLevel": 16
      },
      {
        "level": 3,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 37000,
          "iron": 9300,
          "gold": 2400
        },
        "timeSeconds": 15960,
        "power": 28800,
        "effectValue": 14400,
        "effectIsPercent": false,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "ward-expansion-v",
    "name": "Ward Expansion V",
    "category": "Ward Expansion",
    "desc": "Enhances Infirmary Capacity",
    "effectRange": "Infirmary Capacity +8,600 to +29.2K",
    "maxLevel": 3,
    "unlockAcademyLevel": 20,
    "prereqs": [
      {
        "techId": "tooling-up-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 110000,
          "wood": 110000,
          "stone": 22000,
          "iron": 5500,
          "gold": 3200
        },
        "timeSeconds": 24960,
        "power": 17200,
        "effectValue": 8600,
        "effectIsPercent": false,
        "academyLevel": 20
      },
      {
        "level": 2,
        "cost": {
          "bread": 150000,
          "wood": 150000,
          "stone": 30000,
          "iron": 7700,
          "gold": 4400
        },
        "timeSeconds": 37500,
        "power": 34400,
        "effectValue": 17200,
        "effectIsPercent": false,
        "academyLevel": 21
      },
      {
        "level": 3,
        "cost": {
          "bread": 330000,
          "wood": 330000,
          "stone": 66000,
          "iron": 16000,
          "gold": 9600
        },
        "timeSeconds": 99960,
        "power": 58400,
        "effectValue": 29200,
        "effectIsPercent": false,
        "academyLevel": 22
      }
    ]
  },
  {
    "id": "ward-expansion-vi",
    "name": "Ward Expansion VI",
    "category": "Ward Expansion",
    "desc": "Enhances Infirmary Capacity",
    "effectRange": "Infirmary Capacity +12K to +40K",
    "maxLevel": 3,
    "unlockAcademyLevel": 25,
    "prereqs": [
      {
        "techId": "tooling-up-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 380000,
          "wood": 380000,
          "stone": 77000,
          "iron": 19000,
          "gold": 6400
        },
        "timeSeconds": 120000,
        "power": 24000,
        "effectValue": 12000,
        "effectIsPercent": false,
        "academyLevel": 25
      },
      {
        "level": 2,
        "cost": {
          "bread": 540000,
          "wood": 540000,
          "stone": 100000,
          "iron": 27000,
          "gold": 8900
        },
        "timeSeconds": 180000,
        "power": 48000,
        "effectValue": 24000,
        "effectIsPercent": false,
        "academyLevel": 26
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 230000,
          "iron": 58000,
          "gold": 19000
        },
        "timeSeconds": 480000,
        "power": 80000,
        "effectValue": 40000,
        "effectIsPercent": false,
        "academyLevel": 27
      }
    ]
  },
  {
    "id": "ward-expansion-vii",
    "name": "Ward Expansion VII",
    "category": "Ward Expansion",
    "desc": "Enhances Infirmary Capacity",
    "effectRange": "Infirmary Capacity +20K to +67K",
    "maxLevel": 3,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "tooling-up-vii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 770000,
          "wood": 770000,
          "stone": 150000,
          "iron": 38000,
          "gold": 12000
        },
        "timeSeconds": 420000,
        "power": 40000,
        "effectValue": 20000,
        "effectIsPercent": false,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 210000,
          "iron": 54000,
          "gold": 16000
        },
        "timeSeconds": 630000,
        "power": 80000,
        "effectValue": 40000,
        "effectIsPercent": false,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 36000
        },
        "timeSeconds": 1680000,
        "power": 134000,
        "effectValue": 67000,
        "effectIsPercent": false,
        "academyLevel": 0
      }
    ]
  }
];

export function getGrowthTech(id: string): ResearchTech | undefined {
  return GROWTH_TECHS.find((t) => t.id === id);
}
