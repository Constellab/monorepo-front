import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LmlLabManagerLibModule, LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

/**
 * Advanced configuration section of the lab (config page). Renders — flat, without an
 * expansion panel — the lab-manager advanced actions, MCP toggle, custom env variables
 * and docker services. When the lab manager is not running, shows an empty state.
 * Only accessible to the lab owner.
 *
 * Requires LmlLabManagerState to be provided by the lab detail page.
 */
@Component({
  selector: 'ca-lab-manager',
  templateUrl: './ca-lab-manager.component.html',
  styleUrls: ['./ca-lab-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LmlLabManagerLibModule,
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabManagerComponent implements OnInit, OnDestroy {
  private managerState = inject(LmlLabManagerState);

  labManagerIsRunning$: Observable<boolean> = this.managerState.labManagerIsRunning$();

  private subscription: Subscription;

  ngOnInit(): void {
    this.managerState.init(15000);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
