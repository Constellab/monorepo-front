import { Component, Input } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiSharedEntity } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show the origin of a shared resource.
 */
@Component({
  selector: 'li-shared-entity-origin',
  templateUrl: './li-shared-entity-origin.component.html',
  styleUrls: ['./li-shared-entity-origin.component.scss'],
  imports: [FlKeyValueModule, FlDateModule, TranslatePipe, FlUserModule],
})
export class LiSharedEntityOriginComponent {
  @Input() sharedEntity: LiSharedEntity;
}
