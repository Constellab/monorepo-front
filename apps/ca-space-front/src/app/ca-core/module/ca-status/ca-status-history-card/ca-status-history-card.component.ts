import { Component, Input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { TranslatePipe } from '@ngx-translate/core';

import { CaStatusHistory } from '../../../model/entities/ca-status-history.class';

/**
 * Card to display information about a status history
 */
@Component({
  selector: 'ca-status-history-card',
  templateUrl: './ca-status-history-card.component.html',
  styleUrls: ['./ca-status-history-card.component.scss'],
  imports: [FlStatusModule, TranslatePipe, FlDateModule],
})
export class CaStatusHistoryCardComponent {
  @Input() statusHistory: CaStatusHistory<any>;
}
