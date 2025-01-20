import { Component, Input } from '@angular/core';
import { CaStatusHistory } from '../../../model/entities/ca-status-history.class';

/**
 * Card to display information about a status history
 */
@Component({
    selector: 'ca-status-history-card',
    templateUrl: './ca-status-history-card.component.html',
    styleUrls: ['./ca-status-history-card.component.scss'],
    standalone: false
})
export class CaStatusHistoryCardComponent {
  @Input() statusHistory: CaStatusHistory<any>;
}
