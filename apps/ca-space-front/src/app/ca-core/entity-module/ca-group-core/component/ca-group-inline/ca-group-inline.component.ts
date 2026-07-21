import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { CaGroup } from '../../../../model/entities/ca-group.entity';

/**
 * Component to show the type of group along with label
 */
@Component({
  selector: 'ca-group-inline',
  templateUrl: './ca-group-inline.component.html',
  styleUrls: ['./ca-group-inline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlTextIconModule, MatIcon, FlIconModule, FlUserModule],
})
export class CaGroupInlineComponent {
  @Input({ required: true }) group: CaGroup;

  @Input() disableUserPortal: boolean = false;
}
