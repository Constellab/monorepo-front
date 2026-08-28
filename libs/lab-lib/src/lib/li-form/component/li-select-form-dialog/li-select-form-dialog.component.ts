import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { LiForm } from '../../../li-core/model/entities/form/li-form.entity';
import { LiFormSearchFields, LiFormSearchFieldsDisabled } from '../../service/li-form-search';
import { LiFormSearchComponent } from '../li-form-search/li-form-search.component';

export interface LiSelectFormDialogInput {
  mode?: 'selection' | 'link';
  title?: string;
  defaultFilters?: Partial<LiFormSearchFields>;
  disabledFilters?: LiFormSearchFieldsDisabled;
}

@Component({
  selector: 'li-select-form-dialog',
  templateUrl: './li-select-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, LiFormSearchComponent, TranslatePipe],
})
export class LiSelectFormDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectFormDialogComponent>>(MatDialogRef);

  columns: FlTableColumnStatic<LiForm>[] = ['name', 'status', 'template', 'tags'];
  title: string;
  formSelectable: boolean;
  defaultFilters: Partial<LiFormSearchFields> | undefined;
  disabledFilters: LiFormSearchFieldsDisabled | undefined;

  constructor() {
    const data = inject<LiSelectFormDialogInput>(MAT_DIALOG_DATA, { optional: true });
    this.title = data?.title ?? 'li.form_select';
    this.formSelectable = data?.mode !== 'link';
    this.defaultFilters = data?.defaultFilters;
    this.disabledFilters = data?.disabledFilters;
  }

  onFormSelected(form: LiForm): void {
    this.dialogRef.close(form);
  }
}
