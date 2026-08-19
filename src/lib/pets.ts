import type { Pet } from './petTypes';
import { grizzlyBearPet } from './petData/grizzlyBear';
import { lionPet } from './petData/lion';
import { cheetahPet } from './petData/cheetah';
import { moosePet } from './petData/moose';
import { bisonPet } from './petData/bison';
import { grayWolfPet } from './petData/grayWolf';
import { lynxPet } from './petData/lynx';
import { ironcladWarBearPet } from './petData/ironcladWarBear';
import { ironcladWarElephantPet } from './petData/ironcladWarElephant';
import { regalWhiteLionPet } from './petData/regalWhiteLion';
import { alphaBlackPantherPet } from './petData/alphaBlackPanther';
import { greatMoosePet } from './petData/greatMoose';
import { giantRhinoPet } from './petData/giantRhino';
import { mightyBisonPet } from './petData/mightyBison';

/** Every pet the calculator knows about, in the same order kingshotdata.com
 * lists them (newest first). */
export const PETS: Record<string, Pet> = {
  ironcladWarBear: ironcladWarBearPet,
  ironcladWarElephant: ironcladWarElephantPet,
  regalWhiteLion: regalWhiteLionPet,
  alphaBlackPanther: alphaBlackPantherPet,
  greatMoose: greatMoosePet,
  giantRhino: giantRhinoPet,
  mightyBison: mightyBisonPet,
  grizzlyBear: grizzlyBearPet,
  lion: lionPet,
  cheetah: cheetahPet,
  moose: moosePet,
  bison: bisonPet,
  grayWolf: grayWolfPet,
  lynx: lynxPet,
};

export const PET_ORDER: string[] = Object.keys(PETS);

export function getPet(id: string): Pet | undefined {
  return PETS[id];
}
