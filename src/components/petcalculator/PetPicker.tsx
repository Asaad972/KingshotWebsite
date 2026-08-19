'use client';

import { useState } from 'react';
import { PETS, PET_ORDER } from '@/lib/pets';
import PetPortrait from './PetPortrait';

export default function PetPicker({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = PETS[selectedId];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring w-full flex items-center gap-3 rounded-md border border-stone-700 bg-stone-950 p-2.5 hover:border-gold-600/60 transition-colors"
      >
        <PetPortrait src={selected.image} alt={selected.name} className="h-14 w-14 shrink-0 rounded-md" />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-parchment-100">{selected.name}</p>
          <p className="text-[11px] text-parchment-500">Max Lv.{selected.maxLevel} -- tap to change</p>
        </div>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-parchment-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2 rounded-md border border-stone-700 bg-stone-900 p-2.5">
          {PET_ORDER.map((id) => {
            const pet = PETS[id];
            const isSelected = id === selectedId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onSelect(id);
                  setOpen(false);
                }}
                className={`focus-ring flex flex-col items-center gap-1 rounded-md border p-1.5 transition-colors ${
                  isSelected ? 'border-gold-500 bg-gold-500/10' : 'border-stone-700 hover:border-stone-500'
                }`}
              >
                <PetPortrait src={pet.image} alt={pet.name} className="h-12 w-12 rounded" />
                <span className="text-[10px] text-parchment-300 text-center leading-tight">{pet.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
