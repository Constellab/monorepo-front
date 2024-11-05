import { Component, OnInit } from '@angular/core';
import { CaLabService } from '../../../ca-core/service-api/ca-lab.service';
import { CaLab, CaLabDatasource } from '../../../ca-core/model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { CaDashboardListLayoutComponent } from '../ca-dashboard-list-layout/ca-dashboard-list-layout.component';
import { FlDialogService } from '@monorepo/front-core-lib';
import {
  CaLabFormDialogComponent,
  CaLabFormDialogInput,
} from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-form-dialog/ca-lab-form-dialog.component';

/**
 * Small list of labs in the dashboard
 */
@Component({
  selector: 'ca-dashboard-labs',
  templateUrl: './ca-dashboard-labs.component.html',
  styleUrls: ['./ca-dashboard-labs.component.scss'],
})
export class CaDashboardLabsComponent implements OnInit {
  labsDatasource: CaLabDatasource;

  myLabsRoute: string = CaRouterService.getMyLabsRoute();
  createLabRoute: string = CaRouterService.getCreateLabRoute();

  constructor(
    private labService: CaLabService,
    private dialogService: FlDialogService,
    private routerService: CaRouterService
  ) {}

  ngOnInit(): void {
    this.getMyLabs();
  }

  private getMyLabs(): void {
    this.labsDatasource = this.labService.getCurrentLabsDatasource(CaDashboardListLayoutComponent.maxItems);
  }

  openCreateLabDialog(): void {
    const input: CaLabFormDialogInput = {
      mode: 'create',
    };
    this.dialogService
      .openSmallDialog(CaLabFormDialogComponent, { data: input })
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
