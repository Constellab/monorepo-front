import { Component, inject, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

import { TdParamSpecEntry, TdParamSpecs } from '../../model/td-config-spec.class';
import { TdAbstractDynamicParamSpecState } from '../../service/td-abstract-dynamic-param-spec.state';
import {
  TdEditParamSpecDialogComponent,
  TdEditParamSpecDialogInput,
} from '../td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';

export interface TdConfigureParamSpecsTableDialogInput {
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
  table = this.dynamicParamSpecState.paramSpecsTable;
  reorderEnabled = this.dynamicParamSpecState.reorderEnabled;

  openEditParamSpecDialog(entry: TdParamSpecEntry = null): void {
    const input: TdEditParamSpecDialogInput = {
      dynamicParamSpecState: this.dynamicParamSpecState,
      paramSpec: entry,
      title: entry
        ? { text: 'td.edit_param_spec', translateText: true }
        : { text: 'td.add_param_spec', translateText: true },
    };

    this.dialogService
      .openMediumDialog(TdEditParamSpecDialogComponent, {
        data: input,
        viewContainerRef: this.viewContainerRef,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((output: TdParamSpecs) => this.onEditClosed(output));
  }

  openDeleteParamDialog(entry: TdParamSpecEntry): void {
    const input: FlConfirmDialogInput = {
      title: 'td.confirm_param_spec_deletion_title',
      content: 'td.confirm_param_spec_deletion_content',
      successMessage: 'td.confirm_param_spec_deletion_success',
      observable: this.dynamicParamSpecState.deleteParamSpec(entry.key),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult<TdParamSpecs>) => {
        if (!res || !res.choice || 'values' in res.result) return;
        this.dynamicParamSpecState.setParamSpecs(res.result as TdParamSpecs);
      });
  }

  reorderFields(paramNames: string[]): void {
    this.dynamicParamSpecState.reorderParamSpecs(paramNames)?.subscribe();
  }

  private onEditClosed(output: TdParamSpecs): void {
    if (!output) return;

    this.dynamicParamSpecState.setParamSpecs(output);
  }
}
