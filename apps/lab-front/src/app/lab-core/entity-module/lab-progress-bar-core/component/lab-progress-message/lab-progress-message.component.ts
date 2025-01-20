import { Component, Input } from '@angular/core';
import { LabProgressMessage } from '../../../../model/entities/lab-progress-bar.entity';

@Component({
    selector: 'lab-progress-message',
    templateUrl: './lab-progress-message.component.html',
    styleUrls: ['./lab-progress-message.component.scss'],
    standalone: false
})
export class LabProgressMessageComponent {
  @Input() progressMessage: LabProgressMessage;
}
