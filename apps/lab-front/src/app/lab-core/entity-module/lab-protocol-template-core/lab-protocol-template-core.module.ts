import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  LabProtocolTemplateSearchComponent
} from './component/lab-protocol-template-search/lab-protocol-template-search.component';
import {
  LabProtocolTemplateSearchFormComponent
} from './component/lab-protocol-template-search-form/lab-protocol-template-search-form.component';
import {
  LabProtocolTemplateFormDialogComponent
} from './component/lab-protocol-template-form-dialog/lab-protocol-template-form-dialog.component';
import {
  LabSelectProtocolTemplateComponent
} from './component/lab-select-protocol-template/lab-select-protocol-template.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabCoreModule} from '../../lab-core.module';
import {
  LabProtocolTemplateInlineComponent
} from './component/lab-protocol-template-inline/lab-protocol-template-inline.component';
import {LabTagCoreModule} from '../lab-tag-core/lab-tag-core.module';
import {LabUserCoreModule} from '../lab-user-core/lab-user-core.module';
import {
  LabProtocolTemplateTableComponent
} from './component/lab-protocol-template-table/lab-protocol-template-table.component';
import {
  LabSelectProtocolTemplateDialogComponent
} from './component/lab-select-protocol-template-dialog/lab-select-protocol-template-dialog.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    LabProtocolTemplateSearchComponent,
    LabProtocolTemplateSearchFormComponent,
    LabProtocolTemplateFormDialogComponent,
    LabSelectProtocolTemplateComponent,
    LabProtocolTemplateInlineComponent,
    LabProtocolTemplateTableComponent,
    LabSelectProtocolTemplateDialogComponent,
  ],
  exports: [
    LabProtocolTemplateSearchComponent,
    LabProtocolTemplateSearchFormComponent,
    LabProtocolTemplateFormDialogComponent,
    LabSelectProtocolTemplateComponent,
    LabProtocolTemplateInlineComponent,
    LabProtocolTemplateTableComponent,
    LabSelectProtocolTemplateDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    LabCoreModule,
    LabTagCoreModule,
    LabUserCoreModule,
  ],
})
export class LabProtocolTemplateCoreModule {
}
