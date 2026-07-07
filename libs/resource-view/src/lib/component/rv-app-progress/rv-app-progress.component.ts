import { Component, input } from '@angular/core';

export type RvAppStatus = 'RUNNING' | 'STOPPED' | 'STARTING';

/**
 * Dumb component that renders the "starting…" progress and error states of an app process.
 * Shared between the resource-detail panel (rv-view-app) and the standalone open-app interstitial
 * so both show the exact same progress UI. Does NOT render the running iframe.
 */
@Component({
  selector: 'rv-app-progress',
  templateUrl: './rv-app-progress.component.html',
  styleUrl: './rv-app-progress.component.scss',
  standalone: false,
})
export class RvAppProgressComponent {
  status = input.required<RvAppStatus>();
  statusText = input<string | undefined>();
}
