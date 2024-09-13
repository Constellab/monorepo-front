import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CaReport } from '../../../../../ca-core/model/entities/folder/ca-report.class';
import { FlArrayObs } from '@monorepo/front-core-lib';

@Component({
  selector: 'ca-reports-list',
  templateUrl: './ca-reports-list.component.html',
  styleUrls: ['./ca-reports-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaReportsListComponent {

  @Input({required: true}) reports: FlArrayObs<CaReport>;

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() reportSelected: EventEmitter<CaReport> = new EventEmitter();

  selectReport(report: CaReport): void {
    if (this.rowSelectable) {
      this.reportSelected.next(report);
    }
  }
}
