import { Component, computed, effect, inject, input, output } from '@angular/core';
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
  TdEditableParamSpec,
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

  private static readonly COLUMNS = ['name', 'type', 'optional', 'default_value', 'human_name'];

  tableColumns = computed(() => {
    const cols = ['expand', ...LiFormTemplateVersionEditorComponent.COLUMNS];
    return this.readonly() ? cols : [...cols, 'menu'];
  });

  hasFields = computed(() => {
    const content = this.version()?.content;
    return content && Object.keys(content).length > 0;
  });

  constructor() {
    effect(() => {
      const v = this.version();
      const tId = this.templateId();
      if (v && tId) {
        this.dynamicState.setVersionContent(tId, v.id, v.content);
      }
    });
  }

  addField(): void {
    this.dynamicState.openParamSpecDialog();
  }

  editField(param: TdEditableParamSpec): void {
    this.dynamicState.openParamSpecDialog(param);
  }

  deleteField(param: TdEditableParamSpec): void {
    const input: FlConfirmDialogInput = {
      title: 'td.confirm_param_spec_deletion_title',
      content: 'td.confirm_param_spec_deletion_content',
      successMessage: 'td.confirm_param_spec_deletion_success',
      observable: this.dynamicState.deleteParamSpec('fields', param.name),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult<TdParamSpecs>) => {
        if (res?.choice) {
          this.dynamicState.setParamSpecs(res.result as TdParamSpecs);
        }
      });
  }
}
