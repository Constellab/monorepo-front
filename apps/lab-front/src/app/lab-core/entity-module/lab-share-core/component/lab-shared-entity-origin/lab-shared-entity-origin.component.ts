import { Component, Input } from '@angular/core';
import { LabSharedEntity } from '../../../../model/entities/lab-share.entity';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';
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
