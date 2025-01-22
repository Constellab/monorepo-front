import { Component, OnInit, inject } from '@angular/core';
import { CaLabService } from '../../../ca-core/service-api/ca-lab.service';
import { CaLab, CaLabDatasource } from '../../../ca-core/model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaLabFormDialogComponent } from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-form-dialog/ca-lab-form-dialog.component';
import { CaLabCardComponent } from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-card/ca-lab-card.component';

/**
 * Small list of labs in the dashboard
 */
@Component({
  selector: 'ca-dashboard-labs',
  templateUrl: './ca-dashboard-labs.component.html',
  styleUrls: ['./ca-dashboard-labs.component.scss'],
  imports: [CaDashboardListLayoutComponent, CaLabCardComponent],
})
export class CaDashboardLabsComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(CaRouterService);

  labsDatasource: CaLabDatasource;

  myLabsRoute: string = CaRouterService.getMyLabsRoute();

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
