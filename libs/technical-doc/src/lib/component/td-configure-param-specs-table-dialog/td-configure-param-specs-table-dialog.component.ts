import { Component, Inject, ViewContainerRef } from '@angular/core';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';
import { TdConfig, TdParamSpecs } from '../../model/td-config-spec.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { TdEditableParamSpec } from '../td-editable-param-specs-table/td-editable-param-specs-table.component';
import {
  TdEditParamSpecDialogComponent,
  TdEditParamSpecDialogInput,
} from '../td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';

export interface TdConfigureParamSpecsTableDialogInput {
  configSpecName: string;
  paramSpecs: TdParamSpecs;
}

@Component({
  selector: 'td-configure-param-specs-table-dialog',
  templateUrl: './td-configure-param-specs-table-dialog.component.html',
  styleUrl: './td-configure-param-specs-table-dialog.component.scss',
})
export class TdConfigureParamSpecsTableDialogComponent {
  paramSpecs: TdParamSpecs;
  config: TdConfig;
  configSpecName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: TdConfigureParamSpecsTableDialogInput,
    private dialogService: FlDialogService,
    private dialogRef: MatDialogRef<TdConfigureParamSpecsTableDialogComponent>,
    private viewContainerRef: ViewContainerRef,
    private dynamicParamSpecState: TdAbstractDynamicParamSpecState
  ) {
    this.paramSpecs = data.paramSpecs;
    this.configSpecName = data.configSpecName;

    this.dialogRef.backdropClick().subscribe(() => this.closeDialog());
    this.dialogRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeDialog();
      }
    });
  }

  openEditParamSpecDialog(param: TdEditableParamSpec = null): void {
    const input: TdEditParamSpecDialogInput = {
      paramSpecFormInfoList$: this.dynamicParamSpecState.getParamSpecsInfos(),
      configSpecName: this.configSpecName,
      name: param?.name,
      spec: param != null ? this.paramSpecs[param.name] : null,
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe((output: TdConfig) => {
        if (output) {
          this.config = output;
          if (output.specs[this.configSpecName])
            this.paramSpecs = output.specs[this.configSpecName].additional_info.specs;
        }
      });
  }

  openDeleteParamDialog(param: TdEditableParamSpec): void {
    const input: FlConfirmDialogInput = {
      title: 'td.confirm_param_spec_deletion_title',
      content: 'td.confirm_param_spec_deletion_content',
      successMessage: 'td.confirm_param_spec_deletion_success',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult<TdConfig>) => {
        if (res && res.choice) {
          this.deleteParam(param.name);
        }
      });
  }

  deleteParam(paramName: string): void {
    this.dynamicParamSpecState.deleteParamSpec(this.configSpecName, paramName).subscribe((res) => {
      if (res) {
        this.config = res;
        this.dynamicParamSpecState.setParamSpecs(res.specs[this.configSpecName].additional_info.specs);
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close(this.config);
  }
}
