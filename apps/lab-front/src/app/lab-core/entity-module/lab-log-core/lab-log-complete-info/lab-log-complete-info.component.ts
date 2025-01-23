import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabLogCompleteInfo } from '../../../model/entities/lab-log.entity';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LabLogLinesComponent } from '../lab-log-lines/lab-log-lines.component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-log-complete-info',
  templateUrl: './lab-log-complete-info.component.html',
  styleUrls: ['./lab-log-complete-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlKeyValueModule, LabLogLinesComponent, FlCorePipeModule, TranslatePipe],
})
export class LabLogCompleteInfoComponent {
  @Input({ required: true }) log: LabLogCompleteInfo;
}
