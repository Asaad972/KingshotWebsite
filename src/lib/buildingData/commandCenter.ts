import type { Building } from '../buildingTypes';

// Real data from kingshotdata.com/buildings/command-center/ (read 2026-08-19).
export const commandCenterBuilding: Building = {
  "id": "commandCenter",
  "name": "Command Center",
  "image": "/buildings/command-center-kingshot.png",
  "levels": [
    {
      "level": "1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "1"
        }
      ],
      "cost": {
        "wood": 80
      },
      "timeSeconds": 2,
      "power": null
    },
    {
      "level": "2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "2"
        }
      ],
      "cost": {
        "wood": 125
      },
      "timeSeconds": 8,
      "power": null
    },
    {
      "level": "3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "3"
        }
      ],
      "cost": {
        "wood": 565
      },
      "timeSeconds": 35,
      "power": null
    },
    {
      "level": "4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "4"
        }
      ],
      "cost": {
        "wood": 1200,
        "stone": 250
      },
      "timeSeconds": 105,
      "power": null
    },
    {
      "level": "5",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "5"
        }
      ],
      "cost": {
        "wood": 5300,
        "stone": 1000
      },
      "timeSeconds": 215,
      "power": null
    },
    {
      "level": "6",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "6"
        }
      ],
      "cost": {
        "wood": 13000,
        "stone": 2600,
        "iron": 670
      },
      "timeSeconds": 430,
      "power": null
    },
    {
      "level": "7",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "7"
        }
      ],
      "cost": {
        "wood": 48000,
        "stone": 9600,
        "iron": 2400
      },
      "timeSeconds": 840,
      "power": null
    },
    {
      "level": "8",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "8"
        }
      ],
      "cost": {
        "wood": 88000,
        "stone": 17000,
        "iron": 4400
      },
      "timeSeconds": 1290,
      "power": null
    },
    {
      "level": "9",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "9"
        }
      ],
      "cost": {
        "wood": 180000,
        "stone": 36000,
        "iron": 9100
      },
      "timeSeconds": 1920,
      "power": null
    },
    {
      "level": "10",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "10"
        },
        {
          "buildingId": "embassy",
          "level": "10"
        }
      ],
      "cost": {
        "wood": 320000,
        "stone": 64000,
        "iron": 16000
      },
      "timeSeconds": 2580,
      "power": null
    },
    {
      "level": "11",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "11"
        },
        {
          "buildingId": "embassy",
          "level": "11"
        }
      ],
      "cost": {
        "wood": 390000,
        "bread": 390000,
        "stone": 79000,
        "iron": 19000
      },
      "timeSeconds": 3240,
      "power": null
    },
    {
      "level": "12",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "12"
        },
        {
          "buildingId": "embassy",
          "level": "12"
        }
      ],
      "cost": {
        "wood": 500000,
        "bread": 500000,
        "stone": 100000,
        "iron": 25000
      },
      "timeSeconds": 3870,
      "power": null
    },
    {
      "level": "13",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "13"
        },
        {
          "buildingId": "embassy",
          "level": "13"
        }
      ],
      "cost": {
        "wood": 710000,
        "bread": 710000,
        "stone": 140000,
        "iron": 35000
      },
      "timeSeconds": 4740,
      "power": null
    },
    {
      "level": "14",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "14"
        },
        {
          "buildingId": "embassy",
          "level": "14"
        }
      ],
      "cost": {
        "wood": 940000,
        "bread": 940000,
        "stone": 180000,
        "iron": 47000
      },
      "timeSeconds": 6030,
      "power": null
    },
    {
      "level": "15",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "15"
        },
        {
          "buildingId": "embassy",
          "level": "15"
        }
      ],
      "cost": {
        "wood": 1300000,
        "bread": 1300000,
        "stone": 270000,
        "iron": 69000
      },
      "timeSeconds": 7770,
      "power": null
    },
    {
      "level": "16",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "16"
        },
        {
          "buildingId": "embassy",
          "level": "16"
        }
      ],
      "cost": {
        "wood": 1700000,
        "bread": 1700000,
        "stone": 350000,
        "iron": 89000
      },
      "timeSeconds": 13140,
      "power": null
    },
    {
      "level": "17",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "17"
        },
        {
          "buildingId": "embassy",
          "level": "17"
        }
      ],
      "cost": {
        "wood": 2700000,
        "bread": 2700000,
        "stone": 550000,
        "iron": 130000
      },
      "timeSeconds": 15780,
      "power": null
    },
    {
      "level": "18",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "18"
        },
        {
          "buildingId": "embassy",
          "level": "18"
        }
      ],
      "cost": {
        "wood": 3700000,
        "bread": 3700000,
        "stone": 750000,
        "iron": 180000
      },
      "timeSeconds": 18960,
      "power": null
    },
    {
      "level": "19",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "19"
        },
        {
          "buildingId": "embassy",
          "level": "19"
        }
      ],
      "cost": {
        "wood": 4700000,
        "bread": 4700000,
        "stone": 940000,
        "iron": 230000
      },
      "timeSeconds": 28440,
      "power": null
    },
    {
      "level": "20",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "20"
        },
        {
          "buildingId": "embassy",
          "level": "20"
        }
      ],
      "cost": {
        "wood": 6400000,
        "bread": 6400000,
        "stone": 1200000,
        "iron": 320000
      },
      "timeSeconds": 35520,
      "power": null
    },
    {
      "level": "21",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "21"
        },
        {
          "buildingId": "embassy",
          "level": "21"
        }
      ],
      "cost": {
        "wood": 8100000,
        "bread": 8100000,
        "stone": 1600000,
        "iron": 400000
      },
      "timeSeconds": 46200,
      "power": null
    },
    {
      "level": "22",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "22"
        },
        {
          "buildingId": "embassy",
          "level": "22"
        }
      ],
      "cost": {
        "wood": 10000000,
        "bread": 10000000,
        "stone": 2100000,
        "iron": 540000
      },
      "timeSeconds": 69330,
      "power": null
    },
    {
      "level": "23",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "23"
        },
        {
          "buildingId": "embassy",
          "level": "23"
        }
      ],
      "cost": {
        "wood": 13000000,
        "bread": 13000000,
        "stone": 2600000,
        "iron": 670000
      },
      "timeSeconds": 97020,
      "power": null
    },
    {
      "level": "24",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "24"
        },
        {
          "buildingId": "embassy",
          "level": "24"
        }
      ],
      "cost": {
        "wood": 18000000,
        "bread": 18000000,
        "stone": 3600000,
        "iron": 900000
      },
      "timeSeconds": 135840,
      "power": null
    },
    {
      "level": "25",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "25"
        },
        {
          "buildingId": "embassy",
          "level": "25"
        }
      ],
      "cost": {
        "wood": 24000000,
        "bread": 24000000,
        "stone": 4900000,
        "iron": 1200000
      },
      "timeSeconds": 190200,
      "power": null
    },
    {
      "level": "26",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "26"
        },
        {
          "buildingId": "embassy",
          "level": "26"
        }
      ],
      "cost": {
        "wood": 31000000,
        "bread": 31000000,
        "stone": 6300000,
        "iron": 1500000
      },
      "timeSeconds": 218760,
      "power": null
    },
    {
      "level": "27",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "27"
        },
        {
          "buildingId": "embassy",
          "level": "27"
        }
      ],
      "cost": {
        "wood": 44000000,
        "bread": 44000000,
        "stone": 8900000,
        "iron": 2200000
      },
      "timeSeconds": 262500,
      "power": null
    },
    {
      "level": "28",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "28"
        },
        {
          "buildingId": "embassy",
          "level": "28"
        }
      ],
      "cost": {
        "wood": 59000000,
        "bread": 59000000,
        "stone": 11000000,
        "iron": 2900000
      },
      "timeSeconds": 301860,
      "power": null
    },
    {
      "level": "29",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "29"
        },
        {
          "buildingId": "embassy",
          "level": "29"
        }
      ],
      "cost": {
        "wood": 73000000,
        "bread": 73000000,
        "stone": 14000000,
        "iron": 3600000
      },
      "timeSeconds": 347160,
      "power": null
    },
    {
      "level": "30",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "30"
        },
        {
          "buildingId": "embassy",
          "level": "30"
        }
      ],
      "cost": {
        "wood": 90000000,
        "bread": 90000000,
        "stone": 18000000,
        "iron": 4500000
      },
      "timeSeconds": 416640,
      "power": null
    },
    {
      "level": "30-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG1"
        },
        {
          "buildingId": "embassy",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 20000000,
        "bread": 20000000,
        "stone": 4000000,
        "iron": 1000000,
        "truegold": 26
      },
      "timeSeconds": 72570,
      "power": null
    },
    {
      "level": "30-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG1"
        },
        {
          "buildingId": "embassy",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 20000000,
        "bread": 20000000,
        "stone": 4000000,
        "iron": 1000000,
        "truegold": 26
      },
      "timeSeconds": 72570,
      "power": null
    },
    {
      "level": "30-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG1"
        },
        {
          "buildingId": "embassy",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 20000000,
        "bread": 20000000,
        "stone": 4000000,
        "iron": 1000000,
        "truegold": 26
      },
      "timeSeconds": 72570,
      "power": null
    },
    {
      "level": "30-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG1"
        },
        {
          "buildingId": "embassy",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 20000000,
        "bread": 20000000,
        "stone": 4000000,
        "iron": 1000000,
        "truegold": 26
      },
      "timeSeconds": 72570,
      "power": null
    },
    {
      "level": "TG1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG1"
        },
        {
          "buildingId": "embassy",
          "level": "TG1"
        }
      ],
      "cost": {
        "wood": 20000000,
        "bread": 20000000,
        "stone": 4000000,
        "iron": 1000000,
        "truegold": 26
      },
      "timeSeconds": 72570,
      "power": null
    },
    {
      "level": "TG1-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG2"
        },
        {
          "buildingId": "embassy",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 21000000,
        "bread": 21000000,
        "stone": 4300000,
        "iron": 1000000,
        "truegold": 31
      },
      "timeSeconds": 93300,
      "power": null
    },
    {
      "level": "TG1-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG2"
        },
        {
          "buildingId": "embassy",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 21000000,
        "bread": 21000000,
        "stone": 4300000,
        "iron": 1000000,
        "truegold": 31
      },
      "timeSeconds": 93300,
      "power": null
    },
    {
      "level": "TG1-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG2"
        },
        {
          "buildingId": "embassy",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 21000000,
        "bread": 21000000,
        "stone": 4300000,
        "iron": 1000000,
        "truegold": 31
      },
      "timeSeconds": 93300,
      "power": null
    },
    {
      "level": "TG1-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG2"
        },
        {
          "buildingId": "embassy",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 21000000,
        "bread": 21000000,
        "stone": 4300000,
        "iron": 1000000,
        "truegold": 31
      },
      "timeSeconds": 93300,
      "power": null
    },
    {
      "level": "TG2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG2"
        },
        {
          "buildingId": "embassy",
          "level": "TG2"
        }
      ],
      "cost": {
        "wood": 21000000,
        "bread": 21000000,
        "stone": 4300000,
        "iron": 1000000,
        "truegold": 31
      },
      "timeSeconds": 93300,
      "power": null
    },
    {
      "level": "TG2-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG3"
        },
        {
          "buildingId": "embassy",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 23000000,
        "bread": 23000000,
        "stone": 4700000,
        "iron": 1100000,
        "truegold": 47
      },
      "timeSeconds": 114000,
      "power": null
    },
    {
      "level": "TG2-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG3"
        },
        {
          "buildingId": "embassy",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 23000000,
        "bread": 23000000,
        "stone": 4700000,
        "iron": 1100000,
        "truegold": 47
      },
      "timeSeconds": 114000,
      "power": null
    },
    {
      "level": "TG2-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG3"
        },
        {
          "buildingId": "embassy",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 23000000,
        "bread": 23000000,
        "stone": 4700000,
        "iron": 1100000,
        "truegold": 47
      },
      "timeSeconds": 114000,
      "power": null
    },
    {
      "level": "TG2-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG3"
        },
        {
          "buildingId": "embassy",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 23000000,
        "bread": 23000000,
        "stone": 4700000,
        "iron": 1100000,
        "truegold": 47
      },
      "timeSeconds": 114000,
      "power": null
    },
    {
      "level": "TG3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG3"
        },
        {
          "buildingId": "embassy",
          "level": "TG3"
        }
      ],
      "cost": {
        "wood": 23000000,
        "bread": 23000000,
        "stone": 4700000,
        "iron": 1100000,
        "truegold": 47
      },
      "timeSeconds": 114000,
      "power": null
    },
    {
      "level": "TG3-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG4"
        },
        {
          "buildingId": "embassy",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 24000000,
        "bread": 24000000,
        "stone": 4900000,
        "iron": 1200000,
        "truegold": 56
      },
      "timeSeconds": 124380,
      "power": null
    },
    {
      "level": "TG3-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG4"
        },
        {
          "buildingId": "embassy",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 24000000,
        "bread": 24000000,
        "stone": 4900000,
        "iron": 1200000,
        "truegold": 56
      },
      "timeSeconds": 124380,
      "power": null
    },
    {
      "level": "TG3-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG4"
        },
        {
          "buildingId": "embassy",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 24000000,
        "bread": 24000000,
        "stone": 4900000,
        "iron": 1200000,
        "truegold": 56
      },
      "timeSeconds": 124380,
      "power": null
    },
    {
      "level": "TG3-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG4"
        },
        {
          "buildingId": "embassy",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 24000000,
        "bread": 24000000,
        "stone": 4900000,
        "iron": 1200000,
        "truegold": 56
      },
      "timeSeconds": 124380,
      "power": null
    },
    {
      "level": "TG4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG4"
        },
        {
          "buildingId": "embassy",
          "level": "TG4"
        }
      ],
      "cost": {
        "wood": 24000000,
        "bread": 24000000,
        "stone": 4900000,
        "iron": 1200000,
        "truegold": 56
      },
      "timeSeconds": 124380,
      "power": null
    },
    {
      "level": "TG4-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG5"
        },
        {
          "buildingId": "embassy",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 25000000,
        "bread": 25000000,
        "stone": 5000000,
        "iron": 1200000,
        "truegold": 67
      },
      "timeSeconds": 145140,
      "power": null
    },
    {
      "level": "TG4-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG5"
        },
        {
          "buildingId": "embassy",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 25000000,
        "bread": 25000000,
        "stone": 5000000,
        "iron": 1200000,
        "truegold": 67
      },
      "timeSeconds": 145140,
      "power": null
    },
    {
      "level": "TG4-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG5"
        },
        {
          "buildingId": "embassy",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 25000000,
        "bread": 25000000,
        "stone": 5000000,
        "iron": 1200000,
        "truegold": 67
      },
      "timeSeconds": 145140,
      "power": null
    },
    {
      "level": "TG4-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG5"
        },
        {
          "buildingId": "embassy",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 25000000,
        "bread": 25000000,
        "stone": 5000000,
        "iron": 1200000,
        "truegold": 67
      },
      "timeSeconds": 145140,
      "power": null
    },
    {
      "level": "TG5",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG5"
        },
        {
          "buildingId": "embassy",
          "level": "TG5"
        }
      ],
      "cost": {
        "wood": 25000000,
        "bread": 25000000,
        "stone": 5000000,
        "iron": 1200000,
        "truegold": 67
      },
      "timeSeconds": 145140,
      "power": null
    },
    {
      "level": "TG5-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG6"
        },
        {
          "buildingId": "embassy",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 29000000,
        "bread": 29000000,
        "stone": 5800000,
        "iron": 1400000,
        "truegold": 40,
        "temperedTruegold": 2
      },
      "timeSeconds": 155520,
      "power": null
    },
    {
      "level": "TG5-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG6"
        },
        {
          "buildingId": "embassy",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 29000000,
        "bread": 29000000,
        "stone": 5800000,
        "iron": 1400000,
        "truegold": 40,
        "temperedTruegold": 2
      },
      "timeSeconds": 155520,
      "power": null
    },
    {
      "level": "TG5-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG6"
        },
        {
          "buildingId": "embassy",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 29000000,
        "bread": 29000000,
        "stone": 5800000,
        "iron": 1400000,
        "truegold": 40,
        "temperedTruegold": 2
      },
      "timeSeconds": 155520,
      "power": null
    },
    {
      "level": "TG5-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG6"
        },
        {
          "buildingId": "embassy",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 29000000,
        "bread": 29000000,
        "stone": 5800000,
        "iron": 1400000,
        "truegold": 40,
        "temperedTruegold": 2
      },
      "timeSeconds": 155520,
      "power": null
    },
    {
      "level": "TG6",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG6"
        },
        {
          "buildingId": "embassy",
          "level": "TG6"
        }
      ],
      "cost": {
        "wood": 29000000,
        "bread": 29000000,
        "stone": 5800000,
        "iron": 1400000,
        "truegold": 20,
        "temperedTruegold": 5
      },
      "timeSeconds": 155520,
      "power": null
    },
    {
      "level": "TG6-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG7"
        },
        {
          "buildingId": "embassy",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 32000000,
        "bread": 32000000,
        "stone": 6500000,
        "iron": 1600000,
        "truegold": 48,
        "temperedTruegold": 3
      },
      "timeSeconds": 186600,
      "power": null
    },
    {
      "level": "TG6-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG7"
        },
        {
          "buildingId": "embassy",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 32000000,
        "bread": 32000000,
        "stone": 6500000,
        "iron": 1600000,
        "truegold": 48,
        "temperedTruegold": 3
      },
      "timeSeconds": 186600,
      "power": null
    },
    {
      "level": "TG6-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG7"
        },
        {
          "buildingId": "embassy",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 32000000,
        "bread": 32000000,
        "stone": 6500000,
        "iron": 1600000,
        "truegold": 48,
        "temperedTruegold": 3
      },
      "timeSeconds": 186600,
      "power": null
    },
    {
      "level": "TG6-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG7"
        },
        {
          "buildingId": "embassy",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 32000000,
        "bread": 32000000,
        "stone": 6500000,
        "iron": 1600000,
        "truegold": 48,
        "temperedTruegold": 3
      },
      "timeSeconds": 186600,
      "power": null
    },
    {
      "level": "TG7",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG7"
        },
        {
          "buildingId": "embassy",
          "level": "TG7"
        }
      ],
      "cost": {
        "wood": 32000000,
        "bread": 32000000,
        "stone": 6500000,
        "iron": 1600000,
        "truegold": 24,
        "temperedTruegold": 7
      },
      "timeSeconds": 186600,
      "power": null
    },
    {
      "level": "TG7-1",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG8"
        },
        {
          "buildingId": "embassy",
          "level": "TG8"
        }
      ],
      "cost": {
        "wood": 39000000,
        "bread": 39000000,
        "stone": 7900000,
        "iron": 1900000,
        "truegold": 48,
        "temperedTruegold": 4
      },
      "timeSeconds": 207360,
      "power": null
    },
    {
      "level": "TG7-2",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG8"
        },
        {
          "buildingId": "embassy",
          "level": "TG8"
        }
      ],
      "cost": {
        "wood": 39000000,
        "bread": 39000000,
        "stone": 7900000,
        "iron": 1900000,
        "truegold": 48,
        "temperedTruegold": 4
      },
      "timeSeconds": 207360,
      "power": null
    },
    {
      "level": "TG7-3",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG8"
        },
        {
          "buildingId": "embassy",
          "level": "TG8"
        }
      ],
      "cost": {
        "wood": 39000000,
        "bread": 39000000,
        "stone": 7900000,
        "iron": 1900000,
        "truegold": 48,
        "temperedTruegold": 4
      },
      "timeSeconds": 207360,
      "power": null
    },
    {
      "level": "TG7-4",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG8"
        },
        {
          "buildingId": "embassy",
          "level": "TG8"
        }
      ],
      "cost": {
        "wood": 39000000,
        "bread": 39000000,
        "stone": 7900000,
        "iron": 1900000,
        "truegold": 48,
        "temperedTruegold": 4
      },
      "timeSeconds": 207360,
      "power": null
    },
    {
      "level": "TG8",
      "requirements": [
        {
          "buildingId": "townCenter",
          "level": "TG8"
        },
        {
          "buildingId": "embassy",
          "level": "TG8"
        }
      ],
      "cost": {
        "wood": 39000000,
        "bread": 39000000,
        "stone": 7900000,
        "iron": 1900000,
        "truegold": 24,
        "temperedTruegold": 8
      },
      "timeSeconds": 207360,
      "power": null
    }
  ]
};
