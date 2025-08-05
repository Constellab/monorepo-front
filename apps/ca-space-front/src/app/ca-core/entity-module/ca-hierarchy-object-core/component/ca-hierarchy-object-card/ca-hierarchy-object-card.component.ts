import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { CaHierarchyObject } from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectIconComponent } from '../ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';

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
