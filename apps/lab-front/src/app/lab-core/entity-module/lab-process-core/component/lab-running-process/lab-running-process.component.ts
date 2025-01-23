import { Component, Input, OnInit } from '@angular/core';
import { LabRunningProcessInfo } from '../../../../model/entities/process/lab-process.entity';
import { LabProgressMessageComponent } from '../../../lab-progress-bar-core/component/lab-progress-message/lab-progress-message.component';

@Component({
  selector: 'lab-running-process',
  templateUrl: './lab-running-process.component.html',
  styleUrls: ['./lab-running-process.component.scss'],
  imports: [LabProgressMessageComponent],
})
export class LabRunningProcessComponent {
  @Input() runningProcess: LabRunningProcessInfo;
}
