import { Component } from '@angular/core';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';

/**
 * Sub-page of lab to configure the lab server, bricks, backup, etc.
 */
@Component({
  selector: 'ca-lab-config-page',
  templateUrl: './ca-lab-config-page.component.html',
  styleUrls: ['./ca-lab-config-page.component.scss']
})
export class CaLabConfigPageComponent {

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  isDesktop$: Observable<boolean> = this.state.isDesktop$();
  isHttpAccessible$: Observable<boolean> = this.state.isHttpAccessible$();

  constructor(private state: CaLabDetailPageState) {
  }

}
