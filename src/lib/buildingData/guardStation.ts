import type { Building } from '../buildingTypes';

// Real data from kingshotdata.com/buildings/guard-station/ (read 2026-08-19).
export const guardStationBuilding: Building = {
  "id": "guardStation",
  "name": "Guard Station",
  "image": "/buildings/guard-building.png",
  "levels": [
    {
      "level": "1",
      "requirements": [],
      "cost": {},
      "timeSeconds": 0,
      "power": 400
    },
    {
      "level": "2",
      "requirements": [],
      "cost": {
        "wood": 5300,
        "stone": 1000
      },
      "timeSeconds": 10,
      "power": 3100
    },
    {
      "level": "3",
      "requirements": [],
      "cost": {
        "wood": 88000,
        "stone": 17000,
        "iron": 4400
      },
      "timeSeconds": 1290,
      "power": 9400
    },
    {
      "level": "4",
      "requirements": [],
      "cost": {
        "wood": 420000,
        "bread": 420000,
        "stone": 84000,
        "iron": 21000
      },
      "timeSeconds": 3870,
      "power": 21940
    },
    {
      "level": "5",
      "requirements": [],
      "cost": {
        "wood": 1400000,
        "bread": 1400000,
        "stone": 290000,
        "iron": 74000
      },
      "timeSeconds": 13140,
      "power": 47240
    },
    {
      "level": "6",
      "requirements": [],
      "cost": {
        "wood": 5300000,
        "bread": 5300000,
        "stone": 1000000,
        "iron": 260000
      },
      "timeSeconds": 35550,
      "power": 86360
    },
    {
      "level": "7",
      "requirements": [],
      "cost": {
        "wood": 15000000,
        "bread": 15000000,
        "stone": 3000000,
        "iron": 750000
      },
      "timeSeconds": 135840,
      "power": 149500
    },
    {
      "level": "8",
      "requirements": [],
      "cost": {
        "wood": 37000000,
        "bread": 37000000,
        "stone": 7400000,
        "iron": 1800000
      },
      "timeSeconds": 262500,
      "power": 217320
    },
    {
      "level": "9",
      "requirements": [],
      "cost": {
        "wood": 61000000,
        "bread": 61000000,
        "stone": 12000000,
        "iron": 3000000
      },
      "timeSeconds": 347160,
      "power": 267920
    },
    {
      "level": "10",
      "requirements": [],
      "cost": {
        "wood": 75000000,
        "bread": 75000000,
        "stone": 15000000,
        "iron": 3700000
      },
      "timeSeconds": 416640,
      "power": 304700
    }
  ]
};
