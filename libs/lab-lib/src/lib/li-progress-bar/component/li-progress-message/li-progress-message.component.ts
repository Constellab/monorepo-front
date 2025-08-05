import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { LiProgressMessage } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-progress-message',
  templateUrl: './li-progress-message.component.html',
  styleUrls: ['./li-progress-message.component.scss'],
  imports: [FlStatusModule, MatTooltip, FlCoreComponentModule, FlDateModule, DecimalPipe],
})
export class LiProgressMessageComponent {
  @Input() progressMessage: LiProgressMessage;
}
