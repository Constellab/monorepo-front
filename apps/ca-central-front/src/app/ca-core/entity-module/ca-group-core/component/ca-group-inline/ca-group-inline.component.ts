import { Component, Input } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';

/**
 * Component to show the type of group along with label
 */
@Component({
  selector: 'ca-group-inline',
  templateUrl: './ca-group-inline.component.html',
  styleUrls: ['./ca-group-inline.component.scss'],
  imports: [FlTextIconModule, MatIcon, FlIconModule, FlUserModule],
})
export class CaGroupInlineComponent {
  @Input({ required: true }) group: CaGroup;

  @Input() disableUserPortal: boolean = false;
}
