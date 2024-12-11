import { Component, OnInit } from '@angular/core';
import { CaLab, CaLabDatasource } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabFormDialogComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-form-dialog/ca-lab-form-dialog.component';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';

@Component({
  selector: 'ca-my-labs-page',
  templateUrl: './ca-my-labs-page.component.html',
  styleUrls: ['./ca-my-labs-page.component.scss'],
})
export class CaMyLabsPageComponent implements OnInit {
  labsDatasource: CaLabDatasource;

  constructor(
    private labService: CaLabService,
    private dialogService: FlDialogService,
    private routerService: CaRouterService
  ) {}

  ngOnInit(): void {
    this.getMyLabs();
  }

  private getMyLabs(): void {
    this.labsDatasource = this.labService.getCurrentLabsDatasource();
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
