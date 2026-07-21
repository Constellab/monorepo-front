import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LmlLabManagerLibModule, LmlLabManagerState } from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaUserListInlineComponent } from '../../../../ca-core/entity-module/ca-user-core/component/ca-user-list-inline/ca-user-list-inline.component';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabGreenOption } from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import { CaLabBricksState } from '../../../state/ca-lab-bricks.state';
import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabFoldersState } from '../../../state/ca-lab-folders.state';
import { CaLabGreenOptionsState } from '../../../state/ca-lab-green-options.state';
import { CaLabUsersState } from '../../../state/ca-lab-users.state';
import { CaLabFoldersListComponent } from '../../folder/ca-lab-folders-list/ca-lab-folders-list.component';
import { CaLabGreenOptionBadgeComponent } from '../../green-option/ca-lab-green-option-badge/ca-lab-green-option-badge.component';
import { CaLabGreenOptionsComponent } from '../../green-option/ca-lab-green-options/ca-lab-green-options.component';
import { CaLabChipListComponent } from '../../shared/ca-lab-chip-list/ca-lab-chip-list.component';
import { CaLabUsersListComponent } from '../../user/ca-lab-users-list/ca-lab-users-list.component';
import { CaLabHeroComponent } from '../ca-lab-hero/ca-lab-hero.component';

/**
 * Data lab dashboard — the daily-driver view. A hero strip with the primary
 * open/start/stop actions and lab facts, followed by an accordion whose panels expose
 * the lab's bricks, users, folders and (for cloud labs) green-computing rules inline.
 */
@Component({
  selector: 'ca-lab-dashboard-page',
  templateUrl: './ca-lab-dashboard-page.component.html',
  styleUrls: ['./ca-lab-dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [CaLabUsersState, CaLabFoldersState, CaLabGreenOptionsState, CaLabBricksState],
  imports: [
    FlSectionModule,
    MatExpansionModule,
    MatIcon,
    LmlLabManagerLibModule,
    CaLabHeroComponent,
    CaLabUsersListComponent,
    CaUserListInlineComponent,
    CaLabFoldersListComponent,
    CaLabChipListComponent,
    CaLabGreenOptionsComponent,
    CaLabGreenOptionBadgeComponent,
    AsyncPipe,
    TranslatePipe,
    FlIconModule,
  ],
})
export class CaLabDashboardPageComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private configState = inject(CaLabDetailConfigPageState);
  private managerState = inject(LmlLabManagerState);
  private usersState = inject(CaLabUsersState);
  private foldersState = inject(CaLabFoldersState);
  private greenOptionsState = inject(CaLabGreenOptionsState);
  private bricksState = inject(CaLabBricksState);

  lab$: Observable<CaLab> = this.state.getLab$();
  isOwner$: Observable<boolean> = this.state.isLabOwner$();
  labIsRunning$: Observable<boolean> = this.state.labIsRunning$();
  labManagerIsRunning$: Observable<boolean> = this.managerState.labManagerIsRunning$();

  /** Lab members, loaded once, for the users-panel preview in the header. */
  users$: Observable<CaUser[]>;

  /** Lab folder names, loaded once, for the folders-panel preview in the header. */
  folderNames$: Observable<string[]>;

  /** Lab green-computing rules, loaded once, for the green-panel preview in the header. */
  greenOptions$: Observable<CaLabGreenOption[]>;

  /** Installed brick names, for the bricks-panel preview in the header. */
  brickNames$: Observable<string[]>;

  ngOnInit(): void {
    // configState must be initialized before managerState so that
    // CaLabManagerService.labManagerIsRunning$() can subscribe to getStatus$().
    this.configState.init();
    this.managerState.init(15000);

    this.usersState.init(this.state.getLabId());
    this.users$ = this.usersState.getUsers$();

    this.foldersState.init(this.state.getLabId());
    this.folderNames$ = this.foldersState.getFolderNames$();

    this.greenOptionsState.init(this.state.getLabId());
    this.greenOptions$ = this.greenOptionsState.getOptions$();

    // Bricks load once, when the lab manager first becomes running. The bricks state ensures the
    // manager status is polled itself, so it no longer depends on managerState.init() above.
    this.bricksState.init();
    this.brickNames$ = this.bricksState.getBrickNames$();
  }

  get bricks(): CaLabBricksState {
    return this.bricksState;
  }
}
