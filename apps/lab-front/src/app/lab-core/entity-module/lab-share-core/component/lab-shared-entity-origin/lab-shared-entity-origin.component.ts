import { Component, Input } from '@angular/core';
import { LabSharedEntity } from '../../../../model/entities/lab-share.entity';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show the origin of a shared resource.
 */
@Component({
  selector: 'lab-shared-entity-origin',
  templateUrl: './lab-shared-entity-origin.component.html',
  styleUrls: ['./lab-shared-entity-origin.component.scss'],
  imports: [FlKeyValueModule, FlDateModule, TranslatePipe],
})
export class LabSharedEntityOriginComponent {
  @Input() sharedEntity: LabSharedEntity;
}
