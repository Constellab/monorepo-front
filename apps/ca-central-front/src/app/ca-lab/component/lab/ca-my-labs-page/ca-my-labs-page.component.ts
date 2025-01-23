import { Component, OnInit, inject } from '@angular/core';
import { CaLab, CaLabDatasource } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabFormDialogComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-form-dialog/ca-lab-form-dialog.component';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CaLabCardComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-card/ca-lab-card.component';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { CaDetailRoutePipe } from '../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-my-labs-page',
  templateUrl: './ca-my-labs-page.component.html',
  styleUrls: ['./ca-my-labs-page.component.scss'],
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatButton,
    RouterLink,
    CaLabCardComponent,
    FlInfiniteScrollModule,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaMyLabsPageComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);
  private routerService = inject(CaRouterService);

  labsDatasource: CaLabDatasource;

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
