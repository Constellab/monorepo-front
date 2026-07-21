import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiCredentials } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-credentials-inline',
  templateUrl: './li-credentials-inline.component.html',
  styleUrls: ['./li-credentials-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlUserModule],
})
export class LiCredentialsInlineComponent {
  @Input({ required: true }) credentials: LiCredentials;
}
