import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  TdAbstractDynamicParamSpecState,
  TdParamSpecEntry,
  TdParamSpecs,
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormTemplateVersion } from '../../model/li-form-template-version.entity';
import { LiFormTemplateDynamicParamSpecState } from './li-form-template-dynamic-param-spec.state';

@Component({
  selector: 'li-form-template-version-editor',
  templateUrl: './li-form-template-version-editor.component.html',
  styleUrl: './li-form-template-version-editor.component.scss',
  imports: [TdTechnicalDocModule, FlUserModule, MatButton, MatIcon, TranslatePipe],
  providers: [
    LiFormTemplateDynamicParamSpecState,
    { provide: TdAbstractDynamicParamSpecState, useExisting: LiFormTemplateDynamicParamSpecState },
  ],
})
export class LiFormTemplateVersionEditorComponent {
  private dynamicState = inject(LiFormTemplateDynamicParamSpecState);
  private dialogService = inject(FlDialogService);

  templateId = input.required<string>();
  version = input.required<LiFormTemplateVersion>();
  readonly = input<boolean>(true);

  versionUpdated = output<LiFormTemplateVersion>();

  private static readonly COLUMNS = ['label', 'type', 'optional', 'default_value', 'additional_info'];

  tableColumns = computed(() => {
    return this.readonly()
      ? LiFormTemplateVersionEditorComponent.COLUMNS
      : [...LiFormTemplateVersionEditorComponent.COLUMNS, 'menu'];
  });

  table = this.dynamicState.paramSpecsTable;

  fieldCount = signal(0);

  hasFields = computed(() => this.fieldCount() > 0);

  constructor() {
    effect(() => {
      const v = this.version();
      const tId = this.templateId();
      if (v && tId) {
        this.dynamicState.setVersionContent(tId, v.id, v.content);
        this.fieldCount.set(Object.keys(v.content ?? {}).length);
      }
    });
  }

  addField(): void {
    this.dynamicState.openParamSpecFormDialog(undefined, () => this.updateFieldCount());
  }

  editField(entry: TdParamSpecEntry): void {
    this.dynamicState.openParamSpecFormDialog(entry, () => this.updateFieldCount());
  }

  deleteField(entry: TdParamSpecEntry): void {
    const input: FlConfirmDialogInput = {
      title: 'td.confirm_param_spec_deletion_title',
      content: 'td.confirm_param_spec_deletion_content',
      successMessage: 'td.confirm_param_spec_deletion_success',
      observable: this.dynamicState.deleteParamSpec(entry.key),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult<TdParamSpecs>) => {
        if (res?.choice) {
          this.dynamicState.setParamSpecs(res.result as TdParamSpecs);
          this.updateFieldCount();
        }
      });
  }

  private updateFieldCount(): void {
    this.fieldCount.set(Object.keys(this.dynamicState.getContent()).length);
  }
}
