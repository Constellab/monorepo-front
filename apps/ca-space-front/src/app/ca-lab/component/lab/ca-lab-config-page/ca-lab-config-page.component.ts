import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabGreenOptionsComponent } from '../../green-option/ca-lab-green-options/ca-lab-green-options.component';
import { CaLabManagerComponent } from '../../manager/ca-lab-manager/ca-lab-manager.component';
import { CaLabGlobalStatusComponent } from '../ca-lab-global-status/ca-lab-global-status.component';

/**
 * Sub-page of lab to configure the lab server, bricks, backup, etc.
 */
@Component({
  selector: 'ca-lab-config-page',
  templateUrl: './ca-lab-config-page.component.html',
  styleUrls: ['./ca-lab-config-page.component.scss'],
  imports: [CaLabGlobalStatusComponent, CaLabManagerComponent, CaLabGreenOptionsComponent, AsyncPipe],
})
export class CaLabConfigPageComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private configState = inject(CaLabDetailConfigPageState);
  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  isHttpAccessible$: Observable<boolean> = this.state.isHttpAccessible$();

  ngOnInit(): void {
    this.configState.init();
  }
}
