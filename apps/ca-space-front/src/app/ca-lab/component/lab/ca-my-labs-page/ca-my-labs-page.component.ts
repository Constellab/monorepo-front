import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabCardComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-card/ca-lab-card.component';
import { CaLabFormDialogComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-form-dialog/ca-lab-form-dialog.component';
import { CaLab, CaLabDatasource } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaIsSpaceUserDirective } from '../../../../ca-core/module/ca-core-directive/ca-is-space-user/ca-is-space-user.directive';
import { CaDetailRoutePipe } from '../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

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
    CaIsSpaceUserDirective,
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
