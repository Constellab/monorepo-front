import { Component, Input } from '@angular/core';
import { LabCredentials } from '../../../../model/entities/lab-credentials.entity';

@Component({
  selector: 'lab-credentials-inline',
  templateUrl: './lab-credentials-inline.component.html',
  styleUrls: ['./lab-credentials-inline.component.scss'],
})
export class LabCredentialsInlineComponent {
  @Input({ required: true }) credentials: LabCredentials;
}
