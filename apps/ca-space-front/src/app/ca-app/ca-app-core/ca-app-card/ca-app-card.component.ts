import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';

import { CaHierarchyObjectIconComponent } from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaHierarchyObject } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

@Component({
  selector: 'ca-app-card',
  templateUrl: './ca-app-card.component.html',
  styleUrl: './ca-app-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlCardModule, MatRipple, CaHierarchyObjectIconComponent],
})
export class CaAppCardComponent {
  app = input.required<CaHierarchyObject>();
}
