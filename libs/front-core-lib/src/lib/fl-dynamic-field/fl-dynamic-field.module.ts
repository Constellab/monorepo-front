import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlDynamicFieldComponent } from './component/fl-dynamic-field/fl-dynamic-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import {
  FlDynamicFormGroupComponent,
} from './component/fl-dynamic-form-group/fl-dynamic-form-group.component';
import { FlCorePipeModule } from '../fl-core-pipe/fl-core-pipe.module';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flDynamicFieldI18n } from './i18n/fl-dynamic-field.i18n';
import { FlMultiInputsComponent } from './component/fl-multi-inputs/fl-multi-inputs.component';
import { FlFormModule } from '../fl-form/fl-form.module';
import {
  FlDynamicFormArrayComponent,
} from './component/fl-dynamic-form-array/fl-dynamic-form-array.component';
import {
  FlDynamicAbstractFormComponent,
} from './component/fl-dynamic-abstract-form/fl-dynamic-abstract-form.component';
import { FlSectionModule } from '../fl-section/fl-section.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  FlDynamicFieldInputComponent,
} from './component/fl-dynamic-field-input/fl-dynamic-field-input.component';
import {
  FlDynamicFieldSelectComponent,
} from './component/fl-dynamic-field-select/fl-dynamic-field-select.component';
import {
  FlDynamicFieldBooleanComponent,
} from './component/fl-dynamic-field-boolean/fl-dynamic-field-boolean.component';
import {
  FlDynamicFieldListComponent,
} from './component/fl-dynamic-field-list/fl-dynamic-field-list.component';
import {
  FlDynamicFieldTextareaComponent,
} from './component/fl-dynamic-field-textarea/fl-dynamic-field-textarea.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FlCardModule } from '../fl-card/fl-card.module';
import {
  FlDynamicFieldSelectSearchComponent,
} from './component/fl-dynamic-field-select-search/fl-dynamic-field-select-search.component';
import { FlInputSearchModule } from '@monorepo/front-core-lib/fl-input-search';
import { FlUserModule } from '../fl-user/fl-user.module';
import {
  FlDynamicFieldFormDialogComponent,
} from './component/fl-dynamic-field-form-dialog/fl-dynamic-field-form-dialog.component';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';

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
    FlInputSearchModule,
    FlUserModule,
    FlDialogModule,
    FlLoaderModule,
  ],
})
export class FlDynamicFieldModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlDynamicFieldModule', flDynamicFieldI18n);
  }
}
