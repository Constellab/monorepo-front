import { Component, inject } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { CaLabGlobalStatusComponent } from '../ca-lab-global-status/ca-lab-global-status.component';
import { CaLabManagerComponent } from '../../manager/ca-lab-manager/ca-lab-manager.component';
import { CaLabGreenOptionsComponent } from '../../green-option/ca-lab-green-options/ca-lab-green-options.component';
import { AsyncPipe } from '@angular/common';

/**
 * Sub-page of lab to configure the lab server, bricks, backup, etc.
 */
@Component({
  selector: 'ca-lab-config-page',
  templateUrl: './ca-lab-config-page.component.html',
  styleUrls: ['./ca-lab-config-page.component.scss'],
  imports: [CaLabGlobalStatusComponent, CaLabManagerComponent, CaLabGreenOptionsComponent, AsyncPipe],
})
export class CaLabConfigPageComponent {
  private state = inject(CaLabDetailPageState);
  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  isHttpAccessible$: Observable<boolean> = this.state.isHttpAccessible$();
}
