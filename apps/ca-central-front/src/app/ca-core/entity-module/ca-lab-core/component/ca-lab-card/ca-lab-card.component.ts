import { Component, Input } from '@angular/core';
import { CaLab } from '../../../../model/entities/lab/ca-lab.class';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { MatRipple } from '@angular/material/core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { CaCityComponent } from '../../../ca-config-core/component/ca-city/ca-city.component';
import { CaLabLoginButtonComponent } from '../ca-lab-login-button/ca-lab-login-button.component';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

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
    MatAnchor,
    RouterLink,
    CaDetailRoutePipe,
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabCardComponent {
  @Input() lab: CaLab;

  // prevent ripple effect when used on card
  stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }

  get iconBackground(): string {
    return this.lab.isRunning() ? 'g-primary-background' : 'g-warn-background';
  }

  get statusTooltip(): string {
    return this.lab.currentStatus.status.name;
  }
}
