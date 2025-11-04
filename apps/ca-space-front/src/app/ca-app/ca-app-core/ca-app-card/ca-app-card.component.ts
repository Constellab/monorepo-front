import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';

import { CaHierarchyObject } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaIconContainerComponent } from '../../../ca-core/module/ca-core-component/ca-icon-container/ca-icon-container.component';

@Component({
  selector: 'ca-app-card',
  templateUrl: './ca-app-card.component.html',
  styleUrl: './ca-app-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlCardModule, MatRipple, CaIconContainerComponent],
})
export class CaAppCardComponent {
  app = input.required<CaHierarchyObject>();
}
