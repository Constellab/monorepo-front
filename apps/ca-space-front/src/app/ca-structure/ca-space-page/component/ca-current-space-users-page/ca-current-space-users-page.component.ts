import { ChangeDetectionStrategy,Component } from '@angular/core';

import { CaSpaceUserSearchComponent } from '../../../../ca-core/entity-module/ca-space-core/component/ca-space-user-search/ca-space-user-search.component';

@Component({
  selector: 'ca-current-space-users-page',
  templateUrl: './ca-current-space-users-page.component.html',
  styleUrls: ['./ca-current-space-users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CaSpaceUserSearchComponent],
})
export class CaCurrentSpaceUsersPageComponent {}
