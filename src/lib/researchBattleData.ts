// Kingshot Research Tree -- Battle branch
// REAL data extracted directly from kingshotdata.com/research (fetched
// 2026-08-18) via its own static DOM -- each technology renders as a native
// <details class="ally-tech"> element whose per-level table is present in
// the page's HTML even while collapsed, so this was read directly rather
// than guessed. See researchTypes.ts for the shared shape.
//
// Fortified Mail VI is the one exception: kingshotdata.com had no level
// data for it, so this entry was instead built from real in-game numbers
// the user read off another in-game calculator (current/target deltas
// across levels 0-1 and 1-6), not scraped -- levels 1-3 cost the same per
// step, then 4, 5, and 6 each step up individually, matching the stepped
// per-level cost pattern already seen elsewhere in this file rather than a
// smooth curve.

import type { ResearchTech } from './researchTypes';

export const BATTLE_TECHS: ResearchTech[] = [
  {
    "id": "leathercraft-i",
    "name": "Leathercraft I",
    "category": "Leathercraft",
    "desc": "Enhances Archer Health",
    "effectRange": "Archer Health +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 7,
    "prereqs": [
      {
        "techId": "targeted-sniping-i",
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
        "power": 3000,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 7
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
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 8
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
        "timeSeconds": 420,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 9
      }
    ]
  },
  {
    "id": "leathercraft-ii",
    "name": "Leathercraft II",
    "category": "Leathercraft",
    "desc": "Enhances Archer Health",
    "effectRange": "Archer Health +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "targeted-sniping-ii",
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
        "timeSeconds": 0,
        "power": 4200,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 12
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
        "timeSeconds": 1800,
        "power": 8400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 13
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
        "timeSeconds": 4800,
        "power": 13200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "leathercraft-iii",
    "name": "Leathercraft III",
    "category": "Leathercraft",
    "desc": "Enhances Archer Health",
    "effectRange": "Archer Health +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "targeted-sniping-iii",
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
        "timeSeconds": 4800,
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 220000,
          "wood": 220000,
          "stone": 44000,
          "iron": 11000,
          "gold": 2400
        },
        "timeSeconds": 5760,
        "power": 12000,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 290000,
          "wood": 290000,
          "stone": 58000,
          "iron": 14000,
          "gold": 3200
        },
        "timeSeconds": 9600,
        "power": 18000,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 4,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 7600
        },
        "timeSeconds": 28800,
        "power": 27600,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "leathercraft-iv",
    "name": "Leathercraft IV",
    "category": "Leathercraft",
    "desc": "Enhances Archer Health",
    "effectRange": "Archer Health +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "targeted-sniping-iv",
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
        "timeSeconds": 31980,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 590000,
          "wood": 590000,
          "stone": 110000,
          "iron": 29000,
          "gold": 7600
        },
        "timeSeconds": 41580,
        "power": 19200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 8900
        },
        "timeSeconds": 63960,
        "power": 28800,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 4,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 96000,
        "power": 38400,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 360000,
          "iron": 91000,
          "gold": 23000
        },
        "timeSeconds": 240000,
        "power": 54000,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 26
      }
    ]
  },
  {
    "id": "leathercraft-v",
    "name": "Leathercraft V",
    "category": "Leathercraft",
    "desc": "Enhances Archer Health",
    "effectRange": "Archer Health +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "targeted-sniping-v",
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
        "timeSeconds": 199980,
        "power": 11400,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 199980,
        "power": 22800,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 3,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 219960,
        "power": 34200,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 210000,
          "iron": 53000,
          "gold": 30000
        },
        "timeSeconds": 349980,
        "power": 45600,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 61000,
          "gold": 35000
        },
        "timeSeconds": 420000,
        "power": 57000,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 2400000,
          "wood": 2400000,
          "stone": 480000,
          "iron": 120000,
          "gold": 70000
        },
        "timeSeconds": 999960,
        "power": 76200,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "leathercraft-vi",
    "name": "Leathercraft VI",
    "category": "Leathercraft",
    "desc": "Enhances Archer Health",
    "effectRange": "Archer Health +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "targeted-sniping-vi",
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
        "timeSeconds": 960000,
        "power": 13200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 960000,
        "power": 26400,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 1056000,
        "power": 39600,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 3700000,
          "wood": 3700000,
          "stone": 740000,
          "iron": 180000,
          "gold": 61000
        },
        "timeSeconds": 1680000,
        "power": 52800,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 4300000,
          "wood": 4300000,
          "stone": 870000,
          "iron": 210000,
          "gold": 71000
        },
        "timeSeconds": 2016000,
        "power": 66000,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 8500000,
          "wood": 8500000,
          "stone": 1700000,
          "iron": 420000,
          "gold": 140000
        },
        "timeSeconds": 4800000,
        "power": 87600,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "assault-techniques-i",
    "name": "Assault Techniques I",
    "category": "Assault Techniques",
    "desc": "Enhances all Squads' Lethality.",
    "effectRange": "Squads' Lethality +0.5% to +1.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 5,
    "prereqs": [
      {
        "techId": "special-defensive-training-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8700,
          "wood": 8700,
          "stone": 1700,
          "iron": 430,
          "gold": 520
        },
        "timeSeconds": 120,
        "power": 4200,
        "effectValue": 0.5,
        "effectIsPercent": true,
        "academyLevel": 5
      },
      {
        "level": 2,
        "cost": {
          "bread": 12000,
          "wood": 12000,
          "stone": 2400,
          "iron": 610,
          "gold": 720
        },
        "timeSeconds": 240,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 6
      },
      {
        "level": 3,
        "cost": {
          "bread": 26000,
          "wood": 26000,
          "stone": 5200,
          "iron": 1300,
          "gold": 1500
        },
        "timeSeconds": 660,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 7
      }
    ]
  },
  {
    "id": "assault-techniques-ii",
    "name": "Assault Techniques II",
    "category": "Assault Techniques",
    "desc": "Enhances all Squads' Lethality.",
    "effectRange": "Squads' Lethality +0.75% to +2.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 10,
    "prereqs": [
      {
        "techId": "special-defensive-training-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 87000,
          "wood": 87000,
          "stone": 17000,
          "iron": 4300,
          "gold": 1000
        },
        "timeSeconds": 1920,
        "power": 6300,
        "effectValue": 0.75,
        "effectIsPercent": true,
        "academyLevel": 10
      },
      {
        "level": 2,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 24000,
          "iron": 6100,
          "gold": 1400
        },
        "timeSeconds": 2880,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 11
      },
      {
        "level": 3,
        "cost": {
          "bread": 260000,
          "wood": 260000,
          "stone": 52000,
          "iron": 13000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 21000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 12
      }
    ]
  },
  {
    "id": "assault-techniques-iii",
    "name": "Assault Techniques III",
    "category": "Assault Techniques",
    "desc": "Enhances all Squads' Lethality.",
    "effectRange": "Squads' Lethality +1% to +4.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 15,
    "prereqs": [
      {
        "techId": "special-defensive-training-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 280000,
          "wood": 280000,
          "stone": 56000,
          "iron": 14000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 2,
        "cost": {
          "bread": 360000,
          "wood": 360000,
          "stone": 73000,
          "iron": 18000,
          "gold": 4000
        },
        "timeSeconds": 9360,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 3,
        "cost": {
          "bread": 470000,
          "wood": 470000,
          "stone": 95000,
          "iron": 23000,
          "gold": 5300
        },
        "timeSeconds": 15600,
        "power": 25200,
        "effectValue": 3,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 4,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 12000
        },
        "timeSeconds": 46800,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "assault-techniques-iv",
    "name": "Assault Techniques IV",
    "category": "Assault Techniques",
    "desc": "Enhances all Squads' Lethality.",
    "effectRange": "Squads' Lethality +1.75% to +10%",
    "maxLevel": 5,
    "unlockAcademyLevel": 20,
    "prereqs": [
      {
        "techId": "special-defensive-training-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 800000,
          "wood": 800000,
          "stone": 160000,
          "iron": 40000,
          "gold": 10000
        },
        "timeSeconds": 51960,
        "power": 14700,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 2,
        "cost": {
          "bread": 960000,
          "wood": 960000,
          "stone": 190000,
          "iron": 48000,
          "gold": 12000
        },
        "timeSeconds": 67560,
        "power": 29400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 14000
        },
        "timeSeconds": 103980,
        "power": 44100,
        "effectValue": 5.25,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 4,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 290000,
          "iron": 72000,
          "gold": 18000
        },
        "timeSeconds": 156000,
        "power": 58800,
        "effectValue": 7,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 5,
        "cost": {
          "bread": 2900000,
          "wood": 2900000,
          "stone": 590000,
          "iron": 140000,
          "gold": 38000
        },
        "timeSeconds": 390000,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 24
      }
    ]
  },
  {
    "id": "assault-techniques-v",
    "name": "Assault Techniques V",
    "category": "Assault Techniques",
    "desc": "Enhances all Squads' Lethality.",
    "effectRange": "Squads' Lethality +2% to +13.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 25,
    "prereqs": [
      {
        "techId": "special-defensive-training-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 2,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 33600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 3,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 357480,
        "power": 50400,
        "effectValue": 6,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 4,
        "cost": {
          "bread": 1700000,
          "wood": 1700000,
          "stone": 340000,
          "iron": 86000,
          "gold": 49000
        },
        "timeSeconds": 568740,
        "power": 67200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 5,
        "cost": {
          "bread": 2000000,
          "wood": 2000000,
          "stone": 400000,
          "iron": 100000,
          "gold": 58000
        },
        "timeSeconds": 682500,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 6,
        "cost": {
          "bread": 3900000,
          "wood": 3900000,
          "stone": 790000,
          "iron": 190000,
          "gold": 110000
        },
        "timeSeconds": 1624980,
        "power": 113400,
        "effectValue": 13.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "assault-techniques-vi",
    "name": "Assault Techniques VI",
    "category": "Assault Techniques",
    "desc": "Enhances all Squads' Lethality.",
    "effectRange": "Squads' Lethality +2.25% to +15.25%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "special-defensive-training-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 18900,
        "effectValue": 2.25,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1716000,
        "power": 56700,
        "effectValue": 6.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 6000000,
          "wood": 6000000,
          "stone": 1200000,
          "iron": 300000,
          "gold": 99000
        },
        "timeSeconds": 2730000,
        "power": 75600,
        "effectValue": 9,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 7000000,
          "wood": 7000000,
          "stone": 1400000,
          "iron": 350000,
          "gold": 110000
        },
        "timeSeconds": 3276000,
        "power": 94500,
        "effectValue": 11.25,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 13000000,
          "wood": 13000000,
          "stone": 2700000,
          "iron": 690000,
          "gold": 220000
        },
        "timeSeconds": 7800000,
        "power": 128100,
        "effectValue": 15.25,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "bulwark-formations-i",
    "name": "Bulwark Formations I",
    "category": "Bulwark Formations",
    "desc": "Enhances Cavalry Defense",
    "effectRange": "Cavalry Defense +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "cavalry-charge-i",
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
        "power": 3000,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 4
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
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 5
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
        "timeSeconds": 420,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "bulwark-formations-ii",
    "name": "Bulwark Formations II",
    "category": "Bulwark Formations",
    "desc": "Enhances Cavalry Defense",
    "effectRange": "Cavalry Defense +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 9,
    "prereqs": [
      {
        "techId": "cavalry-charge-ii",
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
        "timeSeconds": 0,
        "power": 4200,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 9
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
        "timeSeconds": 1800,
        "power": 8400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 10
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
        "timeSeconds": 4800,
        "power": 13200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 11
      }
    ]
  },
  {
    "id": "bulwark-formations-iii",
    "name": "Bulwark Formations III",
    "category": "Bulwark Formations",
    "desc": "Enhances Cavalry Defense",
    "effectRange": "Cavalry Defense +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 14,
    "prereqs": [
      {
        "techId": "cavalry-charge-iii",
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
        "timeSeconds": 4800,
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 2,
        "cost": {
          "bread": 220000,
          "wood": 220000,
          "stone": 44000,
          "iron": 11000,
          "gold": 2400
        },
        "timeSeconds": 5760,
        "power": 12000,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 3,
        "cost": {
          "bread": 290000,
          "wood": 290000,
          "stone": 58000,
          "iron": 14000,
          "gold": 3200
        },
        "timeSeconds": 9600,
        "power": 18000,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 4,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 7600
        },
        "timeSeconds": 28800,
        "power": 27600,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "bulwark-formations-iv",
    "name": "Bulwark Formations IV",
    "category": "Bulwark Formations",
    "desc": "Enhances Cavalry Defense",
    "effectRange": "Cavalry Defense +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 19,
    "prereqs": [
      {
        "techId": "cavalry-charge-iv",
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
        "timeSeconds": 31980,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 2,
        "cost": {
          "bread": 590000,
          "wood": 590000,
          "stone": 110000,
          "iron": 29000,
          "gold": 7600
        },
        "timeSeconds": 41580,
        "power": 19200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 3,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 8900
        },
        "timeSeconds": 63960,
        "power": 28800,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 4,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 96000,
        "power": 38400,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 360000,
          "iron": 91000,
          "gold": 23000
        },
        "timeSeconds": 240000,
        "power": 54000,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "bulwark-formations-v",
    "name": "Bulwark Formations V",
    "category": "Bulwark Formations",
    "desc": "Enhances Cavalry Defense",
    "effectRange": "Cavalry Defense +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 24,
    "prereqs": [
      {
        "techId": "cavalry-charge-v",
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
        "timeSeconds": 199980,
        "power": 11400,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 2,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 199980,
        "power": 22800,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 3,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 219960,
        "power": 34200,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 210000,
          "iron": 53000,
          "gold": 30000
        },
        "timeSeconds": 349980,
        "power": 45600,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 5,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 61000,
          "gold": 35000
        },
        "timeSeconds": 420000,
        "power": 57000,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 6,
        "cost": {
          "bread": 2400000,
          "wood": 2400000,
          "stone": 480000,
          "iron": 120000,
          "gold": 70000
        },
        "timeSeconds": 999960,
        "power": 76200,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "bulwark-formations-vi",
    "name": "Bulwark Formations VI",
    "category": "Bulwark Formations",
    "desc": "Enhances Cavalry Defense",
    "effectRange": "Cavalry Defense +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "cavalry-charge-vi",
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
        "timeSeconds": 960000,
        "power": 13200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 960000,
        "power": 26400,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 1056000,
        "power": 39600,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 3700000,
          "wood": 3700000,
          "stone": 740000,
          "iron": 180000,
          "gold": 61000
        },
        "timeSeconds": 1680000,
        "power": 52800,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 4300000,
          "wood": 4300000,
          "stone": 870000,
          "iron": 210000,
          "gold": 71000
        },
        "timeSeconds": 2016000,
        "power": 66000,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 8500000,
          "wood": 8500000,
          "stone": 1700000,
          "iron": 420000,
          "gold": 140000
        },
        "timeSeconds": 4800000,
        "power": 87600,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "close-combat-i",
    "name": "Close Combat I",
    "category": "Close Combat",
    "desc": "Enhances Infantry Lethality",
    "effectRange": "Infantry Lethality +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 7,
    "prereqs": [
      {
        "techId": "regimental-expansion-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 3300,
          "wood": 3300,
          "stone": 670,
          "iron": 160,
          "gold": 200
        },
        "timeSeconds": 60,
        "power": 1750,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 7
      },
      {
        "level": 2,
        "cost": {
          "bread": 4700,
          "wood": 4700,
          "stone": 940,
          "iron": 230,
          "gold": 280
        },
        "timeSeconds": 60,
        "power": 3500,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 8
      },
      {
        "level": 3,
        "cost": {
          "bread": 10000,
          "wood": 10000,
          "stone": 2000,
          "iron": 500,
          "gold": 600
        },
        "timeSeconds": 240,
        "power": 5600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 9
      }
    ]
  },
  {
    "id": "close-combat-ii",
    "name": "Close Combat II",
    "category": "Close Combat",
    "desc": "Enhances Infantry Lethality",
    "effectRange": "Infantry Lethality +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "regimental-expansion-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 33000,
          "wood": 33000,
          "stone": 6700,
          "iron": 1600,
          "gold": 400
        },
        "timeSeconds": 720,
        "power": 2450,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 12
      },
      {
        "level": 2,
        "cost": {
          "bread": 47000,
          "wood": 47000,
          "stone": 9400,
          "iron": 2300,
          "gold": 560
        },
        "timeSeconds": 1080,
        "power": 4900,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 13
      },
      {
        "level": 3,
        "cost": {
          "bread": 100000,
          "wood": 100000,
          "stone": 20000,
          "iron": 5000,
          "gold": 1200
        },
        "timeSeconds": 3000,
        "power": 7700,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "close-combat-iii",
    "name": "Close Combat III",
    "category": "Close Combat",
    "desc": "Enhances Infantry Lethality",
    "effectRange": "Infantry Lethality +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "regimental-expansion-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 100000,
          "wood": 100000,
          "stone": 21000,
          "iron": 5400,
          "gold": 1200
        },
        "timeSeconds": 3000,
        "power": 3500,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 140000,
          "wood": 140000,
          "stone": 28000,
          "iron": 7000,
          "gold": 1500
        },
        "timeSeconds": 3600,
        "power": 7000,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 36000,
          "iron": 9100,
          "gold": 2000
        },
        "timeSeconds": 6000,
        "power": 10500,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 4,
        "cost": {
          "bread": 430000,
          "wood": 430000,
          "stone": 86000,
          "iron": 21000,
          "gold": 4800
        },
        "timeSeconds": 18000,
        "power": 16100,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "close-combat-iv",
    "name": "Close Combat IV",
    "category": "Close Combat",
    "desc": "Enhances Infantry Lethality",
    "effectRange": "Infantry Lethality +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "regimental-expansion-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 310000,
          "wood": 310000,
          "stone": 62000,
          "iron": 15000,
          "gold": 4000
        },
        "timeSeconds": 19980,
        "power": 5600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 370000,
          "wood": 370000,
          "stone": 74000,
          "iron": 18000,
          "gold": 4800
        },
        "timeSeconds": 25980,
        "power": 11200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 430000,
          "wood": 430000,
          "stone": 86000,
          "iron": 21000,
          "gold": 5600
        },
        "timeSeconds": 39960,
        "power": 16800,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 4,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 7200
        },
        "timeSeconds": 60000,
        "power": 22400,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 5,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 57000,
          "gold": 14000
        },
        "timeSeconds": 150000,
        "power": 31500,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 26
      }
    ]
  },
  {
    "id": "close-combat-v",
    "name": "Close Combat V",
    "category": "Close Combat",
    "desc": "Enhances Infantry Lethality",
    "effectRange": "Infantry Lethality +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "regimental-expansion-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 16000
        },
        "timeSeconds": 124980,
        "power": 6650,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 16000
        },
        "timeSeconds": 124980,
        "power": 13300,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 3,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 16000
        },
        "timeSeconds": 137460,
        "power": 19900,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 4,
        "cost": {
          "bread": 660000,
          "wood": 660000,
          "stone": 130000,
          "iron": 33000,
          "gold": 19000
        },
        "timeSeconds": 218700,
        "power": 26600,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 770000,
          "wood": 770000,
          "stone": 150000,
          "iron": 38000,
          "gold": 22000
        },
        "timeSeconds": 262500,
        "power": 33200,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 300000,
          "iron": 76000,
          "gold": 44000
        },
        "timeSeconds": 624960,
        "power": 44500,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "close-combat-vi",
    "name": "Close Combat VI",
    "category": "Close Combat",
    "desc": "Enhances Infantry Lethality",
    "effectRange": "Infantry Lethality +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "regimental-expansion-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 380000,
          "iron": 97000,
          "gold": 32000
        },
        "timeSeconds": 600000,
        "power": 7700,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 380000,
          "iron": 97000,
          "gold": 32000
        },
        "timeSeconds": 600000,
        "power": 15400,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 380000,
          "iron": 97000,
          "gold": 32000
        },
        "timeSeconds": 660000,
        "power": 23100,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 38000
        },
        "timeSeconds": 1050000,
        "power": 30800,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 540000,
          "iron": 130000,
          "gold": 44000
        },
        "timeSeconds": 1260000,
        "power": 38500,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 5300000,
          "wood": 5300000,
          "stone": 1000000,
          "iron": 260000,
          "gold": 88000
        },
        "timeSeconds": 3000000,
        "power": 51100,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "defensive-formations-i",
    "name": "Defensive Formations I",
    "category": "Defensive Formations",
    "desc": "Enhances Infantry Defense",
    "effectRange": "Infantry Defense +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "reprisal-tactics-i",
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
        "timeSeconds": 180,
        "power": 5625,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 4
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
        "timeSeconds": 300,
        "power": 11200,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 5
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
        "timeSeconds": 780,
        "power": 18000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "defensive-formations-ii",
    "name": "Defensive Formations II",
    "category": "Defensive Formations",
    "desc": "Enhances Infantry Defense",
    "effectRange": "Infantry Defense +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 9,
    "prereqs": [
      {
        "techId": "reprisal-tactics-ii",
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
        "timeSeconds": 2220,
        "power": 7875,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 9
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
        "timeSeconds": 3360,
        "power": 15800,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 10
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
        "timeSeconds": 9000,
        "power": 24800,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 11
      }
    ]
  },
  {
    "id": "defensive-formations-iii",
    "name": "Defensive Formations III",
    "category": "Defensive Formations",
    "desc": "Enhances Infantry Defense",
    "effectRange": "Infantry Defense +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 14,
    "prereqs": [
      {
        "techId": "reprisal-tactics-iii",
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
        "timeSeconds": 9000,
        "power": 11200,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 2,
        "cost": {
          "bread": 420000,
          "wood": 420000,
          "stone": 84000,
          "iron": 21000,
          "gold": 4600
        },
        "timeSeconds": 10800,
        "power": 22500,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 3,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 6100
        },
        "timeSeconds": 18000,
        "power": 33800,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 4,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 250000,
          "iron": 64000,
          "gold": 14000
        },
        "timeSeconds": 54000,
        "power": 51800,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "defensive-formations-iv",
    "name": "Defensive Formations IV",
    "category": "Defensive Formations",
    "desc": "Enhances Infantry Defense",
    "effectRange": "Infantry Defense +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 19,
    "prereqs": [
      {
        "techId": "reprisal-tactics-iv",
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
        "timeSeconds": 60000,
        "power": 18000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 2,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 55000,
          "gold": 14000
        },
        "timeSeconds": 78000,
        "power": 36000,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 3,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 65000,
          "gold": 16000
        },
        "timeSeconds": 120000,
        "power": 54000,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 4,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 21000
        },
        "timeSeconds": 180000,
        "power": 72000,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 5,
        "cost": {
          "bread": 3400000,
          "wood": 3400000,
          "stone": 680000,
          "iron": 170000,
          "gold": 44000
        },
        "timeSeconds": 450000,
        "power": 101200,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "defensive-formations-v",
    "name": "Defensive Formations V",
    "category": "Defensive Formations",
    "desc": "Enhances Infantry Defense",
    "effectRange": "Infantry Defense +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 24,
    "prereqs": [
      {
        "techId": "reprisal-tactics-v",
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
        "timeSeconds": 375000,
        "power": 21400,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 2,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 48000
        },
        "timeSeconds": 375000,
        "power": 42800,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 3,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 48000
        },
        "timeSeconds": 412500,
        "power": 64100,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 4,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 390000,
          "iron": 99000,
          "gold": 57000
        },
        "timeSeconds": 656220,
        "power": 85500,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 5,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 67000
        },
        "timeSeconds": 787500,
        "power": 106900,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 6,
        "cost": {
          "bread": 4500000,
          "wood": 4500000,
          "stone": 910000,
          "iron": 220000,
          "gold": 130000
        },
        "timeSeconds": 1875000,
        "power": 142900,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "defensive-formations-vi",
    "name": "Defensive Formations VI",
    "category": "Defensive Formations",
    "desc": "Enhances Infantry Defense",
    "effectRange": "Infantry Defense +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "reprisal-tactics-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5800000,
          "wood": 5800000,
          "stone": 1100000,
          "iron": 290000,
          "gold": 96000
        },
        "timeSeconds": 1800000,
        "power": 24800,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 5800000,
          "wood": 5800000,
          "stone": 1100000,
          "iron": 290000,
          "gold": 96000
        },
        "timeSeconds": 1800000,
        "power": 49500,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 5800000,
          "wood": 5800000,
          "stone": 1100000,
          "iron": 290000,
          "gold": 96000
        },
        "timeSeconds": 1980000,
        "power": 74200,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 6900000,
          "wood": 6900000,
          "stone": 1300000,
          "iron": 340000,
          "gold": 110000
        },
        "timeSeconds": 3150000,
        "power": 99000,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 8100000,
          "wood": 8100000,
          "stone": 1600000,
          "iron": 400000,
          "gold": 130000
        },
        "timeSeconds": 3780000,
        "power": 123800,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 16000000,
          "wood": 16000000,
          "stone": 3200000,
          "iron": 800000,
          "gold": 260000
        },
        "timeSeconds": 9000000,
        "power": 164200,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "shield-upgrade-i",
    "name": "Shield Upgrade I",
    "category": "Shield Upgrade",
    "desc": "Enhances Infantry Health",
    "effectRange": "Infantry Health +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 7,
    "prereqs": [
      {
        "techId": "close-combat-i",
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
        "timeSeconds": 180,
        "power": 5625,
        "effectValue": 1.25,
        "effectIsPercent": true,
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
        "timeSeconds": 300,
        "power": 11200,
        "effectValue": 2.5,
        "effectIsPercent": true,
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
        "timeSeconds": 780,
        "power": 18000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 9
      }
    ]
  },
  {
    "id": "shield-upgrade-ii",
    "name": "Shield Upgrade II",
    "category": "Shield Upgrade",
    "desc": "Enhances Infantry Health",
    "effectRange": "Infantry Health +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "close-combat-ii",
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
        "timeSeconds": 2220,
        "power": 7875,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 12
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
        "timeSeconds": 3360,
        "power": 15800,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 13
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
        "timeSeconds": 9000,
        "power": 24800,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "shield-upgrade-iii",
    "name": "Shield Upgrade III",
    "category": "Shield Upgrade",
    "desc": "Enhances Infantry Health",
    "effectRange": "Infantry Health +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "close-combat-iii",
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
        "timeSeconds": 9000,
        "power": 11200,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 420000,
          "wood": 420000,
          "stone": 84000,
          "iron": 21000,
          "gold": 4600
        },
        "timeSeconds": 10800,
        "power": 22500,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 6100
        },
        "timeSeconds": 18000,
        "power": 33800,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 4,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 250000,
          "iron": 64000,
          "gold": 14000
        },
        "timeSeconds": 54000,
        "power": 51800,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "shield-upgrade-iv",
    "name": "Shield Upgrade IV",
    "category": "Shield Upgrade",
    "desc": "Enhances Infantry Health",
    "effectRange": "Infantry Health +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "close-combat-iv",
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
        "timeSeconds": 60000,
        "power": 18000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 55000,
          "gold": 14000
        },
        "timeSeconds": 78000,
        "power": 36000,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 65000,
          "gold": 16000
        },
        "timeSeconds": 120000,
        "power": 54000,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 4,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 21000
        },
        "timeSeconds": 180000,
        "power": 72000,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 5,
        "cost": {
          "bread": 3400000,
          "wood": 3400000,
          "stone": 680000,
          "iron": 170000,
          "gold": 44000
        },
        "timeSeconds": 450000,
        "power": 101200,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 26
      }
    ]
  },
  {
    "id": "shield-upgrade-v",
    "name": "Shield Upgrade V",
    "category": "Shield Upgrade",
    "desc": "Enhances Infantry Health",
    "effectRange": "Infantry Health +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "close-combat-v",
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
        "timeSeconds": 375000,
        "power": 21400,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 48000
        },
        "timeSeconds": 375000,
        "power": 42800,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 3,
        "cost": {
          "bread": 1600000,
          "wood": 1600000,
          "stone": 330000,
          "iron": 83000,
          "gold": 48000
        },
        "timeSeconds": 412500,
        "power": 64100,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 4,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 390000,
          "iron": 99000,
          "gold": 57000
        },
        "timeSeconds": 656220,
        "power": 85500,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 67000
        },
        "timeSeconds": 787500,
        "power": 106900,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 4500000,
          "wood": 4500000,
          "stone": 910000,
          "iron": 220000,
          "gold": 130000
        },
        "timeSeconds": 1875000,
        "power": 142900,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "shield-upgrade-vi",
    "name": "Shield Upgrade VI",
    "category": "Shield Upgrade",
    "desc": "Enhances Infantry Health",
    "effectRange": "Infantry Health +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "close-combat-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5800000,
          "wood": 5800000,
          "stone": 1100000,
          "iron": 290000,
          "gold": 96000
        },
        "timeSeconds": 1800000,
        "power": 24800,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 5800000,
          "wood": 5800000,
          "stone": 1100000,
          "iron": 290000,
          "gold": 96000
        },
        "timeSeconds": 1800000,
        "power": 49500,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 5800000,
          "wood": 5800000,
          "stone": 1100000,
          "iron": 290000,
          "gold": 96000
        },
        "timeSeconds": 1980000,
        "power": 74200,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 6900000,
          "wood": 6900000,
          "stone": 1300000,
          "iron": 340000,
          "gold": 110000
        },
        "timeSeconds": 3150000,
        "power": 99000,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 8100000,
          "wood": 8100000,
          "stone": 1600000,
          "iron": 400000,
          "gold": 130000
        },
        "timeSeconds": 3780000,
        "power": 123800,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 16000000,
          "wood": 16000000,
          "stone": 3200000,
          "iron": 800000,
          "gold": 260000
        },
        "timeSeconds": 9000000,
        "power": 164200,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "lance-upgrade-i",
    "name": "Lance Upgrade I",
    "category": "Lance Upgrade",
    "desc": "Enhances Cavalry Lethality",
    "effectRange": "Cavalry Lethality +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 7,
    "prereqs": [
      {
        "techId": "regimental-expansion-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8100,
          "wood": 8100,
          "stone": 1600,
          "iron": 400,
          "gold": 480
        },
        "timeSeconds": 120,
        "power": 4375,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 7
      },
      {
        "level": 2,
        "cost": {
          "bread": 11000,
          "wood": 11000,
          "stone": 2200,
          "iron": 560,
          "gold": 670
        },
        "timeSeconds": 240,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 8
      },
      {
        "level": 3,
        "cost": {
          "bread": 24000,
          "wood": 24000,
          "stone": 4800,
          "iron": 1200,
          "gold": 1400
        },
        "timeSeconds": 600,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 9
      }
    ]
  },
  {
    "id": "lance-upgrade-ii",
    "name": "Lance Upgrade II",
    "category": "Lance Upgrade",
    "desc": "Enhances Cavalry Lethality",
    "effectRange": "Cavalry Lethality +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "regimental-expansion-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 81000,
          "wood": 81000,
          "stone": 16000,
          "iron": 4000,
          "gold": 960
        },
        "timeSeconds": 1800,
        "power": 6125,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 12
      },
      {
        "level": 2,
        "cost": {
          "bread": 110000,
          "wood": 110000,
          "stone": 22000,
          "iron": 5600,
          "gold": 1300
        },
        "timeSeconds": 2700,
        "power": 12200,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 13
      },
      {
        "level": 3,
        "cost": {
          "bread": 240000,
          "wood": 240000,
          "stone": 48000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "lance-upgrade-iii",
    "name": "Lance Upgrade III",
    "category": "Lance Upgrade",
    "desc": "Enhances Cavalry Lethality",
    "effectRange": "Cavalry Lethality +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "regimental-expansion-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 250000,
          "wood": 250000,
          "stone": 51000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 330000,
          "wood": 330000,
          "stone": 67000,
          "iron": 16000,
          "gold": 3700
        },
        "timeSeconds": 8640,
        "power": 17500,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 440000,
          "wood": 440000,
          "stone": 88000,
          "iron": 22000,
          "gold": 4800
        },
        "timeSeconds": 14400,
        "power": 26200,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 51000,
          "gold": 11000
        },
        "timeSeconds": 43200,
        "power": 40200,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "lance-upgrade-iv",
    "name": "Lance Upgrade IV",
    "category": "Lance Upgrade",
    "desc": "Enhances Cavalry Lethality",
    "effectRange": "Cavalry Lethality +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "regimental-expansion-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 740000,
          "wood": 740000,
          "stone": 140000,
          "iron": 37000,
          "gold": 9600
        },
        "timeSeconds": 48000,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 62400,
        "power": 28000,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 52000,
          "gold": 13000
        },
        "timeSeconds": 96000,
        "power": 42000,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 4,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 67000,
          "gold": 17000
        },
        "timeSeconds": 144000,
        "power": 56000,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 5,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 550000,
          "iron": 130000,
          "gold": 35000
        },
        "timeSeconds": 360000,
        "power": 78800,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 26
      }
    ]
  },
  {
    "id": "lance-upgrade-v",
    "name": "Lance Upgrade V",
    "category": "Lance Upgrade",
    "desc": "Enhances Cavalry Lethality",
    "effectRange": "Cavalry Lethality +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "regimental-expansion-v",
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
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 16600,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 66000,
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 33200,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 28
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
        "timeSeconds": 330000,
        "power": 49900,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 4,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 310000,
          "iron": 79000,
          "gold": 46000
        },
        "timeSeconds": 525000,
        "power": 66500,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 370000,
          "iron": 92000,
          "gold": 53000
        },
        "timeSeconds": 630000,
        "power": 83100,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 3600000,
          "wood": 3600000,
          "stone": 730000,
          "iron": 180000,
          "gold": 100000
        },
        "timeSeconds": 1500000,
        "power": 111100,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "lance-upgrade-vi",
    "name": "Lance Upgrade VI",
    "category": "Lance Upgrade",
    "desc": "Enhances Cavalry Lethality",
    "effectRange": "Cavalry Lethality +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "regimental-expansion-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 38500,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
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
        "timeSeconds": 1584000,
        "power": 57800,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 5500000,
          "wood": 5500000,
          "stone": 1100000,
          "iron": 270000,
          "gold": 92000
        },
        "timeSeconds": 2520000,
        "power": 77000,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 6500000,
          "wood": 6500000,
          "stone": 1300000,
          "iron": 320000,
          "gold": 100000
        },
        "timeSeconds": 3024000,
        "power": 96200,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 12000000,
          "wood": 12000000,
          "stone": 2500000,
          "iron": 640000,
          "gold": 210000
        },
        "timeSeconds": 7200000,
        "power": 127800,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "cavalry-charge-i",
    "name": "Cavalry Charge I",
    "category": "Cavalry Charge",
    "desc": "Enhances Cavalry Attack",
    "effectRange": "Cavalry Attack +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "weapons-prep-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8100,
          "wood": 8100,
          "stone": 1600,
          "iron": 400,
          "gold": 480
        },
        "timeSeconds": 120,
        "power": 4375,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 4
      },
      {
        "level": 2,
        "cost": {
          "bread": 11000,
          "wood": 11000,
          "stone": 2200,
          "iron": 560,
          "gold": 670
        },
        "timeSeconds": 240,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 5
      },
      {
        "level": 3,
        "cost": {
          "bread": 24000,
          "wood": 24000,
          "stone": 4800,
          "iron": 1200,
          "gold": 1400
        },
        "timeSeconds": 600,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "cavalry-charge-ii",
    "name": "Cavalry Charge II",
    "category": "Cavalry Charge",
    "desc": "Enhances Cavalry Attack",
    "effectRange": "Cavalry Attack +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 9,
    "prereqs": [
      {
        "techId": "weapons-prep-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 81000,
          "wood": 81000,
          "stone": 16000,
          "iron": 4000,
          "gold": 960
        },
        "timeSeconds": 1800,
        "power": 6125,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 9
      },
      {
        "level": 2,
        "cost": {
          "bread": 110000,
          "wood": 110000,
          "stone": 22000,
          "iron": 5600,
          "gold": 1300
        },
        "timeSeconds": 2700,
        "power": 12200,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 10
      },
      {
        "level": 3,
        "cost": {
          "bread": 240000,
          "wood": 240000,
          "stone": 48000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 11
      }
    ]
  },
  {
    "id": "cavalry-charge-iii",
    "name": "Cavalry Charge III",
    "category": "Cavalry Charge",
    "desc": "Enhances Cavalry Attack",
    "effectRange": "Cavalry Attack +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 14,
    "prereqs": [
      {
        "techId": "weapons-prep-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 250000,
          "wood": 250000,
          "stone": 51000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 2,
        "cost": {
          "bread": 330000,
          "wood": 330000,
          "stone": 67000,
          "iron": 16000,
          "gold": 3700
        },
        "timeSeconds": 8640,
        "power": 17500,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 3,
        "cost": {
          "bread": 440000,
          "wood": 440000,
          "stone": 88000,
          "iron": 22000,
          "gold": 4800
        },
        "timeSeconds": 14400,
        "power": 26200,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 51000,
          "gold": 11000
        },
        "timeSeconds": 43200,
        "power": 40200,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "cavalry-charge-iv",
    "name": "Cavalry Charge IV",
    "category": "Cavalry Charge",
    "desc": "Enhances Cavalry Attack",
    "effectRange": "Cavalry Attack +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 19,
    "prereqs": [
      {
        "techId": "weapons-prep-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 740000,
          "wood": 740000,
          "stone": 140000,
          "iron": 37000,
          "gold": 9600
        },
        "timeSeconds": 48000,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 2,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 62400,
        "power": 28000,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 3,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 52000,
          "gold": 13000
        },
        "timeSeconds": 96000,
        "power": 42000,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 4,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 67000,
          "gold": 17000
        },
        "timeSeconds": 144000,
        "power": 56000,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 5,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 550000,
          "iron": 130000,
          "gold": 35000
        },
        "timeSeconds": 360000,
        "power": 78800,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "cavalry-charge-v",
    "name": "Cavalry Charge V",
    "category": "Cavalry Charge",
    "desc": "Enhances Cavalry Attack",
    "effectRange": "Cavalry Attack +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 24,
    "prereqs": [
      {
        "techId": "weapons-prep-v",
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
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 16600,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 2,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 66000,
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 33200,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 25
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
        "timeSeconds": 330000,
        "power": 49900,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 4,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 310000,
          "iron": 79000,
          "gold": 46000
        },
        "timeSeconds": 525000,
        "power": 66500,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 370000,
          "iron": 92000,
          "gold": 53000
        },
        "timeSeconds": 630000,
        "power": 83100,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 6,
        "cost": {
          "bread": 3600000,
          "wood": 3600000,
          "stone": 730000,
          "iron": 180000,
          "gold": 100000
        },
        "timeSeconds": 1500000,
        "power": 111100,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "cavalry-charge-vi",
    "name": "Cavalry Charge VI",
    "category": "Cavalry Charge",
    "desc": "Enhances Cavalry Attack",
    "effectRange": "Cavalry Attack +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "weapons-prep-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 38500,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
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
        "timeSeconds": 1584000,
        "power": 57800,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 5500000,
          "wood": 5500000,
          "stone": 1100000,
          "iron": 270000,
          "gold": 92000
        },
        "timeSeconds": 2520000,
        "power": 77000,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 6500000,
          "wood": 6500000,
          "stone": 1300000,
          "iron": 320000,
          "gold": 100000
        },
        "timeSeconds": 3024000,
        "power": 96200,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 12000000,
          "wood": 12000000,
          "stone": 2500000,
          "iron": 640000,
          "gold": 210000
        },
        "timeSeconds": 7200000,
        "power": 127800,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "fortified-mail-i",
    "name": "Fortified Mail I",
    "category": "Fortified Mail",
    "desc": "Enhances Cavalry Health",
    "effectRange": "Cavalry Health +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 7,
    "prereqs": [
      {
        "techId": "lance-upgrade-i",
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
        "power": 3000,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 7
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
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 8
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
        "timeSeconds": 420,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 9
      }
    ]
  },
  {
    "id": "fortified-mail-ii",
    "name": "Fortified Mail II",
    "category": "Fortified Mail",
    "desc": "Enhances Cavalry Health",
    "effectRange": "Cavalry Health +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "lance-upgrade-ii",
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
        "timeSeconds": 0,
        "power": 4200,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 12
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
        "timeSeconds": 1800,
        "power": 8400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 13
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
        "timeSeconds": 4800,
        "power": 13200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "fortified-mail-iii",
    "name": "Fortified Mail III",
    "category": "Fortified Mail",
    "desc": "Enhances Cavalry Health",
    "effectRange": "Cavalry Health +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "lance-upgrade-iii",
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
        "timeSeconds": 4800,
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 220000,
          "wood": 220000,
          "stone": 44000,
          "iron": 11000,
          "gold": 2400
        },
        "timeSeconds": 5760,
        "power": 12000,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 290000,
          "wood": 290000,
          "stone": 58000,
          "iron": 14000,
          "gold": 3200
        },
        "timeSeconds": 9600,
        "power": 18000,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 4,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 7600
        },
        "timeSeconds": 28800,
        "power": 27600,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "fortified-mail-iv",
    "name": "Fortified Mail IV",
    "category": "Fortified Mail",
    "desc": "Enhances Cavalry Health",
    "effectRange": "Cavalry Health +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "lance-upgrade-iv",
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
        "timeSeconds": 31980,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 590000,
          "wood": 590000,
          "stone": 110000,
          "iron": 29000,
          "gold": 7600
        },
        "timeSeconds": 41580,
        "power": 19200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 8900
        },
        "timeSeconds": 63960,
        "power": 28800,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 4,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 96000,
        "power": 38400,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 360000,
          "iron": 91000,
          "gold": 23000
        },
        "timeSeconds": 240000,
        "power": 54000,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 26
      }
    ]
  },
  {
    "id": "fortified-mail-v",
    "name": "Fortified Mail V",
    "category": "Fortified Mail",
    "desc": "Enhances Cavalry Health",
    "effectRange": "Cavalry Health +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "lance-upgrade-v",
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
        "timeSeconds": 199980,
        "power": 11400,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 199980,
        "power": 22800,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 3,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 219960,
        "power": 34200,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 210000,
          "iron": 53000,
          "gold": 30000
        },
        "timeSeconds": 349980,
        "power": 45600,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 61000,
          "gold": 35000
        },
        "timeSeconds": 420000,
        "power": 57000,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 2400000,
          "wood": 2400000,
          "stone": 480000,
          "iron": 120000,
          "gold": 70000
        },
        "timeSeconds": 999960,
        "power": 76200,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "picket-lines-i",
    "name": "Picket Lines I",
    "category": "Picket Lines",
    "desc": "Enhances Archer Defense",
    "effectRange": "Archer Defense +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "precision-targeting-i",
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
        "power": 3000,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 4
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
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 5
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
        "timeSeconds": 420,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "picket-lines-ii",
    "name": "Picket Lines II",
    "category": "Picket Lines",
    "desc": "Enhances Archer Defense",
    "effectRange": "Archer Defense +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 9,
    "prereqs": [
      {
        "techId": "precision-targeting-ii",
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
        "timeSeconds": 0,
        "power": 4200,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 9
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
        "timeSeconds": 1800,
        "power": 8400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 10
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
        "timeSeconds": 4800,
        "power": 13200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 11
      }
    ]
  },
  {
    "id": "picket-lines-iii",
    "name": "Picket Lines III",
    "category": "Picket Lines",
    "desc": "Enhances Archer Defense",
    "effectRange": "Archer Defense +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 14,
    "prereqs": [
      {
        "techId": "precision-targeting-iii",
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
        "timeSeconds": 4800,
        "power": 6000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 2,
        "cost": {
          "bread": 220000,
          "wood": 220000,
          "stone": 44000,
          "iron": 11000,
          "gold": 2400
        },
        "timeSeconds": 5760,
        "power": 12000,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 3,
        "cost": {
          "bread": 290000,
          "wood": 290000,
          "stone": 58000,
          "iron": 14000,
          "gold": 3200
        },
        "timeSeconds": 9600,
        "power": 18000,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 4,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 7600
        },
        "timeSeconds": 28800,
        "power": 27600,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "picket-lines-iv",
    "name": "Picket Lines IV",
    "category": "Picket Lines",
    "desc": "Enhances Archer Defense",
    "effectRange": "Archer Defense +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 19,
    "prereqs": [
      {
        "techId": "precision-targeting-iv",
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
        "timeSeconds": 31980,
        "power": 9600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 2,
        "cost": {
          "bread": 590000,
          "wood": 590000,
          "stone": 110000,
          "iron": 29000,
          "gold": 7600
        },
        "timeSeconds": 41580,
        "power": 19200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 3,
        "cost": {
          "bread": 690000,
          "wood": 690000,
          "stone": 130000,
          "iron": 34000,
          "gold": 8900
        },
        "timeSeconds": 63960,
        "power": 28800,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 4,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 96000,
        "power": 38400,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 360000,
          "iron": 91000,
          "gold": 23000
        },
        "timeSeconds": 240000,
        "power": 54000,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "picket-lines-v",
    "name": "Picket Lines V",
    "category": "Picket Lines",
    "desc": "Enhances Archer Defense",
    "effectRange": "Archer Defense +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 24,
    "prereqs": [
      {
        "techId": "precision-targeting-v",
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
        "timeSeconds": 199980,
        "power": 11400,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 2,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 199980,
        "power": 22800,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 3,
        "cost": {
          "bread": 880000,
          "wood": 880000,
          "stone": 170000,
          "iron": 44000,
          "gold": 25000
        },
        "timeSeconds": 219960,
        "power": 34200,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 210000,
          "iron": 53000,
          "gold": 30000
        },
        "timeSeconds": 349980,
        "power": 45600,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 5,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 61000,
          "gold": 35000
        },
        "timeSeconds": 420000,
        "power": 57000,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 6,
        "cost": {
          "bread": 2400000,
          "wood": 2400000,
          "stone": 480000,
          "iron": 120000,
          "gold": 70000
        },
        "timeSeconds": 999960,
        "power": 76200,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "picket-lines-vi",
    "name": "Picket Lines VI",
    "category": "Picket Lines",
    "desc": "Enhances Archer Defense",
    "effectRange": "Archer Defense +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "precision-targeting-vi",
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
        "timeSeconds": 960000,
        "power": 13200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 960000,
        "power": 26400,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 0,
          "wood": 0,
          "stone": 0,
          "iron": 0,
          "gold": 0
        },
        "timeSeconds": 1056000,
        "power": 39600,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 3700000,
          "wood": 3700000,
          "stone": 740000,
          "iron": 180000,
          "gold": 61000
        },
        "timeSeconds": 1680000,
        "power": 52800,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 4300000,
          "wood": 4300000,
          "stone": 870000,
          "iron": 210000,
          "gold": 71000
        },
        "timeSeconds": 2016000,
        "power": 66000,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 8500000,
          "wood": 8500000,
          "stone": 1700000,
          "iron": 420000,
          "gold": 140000
        },
        "timeSeconds": 4800000,
        "power": 87600,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "precision-targeting-i",
    "name": "Precision Targeting I",
    "category": "Precision Targeting",
    "desc": "Enhances Archer Attack",
    "effectRange": "Archer Attack +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "weapons-prep-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8100,
          "wood": 8100,
          "stone": 1600,
          "iron": 400,
          "gold": 480
        },
        "timeSeconds": 120,
        "power": 4375,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 4
      },
      {
        "level": 2,
        "cost": {
          "bread": 11000,
          "wood": 11000,
          "stone": 2200,
          "iron": 560,
          "gold": 670
        },
        "timeSeconds": 240,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 5
      },
      {
        "level": 3,
        "cost": {
          "bread": 24000,
          "wood": 24000,
          "stone": 4800,
          "iron": 1200,
          "gold": 1400
        },
        "timeSeconds": 600,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "precision-targeting-ii",
    "name": "Precision Targeting II",
    "category": "Precision Targeting",
    "desc": "Enhances Archer Attack",
    "effectRange": "Archer Attack +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 9,
    "prereqs": [
      {
        "techId": "weapons-prep-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 81000,
          "wood": 81000,
          "stone": 16000,
          "iron": 4000,
          "gold": 960
        },
        "timeSeconds": 1800,
        "power": 6125,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 9
      },
      {
        "level": 2,
        "cost": {
          "bread": 110000,
          "wood": 110000,
          "stone": 22000,
          "iron": 5600,
          "gold": 1300
        },
        "timeSeconds": 2700,
        "power": 12200,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 10
      },
      {
        "level": 3,
        "cost": {
          "bread": 240000,
          "wood": 240000,
          "stone": 48000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 11
      }
    ]
  },
  {
    "id": "precision-targeting-iii",
    "name": "Precision Targeting III",
    "category": "Precision Targeting",
    "desc": "Enhances Archer Attack",
    "effectRange": "Archer Attack +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 14,
    "prereqs": [
      {
        "techId": "weapons-prep-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 250000,
          "wood": 250000,
          "stone": 51000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 2,
        "cost": {
          "bread": 330000,
          "wood": 330000,
          "stone": 67000,
          "iron": 16000,
          "gold": 3700
        },
        "timeSeconds": 8640,
        "power": 17500,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 3,
        "cost": {
          "bread": 440000,
          "wood": 440000,
          "stone": 88000,
          "iron": 22000,
          "gold": 4800
        },
        "timeSeconds": 14400,
        "power": 26200,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 51000,
          "gold": 11000
        },
        "timeSeconds": 43200,
        "power": 40200,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "precision-targeting-iv",
    "name": "Precision Targeting IV",
    "category": "Precision Targeting",
    "desc": "Enhances Archer Attack",
    "effectRange": "Archer Attack +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 19,
    "prereqs": [
      {
        "techId": "weapons-prep-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 740000,
          "wood": 740000,
          "stone": 140000,
          "iron": 37000,
          "gold": 9600
        },
        "timeSeconds": 48000,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 2,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 62400,
        "power": 28000,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 3,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 52000,
          "gold": 13000
        },
        "timeSeconds": 96000,
        "power": 42000,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 4,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 67000,
          "gold": 17000
        },
        "timeSeconds": 144000,
        "power": 56000,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 5,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 550000,
          "iron": 130000,
          "gold": 35000
        },
        "timeSeconds": 360000,
        "power": 78800,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "precision-targeting-v",
    "name": "Precision Targeting V",
    "category": "Precision Targeting",
    "desc": "Enhances Archer Attack",
    "effectRange": "Archer Attack +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 24,
    "prereqs": [
      {
        "techId": "weapons-prep-v",
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
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 16600,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 2,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 66000,
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 33200,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 25
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
        "timeSeconds": 330000,
        "power": 49900,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 4,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 310000,
          "iron": 79000,
          "gold": 46000
        },
        "timeSeconds": 525000,
        "power": 66500,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 370000,
          "iron": 92000,
          "gold": 53000
        },
        "timeSeconds": 630000,
        "power": 83100,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 6,
        "cost": {
          "bread": 3600000,
          "wood": 3600000,
          "stone": 730000,
          "iron": 180000,
          "gold": 100000
        },
        "timeSeconds": 1500000,
        "power": 111100,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "precision-targeting-vi",
    "name": "Precision Targeting VI",
    "category": "Precision Targeting",
    "desc": "Enhances Archer Attack",
    "effectRange": "Archer Attack +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "weapons-prep-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 38500,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
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
        "timeSeconds": 1584000,
        "power": 57800,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 5500000,
          "wood": 5500000,
          "stone": 1100000,
          "iron": 270000,
          "gold": 92000
        },
        "timeSeconds": 2520000,
        "power": 77000,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 6500000,
          "wood": 6500000,
          "stone": 1300000,
          "iron": 320000,
          "gold": 100000
        },
        "timeSeconds": 3024000,
        "power": 96200,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 12000000,
          "wood": 12000000,
          "stone": 2500000,
          "iron": 640000,
          "gold": 210000
        },
        "timeSeconds": 7200000,
        "power": 127800,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "fortified-mail-vi",
    "name": "Fortified Mail VI",
    "category": "Fortified Mail",
    "desc": "Enhances Cavalry Health",
    "effectRange": "Cavalry Health +5.25% to +35.25%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "lance-upgrade-vi",
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
          "gold": 51000
        },
        "timeSeconds": 960000,
        "power": 13200,
        "effectValue": 5.25,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 3100000,
          "wood": 3100000,
          "stone": 620000,
          "iron": 150000,
          "gold": 51000
        },
        "timeSeconds": 960000,
        "power": 13200,
        "effectValue": 10.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 3100000,
          "wood": 3100000,
          "stone": 620000,
          "iron": 150000,
          "gold": 51000
        },
        "timeSeconds": 1056000,
        "power": 13200,
        "effectValue": 15.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 3700000,
          "wood": 3700000,
          "stone": 740000,
          "iron": 180000,
          "gold": 61000
        },
        "timeSeconds": 1680000,
        "power": 13200,
        "effectValue": 21,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 4300000,
          "wood": 4300000,
          "stone": 870000,
          "iron": 210000,
          "gold": 71000
        },
        "timeSeconds": 2016000,
        "power": 13200,
        "effectValue": 26.25,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 8500000,
          "wood": 8500000,
          "stone": 1700000,
          "iron": 420000,
          "gold": 140000
        },
        "timeSeconds": 4800000,
        "power": 21600,
        "effectValue": 35.25,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "regimental-expansion-i",
    "name": "Regimental Expansion I",
    "category": "Regimental Expansion",
    "desc": "Increases the size of armies that can be sent in a single Expedition",
    "effectRange": "Squads' Deployment Capacity +320 to +1,000",
    "maxLevel": 3,
    "unlockAcademyLevel": 6,
    "prereqs": [
      {
        "techId": "survival-techniques-i",
        "level": 1
      },
      {
        "techId": "assault-techniques-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 9400,
          "wood": 9400,
          "stone": 1800,
          "iron": 470,
          "gold": 560
        },
        "timeSeconds": 180,
        "power": 5760,
        "effectValue": 320,
        "effectIsPercent": false,
        "academyLevel": 6
      },
      {
        "level": 2,
        "cost": {
          "bread": 13000,
          "wood": 13000,
          "stone": 2600,
          "iron": 660,
          "gold": 780
        },
        "timeSeconds": 300,
        "power": 11500,
        "effectValue": 640,
        "effectIsPercent": false,
        "academyLevel": 7
      },
      {
        "level": 3,
        "cost": {
          "bread": 28000,
          "wood": 28000,
          "stone": 5600,
          "iron": 1400,
          "gold": 1600
        },
        "timeSeconds": 840,
        "power": 18000,
        "effectValue": 1000,
        "effectIsPercent": false,
        "academyLevel": 8
      }
    ]
  },
  {
    "id": "regimental-expansion-ii",
    "name": "Regimental Expansion II",
    "category": "Regimental Expansion",
    "desc": "Increases the size of armies that can be sent in a single Expedition",
    "effectRange": "Squads' Deployment Capacity +320 to +1,400",
    "maxLevel": 3,
    "unlockAcademyLevel": 11,
    "prereqs": [
      {
        "techId": "survival-techniques-ii",
        "level": 1
      },
      {
        "techId": "assault-techniques-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 94000,
          "wood": 94000,
          "stone": 18000,
          "iron": 4700,
          "gold": 1100
        },
        "timeSeconds": 2400,
        "power": 5760,
        "effectValue": 320,
        "effectIsPercent": false,
        "academyLevel": 11
      },
      {
        "level": 2,
        "cost": {
          "bread": 130000,
          "wood": 130000,
          "stone": 26000,
          "iron": 6600,
          "gold": 1500
        },
        "timeSeconds": 3600,
        "power": 11500,
        "effectValue": 640,
        "effectIsPercent": false,
        "academyLevel": 12
      },
      {
        "level": 3,
        "cost": {
          "bread": 280000,
          "wood": 280000,
          "stone": 56000,
          "iron": 14000,
          "gold": 3300
        },
        "timeSeconds": 9600,
        "power": 25200,
        "effectValue": 1400,
        "effectIsPercent": false,
        "academyLevel": 13
      }
    ]
  },
  {
    "id": "regimental-expansion-iii",
    "name": "Regimental Expansion III",
    "category": "Regimental Expansion",
    "desc": "Increases the size of armies that can be sent in a single Expedition",
    "effectRange": "Squads' Deployment Capacity +620 to +2,800",
    "maxLevel": 4,
    "unlockAcademyLevel": 16,
    "prereqs": [
      {
        "techId": "survival-techniques-iii",
        "level": 1
      },
      {
        "techId": "assault-techniques-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 300000,
          "wood": 300000,
          "stone": 60000,
          "iron": 15000,
          "gold": 3300
        },
        "timeSeconds": 9600,
        "power": 11200,
        "effectValue": 620,
        "effectIsPercent": false,
        "academyLevel": 16
      },
      {
        "level": 2,
        "cost": {
          "bread": 390000,
          "wood": 390000,
          "stone": 78000,
          "iron": 19000,
          "gold": 4300
        },
        "timeSeconds": 11520,
        "power": 21600,
        "effectValue": 1200,
        "effectIsPercent": false,
        "academyLevel": 17
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
        "timeSeconds": 19200,
        "power": 32400,
        "effectValue": 1800,
        "effectIsPercent": false,
        "academyLevel": 18
      },
      {
        "level": 4,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 60000,
          "gold": 13000
        },
        "timeSeconds": 57600,
        "power": 50400,
        "effectValue": 2800,
        "effectIsPercent": false,
        "academyLevel": 19
      }
    ]
  },
  {
    "id": "regimental-expansion-iv",
    "name": "Regimental Expansion IV",
    "category": "Regimental Expansion",
    "desc": "Increases the size of armies that can be sent in a single Expedition",
    "effectRange": "Squads' Deployment Capacity +990 to +5,600",
    "maxLevel": 5,
    "unlockAcademyLevel": 21,
    "prereqs": [
      {
        "techId": "survival-techniques-iv",
        "level": 1
      },
      {
        "techId": "assault-techniques-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 860000,
          "wood": 860000,
          "stone": 170000,
          "iron": 43000,
          "gold": 11000
        },
        "timeSeconds": 63960,
        "power": 17800,
        "effectValue": 990,
        "effectIsPercent": false,
        "academyLevel": 21
      },
      {
        "level": 2,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 52000,
          "gold": 13000
        },
        "timeSeconds": 83160,
        "power": 34200,
        "effectValue": 1900,
        "effectIsPercent": false,
        "academyLevel": 22
      },
      {
        "level": 3,
        "cost": {
          "bread": 1200000,
          "wood": 1200000,
          "stone": 240000,
          "iron": 60000,
          "gold": 15000
        },
        "timeSeconds": 127980,
        "power": 52200,
        "effectValue": 2900,
        "effectIsPercent": false,
        "academyLevel": 23
      },
      {
        "level": 4,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 310000,
          "iron": 78000,
          "gold": 20000
        },
        "timeSeconds": 192000,
        "power": 70200,
        "effectValue": 3900,
        "effectIsPercent": false,
        "academyLevel": 24
      },
      {
        "level": 5,
        "cost": {
          "bread": 3200000,
          "wood": 3200000,
          "stone": 640000,
          "iron": 160000,
          "gold": 41000
        },
        "timeSeconds": 480000,
        "power": 100800,
        "effectValue": 5600,
        "effectIsPercent": false,
        "academyLevel": 25
      }
    ]
  },
  {
    "id": "regimental-expansion-v",
    "name": "Regimental Expansion V",
    "category": "Regimental Expansion",
    "desc": "Increases the size of armies that can be sent in a single Expedition",
    "effectRange": "Squads' Deployment Capacity +1,200 to +8,000",
    "maxLevel": 6,
    "unlockAcademyLevel": 26,
    "prereqs": [
      {
        "techId": "survival-techniques-v",
        "level": 1
      },
      {
        "techId": "assault-techniques-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 300000,
          "iron": 77000,
          "gold": 44000
        },
        "timeSeconds": 399960,
        "power": 21600,
        "effectValue": 1200,
        "effectIsPercent": false,
        "academyLevel": 26
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
        "timeSeconds": 399960,
        "power": 43200,
        "effectValue": 2400,
        "effectIsPercent": false,
        "academyLevel": 27
      },
      {
        "level": 3,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 300000,
          "iron": 77000,
          "gold": 44000
        },
        "timeSeconds": 439980,
        "power": 64800,
        "effectValue": 3600,
        "effectIsPercent": false,
        "academyLevel": 28
      },
      {
        "level": 4,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 370000,
          "iron": 92000,
          "gold": 53000
        },
        "timeSeconds": 699960,
        "power": 86400,
        "effectValue": 4800,
        "effectIsPercent": false,
        "academyLevel": 29
      },
      {
        "level": 5,
        "cost": {
          "bread": 2100000,
          "wood": 2100000,
          "stone": 430000,
          "iron": 100000,
          "gold": 62000
        },
        "timeSeconds": 840000,
        "power": 108000,
        "effectValue": 6000,
        "effectIsPercent": false,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 4200000,
          "wood": 4200000,
          "stone": 850000,
          "iron": 210000,
          "gold": 120000
        },
        "timeSeconds": 1999980,
        "power": 144000,
        "effectValue": 8000,
        "effectIsPercent": false,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "regimental-expansion-vi",
    "name": "Regimental Expansion VI",
    "category": "Regimental Expansion",
    "desc": "Increases the size of armies that can be sent in a single Expedition",
    "effectRange": "Squads' Deployment Capacity +2,000 to +13.4K",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "survival-techniques-vi",
        "level": 1
      },
      {
        "techId": "assault-techniques-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5400000,
          "wood": 5400000,
          "stone": 1000000,
          "iron": 270000,
          "gold": 89000
        },
        "timeSeconds": 1920000,
        "power": 36000,
        "effectValue": 2000,
        "effectIsPercent": false,
        "academyLevel": 30
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
        "timeSeconds": 1920000,
        "power": 72000,
        "effectValue": 4000,
        "effectIsPercent": false,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 5400000,
          "wood": 5400000,
          "stone": 1000000,
          "iron": 270000,
          "gold": 89000
        },
        "timeSeconds": 2112000,
        "power": 108000,
        "effectValue": 6000,
        "effectIsPercent": false,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 6500000,
          "wood": 6500000,
          "stone": 1300000,
          "iron": 320000,
          "gold": 100000
        },
        "timeSeconds": 3360000,
        "power": 144000,
        "effectValue": 8000,
        "effectIsPercent": false,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 7600000,
          "wood": 7600000,
          "stone": 1500000,
          "iron": 380000,
          "gold": 120000
        },
        "timeSeconds": 4032000,
        "power": 180000,
        "effectValue": 10000,
        "effectIsPercent": false,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 14000000,
          "wood": 14000000,
          "stone": 2900000,
          "iron": 740000,
          "gold": 240000
        },
        "timeSeconds": 9600000,
        "power": 241200,
        "effectValue": 13400,
        "effectIsPercent": false,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "reprisal-tactics-i",
    "name": "Reprisal Tactics I",
    "category": "Reprisal Tactics",
    "desc": "Enhances Infantry Attack",
    "effectRange": "Infantry Attack +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 4,
    "prereqs": [
      {
        "techId": "weapons-prep-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 3300,
          "wood": 3300,
          "stone": 670,
          "iron": 160,
          "gold": 200
        },
        "timeSeconds": 60,
        "power": 1750,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 4
      },
      {
        "level": 2,
        "cost": {
          "bread": 4700,
          "wood": 4700,
          "stone": 940,
          "iron": 230,
          "gold": 280
        },
        "timeSeconds": 60,
        "power": 3500,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 5
      },
      {
        "level": 3,
        "cost": {
          "bread": 10000,
          "wood": 10000,
          "stone": 2000,
          "iron": 500,
          "gold": 600
        },
        "timeSeconds": 240,
        "power": 5600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 6
      }
    ]
  },
  {
    "id": "reprisal-tactics-ii",
    "name": "Reprisal Tactics II",
    "category": "Reprisal Tactics",
    "desc": "Enhances Infantry Attack",
    "effectRange": "Infantry Attack +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 9,
    "prereqs": [
      {
        "techId": "weapons-prep-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 33000,
          "wood": 33000,
          "stone": 6700,
          "iron": 1600,
          "gold": 400
        },
        "timeSeconds": 720,
        "power": 2450,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 9
      },
      {
        "level": 2,
        "cost": {
          "bread": 47000,
          "wood": 47000,
          "stone": 9400,
          "iron": 2300,
          "gold": 560
        },
        "timeSeconds": 1080,
        "power": 4900,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 10
      },
      {
        "level": 3,
        "cost": {
          "bread": 100000,
          "wood": 100000,
          "stone": 20000,
          "iron": 5000,
          "gold": 1200
        },
        "timeSeconds": 3000,
        "power": 7700,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 11
      }
    ]
  },
  {
    "id": "reprisal-tactics-iii",
    "name": "Reprisal Tactics III",
    "category": "Reprisal Tactics",
    "desc": "Enhances Infantry Attack",
    "effectRange": "Infantry Attack +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 14,
    "prereqs": [
      {
        "techId": "weapons-prep-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 100000,
          "wood": 100000,
          "stone": 21000,
          "iron": 5400,
          "gold": 1200
        },
        "timeSeconds": 3000,
        "power": 3500,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 2,
        "cost": {
          "bread": 140000,
          "wood": 140000,
          "stone": 28000,
          "iron": 7000,
          "gold": 1500
        },
        "timeSeconds": 3600,
        "power": 7000,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 3,
        "cost": {
          "bread": 180000,
          "wood": 180000,
          "stone": 36000,
          "iron": 9100,
          "gold": 2000
        },
        "timeSeconds": 6000,
        "power": 10500,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 4,
        "cost": {
          "bread": 430000,
          "wood": 430000,
          "stone": 86000,
          "iron": 21000,
          "gold": 4800
        },
        "timeSeconds": 18000,
        "power": 16100,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 17
      }
    ]
  },
  {
    "id": "reprisal-tactics-iv",
    "name": "Reprisal Tactics IV",
    "category": "Reprisal Tactics",
    "desc": "Enhances Infantry Attack",
    "effectRange": "Infantry Attack +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 19,
    "prereqs": [
      {
        "techId": "weapons-prep-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 310000,
          "wood": 310000,
          "stone": 62000,
          "iron": 15000,
          "gold": 4000
        },
        "timeSeconds": 19980,
        "power": 5600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 2,
        "cost": {
          "bread": 370000,
          "wood": 370000,
          "stone": 74000,
          "iron": 18000,
          "gold": 4800
        },
        "timeSeconds": 25980,
        "power": 11200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 3,
        "cost": {
          "bread": 430000,
          "wood": 430000,
          "stone": 86000,
          "iron": 21000,
          "gold": 5600
        },
        "timeSeconds": 39960,
        "power": 16800,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 4,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 7200
        },
        "timeSeconds": 60000,
        "power": 22400,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 5,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 57000,
          "gold": 14000
        },
        "timeSeconds": 150000,
        "power": 31500,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 23
      }
    ]
  },
  {
    "id": "reprisal-tactics-v",
    "name": "Reprisal Tactics V",
    "category": "Reprisal Tactics",
    "desc": "Enhances Infantry Attack",
    "effectRange": "Infantry Attack +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 24,
    "prereqs": [
      {
        "techId": "weapons-prep-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 16000
        },
        "timeSeconds": 124980,
        "power": 6650,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 2,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 16000
        },
        "timeSeconds": 124980,
        "power": 13300,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 3,
        "cost": {
          "bread": 550000,
          "wood": 550000,
          "stone": 110000,
          "iron": 27000,
          "gold": 16000
        },
        "timeSeconds": 137460,
        "power": 19900,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 4,
        "cost": {
          "bread": 660000,
          "wood": 660000,
          "stone": 130000,
          "iron": 33000,
          "gold": 19000
        },
        "timeSeconds": 218700,
        "power": 26600,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 5,
        "cost": {
          "bread": 770000,
          "wood": 770000,
          "stone": 150000,
          "iron": 38000,
          "gold": 22000
        },
        "timeSeconds": 262500,
        "power": 33200,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 6,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 300000,
          "iron": 76000,
          "gold": 44000
        },
        "timeSeconds": 624960,
        "power": 44500,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 29
      }
    ]
  },
  {
    "id": "reprisal-tactics-vi",
    "name": "Reprisal Tactics VI",
    "category": "Reprisal Tactics",
    "desc": "Enhances Infantry Attack",
    "effectRange": "Infantry Attack +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 29,
    "prereqs": [
      {
        "techId": "weapons-prep-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 380000,
          "iron": 97000,
          "gold": 32000
        },
        "timeSeconds": 600000,
        "power": 7700,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 2,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 380000,
          "iron": 97000,
          "gold": 32000
        },
        "timeSeconds": 600000,
        "power": 15400,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 1900000,
          "wood": 1900000,
          "stone": 380000,
          "iron": 97000,
          "gold": 32000
        },
        "timeSeconds": 660000,
        "power": 23100,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 2300000,
          "wood": 2300000,
          "stone": 460000,
          "iron": 110000,
          "gold": 38000
        },
        "timeSeconds": 1050000,
        "power": 30800,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 540000,
          "iron": 130000,
          "gold": 44000
        },
        "timeSeconds": 1260000,
        "power": 38500,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 5300000,
          "wood": 5300000,
          "stone": 1000000,
          "iron": 260000,
          "gold": 88000
        },
        "timeSeconds": 3000000,
        "power": 51100,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "special-defensive-training-i",
    "name": "Special Defensive Training I",
    "category": "Special Defensive Training",
    "desc": "Enhances all Squads' Defense.",
    "effectRange": "Squads' Defense +0.5% to +1.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 5,
    "prereqs": [
      {
        "techId": "defensive-formations-i",
        "level": 1
      },
      {
        "techId": "picket-lines-i",
        "level": 1
      },
      {
        "techId": "bulwark-formations-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8700,
          "wood": 8700,
          "stone": 1700,
          "iron": 430,
          "gold": 520
        },
        "timeSeconds": 120,
        "power": 4200,
        "effectValue": 0.5,
        "effectIsPercent": true,
        "academyLevel": 5
      },
      {
        "level": 2,
        "cost": {
          "bread": 12000,
          "wood": 12000,
          "stone": 2400,
          "iron": 610,
          "gold": 720
        },
        "timeSeconds": 240,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 6
      },
      {
        "level": 3,
        "cost": {
          "bread": 26000,
          "wood": 26000,
          "stone": 5200,
          "iron": 1300,
          "gold": 1500
        },
        "timeSeconds": 660,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 7
      }
    ]
  },
  {
    "id": "special-defensive-training-ii",
    "name": "Special Defensive Training II",
    "category": "Special Defensive Training",
    "desc": "Enhances all Squads' Defense.",
    "effectRange": "Squads' Defense +0.75% to +2.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 10,
    "prereqs": [
      {
        "techId": "defensive-formations-ii",
        "level": 1
      },
      {
        "techId": "picket-lines-ii",
        "level": 1
      },
      {
        "techId": "bulwark-formations-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 87000,
          "wood": 87000,
          "stone": 17000,
          "iron": 4300,
          "gold": 1000
        },
        "timeSeconds": 1920,
        "power": 6300,
        "effectValue": 0.75,
        "effectIsPercent": true,
        "academyLevel": 10
      },
      {
        "level": 2,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 24000,
          "iron": 6100,
          "gold": 1400
        },
        "timeSeconds": 2880,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 11
      },
      {
        "level": 3,
        "cost": {
          "bread": 260000,
          "wood": 260000,
          "stone": 52000,
          "iron": 13000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 21000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 12
      }
    ]
  },
  {
    "id": "special-defensive-training-iii",
    "name": "Special Defensive Training III",
    "category": "Special Defensive Training",
    "desc": "Enhances all Squads' Defense.",
    "effectRange": "Squads' Defense +1% to +4.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 15,
    "prereqs": [
      {
        "techId": "defensive-formations-iii",
        "level": 1
      },
      {
        "techId": "picket-lines-iii",
        "level": 1
      },
      {
        "techId": "bulwark-formations-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 280000,
          "wood": 280000,
          "stone": 56000,
          "iron": 14000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 2,
        "cost": {
          "bread": 360000,
          "wood": 360000,
          "stone": 73000,
          "iron": 18000,
          "gold": 4000
        },
        "timeSeconds": 9360,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 3,
        "cost": {
          "bread": 470000,
          "wood": 470000,
          "stone": 95000,
          "iron": 23000,
          "gold": 5300
        },
        "timeSeconds": 15600,
        "power": 25200,
        "effectValue": 3,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 4,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 12000
        },
        "timeSeconds": 46800,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "special-defensive-training-iv",
    "name": "Special Defensive Training IV",
    "category": "Special Defensive Training",
    "desc": "Enhances all Squads' Defense.",
    "effectRange": "Squads' Defense +1.75% to +10%",
    "maxLevel": 5,
    "unlockAcademyLevel": 20,
    "prereqs": [
      {
        "techId": "defensive-formations-iv",
        "level": 1
      },
      {
        "techId": "picket-lines-iv",
        "level": 1
      },
      {
        "techId": "bulwark-formations-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 800000,
          "wood": 800000,
          "stone": 160000,
          "iron": 40000,
          "gold": 10000
        },
        "timeSeconds": 51960,
        "power": 14700,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 2,
        "cost": {
          "bread": 960000,
          "wood": 960000,
          "stone": 190000,
          "iron": 48000,
          "gold": 12000
        },
        "timeSeconds": 67560,
        "power": 29400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 14000
        },
        "timeSeconds": 103980,
        "power": 44100,
        "effectValue": 5.25,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 4,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 290000,
          "iron": 72000,
          "gold": 18000
        },
        "timeSeconds": 156000,
        "power": 58800,
        "effectValue": 7,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 5,
        "cost": {
          "bread": 2900000,
          "wood": 2900000,
          "stone": 590000,
          "iron": 140000,
          "gold": 38000
        },
        "timeSeconds": 390000,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 24
      }
    ]
  },
  {
    "id": "special-defensive-training-v",
    "name": "Special Defensive Training V",
    "category": "Special Defensive Training",
    "desc": "Enhances all Squads' Defense.",
    "effectRange": "Squads' Defense +2% to +13.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 25,
    "prereqs": [
      {
        "techId": "defensive-formations-v",
        "level": 1
      },
      {
        "techId": "picket-lines-v",
        "level": 1
      },
      {
        "techId": "bulwark-formations-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 2,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 33600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 3,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 357480,
        "power": 50400,
        "effectValue": 6,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 4,
        "cost": {
          "bread": 1700000,
          "wood": 1700000,
          "stone": 340000,
          "iron": 86000,
          "gold": 49000
        },
        "timeSeconds": 568740,
        "power": 67200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 5,
        "cost": {
          "bread": 2000000,
          "wood": 2000000,
          "stone": 400000,
          "iron": 100000,
          "gold": 58000
        },
        "timeSeconds": 682500,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 6,
        "cost": {
          "bread": 3900000,
          "wood": 3900000,
          "stone": 790000,
          "iron": 190000,
          "gold": 110000
        },
        "timeSeconds": 1624980,
        "power": 113400,
        "effectValue": 13.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "special-defensive-training-vi",
    "name": "Special Defensive Training VI",
    "category": "Special Defensive Training",
    "desc": "Enhances all Squads' Defense.",
    "effectRange": "Squads' Defense +2.25% to +15.25%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "defensive-formations-vi",
        "level": 1
      },
      {
        "techId": "picket-lines-vi",
        "level": 1
      },
      {
        "techId": "bulwark-formations-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 18900,
        "effectValue": 2.25,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1716000,
        "power": 56700,
        "effectValue": 6.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 6000000,
          "wood": 6000000,
          "stone": 1200000,
          "iron": 300000,
          "gold": 99000
        },
        "timeSeconds": 2730000,
        "power": 75600,
        "effectValue": 9,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 7000000,
          "wood": 7000000,
          "stone": 1400000,
          "iron": 350000,
          "gold": 110000
        },
        "timeSeconds": 3276000,
        "power": 94500,
        "effectValue": 11.25,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 13000000,
          "wood": 13000000,
          "stone": 2700000,
          "iron": 690000,
          "gold": 220000
        },
        "timeSeconds": 7800000,
        "power": 128100,
        "effectValue": 15.25,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "survival-techniques-i",
    "name": "Survival Techniques I",
    "category": "Survival Techniques",
    "desc": "Enhances all Squads' Health.",
    "effectRange": "Squads' Health +0.5% to +1.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 5,
    "prereqs": [
      {
        "techId": "special-defensive-training-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8700,
          "wood": 8700,
          "stone": 1700,
          "iron": 430,
          "gold": 520
        },
        "timeSeconds": 120,
        "power": 4200,
        "effectValue": 0.5,
        "effectIsPercent": true,
        "academyLevel": 5
      },
      {
        "level": 2,
        "cost": {
          "bread": 12000,
          "wood": 12000,
          "stone": 2400,
          "iron": 610,
          "gold": 720
        },
        "timeSeconds": 240,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 6
      },
      {
        "level": 3,
        "cost": {
          "bread": 26000,
          "wood": 26000,
          "stone": 5200,
          "iron": 1300,
          "gold": 1500
        },
        "timeSeconds": 660,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 7
      }
    ]
  },
  {
    "id": "survival-techniques-ii",
    "name": "Survival Techniques II",
    "category": "Survival Techniques",
    "desc": "Enhances all Squads' Health.",
    "effectRange": "Squads' Health +0.75% to +2.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 10,
    "prereqs": [
      {
        "techId": "special-defensive-training-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 87000,
          "wood": 87000,
          "stone": 17000,
          "iron": 4300,
          "gold": 1000
        },
        "timeSeconds": 1920,
        "power": 6300,
        "effectValue": 0.75,
        "effectIsPercent": true,
        "academyLevel": 10
      },
      {
        "level": 2,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 24000,
          "iron": 6100,
          "gold": 1400
        },
        "timeSeconds": 2880,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 11
      },
      {
        "level": 3,
        "cost": {
          "bread": 260000,
          "wood": 260000,
          "stone": 52000,
          "iron": 13000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 21000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 12
      }
    ]
  },
  {
    "id": "survival-techniques-iii",
    "name": "Survival Techniques III",
    "category": "Survival Techniques",
    "desc": "Enhances all Squads' Health.",
    "effectRange": "Squads' Health +1% to +4.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 15,
    "prereqs": [
      {
        "techId": "special-defensive-training-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 280000,
          "wood": 280000,
          "stone": 56000,
          "iron": 14000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 2,
        "cost": {
          "bread": 360000,
          "wood": 360000,
          "stone": 73000,
          "iron": 18000,
          "gold": 4000
        },
        "timeSeconds": 9360,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 16
      },
      {
        "level": 3,
        "cost": {
          "bread": 470000,
          "wood": 470000,
          "stone": 95000,
          "iron": 23000,
          "gold": 5300
        },
        "timeSeconds": 15600,
        "power": 25200,
        "effectValue": 3,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 4,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 12000
        },
        "timeSeconds": 46800,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 18
      }
    ]
  },
  {
    "id": "survival-techniques-iv",
    "name": "Survival Techniques IV",
    "category": "Survival Techniques",
    "desc": "Enhances all Squads' Health.",
    "effectRange": "Squads' Health +1.75% to +10%",
    "maxLevel": 5,
    "unlockAcademyLevel": 20,
    "prereqs": [
      {
        "techId": "special-defensive-training-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 800000,
          "wood": 800000,
          "stone": 160000,
          "iron": 40000,
          "gold": 10000
        },
        "timeSeconds": 51960,
        "power": 14700,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 2,
        "cost": {
          "bread": 960000,
          "wood": 960000,
          "stone": 190000,
          "iron": 48000,
          "gold": 12000
        },
        "timeSeconds": 67560,
        "power": 29400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 14000
        },
        "timeSeconds": 103980,
        "power": 44100,
        "effectValue": 5.25,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 4,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 290000,
          "iron": 72000,
          "gold": 18000
        },
        "timeSeconds": 156000,
        "power": 58800,
        "effectValue": 7,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 5,
        "cost": {
          "bread": 2900000,
          "wood": 2900000,
          "stone": 590000,
          "iron": 140000,
          "gold": 38000
        },
        "timeSeconds": 390000,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 24
      }
    ]
  },
  {
    "id": "survival-techniques-v",
    "name": "Survival Techniques V",
    "category": "Survival Techniques",
    "desc": "Enhances all Squads' Health.",
    "effectRange": "Squads' Health +2% to +13.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 25,
    "prereqs": [
      {
        "techId": "special-defensive-training-v",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 2,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 33600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 3,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 357480,
        "power": 50400,
        "effectValue": 6,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 4,
        "cost": {
          "bread": 1700000,
          "wood": 1700000,
          "stone": 340000,
          "iron": 86000,
          "gold": 49000
        },
        "timeSeconds": 568740,
        "power": 67200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 5,
        "cost": {
          "bread": 2000000,
          "wood": 2000000,
          "stone": 400000,
          "iron": 100000,
          "gold": 58000
        },
        "timeSeconds": 682500,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 6,
        "cost": {
          "bread": 3900000,
          "wood": 3900000,
          "stone": 790000,
          "iron": 190000,
          "gold": 110000
        },
        "timeSeconds": 1624980,
        "power": 113400,
        "effectValue": 13.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "survival-techniques-vi",
    "name": "Survival Techniques VI",
    "category": "Survival Techniques",
    "desc": "Enhances all Squads' Health.",
    "effectRange": "Squads' Health +2.25% to +15.25%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "special-defensive-training-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 18900,
        "effectValue": 2.25,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 3,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1716000,
        "power": 56700,
        "effectValue": 6.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 6000000,
          "wood": 6000000,
          "stone": 1200000,
          "iron": 300000,
          "gold": 99000
        },
        "timeSeconds": 2730000,
        "power": 75600,
        "effectValue": 9,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 7000000,
          "wood": 7000000,
          "stone": 1400000,
          "iron": 350000,
          "gold": 110000
        },
        "timeSeconds": 3276000,
        "power": 94500,
        "effectValue": 11.25,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 13000000,
          "wood": 13000000,
          "stone": 2700000,
          "iron": 690000,
          "gold": 220000
        },
        "timeSeconds": 7800000,
        "power": 128100,
        "effectValue": 15.25,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "targeted-sniping-i",
    "name": "Targeted Sniping I",
    "category": "Targeted Sniping",
    "desc": "Enhances Archer Lethality",
    "effectRange": "Archer Lethality +1.25% to +4%",
    "maxLevel": 3,
    "unlockAcademyLevel": 7,
    "prereqs": [
      {
        "techId": "regimental-expansion-i",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8100,
          "wood": 8100,
          "stone": 1600,
          "iron": 400,
          "gold": 480
        },
        "timeSeconds": 120,
        "power": 4375,
        "effectValue": 1.25,
        "effectIsPercent": true,
        "academyLevel": 7
      },
      {
        "level": 2,
        "cost": {
          "bread": 11000,
          "wood": 11000,
          "stone": 2200,
          "iron": 560,
          "gold": 670
        },
        "timeSeconds": 240,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 8
      },
      {
        "level": 3,
        "cost": {
          "bread": 24000,
          "wood": 24000,
          "stone": 4800,
          "iron": 1200,
          "gold": 1400
        },
        "timeSeconds": 600,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 9
      }
    ]
  },
  {
    "id": "targeted-sniping-ii",
    "name": "Targeted Sniping II",
    "category": "Targeted Sniping",
    "desc": "Enhances Archer Lethality",
    "effectRange": "Archer Lethality +1.75% to +5.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 12,
    "prereqs": [
      {
        "techId": "regimental-expansion-ii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 81000,
          "wood": 81000,
          "stone": 16000,
          "iron": 4000,
          "gold": 960
        },
        "timeSeconds": 1800,
        "power": 6125,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 12
      },
      {
        "level": 2,
        "cost": {
          "bread": 110000,
          "wood": 110000,
          "stone": 22000,
          "iron": 5600,
          "gold": 1300
        },
        "timeSeconds": 2700,
        "power": 12200,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 13
      },
      {
        "level": 3,
        "cost": {
          "bread": 240000,
          "wood": 240000,
          "stone": 48000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 14
      }
    ]
  },
  {
    "id": "targeted-sniping-iii",
    "name": "Targeted Sniping III",
    "category": "Targeted Sniping",
    "desc": "Enhances Archer Lethality",
    "effectRange": "Archer Lethality +2.5% to +11.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 17,
    "prereqs": [
      {
        "techId": "regimental-expansion-iii",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 250000,
          "wood": 250000,
          "stone": 51000,
          "iron": 12000,
          "gold": 2800
        },
        "timeSeconds": 7200,
        "power": 8750,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 17
      },
      {
        "level": 2,
        "cost": {
          "bread": 330000,
          "wood": 330000,
          "stone": 67000,
          "iron": 16000,
          "gold": 3700
        },
        "timeSeconds": 8640,
        "power": 17500,
        "effectValue": 5,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 3,
        "cost": {
          "bread": 440000,
          "wood": 440000,
          "stone": 88000,
          "iron": 22000,
          "gold": 4800
        },
        "timeSeconds": 14400,
        "power": 26200,
        "effectValue": 7.5,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 4,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 51000,
          "gold": 11000
        },
        "timeSeconds": 43200,
        "power": 40200,
        "effectValue": 11.5,
        "effectIsPercent": true,
        "academyLevel": 20
      }
    ]
  },
  {
    "id": "targeted-sniping-iv",
    "name": "Targeted Sniping IV",
    "category": "Targeted Sniping",
    "desc": "Enhances Archer Lethality",
    "effectRange": "Archer Lethality +4% to +22.5%",
    "maxLevel": 5,
    "unlockAcademyLevel": 22,
    "prereqs": [
      {
        "techId": "regimental-expansion-iv",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 740000,
          "wood": 740000,
          "stone": 140000,
          "iron": 37000,
          "gold": 9600
        },
        "timeSeconds": 48000,
        "power": 14000,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 22
      },
      {
        "level": 2,
        "cost": {
          "bread": 890000,
          "wood": 890000,
          "stone": 170000,
          "iron": 44000,
          "gold": 11000
        },
        "timeSeconds": 62400,
        "power": 28000,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 3,
        "cost": {
          "bread": 1000000,
          "wood": 1000000,
          "stone": 200000,
          "iron": 52000,
          "gold": 13000
        },
        "timeSeconds": 96000,
        "power": 42000,
        "effectValue": 12,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 4,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 67000,
          "gold": 17000
        },
        "timeSeconds": 144000,
        "power": 56000,
        "effectValue": 16,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 5,
        "cost": {
          "bread": 2700000,
          "wood": 2700000,
          "stone": 550000,
          "iron": 130000,
          "gold": 35000
        },
        "timeSeconds": 360000,
        "power": 78800,
        "effectValue": 22.5,
        "effectIsPercent": true,
        "academyLevel": 26
      }
    ]
  },
  {
    "id": "targeted-sniping-v",
    "name": "Targeted Sniping V",
    "category": "Targeted Sniping",
    "desc": "Enhances Archer Lethality",
    "effectRange": "Archer Lethality +4.75% to +31.75%",
    "maxLevel": 6,
    "unlockAcademyLevel": 27,
    "prereqs": [
      {
        "techId": "regimental-expansion-v",
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
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 16600,
        "effectValue": 4.75,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 2,
        "cost": {
          "bread": 1300000,
          "wood": 1300000,
          "stone": 260000,
          "iron": 66000,
          "gold": 38000
        },
        "timeSeconds": 300000,
        "power": 33200,
        "effectValue": 9.5,
        "effectIsPercent": true,
        "academyLevel": 28
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
        "timeSeconds": 330000,
        "power": 49900,
        "effectValue": 14.25,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 4,
        "cost": {
          "bread": 1500000,
          "wood": 1500000,
          "stone": 310000,
          "iron": 79000,
          "gold": 46000
        },
        "timeSeconds": 525000,
        "power": 66500,
        "effectValue": 19,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 1800000,
          "wood": 1800000,
          "stone": 370000,
          "iron": 92000,
          "gold": 53000
        },
        "timeSeconds": 630000,
        "power": 83100,
        "effectValue": 23.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 3600000,
          "wood": 3600000,
          "stone": 730000,
          "iron": 180000,
          "gold": 100000
        },
        "timeSeconds": 1500000,
        "power": 111100,
        "effectValue": 31.75,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "targeted-sniping-vi",
    "name": "Targeted Sniping VI",
    "category": "Targeted Sniping",
    "desc": "Enhances Archer Lethality",
    "effectRange": "Archer Lethality +5.5% to +36.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 30,
    "prereqs": [
      {
        "techId": "regimental-expansion-vi",
        "level": 1
      }
    ],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 19200,
        "effectValue": 5.5,
        "effectIsPercent": true,
        "academyLevel": 30
      },
      {
        "level": 2,
        "cost": {
          "bread": 4600000,
          "wood": 4600000,
          "stone": 930000,
          "iron": 230000,
          "gold": 76000
        },
        "timeSeconds": 1440000,
        "power": 38500,
        "effectValue": 11,
        "effectIsPercent": true,
        "academyLevel": 0
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
        "timeSeconds": 1584000,
        "power": 57800,
        "effectValue": 16.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 5500000,
          "wood": 5500000,
          "stone": 1100000,
          "iron": 270000,
          "gold": 92000
        },
        "timeSeconds": 2520000,
        "power": 77000,
        "effectValue": 22,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 6500000,
          "wood": 6500000,
          "stone": 1300000,
          "iron": 320000,
          "gold": 100000
        },
        "timeSeconds": 3024000,
        "power": 96200,
        "effectValue": 27.5,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 12000000,
          "wood": 12000000,
          "stone": 2500000,
          "iron": 640000,
          "gold": 210000
        },
        "timeSeconds": 7200000,
        "power": 127800,
        "effectValue": 36.5,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  },
  {
    "id": "weapons-prep-i",
    "name": "Weapons Prep I",
    "category": "Weapons Prep",
    "desc": "Enhances all Squads' Attack.",
    "effectRange": "Squads' Attack +0.5% to +1.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 1,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 8700,
          "wood": 8700,
          "stone": 1700,
          "iron": 430,
          "gold": 520
        },
        "timeSeconds": 120,
        "power": 4200,
        "effectValue": 0.5,
        "effectIsPercent": true,
        "academyLevel": 1
      },
      {
        "level": 2,
        "cost": {
          "bread": 12000,
          "wood": 12000,
          "stone": 2400,
          "iron": 610,
          "gold": 720
        },
        "timeSeconds": 240,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 2
      },
      {
        "level": 3,
        "cost": {
          "bread": 26000,
          "wood": 26000,
          "stone": 5200,
          "iron": 1300,
          "gold": 1500
        },
        "timeSeconds": 660,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 3
      }
    ]
  },
  {
    "id": "weapons-prep-ii",
    "name": "Weapons Prep II",
    "category": "Weapons Prep",
    "desc": "Enhances all Squads' Attack.",
    "effectRange": "Squads' Attack +0.75% to +2.5%",
    "maxLevel": 3,
    "unlockAcademyLevel": 8,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 87000,
          "wood": 87000,
          "stone": 17000,
          "iron": 4300,
          "gold": 1000
        },
        "timeSeconds": 1920,
        "power": 6300,
        "effectValue": 0.75,
        "effectIsPercent": true,
        "academyLevel": 8
      },
      {
        "level": 2,
        "cost": {
          "bread": 120000,
          "wood": 120000,
          "stone": 24000,
          "iron": 6100,
          "gold": 1400
        },
        "timeSeconds": 2880,
        "power": 12600,
        "effectValue": 1.5,
        "effectIsPercent": true,
        "academyLevel": 9
      },
      {
        "level": 3,
        "cost": {
          "bread": 260000,
          "wood": 260000,
          "stone": 52000,
          "iron": 13000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 21000,
        "effectValue": 2.5,
        "effectIsPercent": true,
        "academyLevel": 10
      }
    ]
  },
  {
    "id": "weapons-prep-iii",
    "name": "Weapons Prep III",
    "category": "Weapons Prep",
    "desc": "Enhances all Squads' Attack.",
    "effectRange": "Squads' Attack +1% to +4.5%",
    "maxLevel": 4,
    "unlockAcademyLevel": 13,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 280000,
          "wood": 280000,
          "stone": 56000,
          "iron": 14000,
          "gold": 3100
        },
        "timeSeconds": 7800,
        "power": 8400,
        "effectValue": 1,
        "effectIsPercent": true,
        "academyLevel": 13
      },
      {
        "level": 2,
        "cost": {
          "bread": 360000,
          "wood": 360000,
          "stone": 73000,
          "iron": 18000,
          "gold": 4000
        },
        "timeSeconds": 9360,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 14
      },
      {
        "level": 3,
        "cost": {
          "bread": 470000,
          "wood": 470000,
          "stone": 95000,
          "iron": 23000,
          "gold": 5300
        },
        "timeSeconds": 15600,
        "power": 25200,
        "effectValue": 3,
        "effectIsPercent": true,
        "academyLevel": 15
      },
      {
        "level": 4,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 12000
        },
        "timeSeconds": 46800,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 16
      }
    ]
  },
  {
    "id": "weapons-prep-iv",
    "name": "Weapons Prep IV",
    "category": "Weapons Prep",
    "desc": "Enhances all Squads' Attack.",
    "effectRange": "Squads' Attack +1.75% to +10%",
    "maxLevel": 5,
    "unlockAcademyLevel": 18,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 800000,
          "wood": 800000,
          "stone": 160000,
          "iron": 40000,
          "gold": 10000
        },
        "timeSeconds": 51960,
        "power": 14700,
        "effectValue": 1.75,
        "effectIsPercent": true,
        "academyLevel": 18
      },
      {
        "level": 2,
        "cost": {
          "bread": 960000,
          "wood": 960000,
          "stone": 190000,
          "iron": 48000,
          "gold": 12000
        },
        "timeSeconds": 67560,
        "power": 29400,
        "effectValue": 3.5,
        "effectIsPercent": true,
        "academyLevel": 19
      },
      {
        "level": 3,
        "cost": {
          "bread": 1100000,
          "wood": 1100000,
          "stone": 220000,
          "iron": 56000,
          "gold": 14000
        },
        "timeSeconds": 103980,
        "power": 44100,
        "effectValue": 5.25,
        "effectIsPercent": true,
        "academyLevel": 20
      },
      {
        "level": 4,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 290000,
          "iron": 72000,
          "gold": 18000
        },
        "timeSeconds": 156000,
        "power": 58800,
        "effectValue": 7,
        "effectIsPercent": true,
        "academyLevel": 21
      },
      {
        "level": 5,
        "cost": {
          "bread": 2900000,
          "wood": 2900000,
          "stone": 590000,
          "iron": 140000,
          "gold": 38000
        },
        "timeSeconds": 390000,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 22
      }
    ]
  },
  {
    "id": "weapons-prep-v",
    "name": "Weapons Prep V",
    "category": "Weapons Prep",
    "desc": "Enhances all Squads' Attack.",
    "effectRange": "Squads' Attack +2% to +13.5%",
    "maxLevel": 6,
    "unlockAcademyLevel": 23,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 16800,
        "effectValue": 2,
        "effectIsPercent": true,
        "academyLevel": 23
      },
      {
        "level": 2,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 324960,
        "power": 33600,
        "effectValue": 4,
        "effectIsPercent": true,
        "academyLevel": 24
      },
      {
        "level": 3,
        "cost": {
          "bread": 1400000,
          "wood": 1400000,
          "stone": 280000,
          "iron": 71000,
          "gold": 41000
        },
        "timeSeconds": 357480,
        "power": 50400,
        "effectValue": 6,
        "effectIsPercent": true,
        "academyLevel": 25
      },
      {
        "level": 4,
        "cost": {
          "bread": 1700000,
          "wood": 1700000,
          "stone": 340000,
          "iron": 86000,
          "gold": 49000
        },
        "timeSeconds": 568740,
        "power": 67200,
        "effectValue": 8,
        "effectIsPercent": true,
        "academyLevel": 26
      },
      {
        "level": 5,
        "cost": {
          "bread": 2000000,
          "wood": 2000000,
          "stone": 400000,
          "iron": 100000,
          "gold": 58000
        },
        "timeSeconds": 682500,
        "power": 84000,
        "effectValue": 10,
        "effectIsPercent": true,
        "academyLevel": 27
      },
      {
        "level": 6,
        "cost": {
          "bread": 3900000,
          "wood": 3900000,
          "stone": 790000,
          "iron": 190000,
          "gold": 110000
        },
        "timeSeconds": 1624980,
        "power": 113400,
        "effectValue": 13.5,
        "effectIsPercent": true,
        "academyLevel": 28
      }
    ]
  },
  {
    "id": "weapons-prep-vi",
    "name": "Weapons Prep VI",
    "category": "Weapons Prep",
    "desc": "Enhances all Squads' Attack.",
    "effectRange": "Squads' Attack +2.25% to +15.25%",
    "maxLevel": 6,
    "unlockAcademyLevel": 28,
    "prereqs": [],
    "levels": [
      {
        "level": 1,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 18900,
        "effectValue": 2.25,
        "effectIsPercent": true,
        "academyLevel": 28
      },
      {
        "level": 2,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1560000,
        "power": 37800,
        "effectValue": 4.5,
        "effectIsPercent": true,
        "academyLevel": 29
      },
      {
        "level": 3,
        "cost": {
          "bread": 5000000,
          "wood": 5000000,
          "stone": 1000000,
          "iron": 250000,
          "gold": 83000
        },
        "timeSeconds": 1716000,
        "power": 56700,
        "effectValue": 6.75,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 4,
        "cost": {
          "bread": 6000000,
          "wood": 6000000,
          "stone": 1200000,
          "iron": 300000,
          "gold": 99000
        },
        "timeSeconds": 2730000,
        "power": 75600,
        "effectValue": 9,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 5,
        "cost": {
          "bread": 7000000,
          "wood": 7000000,
          "stone": 1400000,
          "iron": 350000,
          "gold": 110000
        },
        "timeSeconds": 3276000,
        "power": 94500,
        "effectValue": 11.25,
        "effectIsPercent": true,
        "academyLevel": 0
      },
      {
        "level": 6,
        "cost": {
          "bread": 13000000,
          "wood": 13000000,
          "stone": 2700000,
          "iron": 690000,
          "gold": 220000
        },
        "timeSeconds": 7800000,
        "power": 128100,
        "effectValue": 15.25,
        "effectIsPercent": true,
        "academyLevel": 0
      }
    ]
  }
];

export function getBattleTech(id: string): ResearchTech | undefined {
  return BATTLE_TECHS.find((t) => t.id === id);
}
