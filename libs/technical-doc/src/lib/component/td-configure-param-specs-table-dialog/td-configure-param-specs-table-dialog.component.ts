import { Component, inject, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

import { TdConfigI } from '../../model/td-config.class';
import { TdParamSpec, TdParamSpecs } from '../../model/td-config-spec.class';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';
import {
  TdEditParamSpecDialogComponent,
  TdEditParamSpecDialogInput,
} from '../td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';
import { TdEditableParamSpec } from '../td-editable-param-specs-table/td-editable-param-specs-table.component';

export interface TdConfigureParamSpecsTableDialogInput {
  configSpecName: string;
  paramSpecs: TdParamSpecs;
  dynamicParamsDescription: FlTranslatableText;
}

@Component({
  selector: 'td-configure-param-specs-table-dialog',
  templateUrl: './td-configure-param-specs-table-dialog.component.html',
  styleUrl: './td-configure-param-specs-table-dialog.component.scss',
  standalone: false,
})
export class TdConfigureParamSpecsTableDialogComponent {
  private data: TdConfigureParamSpecsTableDialogInput = inject(MAT_DIALOG_DATA);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private dynamicParamSpecState = inject(TdAbstractDynamicParamSpecState);

  description: FlTranslatableText = this.data.dynamicParamsDescription;

  openEditParamSpecDialog(param: TdEditableParamSpec = null): void {
    const input: TdEditParamSpecDialogInput = {
      paramSpecFormInfoList$: this.dynamicParamSpecState.getParamSpecsInfos(),
      configSpecName: this.data.configSpecName,
      name: param?.name,
      spec: param ? (Object.assign({}, param) as TdParamSpec) : null,
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
      })
      .afterClosed()
      .subscribe((output: TdParamSpecs | TdConfigI) => this.onEditClosed(output));
  }

  openDeleteParamDialog(param: TdEditableParamSpec): void {
    const input: FlConfirmDialogInput = {
      title: 'td.confirm_param_spec_deletion_title',
      content: 'td.confirm_param_spec_deletion_content',
      successMessage: 'td.confirm_param_spec_deletion_success',
      observable: this.dynamicParamSpecState.deleteParamSpec(this.data.configSpecName, param.name),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult<TdParamSpecs | TdConfigI>) => {
        if (!res || !res.choice || 'values' in res.result) return;
        this.dynamicParamSpecState.setParamSpecs(res.result as TdParamSpecs);
      });
  }

  private onEditClosed(output: TdParamSpecs | TdConfigI): void {
    if (!output) return;

    if ('specs' in output) {
      this.data.paramSpecs = (output as TdConfigI).specs[this.data.configSpecName].additional_info.specs;
      this.dynamicParamSpecState.setParamSpecs(this.data.paramSpecs);
      return;
    } else {
      this.data.paramSpecs = output as TdParamSpecs;
      this.dynamicParamSpecState.setParamSpecs(this.data.paramSpecs);
    }
  }
}
