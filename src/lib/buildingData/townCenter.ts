import type { Building } from '../buildingTypes';

// Real data from kingshotdata.com/buildings/town-center/ (read 2026-08-19).
export const townCenterBuilding: Building = {
  "id": "townCenter",
  "name": "Town Center",
  "image": "/buildings/town-center-kingshot.png",
  "levels": [
    {
      "level": "1",
      "requirements": [],
      "cost": {},
      "timeSeconds": 0,
      "power": 2000
    },
    {
      "level": "2",
      "requirements": [],
      "cost": {
        "wood": 180
      },
      "timeSeconds": 6,
      "power": 3800
    },
    {
      "level": "3",
      "requirements": [],
      "cost": {
        "wood": 805
      },
      "timeSeconds": 60,
      "power": 6500
    },
    {
      "level": "4",
      "requirements": [],
      "cost": {
        "wood": 1800,
        "stone": 360
      },
      "timeSeconds": 180,
      "power": 10100
    },
    {
      "level": "5",
      "requirements": [],
      "cost": {
        "wood": 7600,
        "stone": 1500
      },
      "timeSeconds": 600,
      "power": 15500
    },
    {
      "level": "6",
      "requirements": [],
      "cost": {
        "wood": 19000,
        "stone": 3800,
        "iron": 960
      },
      "timeSeconds": 1800,
      "power": 23600
    },
    {
      "level": "7",
      "requirements": [],
      "cost": {
        "wood": 69000,
        "stone": 13000,
        "iron": 3400
      },
      "timeSeconds": 3600,
      "power": 35300
    },
    {
      "level": "8",
      "requirements": [
        {
          "buildingId": "barracks",
          "level": "7"
        }
      ],
      "cost": {
        "wood": 120000,
        "stone": 25000,
        "iron": 6300
      },
      "timeSeconds": 9000,
      "power": 47000
    },
    {
      "level": "9",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "8"
        }
      ],
      "cost": {
        "wood": 260000,
        "stone": 52000,
        "iron": 13000
      },
      "timeSeconds": 16200,
      "power": 58700
    },
    {
      "level": "10",
      "requirements": [
        {
          "buildingId": "range",
          "level": "9"
        }
      ],
      "cost": {
        "wood": 460000,
        "stone": 92000,
        "iron": 23000
      },
      "timeSeconds": 21600,
      "power": 75700
    },
    {
      "level": "11",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "10"
        },
        {
          "buildingId": "stable",
          "level": "10"
        }
      ],
      "cost": {
        "wood": 1300000,
        "bread": 1300000,
        "stone": 20000,
        "iron": 65000
      },
      "timeSeconds": 27000,
      "power": 92700
    },
    {
      "level": "12",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "11"
        },
        {
          "buildingId": "commandCenter",
          "level": "1"
        }
      ],
      "cost": {
        "wood": 1600000,
        "bread": 1600000,
        "stone": 330000,
        "iron": 84000
      },
      "timeSeconds": 32400,
      "power": 109700
    },
    {
      "level": "13",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "12"
        },
        {
          "buildingId": "barracks",
          "level": "12"
        }
      ],
      "cost": {
        "wood": 2300000,
        "bread": 2300000,
        "stone": 470000,
        "iron": 110000
      },
      "timeSeconds": 39600,
      "power": 138400
    },
    {
      "level": "14",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "13"
        },
        {
          "buildingId": "range",
          "level": "13"
        }
      ],
      "cost": {
        "wood": 3100000,
        "bread": 3100000,
        "stone": 630000,
        "iron": 150000
      },
      "timeSeconds": 50400,
      "power": 167100
    },
    {
      "level": "15",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "14"
        },
        {
          "buildingId": "stable",
          "level": "14"
        }
      ],
      "cost": {
        "wood": 4600000,
        "bread": 4600000,
        "stone": 930000,
        "iron": 230000
      },
      "timeSeconds": 64800,
      "power": 195800
    },
    {
      "level": "16",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "15"
        },
        {
          "buildingId": "academy",
          "level": "15"
        }
      ],
      "cost": {
        "wood": 5900000,
        "bread": 5900000,
        "stone": 1100000,
        "iron": 290000
      },
      "timeSeconds": 109680,
      "power": 236200
    },
    {
      "level": "17",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "16"
        },
        {
          "buildingId": "barracks",
          "level": "16"
        }
      ],
      "cost": {
        "wood": 9300000,
        "bread": 9300000,
        "stone": 1800000,
        "iron": 480000
      },
      "timeSeconds": 131640,
      "power": 276600
    },
    {
      "level": "18",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "17"
        },
        {
          "buildingId": "range",
          "level": "17"
        }
      ],
      "cost": {
        "wood": 12000000,
        "bread": 12000000,
        "stone": 2500000,
        "iron": 620000
      },
      "timeSeconds": 157980,
      "power": 317000
    },
    {
      "level": "19",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "18"
        },
        {
          "buildingId": "stable",
          "level": "18"
        }
      ],
      "cost": {
        "wood": 15000000,
        "bread": 15000000,
        "stone": 3100000,
        "iron": 780000
      },
      "timeSeconds": 237000,
      "power": 374400
    },
    {
      "level": "20",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "19"
        },
        {
          "buildingId": "academy",
          "level": "19"
        }
      ],
      "cost": {
        "wood": 21000000,
        "bread": 21000000,
        "stone": 4300000,
        "iron": 1000000
      },
      "timeSeconds": 296280,
      "power": 431800
    },
    {
      "level": "21",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "20"
        },
        {
          "buildingId": "barracks",
          "level": "20"
        }
      ],
      "cost": {
        "wood": 27000000,
        "bread": 27000000,
        "stone": 5400000,
        "iron": 1300000
      },
      "timeSeconds": 385140,
      "power": 489200
    },
    {
      "level": "22",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "21"
        },
        {
          "buildingId": "range",
          "level": "21"
        }
      ],
      "cost": {
        "wood": 36000000,
        "bread": 36000000,
        "stone": 7200000,
        "iron": 1800000
      },
      "timeSeconds": 577740,
      "power": 575300
    },
    {
      "level": "23",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "22"
        },
        {
          "buildingId": "stable",
          "level": "22"
        }
      ],
      "cost": {
        "wood": 44000000,
        "bread": 44000000,
        "stone": 8900000,
        "iron": 2200000
      },
      "timeSeconds": 808800,
      "power": 661400
    },
    {
      "level": "24",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "23"
        },
        {
          "buildingId": "academy",
          "level": "23"
        }
      ],
      "cost": {
        "wood": 60000000,
        "bread": 60000000,
        "stone": 12000000,
        "iron": 3000000
      },
      "timeSeconds": 1132380,
      "power": 747500
    },
    {
      "level": "25",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "24"
        },
        {
          "buildingId": "barracks",
          "level": "24"
        }
      ],
      "cost": {
        "wood": 81000000,
        "bread": 81000000,
        "stone": 16000000,
        "iron": 4000000
      },
      "timeSeconds": 1585320,
      "power": 833600
    },
    {
      "level": "26",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "25"
        },
        {
          "buildingId": "range",
          "level": "25"
        }
      ],
      "cost": {
        "wood": 100000000,
        "bread": 100000000,
        "stone": 21000000,
        "iron": 5200000
      },
      "timeSeconds": 1823160,
      "power": 960100
    },
    {
      "level": "27",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "26"
        },
        {
          "buildingId": "stable",
          "level": "26"
        }
      ],
      "cost": {
        "wood": 140000000,
        "bread": 140000000,
        "stone": 24000000,
        "iron": 7400000
      },
      "timeSeconds": 2187780,
      "power": 1086600
    },
    {
      "level": "28",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "27"
        },
        {
          "buildingId": "academy",
          "level": "27"
        }
      ],
      "cost": {
        "wood": 190000000,
        "bread": 190000000,
        "stone": 39000000,
        "iron": 9900000
      },
      "timeSeconds": 2515920,
      "power": 1213100
    },
    {
      "level": "29",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "28"
        },
        {
          "buildingId": "barracks",
          "level": "28"
        }
      ],
      "cost": {
        "wood": 240000000,
        "bread": 240000000,
        "stone": 49000000,
        "iron": 12000000
      },
      "timeSeconds": 2893320,
      "power": 1339600
    },
    {
      "level": "30",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "29"
        },
        {
          "buildingId": "range",
          "level": "29"
        }
      ],
      "cost": {
        "wood": 300000000,
        "bread": 300000000,
        "stone": 60000000,
        "iron": 15000000
      },
      "timeSeconds": 3472020,
      "power": 1523500
    },
    {
      "level": "30-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "30"
        },
        {
          "buildingId": "academy",
          "level": "30"
        }
      ],
      "cost": {
        "wood": 67000000,
        "bread": 67000000,
        "stone": 13000000,
        "iron": 3300000,
        "truegold": 132
      },
      "timeSeconds": 604800,
      "power": null
    },
    {
      "level": "30-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "30"
        }
      ],
      "cost": {
        "wood": 67000000,
        "bread": 67000000,
        "stone": 13000000,
        "iron": 3300000,
        "truegold": 132
      },
      "timeSeconds": 604800,
      "power": null
    },
    {
      "level": "30-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "30"
        },
        {
          "buildingId": "academy",
          "level": "30"
        }
      ],
      "cost": {
        "wood": 67000000,
        "bread": 67000000,
        "stone": 13000000,
        "iron": 3300000,
        "truegold": 132
      },
      "timeSeconds": 604800,
      "power": null
    },
    {
      "level": "30-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "30"
        },
        {
          "buildingId": "academy",
          "level": "30"
        }
      ],
      "cost": {
        "wood": 67000000,
        "bread": 67000000,
        "stone": 13000000,
        "iron": 3300000,
        "truegold": 132
      },
      "timeSeconds": 604800,
      "power": null
    },
    {
      "level": "TG1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "30"
        },
        {
          "buildingId": "academy",
          "level": "30"
        }
      ],
      "cost": {
        "wood": 67000000,
        "bread": 67000000,
        "stone": 13000000,
        "iron": 3300000,
        "truegold": 132
      },
      "timeSeconds": 604800,
      "power": 1810500
    },
    {
      "level": "TG1-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG1"
        },
        {
          "buildingId": "stable",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 72000000,
        "bread": 72000000,
        "stone": 14000000,
        "iron": 3600000,
        "truegold": 158
      },
      "timeSeconds": 777600,
      "power": null
    },
    {
      "level": "TG1-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG1"
        },
        {
          "buildingId": "stable",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 72000000,
        "bread": 72000000,
        "stone": 14000000,
        "iron": 3600000,
        "truegold": 158
      },
      "timeSeconds": 777600,
      "power": null
    },
    {
      "level": "TG1-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG1"
        },
        {
          "buildingId": "stable",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 72000000,
        "bread": 72000000,
        "stone": 14000000,
        "iron": 3600000,
        "truegold": 158
      },
      "timeSeconds": 777600,
      "power": null
    },
    {
      "level": "TG1-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG1"
        },
        {
          "buildingId": "stable",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 72000000,
        "bread": 72000000,
        "stone": 14000000,
        "iron": 3600000,
        "truegold": 158
      },
      "timeSeconds": 777600,
      "power": null
    },
    {
      "level": "TG2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG1"
        },
        {
          "buildingId": "stable",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 72000000,
        "bread": 72000000,
        "stone": 14000000,
        "iron": 3600000,
        "truegold": 158
      },
      "timeSeconds": 777600,
      "power": 2097500
    },
    {
      "level": "TG2-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG2"
        },
        {
          "buildingId": "barracks",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 79000000,
        "bread": 79000000,
        "stone": 15000000,
        "iron": 3900000,
        "truegold": 238
      },
      "timeSeconds": 950400,
      "power": null
    },
    {
      "level": "TG2-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG2"
        },
        {
          "buildingId": "barracks",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 79000000,
        "bread": 79000000,
        "stone": 15000000,
        "iron": 3900000,
        "truegold": 238
      },
      "timeSeconds": 950400,
      "power": null
    },
    {
      "level": "TG2-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG2"
        },
        {
          "buildingId": "barracks",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 79000000,
        "bread": 79000000,
        "stone": 15000000,
        "iron": 3900000,
        "truegold": 238
      },
      "timeSeconds": 950400,
      "power": null
    },
    {
      "level": "TG2-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG2"
        },
        {
          "buildingId": "barracks",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 79000000,
        "bread": 79000000,
        "stone": 15000000,
        "iron": 3900000,
        "truegold": 238
      },
      "timeSeconds": 950400,
      "power": null
    },
    {
      "level": "TG3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG2"
        },
        {
          "buildingId": "barracks",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 79000000,
        "bread": 79000000,
        "stone": 15000000,
        "iron": 3900000,
        "truegold": 238
      },
      "timeSeconds": 950400,
      "power": 2384500
    },
    {
      "level": "TG3-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG3"
        },
        {
          "buildingId": "range",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 82000000,
        "bread": 82000000,
        "stone": 16000000,
        "iron": 4100000,
        "truegold": 280
      },
      "timeSeconds": 1036800,
      "power": null
    },
    {
      "level": "TG3-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG3"
        },
        {
          "buildingId": "range",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 82000000,
        "bread": 82000000,
        "stone": 16000000,
        "iron": 4100000,
        "truegold": 280
      },
      "timeSeconds": 1036800,
      "power": null
    },
    {
      "level": "TG3-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG3"
        },
        {
          "buildingId": "range",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 82000000,
        "bread": 82000000,
        "stone": 16000000,
        "iron": 4100000,
        "truegold": 280
      },
      "timeSeconds": 1036800,
      "power": null
    },
    {
      "level": "TG3-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG3"
        },
        {
          "buildingId": "range",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 82000000,
        "bread": 82000000,
        "stone": 16000000,
        "iron": 4100000,
        "truegold": 280
      },
      "timeSeconds": 1036800,
      "power": null
    },
    {
      "level": "TG4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG3"
        },
        {
          "buildingId": "range",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 82000000,
        "bread": 82000000,
        "stone": 16000000,
        "iron": 4100000,
        "truegold": 280
      },
      "timeSeconds": 1036800,
      "power": 2700500
    },
    {
      "level": "TG4-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG4"
        },
        {
          "buildingId": "stable",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 84000000,
        "bread": 84000000,
        "stone": 16000000,
        "iron": 4200000,
        "truegold": 335
      },
      "timeSeconds": 1209600,
      "power": null
    },
    {
      "level": "TG4-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG4"
        },
        {
          "buildingId": "stable",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 84000000,
        "bread": 84000000,
        "stone": 16000000,
        "iron": 4200000,
        "truegold": 335
      },
      "timeSeconds": 1209600,
      "power": null
    },
    {
      "level": "TG4-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG4"
        },
        {
          "buildingId": "stable",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 84000000,
        "bread": 84000000,
        "stone": 16000000,
        "iron": 4200000,
        "truegold": 335
      },
      "timeSeconds": 1209600,
      "power": null
    },
    {
      "level": "TG4-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG4"
        },
        {
          "buildingId": "stable",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 84000000,
        "bread": 84000000,
        "stone": 16000000,
        "iron": 4200000,
        "truegold": 335
      },
      "timeSeconds": 1209600,
      "power": null
    },
    {
      "level": "TG5",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG4"
        },
        {
          "buildingId": "stable",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 84000000,
        "bread": 84000000,
        "stone": 16000000,
        "iron": 4200000,
        "truegold": 335
      },
      "timeSeconds": 1209600,
      "power": 3016500
    },
    {
      "level": "TG5-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG5"
        },
        {
          "buildingId": "barracks",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 96000000,
        "bread": 96000000,
        "stone": 19000000,
        "iron": 4800000,
        "truegold": 200,
        "temperedTruegold": 10
      },
      "timeSeconds": 1296000,
      "power": null
    },
    {
      "level": "TG5-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG5"
        },
        {
          "buildingId": "barracks",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 96000000,
        "bread": 96000000,
        "stone": 19000000,
        "iron": 4800000,
        "truegold": 200,
        "temperedTruegold": 10
      },
      "timeSeconds": 1296000,
      "power": null
    },
    {
      "level": "TG5-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG5"
        },
        {
          "buildingId": "barracks",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 96000000,
        "bread": 96000000,
        "stone": 19000000,
        "iron": 4800000,
        "truegold": 200,
        "temperedTruegold": 10
      },
      "timeSeconds": 1296000,
      "power": null
    },
    {
      "level": "TG5-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG5"
        },
        {
          "buildingId": "barracks",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 96000000,
        "bread": 96000000,
        "stone": 19000000,
        "iron": 4800000,
        "truegold": 200,
        "temperedTruegold": 10
      },
      "timeSeconds": 1296000,
      "power": null
    },
    {
      "level": "TG6",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG5"
        },
        {
          "buildingId": "barracks",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 96000000,
        "bread": 96000000,
        "stone": 19000000,
        "iron": 4800000,
        "truegold": 100,
        "temperedTruegold": 20
      },
      "timeSeconds": 1296000,
      "power": 3354500
    },
    {
      "level": "TG6-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG6"
        },
        {
          "buildingId": "range",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 100000000,
        "bread": 100000000,
        "stone": 21000000,
        "iron": 5400000,
        "truegold": 240,
        "temperedTruegold": 15
      },
      "timeSeconds": 1555200,
      "power": null
    },
    {
      "level": "TG6-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG6"
        },
        {
          "buildingId": "range",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 100000000,
        "bread": 100000000,
        "stone": 21000000,
        "iron": 5400000,
        "truegold": 240,
        "temperedTruegold": 15
      },
      "timeSeconds": 1555200,
      "power": null
    },
    {
      "level": "TG6-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG6"
        },
        {
          "buildingId": "range",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 100000000,
        "bread": 100000000,
        "stone": 21000000,
        "iron": 5400000,
        "truegold": 240,
        "temperedTruegold": 15
      },
      "timeSeconds": 1555200,
      "power": null
    },
    {
      "level": "TG6-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG6"
        },
        {
          "buildingId": "range",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 100000000,
        "bread": 100000000,
        "stone": 21000000,
        "iron": 5400000,
        "truegold": 240,
        "temperedTruegold": 15
      },
      "timeSeconds": 1555200,
      "power": null
    },
    {
      "level": "TG7",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG6"
        },
        {
          "buildingId": "range",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 100000000,
        "bread": 100000000,
        "stone": 21000000,
        "iron": 5400000,
        "truegold": 120,
        "temperedTruegold": 30
      },
      "timeSeconds": 1555200,
      "power": 3692500
    },
    {
      "level": "TG7-1",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG7"
        },
        {
          "buildingId": "stable",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 130000000,
        "bread": 130000000,
        "stone": 26000000,
        "iron": 6600000,
        "truegold": 240,
        "temperedTruegold": 20
      },
      "timeSeconds": 1728000,
      "power": null
    },
    {
      "level": "TG7-2",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG7"
        },
        {
          "buildingId": "stable",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 130000000,
        "bread": 130000000,
        "stone": 26000000,
        "iron": 6600000,
        "truegold": 240,
        "temperedTruegold": 20
      },
      "timeSeconds": 1728000,
      "power": null
    },
    {
      "level": "TG7-3",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG7"
        },
        {
          "buildingId": "stable",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 130000000,
        "bread": 130000000,
        "stone": 26000000,
        "iron": 6600000,
        "truegold": 240,
        "temperedTruegold": 20
      },
      "timeSeconds": 1728000,
      "power": null
    },
    {
      "level": "TG7-4",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG7"
        },
        {
          "buildingId": "stable",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 130000000,
        "bread": 130000000,
        "stone": 26000000,
        "iron": 6600000,
        "truegold": 240,
        "temperedTruegold": 20
      },
      "timeSeconds": 1728000,
      "power": null
    },
    {
      "level": "TG8",
      "requirements": [
        {
          "buildingId": "embassy",
          "level": "TG7"
        },
        {
          "buildingId": "stable",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 130000000,
        "bread": 130000000,
        "stone": 26000000,
        "iron": 6600000,
        "truegold": 120,
        "temperedTruegold": 40
      },
      "timeSeconds": 1728000,
      "power": 4030500
    }
  ]
};
