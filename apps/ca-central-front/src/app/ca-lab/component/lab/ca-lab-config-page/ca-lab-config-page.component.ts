import { Component, inject } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';

/**
 * Sub-page of lab to configure the lab server, bricks, backup, etc.
 */
@Component({
    selector: 'ca-lab-config-page',
    templateUrl: './ca-lab-config-page.component.html',
    styleUrls: ['./ca-lab-config-page.component.scss'],
    standalone: false
})
export class CaLabConfigPageComponent {

  private state = inject(CaLabDetailPageState);
  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  isHttpAccessible$: Observable<boolean> = this.state.isHttpAccessible$();

}
