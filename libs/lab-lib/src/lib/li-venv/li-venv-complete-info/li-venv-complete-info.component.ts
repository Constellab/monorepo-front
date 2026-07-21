import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LiVEnvCompleteInfo } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-venv-complete-info',
  templateUrl: './li-venv-complete-info.component.html',
  styleUrls: ['./li-venv-complete-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlKeyValueModule, FlDateModule, FlCorePipeModule, TranslatePipe],
})
export class LiVenvCompleteInfoComponent {
  @Input() venvCompleteInfo: LiVEnvCompleteInfo;
}
