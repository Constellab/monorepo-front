import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabCardComponent } from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-card/ca-lab-card.component';
import { CaLabFormDialogComponent } from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-form-dialog/ca-lab-form-dialog.component';
import { CaLab, CaLabDatasource } from '../../../ca-core/model/entities/lab/ca-lab.class';
import { CaIsSpaceUserDirective } from '../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';
import { CaLabService } from '../../../ca-core/service-api/ca-lab.service';
import { CaDashboardEmptyListComponent } from '../ca-dashboard-empty-list/ca-dashboard-empty-list.component';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';

/**
 * Small list of labs in the dashboard
 */
@Component({
  selector: 'ca-dashboard-labs',
  templateUrl: './ca-dashboard-labs.component.html',
  styleUrls: ['./ca-dashboard-labs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CaDashboardListLayoutComponent,
    CaLabCardComponent,
    CaDashboardEmptyListComponent,
    CaIsSpaceUserDirective,
    MatButtonModule,
    MatIcon,
    TranslatePipe,
  ],
})
export class CaDashboardLabsComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(CaRouterService);

  isSpaceUser = inject(CaAuthenticatedUserService).isCurrentSpaceUser();

  labsDatasource: CaLabDatasource;

  myLabsRoute: string = CaRouterService.getMyLabsRoute();

  color = inject(FlThemeService).getCurrentThemeDetail().primary;

  ngOnInit(): void {
    this.getMyLabs();
  }

  private getMyLabs(): void {
    this.labsDatasource = this.labService.getCurrentLabsDatasource(CaDashboardListLayoutComponent.maxItems);
  }

  openCreateLabDialog(): void {
    this.dialogService
      .openSmallDialog(CaLabFormDialogComponent, { autoFocus: false })
      .afterClosed()
      .subscribe((lab) => this.onCreateLabDialogClosed(lab));
  }

  private onCreateLabDialogClosed(lab?: CaLab): void {
    // only navigate if the lab has been created (for cloud lab, it sends a request, do nothing here)
    if (lab && lab instanceof CaLab) {
      this.routerService.navigateToLabDetail(lab.id);
    }
  }
}
