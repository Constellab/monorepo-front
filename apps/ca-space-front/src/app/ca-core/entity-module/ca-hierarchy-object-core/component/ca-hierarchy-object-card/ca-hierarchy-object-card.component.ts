import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaHierarchyObject } from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { MatRipple } from '@angular/material/core';
import { CaHierarchyObjectIconComponent } from '../ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

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
