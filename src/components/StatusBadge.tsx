type Tone = 'gold' | 'moss' | 'ember' | 'sky' | 'neutral';

const TONE_CLASSES: Record<Tone, string> = {
  gold: 'bg-gold-500/15 text-gold-300 border-gold-600/40',
  moss: 'bg-moss-500/15 text-moss-500 border-moss-500/40',
  ember: 'bg-ember-500/15 text-ember-500 border-ember-600/40',
  sky: 'bg-sky-500/15 text-sky-400 border-sky-500/40',
  neutral: 'bg-stone-700/40 text-parchment-300 border-stone-600/50',
};

export default function StatusBadge({
  tone = 'neutral',
  children,
  icon,
}: {
  tone?: Tone;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${TONE_CLASSES[tone]}`}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}
