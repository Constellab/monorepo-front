import { ChangeDetectionStrategy,Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
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
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabGreenOption } from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabGreenOptionFormDialogComponent,
  CaLabGreenOptionFormDialogInput,
} from '../ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';
import { CaLabGreenOptionValueComponent } from '../ca-lab-green-option-value/ca-lab-green-option-value.component';

@Component({
  selector: 'ca-lab-green-option-table',
  templateUrl: './ca-lab-green-option-table.component.html',
  styleUrls: ['./ca-lab-green-option-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlTextIconModule,
    CaLabGreenOptionValueComponent,
    FlUserModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class CaLabGreenOptionTableComponent {
  private labService = inject(CaLabService);
  private dialogService = inject(FlDialogService);

  @Input({ required: true }) datasource: FlArrayObs<CaLabGreenOption>;

  @Input({ required: true }) columns: FlTableColumnStatic<CaLabGreenOption>[];

  updateGreenOption(greenOption: CaLabGreenOption): void {
    const data: CaLabGreenOptionFormDialogInput = {
      mode: 'update',
      id: greenOption.id,
      object: greenOption,
    };

    this.dialogService
      .openSmallDialog(CaLabGreenOptionFormDialogComponent, { data: data, autoFocus: false })
      .afterClosed()
      .subscribe((updatedGreenOption: CaLabGreenOption) =>
        this.onUpdateGreenOptionClosed(updatedGreenOption)
      );
  }

  private onUpdateGreenOptionClosed(updatedGreenOption?: CaLabGreenOption): void {
    if (updatedGreenOption) {
      this.datasource.updateItem(updatedGreenOption);
    }
  }

  deleteGreenOption(greenOption: CaLabGreenOption): void {
    const configInput: FlConfirmDialogInput = {
      title: 'lab_delete_green_option',
      content: 'lab_delete_green_option_confirmation',
      observable: this.labService.deleteGreenOption(greenOption.id),
      successMessage: 'lab_green_option_deleted',
    };

    this.dialogService
      .openConfirmDialog(configInput)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => this.onDeleteGreenOptionClosed(result, greenOption));
  }

  private onDeleteGreenOptionClosed(result: FlConfirmDialogResult, greenOption?: CaLabGreenOption): void {
    if (result.choice) {
      this.datasource.removeItem(greenOption);
    }
  }
}
