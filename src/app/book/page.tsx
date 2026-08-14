'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import UTCClock from '@/components/UTCClock';
import SlotSelector from '@/components/SlotSelector';
import ApplicationSidebar from '@/components/ApplicationSidebar';
import { deriveDisplayStatus, generateSlotStartTimes } from '@/lib/slots';
import type { CastleSlot, EventSettings } from '@/types';

const DRAFT_KEY = 'kingshot_booking_draft';
const FOLDER_KEY = 'kingshot_application_folder_id';

// Mirrors the defaults `schema.sql` seeds event_settings with, so the grid
// still renders (with every slot marked available) before a real Supabase
// project is connected -- only the booked/pending status needs the DB.
const PREVIEW_SETTINGS: EventSettings = {
  id: 1,
  event_name: 'KingShot Castle Appointments',
  event_date: new Date().toISOString().substring(0, 10),
  start_time_utc: '00:15',
  num_slots: 49,
  slot_interval_minutes: 30,
  slot_duration_minutes: 30,
  applications_open: true,
  lock_past_slots: true,
  updated_at: new Date().toISOString(),
};

function buildPreviewSlots(): CastleSlot[] {
  const now = new Date();
  return generateSlotStartTimes(PREVIEW_SETTINGS).map((start, i) => ({
    slot_id: `preview-${i}`,
    slot_index: i,
    start_time_utc: start.toISOString(),
    status: deriveDisplayStatus(
      'available',
      start.toISOString(),
      PREVIEW_SETTINGS.slot_duration_minutes,
      now,
      PREVIEW_SETTINGS.lock_past_slots
    ),
    accepted_application_id: null,
    created_at: new Date().toISOString(),
  }));
}

interface Draft {
  playerName: string;
  selectedSlotIds: string[];
  mainScreenshotPath: string | null;
  resourcesScreenshotPath: string | null;
}

const EMPTY_DRAFT: Draft = {
  playerName: '',
  selectedSlotIds: [],
  mainScreenshotPath: null,
  resourcesScreenshotPath: null,
};

function readStoredDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
  } catch {
    // ignore corrupt draft
  }
  return null;
}

function getOrCreateFolderId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(FOLDER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(FOLDER_KEY, id);
  }
  return id;
}

export default function BookPage() {
  const { t } = useI18n();

  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [slots, setSlots] = useState<CastleSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [folderId, setFolderId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; main?: boolean; resources?: boolean }>({});

  useEffect(() => {
    setFolderId(getOrCreateFolderId());
    const stored = readStoredDraft();
    if (stored) setDraft(stored);
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    // Guard on draftLoaded so the initial empty state doesn't overwrite a
    // saved draft before we've had a chance to read it back.
    if (!draftLoaded) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, draftLoaded]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch('/api/slots', { cache: 'no-store' });
      const data = await res.json();

      if (!data?.settings || !Array.isArray(data.slots) || data.slots.length === 0) {
        // No live Supabase project connected yet (or it has no slots seeded).
        // Show the full 49-slot grid locally so the layout can still be
        // reviewed -- every slot is just marked available since real
        // booked/pending status genuinely requires the database.
        setPreviewMode(true);
        setSettings(PREVIEW_SETTINGS);
        setSlots(buildPreviewSlots());
        return;
      }

      setPreviewMode(false);
      setSettings(data.settings);
      const now = new Date();
      const withStatus: CastleSlot[] = data.slots.map((s: CastleSlot) => ({
        ...s,
        status: deriveDisplayStatus(
          s.status,
          s.start_time_utc,
          data.settings?.slot_duration_minutes ?? 30,
          now,
          data.settings?.lock_past_slots ?? true
        ),
      }));
      setSlots(withStatus);
    } catch {
      setPreviewMode(true);
      setSettings(PREVIEW_SETTINGS);
      setSlots(buildPreviewSlots());
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const selectedIds = useMemo(() => new Set(draft.selectedSlotIds), [draft.selectedSlotIds]);
  const selectedSlots = useMemo(() => slots.filter((s) => selectedIds.has(s.slot_id)), [slots, selectedIds]);

  const toggleSlot = (slotId: string) => {
    setDraft((d) => {
      const isSelected = d.selectedSlotIds.includes(slotId);
      return {
        ...d,
        selectedSlotIds: isSelected ? d.selectedSlotIds.filter((id) => id !== slotId) : [...d.selectedSlotIds, slotId],
      };
    });
  };

  const clearAllSlots = () => setDraft((d) => ({ ...d, selectedSlotIds: [] }));

  const selectAllAvailable = () => {
    const availableIds = slots.filter((s) => s.status === 'available' || s.status === 'pending').map((s) => s.slot_id);
    setDraft((d) => ({ ...d, selectedSlotIds: Array.from(new Set([...d.selectedSlotIds, ...availableIds])) }));
  };

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!draft.playerName.trim()) errors.name = true;
    if (!draft.mainScreenshotPath) errors.main = true;
    if (!draft.resourcesScreenshotPath) errors.resources = true;
    setFieldErrors(errors);

    // Report the most specific problem first, rather than a blanket message.
    if (errors.name) {
      setFormError(t('booking.playerNameRequired'));
      return false;
    }
    if (errors.main || errors.resources) {
      setFormError(t('booking.errorUploadBoth'));
      return false;
    }
    if (draft.selectedSlotIds.length === 0) {
      setFormError(t('booking.errorNoSlots'));
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: draft.playerName,
          player_id: null,
          alliance: '',
          main_account_screenshot_url: draft.mainScreenshotPath,
          resources_screenshot_url: draft.resourcesScreenshotPath,
          slot_ids: draft.selectedSlotIds,
        }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.removeItem(DRAFT_KEY);
        sessionStorage.removeItem(FOLDER_KEY);
        setSubmitted(true);
        return;
      }

      if (data.reason === 'slots_unavailable') {
        const unavailable: string[] = data.unavailable_slot_ids || [];
        setDraft((d) => ({ ...d, selectedSlotIds: d.selectedSlotIds.filter((id) => !unavailable.includes(id)) }));
        setFormError(t('booking.errorSlotsTaken'));
        await fetchSlots();
        return;
      }

      if (data.reason === 'applications_closed') {
        setFormError(t('booking.applicationsClosedBody'));
        return;
      }

      setFormError(t('booking.errorGeneric'));
    } catch (err) {
      console.error(err);
      setFormError(t('booking.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-gold-300">{t('booking.successTitle')}</h1>
        <p className="text-parchment-300 mt-2 leading-relaxed text-sm">{t('booking.successBody')}</p>
        <Link
          href="/"
          className="focus-ring inline-block mt-6 rounded-md border border-stone-700 px-5 py-2 text-sm text-parchment-100 hover:border-gold-600 transition-colors"
        >
          {t('booking.backHome')}
        </Link>
      </div>
    );
  }

  if (settings && !settings.applications_open) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-parchment-100">{t('booking.applicationsClosedTitle')}</h1>
        <p className="text-parchment-300 mt-2 text-sm">{t('booking.applicationsClosedBody')}</p>
        <Link
          href="/schedule"
          className="focus-ring inline-block mt-6 rounded-md border border-stone-700 px-5 py-2 text-sm text-parchment-100 hover:border-gold-600 transition-colors"
        >
          {t('home.viewSchedule')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 pb-8">
      <div className="sm:hidden mb-4 flex justify-center">
        <UTCClock />
      </div>

      <h1 className="text-lg font-semibold text-parchment-100 mb-4">{t('booking.pageTitle')}</h1>

      {previewMode && (
        <div className="mb-4 rounded border-l-2 border-sky-500 bg-stone-900 px-3 py-2 text-sm text-sky-300">
          {t('booking.previewModeBanner')}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
        {/* Main area: clock (desktop) + slot heatmap */}
        <div className="flex flex-col gap-5 min-w-0 order-1 lg:order-none">
          <div className="hidden sm:flex justify-start">
            <UTCClock sticky />
          </div>

          {loadingSlots ? (
            <p className="text-center text-parchment-400 py-16">{t('common.loading')}</p>
          ) : (
            <SlotSelector
              slots={slots}
              selectedIds={selectedIds}
              slotDurationMinutes={settings?.slot_duration_minutes ?? 30}
              onToggle={toggleSlot}
              onClearAll={clearAllSlots}
              onSelectAllAvailable={selectAllAvailable}
            />
          )}
        </div>

        {/* Sidebar: player info, uploads, selected chips, submit */}
        <div className="order-2 lg:order-none">
          <ApplicationSidebar
            playerName={draft.playerName}
            onChangeName={(v) => setDraft((d) => ({ ...d, playerName: v }))}
            fieldErrors={fieldErrors}
            folderId={folderId}
            mainScreenshotPath={draft.mainScreenshotPath}
            resourcesScreenshotPath={draft.resourcesScreenshotPath}
            onUploadedMain={(path) => setDraft((d) => ({ ...d, mainScreenshotPath: path }))}
            onUploadedResources={(path) => setDraft((d) => ({ ...d, resourcesScreenshotPath: path }))}
            onRemoveMain={() => setDraft((d) => ({ ...d, mainScreenshotPath: null }))}
            onRemoveResources={() => setDraft((d) => ({ ...d, resourcesScreenshotPath: null }))}
            selectedSlots={selectedSlots}
            onRemoveSlot={toggleSlot}
            formError={formError}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
