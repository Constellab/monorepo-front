import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiLab, LiLabMode } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiLabService } from '../../service/li-lab.service';
import { LiLabUpdateDomainDialogComponent } from '../li-lab-update-domain-dialog/li-lab-update-domain-dialog.component';

@Component({
  selector: 'li-lab-table',
  templateUrl: './li-lab-table.component.html',
  styleUrls: ['./li-lab-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatSortHeader,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    FlCoreComponentModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiLabTableComponent {
  private labService = inject(LiLabService);
  private dialogService = inject(FlDialogService);
  private snackBarService = inject(FlSnackBarService);

  @Input() datasource: FlArrayObs<LiLab>;

  @Input() columns: FlTableColumnStatic<LiLab>[];

  @Input() rowSelectable: boolean = false;

  @Output() labSelected: EventEmitter<LiLab> = new EventEmitter();

  labModes = LiLabMode;

  rowClicked(lab: LiLab): void {
    if (this.rowSelectable) {
      this.labSelected.next(lab);
    }
  }

  updateDomain(lab: LiLab): void {
    this.dialogService
      .openSmallDialog(LiLabUpdateDomainDialogComponent, { data: lab })
      .afterClosed()
      .subscribe((updatedLab: LiLab) => {
        if (updatedLab) {
          this.datasource.updateItem(updatedLab);
        }
      });
  }

  refreshLab(lab: LiLab): void {
    this.labService.refreshExternalLab(lab.id).subscribe((updatedLab) => {
      this.datasource.updateItem(updatedLab);
      this.snackBarService.openSuccessMessage({ text: 'li.lab_refreshed', translateText: true });
    });
  }

  deleteLab(lab: LiLab): void {
    const data: FlConfirmDialogInput = {
      title: 'li.delete_lab',
      content: 'li.delete_lab_confirmation',
      observable: this.labService.delete(lab.id),
      successMessage: 'li.lab_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => this.deleteLabClosed(result, lab));
  }

  private deleteLabClosed(result: FlConfirmDialogResult, lab: LiLab): void {
    if (result.choice) {
      this.datasource.removeItem(lab);
    }
  }
}
