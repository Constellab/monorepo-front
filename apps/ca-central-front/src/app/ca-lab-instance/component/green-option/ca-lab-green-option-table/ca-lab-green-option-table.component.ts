import {Component, Input} from '@angular/core';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {CaLabGreenOption} from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {
  CaLabGreenOptionFormDialogComponent,
  CaLabGreenOptionFormDialogInput
} from '../ca-lab-green-option-form-dialog/ca-lab-green-option-form-dialog.component';

@Component({
  selector: 'ca-lab-green-option-table',
  templateUrl: './ca-lab-green-option-table.component.html',
  styleUrls: ['./ca-lab-green-option-table.component.scss'],
})
export class CaLabGreenOptionTableComponent {

  @Input() datasource: FlArrayObs<CaLabGreenOption>;

  @Input() columns: FlTableColumnStatic<CaLabGreenOption>[];

  constructor(private labInstanceService: CaLabInstanceService,
              private dialogService: FlDialogService) {
  }

  updateGreenOption(greenOption: CaLabGreenOption): void {
    const data: CaLabGreenOptionFormDialogInput = {
      mode: 'update',
      id: greenOption.id,
      object: greenOption
    }

    this.dialogService.openSmallDialog(CaLabGreenOptionFormDialogComponent, {data: data}).afterClosed().subscribe(
      (updatedGreenOption: CaLabGreenOption) => this.onUpdateGreenOptionClosed(updatedGreenOption)
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
      translateTitleAndContent: true,
      observable: this.labInstanceService.deleteGreenOption(greenOption.id),
      successMessage: 'lab_green_option_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(configInput).afterClosed().subscribe(
      (result: FlConfirmDialogResult) => this.onDeleteGreenOptionClosed(result, greenOption)
    );
  }

  private onDeleteGreenOptionClosed(result: FlConfirmDialogResult, greenOption?: CaLabGreenOption): void {
    if(result.choice){
      this.datasource.removeItem(greenOption);
    }
  }
}
