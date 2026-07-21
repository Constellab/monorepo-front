import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiBaseEntityWithUser } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show creation and last modification info for an entity
 * Uses a label/value row layout (label left, user + date right)
 */
@Component({
  selector: 'li-object-creation-info',
  templateUrl: './li-object-creation-info.component.html',
  styleUrls: ['./li-object-creation-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlUserModule, TranslatePipe],
})
export class LiObjectCreationInfoComponent {
  object = input.required<LiBaseEntityWithUser>();
}
