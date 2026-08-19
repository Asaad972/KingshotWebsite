'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import UTCClock from '@/components/UTCClock';
import SlotSelector from '@/components/SlotSelector';
import ApplicationSidebar from '@/components/ApplicationSidebar';
import BookingGuide from '@/components/BookingGuide';
import { deriveDisplayStatus } from '@/lib/slots';
import type { CastleSlot, EventSettings } from '@/types';

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

function getOrCreateFolderId(key: string): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function KingdomBookPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { t } = useI18n();
  const DRAFT_KEY = `kingshot_booking_draft_${slug}`;
  const FOLDER_KEY = `kingshot_application_folder_id_${slug}`;

  const [kingdomName, setKingdomName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [slots, setSlots] = useState<CastleSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [folderId, setFolderId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; main?: boolean; resources?: boolean }>({});

  useEffect(() => {
    setFolderId(getOrCreateFolderId(FOLDER_KEY));
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) setDraft({ ...EMPTY_DRAFT, ...JSON.parse(raw) });
    } catch {
      // ignore corrupt draft
    }
    setDraftLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!draftLoaded) return;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, draftLoaded, DRAFT_KEY]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/k/${slug}/slots`, { cache: 'no-store' });
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setKingdomName(data.kingdom?.name ?? null);
      setSettings(data.settings);
      const now = new Date();
      const withStatus: CastleSlot[] = (data.slots || []).map((s: CastleSlot) => ({
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
      setNotFound(true);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
      const res = await fetch(`/api/k/${slug}/applications`, {
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

  if (notFound) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-parchment-100">Kingdom not found</h1>
        <p className="text-parchment-300 mt-2 text-sm">
          This booking link doesn't match any kingdom. Double-check the link, or{' '}
          <Link href="/start" className="text-gold-300 hover:underline">
            set up your own
          </Link>
          .
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-gold-300">{t('booking.successTitle')}</h1>
        <p className="text-parchment-300 mt-2 leading-relaxed text-sm">{t('booking.successBody')}</p>
      </div>
    );
  }

  if (settings && !settings.applications_open) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-parchment-100">{t('booking.applicationsClosedTitle')}</h1>
        <p className="text-parchment-300 mt-2 text-sm">{t('booking.applicationsClosedBody')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 pb-8">
      <div className="sm:hidden mb-4 flex justify-center">
        <UTCClock />
      </div>

      <h1 className="section-title mb-4">
        {kingdomName ? `${kingdomName} — ` : ''}
        {t('booking.pageTitle')}
      </h1>

      <BookingGuide />

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
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
