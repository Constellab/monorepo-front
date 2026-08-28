import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFormFieldDirective,
} from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputSearchAdvancedButton, FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { LiForm } from '../../../li-core/model/entities/form/li-form.entity';
import { LiFormDatasource, LiFormService } from '../../service/li-form.service';
import { LiFormSearchFields } from '../../service/li-form-search';
import { LiSelectFormDialogComponent } from '../li-select-form-dialog/li-select-form-dialog.component';

@Component({
  selector: 'li-select-form',
  templateUrl: './li-select-form.component.html',
  providers: [
    {
      provide: FlFormFieldDirective,
      useExisting: LiSelectFormComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AsyncPipe, FlInputSearchModule, FlIconModule, FlTranslateModule, MatIcon],
})
export class LiSelectFormComponent extends FlFormFieldDirective<LiForm | null> implements OnInit {
  private formService = inject(LiFormService);
  private dialogService = inject(FlDialogService);

  placeholder = input<FlTranslatableText>('li.form_select');

  formChange = output<LiForm>();

  selectedForm: LiForm | Observable<LiForm> | null;

  datasource: LiFormDatasource<any>;

  advancedButton: FlInputSearchAdvancedButton<LiForm>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page: number, size: number, data: FlDatasourceGetPageData<any>) => {
        const searchFields: FlDatasourceGetPageData<LiFormSearchFields> = {
          filtersCriteria: {
            name: data.filtersCriteria.searchText,
            isArchived: false,
          },
          sortsCriteria: [{ key: 'name', direction: 'ASC' }],
        };
        return this.formService.search(page, size, searchFields);
      },
      20,
      { initFirstPage: false }
    );

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LiSelectFormDialogComponent).afterClosed(),
    };
  }

  writeValue(obj: LiForm | null): void {
    if (obj == null) {
      this.selectedForm = null;
      this.value = null;
      return;
    }

    if (obj instanceof LiForm && obj.isLoaded()) {
      this.selectedForm = obj;
    } else if (typeof obj === 'string') {
      this.selectedForm = this.formService.getById(obj);
    } else if ((obj as any).id != null) {
      this.selectedForm = this.formService.getById((obj as any).id);
    }
    this.value = obj;
  }

  callChangeEvent(value: LiForm): void {
    this.formChange.emit(value);
    this.selectedForm = value;
  }

  onDisableChange(): void {}
}
