import { TechIconImage, BreadIcon, WoodIcon, StoneIcon, IronIcon, ClockIcon } from '../research/ResearchIcons';

export { BreadIcon, WoodIcon, StoneIcon, IronIcon, ClockIcon, TechIconImage };

export function TruegoldIcon() {
  return <TechIconImage src="/buildings/truegold.png" alt="Truegold" />;
}

export function TemperedTruegoldIcon() {
  return <TechIconImage src="/buildings/tempered-truegold.png" alt="Tempered Truegold" />;
}

export function ConstructionSpeedupIcon() {
  return <TechIconImage src="/buildings/construction-speedup.png" alt="Construction Speed" />;
}
