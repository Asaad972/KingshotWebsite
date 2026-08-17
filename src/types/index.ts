export type Locale = 'en' | 'ar' | 'tr' | 'sr';

export type SlotStatus = 'available' | 'pending' | 'booked' | 'past';

export interface CastleSlot {
  slot_id: string;
  slot_index: number;
  start_time_utc: string; // ISO timestamp
  status: SlotStatus;
  accepted_application_id: string | null;
  created_at: string;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  application_id: string;
  player_name: string;
  player_id: string | null;
  alliance: string;
  main_account_screenshot_url: string;
  resources_screenshot_url: string;
  status: ApplicationStatus;
  created_at: string;
}

export type ApplicationSlotStatus = 'active' | 'removed_after_acceptance' | 'rejected';

export interface ApplicationSlot {
  id: string;
  application_id: string;
  slot_id: string;
  status: ApplicationSlotStatus;
  created_at: string;
  // joined fields (optional, populated by some queries)
  application?: Application;
  slot?: CastleSlot;
}

export interface EventSettings {
  id: number;
  event_name: string;
  event_date: string; // YYYY-MM-DD
  start_time_utc: string; // HH:MM
  num_slots: number;
  slot_interval_minutes: number;
  slot_duration_minutes: number;
  applications_open: boolean;
  lock_past_slots: boolean;
  updated_at: string;
}

export interface SlotWithApplicants extends CastleSlot {
  applicants: Array<{
    application_slot_id: string;
    application: Application;
  }>;
}

export interface SubmitApplicationPayload {
  player_name: string;
  player_id: string | null;
  alliance: string;
  main_account_screenshot_url: string;
  resources_screenshot_url: string;
  slot_ids: string[];
}
