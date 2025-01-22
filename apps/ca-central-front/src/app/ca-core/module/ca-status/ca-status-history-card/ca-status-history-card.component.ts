import { Component, Input } from '@angular/core';
import { CaStatusHistory } from '../../../model/entities/ca-status-history.class';
import { FlStatusModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

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
