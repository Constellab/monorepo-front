import { NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLab } from '../../../../model/entities/lab/ca-lab.class';
import { CaIconContainerComponent } from '../../../../module/ca-core-component/ca-icon-container/ca-icon-container.component';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaCityComponent } from '../../../ca-config-core/component/ca-city/ca-city.component';
import { CaLabLoginButtonComponent } from '../ca-lab-login-button/ca-lab-login-button.component';

/**
 * Card to display a {@link CaLab}
 */
@Component({
  selector: 'ca-lab-card',
  templateUrl: './ca-lab-card.component.html',
  styleUrls: ['./ca-lab-card.component.scss'],
  imports: [
    FlCardModule,
    MatRipple,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    NgClass,
    MatTooltip,
    CaCityComponent,
    CaLabLoginButtonComponent,
    RouterLink,
    CaDetailRoutePipe,
    TranslatePipe,
    FlDateModule,
    MatButtonModule,
    CaIconContainerComponent,
  ],
})
export class CaLabCardComponent {
  lab = input.required<CaLab>();

  showButtons = input<boolean>(true);

  statusIndicatorClass = computed(() => (this.lab().isRunning() ? 'running' : 'stopped'));
  statusText = computed(() => (this.lab().isRunning() ? 'running' : 'stopped'));

  color = inject(FlThemeService).getCurrentThemeDetail().primary;

  // prevent ripple effect when used on card
  stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }
}
