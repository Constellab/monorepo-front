import { Component, Input } from '@angular/core';
import { LiRunningProcessInfo } from '@monorepo/lab-lib/li-core';
import { LiProgressMessageComponent } from '@monorepo/lab-lib/li-progress-bar';

@Component({
  selector: 'li-running-process',
  templateUrl: './li-running-process.component.html',
  styleUrls: ['./li-running-process.component.scss'],
  imports: [LiProgressMessageComponent],
})
export class LiRunningProcessComponent {
  @Input() runningProcess: LiRunningProcessInfo;
}
