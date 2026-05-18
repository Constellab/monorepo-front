import { Component, inject, OnInit, output } from '@angular/core';
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
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { LiFormTemplate } from '../../../li-core/model/entities/form/li-form-template.entity';
import { LiFormTemplateDatasource, LiFormTemplateService } from '../../service/li-form-template.service';
import { LiFormTemplateSearchFields } from '../../service/li-form-template-search';
import { LiSelectFormTemplateDialogComponent } from '../li-select-form-template-dialog/li-select-form-template-dialog.component';

@Component({
  selector: 'li-select-form-template',
  templateUrl: './li-select-form-template.component.html',
  providers: [
    {
      provide: FlFormFieldDirective,
      useExisting: LiSelectFormTemplateComponent,
    },
  ],
  imports: [FlInputSearchModule, FlIconModule, FlTranslateModule, MatIcon],
})
export class LiSelectFormTemplateComponent extends FlFormFieldDirective<LiFormTemplate> implements OnInit {
  private formTemplateService = inject(LiFormTemplateService);
  private dialogService = inject(FlDialogService);

  templateChange = output<LiFormTemplate>();

  selectedTemplate: LiFormTemplate | Observable<LiFormTemplate>;

  datasource: LiFormTemplateDatasource<any>;

  advancedButton: FlInputSearchAdvancedButton<LiFormTemplate>;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    super(ngControl);
  }

  ngOnInit(): void {
    this.datasource = new FlEntityPaginatedDatasource(
      (page: number, size: number, data: FlDatasourceGetPageData<any>) => {
        const searchFields: FlDatasourceGetPageData<LiFormTemplateSearchFields> = {
          filtersCriteria: {
            name: data.filtersCriteria.searchText,
            isArchived: false,
          },
          sortsCriteria: [{ key: 'name', direction: 'ASC' }],
        };
        return this.formTemplateService.search(page, size, searchFields);
      },
      20,
      { initFirstPage: false }
    );

    this.advancedButton = {
      onClick: () => this.dialogService.openBigDialog(LiSelectFormTemplateDialogComponent).afterClosed(),
    };
  }

  writeValue(obj: LiFormTemplate): void {
    if (obj == null) {
      this.selectedTemplate = null;
      this.value = null;
      return;
    }

    if (obj instanceof LiFormTemplate && obj.isLoaded()) {
      this.selectedTemplate = obj;
    } else if (typeof obj === 'string') {
      this.selectedTemplate = this.formTemplateService.getById(obj);
    } else if ((obj as any).id != null) {
      this.selectedTemplate = this.formTemplateService.getById((obj as any).id);
    }
    this.value = obj;
  }

  callChangeEvent(value: LiFormTemplate): void {
    this.templateChange.emit(value);
    this.selectedTemplate = value;
  }

  onDisableChange(): void {}
}
