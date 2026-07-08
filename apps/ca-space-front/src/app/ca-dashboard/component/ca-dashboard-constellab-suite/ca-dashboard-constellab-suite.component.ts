import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import {
  CaConstellabSuiteAppDTO,
  CaConstellabSuiteDTO,
} from '../../../ca-core/model/entities/ca-constellab-suite.class';
import { CaIconContainerComponent } from '../../../ca-core/module/ca-core-component/ca-icon-container/ca-icon-container.component';
import { CaSettingsService } from '../../../ca-core/service-api/ca-settings.service';
import { CaConstellabSuiteDetailDialogComponent } from '../ca-constellab-suite-detail-dialog/ca-constellab-suite-detail-dialog.component';

@Component({
  selector: 'ca-dashboard-constellab-suite',
  templateUrl: './ca-dashboard-constellab-suite.component.html',
  styleUrls: ['./ca-dashboard-constellab-suite.component.scss'],
  imports: [FlCardModule, FlTextIconModule, MatIcon, TranslatePipe, AsyncPipe, CaIconContainerComponent],
})
export class CaDashboardConstellabSuiteComponent {
  private dialogService = inject(FlDialogService);

  constellabSuite$: Observable<CaConstellabSuiteDTO> = inject(CaSettingsService).getConstellabSuite();

  openAppDetail(app: CaConstellabSuiteAppDTO): void {
    this.dialogService.openMediumDialog(CaConstellabSuiteDetailDialogComponent, {
      data: { app },
    });
  }
}
