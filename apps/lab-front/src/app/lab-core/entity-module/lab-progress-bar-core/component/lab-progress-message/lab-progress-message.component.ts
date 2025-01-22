import { Component, Input } from '@angular/core';
import { LabProgressMessage } from '../../../../model/entities/lab-progress-bar.entity';
import { FlStatusModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCoreComponentModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-component/fl-core-component.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

@Component({
  selector: 'lab-progress-message',
  templateUrl: './lab-progress-message.component.html',
  styleUrls: ['./lab-progress-message.component.scss'],
  imports: [FlStatusModule, MatTooltip, FlCoreComponentModule, FlDateModule],
})
export class LabProgressMessageComponent {
  @Input() progressMessage: LabProgressMessage;
}
