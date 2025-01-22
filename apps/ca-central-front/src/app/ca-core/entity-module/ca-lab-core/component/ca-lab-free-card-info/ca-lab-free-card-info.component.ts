import { Component, Input, OnInit, inject } from '@angular/core';
import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { Observable, of } from 'rxjs';
import {
  CaLabFreeFormDialogComponent,
  CaLabFreeFormDialogInput,
} from '../ca-lab-free-form-dialog/ca-lab-free-form-dialog.component';

/**
 * Accessible by admin to show the free lab info of a user
 * and update it if needed
 */
@Component({
  selector: 'ca-lab-free-card-info',
  templateUrl: './ca-lab-free-card-info.component.html',
  styleUrls: ['./ca-lab-free-card-info.component.scss'],
  standalone: false,
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
