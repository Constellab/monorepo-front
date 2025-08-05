import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { CaIsAdminDirective } from '../../../../module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import {
  CaLabFreeFormDialogComponent,
  CaLabFreeFormDialogInput,
} from '../ca-lab-free-form-dialog/ca-lab-free-form-dialog.component';
import { CaLabFreeInfoComponent } from '../ca-lab-free-info/ca-lab-free-info.component';

/**
 * Accessible by admin to show the free lab info of a user
 * and update it if needed
 */
@Component({
  selector: 'ca-lab-free-card-info',
  templateUrl: './ca-lab-free-card-info.component.html',
  styleUrls: ['./ca-lab-free-card-info.component.scss'],
  imports: [
    FlSectionModule,
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    CaIsAdminDirective,
    MatIconButton,
    MatTooltip,
    CaLabFreeInfoComponent,
    TranslatePipe,
  ],
})
export class CaLabFreeCardInfoComponent implements OnInit {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);

  @Input() userId: string;

  @Input() labId: string;

  freeLabDTO$: Observable<CaLabFreeGetDto>;

  ngOnInit(): void {
    if (this.userId) {
      this.freeLabDTO$ = this.labService.getUserFreeLabByUser(this.userId);
    } else if (this.labId) {
      this.freeLabDTO$ = this.labService.getUserFreeLabByLab(this.labId);
    } else {
      this.freeLabDTO$ = this.labService.getCurrentUserFreeLab();
    }
  }

  updateFreeLab(freeLab: CaLabFreeGetDto): void {
    const data: CaLabFreeFormDialogInput = {
      freeLabId: freeLab.freeLab.id,
      usageLimitInHours: freeLab.freeLab.usageLimitInHours,
      expirationDate: freeLab.freeLab.expirationDate,
    };

    this.dialogService
      .openSmallDialog(CaLabFreeFormDialogComponent, { data })
      .afterClosed()
      .subscribe((result) => this.onUpdateClosed(result));
  }

  private onUpdateClosed(freeLab?: CaLabFreeGetDto): void {
    if (freeLab) {
      this.freeLabDTO$ = of(freeLab);
    }
  }

  deleteFreeLab(freeLab: CaLabFreeGetDto): void {
    const input: FlConfirmDialogInput = {
      title: 'free_data_lab_delete',
      content: 'free_data_lab_delete_confirmation',
      observable: this.labService.deleteFreeLab(freeLab.freeLab.id),
      successMessage: 'free_data_lab_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.deleteFreeLabSuccess(result));
  }

  private deleteFreeLabSuccess(result: FlConfirmDialogResult<CaLabFreeGetDto>): void {
    if (result.choice) {
      this.freeLabDTO$ = of(result.result);
    }
  }
}
