import { Component, Input } from '@angular/core';
import { LabProgressMessage } from '../../../../model/entities/lab-progress-bar.entity';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'lab-progress-message',
  templateUrl: './lab-progress-message.component.html',
  styleUrls: ['./lab-progress-message.component.scss'],
  imports: [FlStatusModule, MatTooltip, FlCoreComponentModule, FlDateModule, DecimalPipe],
})
export class LabProgressMessageComponent {
  @Input() progressMessage: LabProgressMessage;
}
