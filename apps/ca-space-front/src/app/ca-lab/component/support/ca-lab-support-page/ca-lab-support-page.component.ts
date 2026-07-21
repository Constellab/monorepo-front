import { ChangeDetectionStrategy,Component } from '@angular/core';

import { CaIsSpaceAdminDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-space-admlin/ca-is-space-admin.directive';
import { CaLabServerComponent } from '../ca-lab-server/ca-lab-server.component';
import { CaLabSupportComponent } from '../ca-lab-support/ca-lab-support.component';

@Component({
  selector: 'ca-lab-support-page',
  templateUrl: './ca-lab-support-page.component.html',
  styleUrl: './ca-lab-support-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CaIsSpaceAdminDirective, CaLabSupportComponent, CaLabServerComponent],
})
export class CaLabSupportPageComponent {}
