import { AfterViewInit, Component, inject, Input } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';

/**
 * List of option for a {@link ClUserCategory}
 */
@Component({
  selector: 'fl-select-user-category-option',
  templateUrl: './fl-select-user-category-option.component.html',
  styleUrls: ['./fl-select-user-category-option.component.scss'],
  standalone: false,
})
export class FlSelectUserCategoryOptionComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  // in basic mode, the ADMIN category is not shown
  @Input() mode: 'all' | 'basic' = 'basic';

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
