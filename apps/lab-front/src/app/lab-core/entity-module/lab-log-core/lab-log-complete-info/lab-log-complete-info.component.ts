import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabLogCompleteInfo } from '../../../model/entities/lab-log.entity';

@Component({
  selector: 'lab-log-complete-info',
  templateUrl: './lab-log-complete-info.component.html',
  styleUrls: ['./lab-log-complete-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabLogCompleteInfoComponent {
  @Input({ required: true }) log: LabLogCompleteInfo;
}
