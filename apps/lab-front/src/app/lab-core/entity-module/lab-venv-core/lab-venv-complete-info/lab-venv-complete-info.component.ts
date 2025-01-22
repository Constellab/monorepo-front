import { Component, Input, OnInit } from '@angular/core';
import { LabVEnvCompleteInfo } from '../../../model/entities/lab-venv.entity';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-venv-complete-info',
  templateUrl: './lab-venv-complete-info.component.html',
  styleUrls: ['./lab-venv-complete-info.component.scss'],
  imports: [FlKeyValueModule, FlDateModule, FlCorePipeModule, TranslatePipe],
})
export class LabVenvCompleteInfoComponent implements OnInit {
  @Input() venvCompleteInfo: LabVEnvCompleteInfo;

  constructor() {}

  ngOnInit(): void {}
}
