import { Component, Input } from '@angular/core';
import { LabCredentials } from '../../../../model/entities/lab-credentials.entity';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-credentials-inline',
  templateUrl: './lab-credentials-inline.component.html',
  styleUrls: ['./lab-credentials-inline.component.scss'],
  imports: [FlUserModule, TranslatePipe],
})
export class LabCredentialsInlineComponent {
  @Input({ required: true }) credentials: LabCredentials;
}
