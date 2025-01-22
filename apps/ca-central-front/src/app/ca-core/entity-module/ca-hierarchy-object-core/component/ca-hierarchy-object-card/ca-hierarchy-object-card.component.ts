import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaHierarchyObject } from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { MatRipple } from '@angular/material/core';
import { CaHierarchyObjectIconComponent } from '../ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlDateModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

@Component({
  selector: 'ca-hierarchy-object-card',
  templateUrl: './ca-hierarchy-object-card.component.html',
  styleUrl: './ca-hierarchy-object-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlCardModule,
    MatRipple,
    CaHierarchyObjectIconComponent,
    FlUserModule,
    FlTextIconModule,
    MatIcon,
    FlDateModule,
  ],
})
export class CaHierarchyObjectCardComponent {
  @Input({ required: true }) hierarchyObject: CaHierarchyObject;
}
