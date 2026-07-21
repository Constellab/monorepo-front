import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';

import { CaIconContainerComponent } from '../../../ca-core/module/ca-core-component/ca-icon-container/ca-icon-container.component';

@Component({
  selector: 'ca-dashboard-empty-list',
  templateUrl: './ca-dashboard-empty-list.component.html',
  styleUrls: ['./ca-dashboard-empty-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CaIconContainerComponent, FlCoreDirectiveModule],
})
export class CaDashboardEmptyListComponent {
  emoji = input.required<string>();

  emojiBackgroundColor = input<string>();

  emptyTitle = input.required<string>();

  emptyDescription = input.required<string>();
}
