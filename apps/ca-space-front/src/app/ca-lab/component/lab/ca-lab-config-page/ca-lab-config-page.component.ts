import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabManagerComponent } from '../../manager/ca-lab-manager/ca-lab-manager.component';
import { CaLabConfigHeroComponent } from '../ca-lab-config-hero/ca-lab-config-hero.component';

/**
 * Sub-page of a lab to configure the lab server, bricks and advanced services.
 *
 * The page is a single scroll: a status hero that absorbs all lab-level status, then the
 * advanced configuration section (lab-manager actions, MCP, env vars and docker
 * services), rendered flat. Bricks and green-computing are managed from the dashboard.
 */
@Component({
  selector: 'ca-lab-config-page',
  templateUrl: './ca-lab-config-page.component.html',
  styleUrls: ['./ca-lab-config-page.component.scss'],
  imports: [CaLabConfigHeroComponent, CaLabManagerComponent, AsyncPipe],
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
