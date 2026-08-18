'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

/** Add/update-my-profile form. No login -- submitting again with the same
 * Player ID just overwrites the previous entry, so "editing" is just
 * resubmitting the form with updated numbers. */
export default function PlayerProfileForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (playerId: string) => void;
}) {
  const { t } = useI18n();
  const [playerId, setPlayerId] = useState('');
  const [name, setName] = useState('');
  const [alliance, setAlliance] = useState('');
  const [power, setPower] = useState('');
  const [kills, setKills] = useState('');
  const [vipLevel, setVipLevel] = useState('');
  const [furnaceLevel, setFurnaceLevel] = useState('');
  const [kingdom, setKingdom] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = playerId.trim() !== '' && name.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: playerId.trim(),
          player_name: name.trim(),
          alliance: alliance.trim(),
          power: power.trim(),
          kills: kills.trim(),
          vip_level: vipLevel.trim(),
          furnace_level: furnaceLevel.trim(),
          kingdom: kingdom.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSaved(data.playerId);
      } else {
        setError(t('players.errorGeneric'));
      }
    } catch {
      setError(t('players.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card p-5 flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-parchment-100">{t('players.formTitle')}</h2>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring shrink-0 rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
        >
          {t('common.close')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field
          label={t('players.fieldPlayerId')}
          value={playerId}
          onChange={setPlayerId}
          required
          inputMode="numeric"
          placeholder="e.g. 12345678"
        />
        <Field label={t('players.fieldName')} value={name} onChange={setName} required />
        <Field label={t('players.fieldAlliance')} value={alliance} onChange={setAlliance} placeholder="e.g. BBQ" />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('players.fieldPower')} value={power} onChange={setPower} inputMode="numeric" />
          <Field label={t('players.fieldKills')} value={kills} onChange={setKills} inputMode="numeric" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('players.fieldVipLevel')} value={vipLevel} onChange={setVipLevel} inputMode="numeric" />
          <Field label={t('players.fieldFurnaceLevel')} value={furnaceLevel} onChange={setFurnaceLevel} placeholder="e.g. 55" />
        </div>
        <Field label={t('players.fieldKingdom')} value={kingdom} onChange={setKingdom} placeholder="1781" />

        {error && (
          <div className="rounded border border-ember-600/50 bg-ember-500/10 px-3 py-2 text-xs text-ember-500">{error}</div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="focus-ring w-full rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-60"
        >
          {submitting ? t('players.submitting') : t('players.submitButton')}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  inputMode,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  inputMode?: 'numeric' | 'text';
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-parchment-300 mb-1 block">
        {label} {required && <span className="text-gold-400">*</span>}
      </span>
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-full rounded border bg-stone-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 border-stone-700 focus:border-gold-600"
      />
    </label>
  );
}
