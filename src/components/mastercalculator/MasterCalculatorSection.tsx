'use client';

import { useMemo, useState } from 'react';
import { MASTERS } from '@/lib/masters';
import { costForAffinityRange, costForSkillRange, costForResearchRange } from '@/lib/masterCalc';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import MasterPicker from './MasterPicker';
import AffinityPlanner from './AffinityPlanner';
import TalentCard from './TalentCard';
import SkillCard from './SkillCard';
import ResearchPlanner from './ResearchPlanner';
import MasterMaterialsPanel from './MasterMaterialsPanel';
import MasterResultsSidebar from './MasterResultsSidebar';
import CompareMasters from './CompareMasters';

interface LevelRange {
  current: number;
  target: number;
}

interface MasterProgress {
  affinity: LevelRange;
  talent: LevelRange;
  skills: LevelRange[];
  research: LevelRange;
}

function defaultProgress(): MasterProgress {
  return {
    affinity: { current: 0, target: 0 },
    talent: { current: 0, target: 0 },
    skills: [{ current: 0, target: 0 }, { current: 0, target: 0 }, { current: 0, target: 0 }, { current: 0, target: 0 }],
    research: { current: 0, target: 0 },
  };
}

export default function MasterCalculatorSection() {
  const [view, setView] = useState<'plan' | 'compare'>('plan');
  const [selectedId, setSelectedId] = useLocalStorageState<string | null>('masterCalculator:selected', null);
  const [progressByMaster, setProgressByMaster] = useLocalStorageState<Record<string, MasterProgress>>('masterCalculator:progress', {});
  const [owned, setOwned] = useLocalStorageState<Record<string, number>>('masterCalculator:owned', {});

  const master = selectedId ? MASTERS[selectedId] : null;
  const progress = (selectedId && progressByMaster[selectedId]) || defaultProgress();

  const updateProgress = (patch: Partial<MasterProgress>) => {
    if (!selectedId) return;
    setProgressByMaster((prev) => ({
      ...prev,
      [selectedId]: { ...(prev[selectedId] || defaultProgress()), ...patch },
    }));
  };

  const affinityResult = useMemo(() => {
    if (!master) return null;
    return costForAffinityRange(master, progress.affinity.current, progress.affinity.target);
  }, [master, progress.affinity]);

  const skillResults = useMemo(() => {
    if (!master) return [];
    return master.skills.map((skill, i) => {
      const range = progress.skills[i] || { current: 0, target: 0 };
      return costForSkillRange(skill, range.current, range.target);
    });
  }, [master, progress.skills]);

  const researchResult = useMemo(() => {
    if (!master) return null;
    return costForResearchRange(master, progress.research.current, progress.research.target);
  }, [master, progress.research]);

  const requiredRecord: Record<string, number> = useMemo(() => {
    const emblems = (affinityResult?.totalEmblems ?? 0) + (researchResult?.totalEmblems ?? 0);
    const manuscripts = skillResults.reduce((sum, r) => sum + (r?.totalManuscripts ?? 0), 0);
    const learningXp = skillResults.reduce((sum, r) => sum + (r?.totalLearningXP ?? 0), 0);
    const affinityXp = affinityResult?.totalPoints ?? 0;
    return { emblems, manuscripts, learningXp, affinityXp };
  }, [affinityResult, researchResult, skillResults]);

  // The 3 Affinity gift denominations are entered as raw item counts (how
  // many Small/Medium/Large gifts you own), same as Hero Gear's XP items --
  // this derives the combined Affinity total from them for the sidebar's
  // Required/Have comparison, without polluting the raw counts themselves.
  const ownedForSidebar = useMemo(() => {
    const affinityXp = (owned.affinityGift10 ?? 0) * 10 + (owned.affinityGift100 ?? 0) * 100 + (owned.affinityGift1000 ?? 0) * 1000;
    return { ...owned, affinityXp };
  }, [owned]);

  const selections = useMemo(() => {
    if (!master) return [];
    const list: { label: string; current: number; target: number }[] = [
      { label: 'Affinity', current: progress.affinity.current, target: progress.affinity.target },
      { label: master.talent.name, current: progress.talent.current, target: progress.talent.target },
      { label: 'Special Research', current: progress.research.current, target: progress.research.target },
    ];
    master.skills.forEach((skill, i) => {
      const r = progress.skills[i] || { current: 0, target: 0 };
      list.push({ label: skill.name, current: r.current, target: r.target });
    });
    return list;
  }, [master, progress]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="section-title">Masters Calculator</h1>
          <p className="text-xs text-parchment-400 mt-0.5">
            Pick a Master, then plan Affinity, Talent, Skills, and Special Research -- see exactly what you need.
          </p>
        </div>
        <div className="flex gap-1.5 rounded-lg border border-stone-700 bg-stone-900 p-1">
          {(['plan', 'compare'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`focus-ring rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                view === v ? 'bg-gold-500 text-stone-950' : 'text-parchment-400 hover:text-parchment-100'
              }`}
            >
              {v === 'plan' ? 'Plan a Master' : 'Compare Masters'}
            </button>
          ))}
        </div>
      </div>

      {view === 'compare' && <CompareMasters />}

      {view === 'plan' && <MasterPicker selectedId={selectedId} onSelect={setSelectedId} />}

      {view === 'plan' && master && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="flex flex-col gap-5 min-w-0">
            <MasterMaterialsPanel owned={owned} onChangeOwned={(id, value) => setOwned((prev) => ({ ...prev, [id]: value }))} />

            <AffinityPlanner
              master={master}
              current={progress.affinity.current}
              target={progress.affinity.target}
              onChange={(affinity) => updateProgress({ affinity })}
            />

            <TalentCard
              talent={master.talent}
              current={progress.talent.current}
              target={progress.talent.target}
              onChange={(talent) => updateProgress({ talent })}
            />

            <div className="flex flex-col gap-3">
              <h2 className="section-title text-base">Skills</h2>
              {master.skills.map((skill, i) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  index={i}
                  current={progress.skills[i]?.current ?? 0}
                  target={progress.skills[i]?.target ?? 0}
                  currentAffinity={progress.affinity.current}
                  onChange={(range) => {
                    const skills = [...progress.skills];
                    skills[i] = range;
                    updateProgress({ skills });
                  }}
                  onRequireAffinity={(affinityNeeded) =>
                    updateProgress({ affinity: { current: progress.affinity.current, target: Math.max(progress.affinity.target, affinityNeeded) } })
                  }
                />
              ))}
            </div>

            <ResearchPlanner
              master={master}
              currentAffinity={progress.affinity.current}
              current={progress.research.current}
              target={progress.research.target}
              onChange={(research) => updateProgress({ research })}
            />
          </div>

          <div className="lg:sticky lg:top-20">
            <MasterResultsSidebar masterName={master.name} selections={selections} required={requiredRecord} owned={ownedForSidebar} />
          </div>
        </div>
      )}
    </div>
  );
}
