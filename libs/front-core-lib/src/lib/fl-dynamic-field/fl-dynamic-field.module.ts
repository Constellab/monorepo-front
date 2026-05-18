import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlCardModule } from '../fl-card/fl-card.module';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlDateModule } from '../fl-date/fl-date.module';
import { FlFormModule } from '../fl-form/fl-form.module';
import { FlSectionModule } from '../fl-section/fl-section.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlUserModule } from '../fl-user/fl-user.module';
import { FlDynamicAbstractFormComponent } from './component/fl-dynamic-abstract-form/fl-dynamic-abstract-form.component';
import { FlDynamicFieldComponent } from './component/fl-dynamic-field/fl-dynamic-field.component';
import { FlDynamicFieldBooleanComponent } from './component/fl-dynamic-field-boolean/fl-dynamic-field-boolean.component';
import { FlDynamicFieldDateComponent } from './component/fl-dynamic-field-date/fl-dynamic-field-date.component';
import { FlDynamicFieldFormDialogComponent } from './component/fl-dynamic-field-form-dialog/fl-dynamic-field-form-dialog.component';
import { FlDynamicFieldInputComponent } from './component/fl-dynamic-field-input/fl-dynamic-field-input.component';
import { FlDynamicFieldListComponent } from './component/fl-dynamic-field-list/fl-dynamic-field-list.component';
import { FlDynamicFieldSelectComponent } from './component/fl-dynamic-field-select/fl-dynamic-field-select.component';
import { FlDynamicFieldSelectSearchComponent } from './component/fl-dynamic-field-select-search/fl-dynamic-field-select-search.component';
import { FlDynamicFieldTextareaComponent } from './component/fl-dynamic-field-textarea/fl-dynamic-field-textarea.component';
import { FlDynamicFormArrayComponent } from './component/fl-dynamic-form-array/fl-dynamic-form-array.component';
import { FlDynamicFormGroupComponent } from './component/fl-dynamic-form-group/fl-dynamic-form-group.component';
import { FlMultiInputsComponent } from './component/fl-multi-inputs/fl-multi-inputs.component';
import { FL_DYNAMIC_FIELD_I18N } from './i18n/fl-dynamic-field.i18n';

/**
 * Module for the {@link FlDynamicFieldComponent} to create dynamic form field input
 * based on a config
 */
@NgModule({
  declarations: [
    FlDynamicFieldComponent,
    FlDynamicFormGroupComponent,
    FlMultiInputsComponent,
    FlDynamicFormArrayComponent,
    FlDynamicAbstractFormComponent,
    FlDynamicFieldInputComponent,
    FlDynamicFieldSelectComponent,
    FlDynamicFieldBooleanComponent,
    FlDynamicFieldDateComponent,
    FlDynamicFieldListComponent,
    FlDynamicFieldTextareaComponent,
    FlDynamicFieldSelectSearchComponent,
    FlDynamicFieldFormDialogComponent,
  ],
  exports: [
    FlDynamicFieldComponent,
    FlDynamicFormGroupComponent,
    FlMultiInputsComponent,
    FlDynamicFormArrayComponent,
    FlDynamicAbstractFormComponent,
    FlDynamicFieldTextareaComponent,
    FlDynamicFieldSelectSearchComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,

    FlTranslateModule,
    FlCorePipeModule,
    FlFormModule,
    FlSectionModule,
    FlCardModule,
    FlDateModule,
    FlInputSearchModule,
    FlUserModule,
    FlDialogModule,
    FlLoaderModule,
    FlKeyValueModule,
  ],
})
export class FlDynamicFieldModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlDynamicFieldModule', FL_DYNAMIC_FIELD_I18N);
  }
}
