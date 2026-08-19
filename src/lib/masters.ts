import type { Master } from './masterTypes';
import { valoraMaster } from './masterData/valora';
import { panMaster } from './masterData/pan';
import { romanMaster } from './masterData/roman';
import { cassiaMaster } from './masterData/cassia';
import { wilsonMaster } from './masterData/wilson';
import { guinevereMaster } from './masterData/guinevere';

/** Every master the calculator knows about, in kingshotdata.com's own listing order. */
export const MASTERS: Record<string, Master> = {
  valora: valoraMaster,
  pan: panMaster,
  roman: romanMaster,
  cassia: cassiaMaster,
  wilson: wilsonMaster,
  guinevere: guinevereMaster,
};

export const MASTER_ORDER: string[] = Object.keys(MASTERS);

export function getMaster(id: string): Master | undefined {
  return MASTERS[id];
}
