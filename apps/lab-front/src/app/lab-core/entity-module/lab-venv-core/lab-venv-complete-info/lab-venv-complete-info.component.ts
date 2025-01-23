import { Component, Input, OnInit } from '@angular/core';
import { LabVEnvCompleteInfo } from '../../../model/entities/lab-venv.entity';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-venv-complete-info',
  templateUrl: './lab-venv-complete-info.component.html',
  styleUrls: ['./lab-venv-complete-info.component.scss'],
  imports: [FlKeyValueModule, FlDateModule, FlCorePipeModule, TranslatePipe],
})
export class LabVenvCompleteInfoComponent {
  @Input() venvCompleteInfo: LabVEnvCompleteInfo;
}
