import { Component, input } from '@angular/core';
import { DateTime } from 'luxon';

/**
 * A running-task loader row shown by lml-status-banners. Both the data-lab
 * (LmlLabManagerStatus) and ca-space (CaLabBusyStatusDTO) status shapes map onto this.
 */
export interface LmlStatusBannerBusy {
  mainText: string;
  subText?: string;
  progress?: { percent: number; message?: string };
  datetime?: DateTime;
}

/** An action button rendered on a banner. `label` is a translation key. */
export interface LmlStatusBannerAction {
  label: string;
  action: () => void;
}

/** The error banner. `body` is already-translated text. */
export interface LmlStatusBannerError {
  body: string;
  /** Translation key for the banner title. Defaults to 'lml.error'. */
  title?: string;
  /** Action buttons shown on the banner (e.g. "view errors", "restart"). */
  actions?: LmlStatusBannerAction[];
}

/**
 * A warning banner (amber, non-blocking). At least one of `title` (a translation key) or
 * `body` (already-translated text) should be set; when only `title` is given it is shown as
 * the banner's main line.
 */
export interface LmlStatusBannerWarning {
  /** Translation key for the banner title / main line. */
  title?: string;
  /** Already-translated body text. */
  body?: string;
  /** Action buttons shown on the banner. */
  actions?: LmlStatusBannerAction[];
}

/** The "restart needed" banner. Titles/labels are translation keys with defaults. */
export interface LmlStatusBannerRestart {
  action: () => void;
  title?: string;
  body?: string;
  buttonLabel?: string;
}

/** The "new version available" banner. Titles/labels are translation keys with defaults. */
export interface LmlStatusBannerNewVersion {
  action: () => void;
  title?: string;
  buttonLabel?: string;
}

/**
 * The full configuration of the status banners. Every section is optional; a section is
 * rendered only when its entry is set.
 */
export interface LmlStatusBannersConfig {
  busy?: LmlStatusBannerBusy | null;
  error?: LmlStatusBannerError | null;
  warning?: LmlStatusBannerWarning | null;
  restart?: LmlStatusBannerRestart | null;
  newVersion?: LmlStatusBannerNewVersion | null;
}

/**
 * Presentational stack of lab status notices, driven by a single `config` input (no state
 * injection). Renders, top to bottom, only the sections present in the config:
 *  - a loader row for a running task (`busy`)
 *  - an error banner with any number of action buttons (`error`)
 *  - a warning banner with any number of action buttons (`warning`)
 *  - a "restart needed" banner with a restart action (`restart`)
 *  - a "new version available" banner with an update action (`newVersion`)
 *
 * Callers map their own status source onto this config, so the same UI is shared across the
 * data-lab manager and the ca-space lab pages. Actions are callbacks carried by the config.
 */
@Component({
  selector: 'lml-status-banners',
  templateUrl: './lml-status-banners.component.html',
  styleUrls: ['./lml-status-banners.component.scss'],
  standalone: false,
})
export class LmlStatusBannersComponent {
  config = input.required<LmlStatusBannersConfig>();

  // Default translation keys for the optional banner labels.
  readonly defaultErrorTitle = 'lml.error';
  readonly defaultRestartTitle = 'lml.lab_config_changed_title';
  readonly defaultRestartBody = 'lml.lab_config_restart_hint';
  readonly defaultRestartButtonLabel = 'lml.lab_manager_restart';
  readonly defaultNewVersionTitle = 'lml.new_lab_manager_version';
  readonly defaultNewVersionButtonLabel = 'lml.update_lab_manager';
}
