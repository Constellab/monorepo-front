import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { LiTypeEntity } from '@monorepo/lab-lib/li-core';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

/**
 * Component to show the detail of a type (resource, task or protocol)
 */
@Component({
  selector: 'li-type-detail',
  templateUrl: './li-type-detail.component.html',
  styleUrls: ['./li-type-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TdTechnicalDocModule, FlCorePipeModule],
})
export class LiTypeDetailComponent {
  @Input() type: LiTypeEntity;
}
