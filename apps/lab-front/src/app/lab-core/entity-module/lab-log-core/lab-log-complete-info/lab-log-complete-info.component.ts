import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabLogCompleteInfo } from '../../../model/entities/lab-log.entity';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { LabLogLinesComponent } from '../lab-log-lines/lab-log-lines.component';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
