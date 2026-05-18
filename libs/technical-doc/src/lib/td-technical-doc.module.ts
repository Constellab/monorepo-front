import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { inject, ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldModule } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlMarkdownModule } from '@monorepo/front-core-lib/fl-markdown';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeModule } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { TdConfigComponent } from './component/td-config/td-config.component';
import { TdConfigureParamSpecsTableDialogComponent } from './component/td-configure-param-specs-table-dialog/td-configure-param-specs-table-dialog.component';
import { TdConfigureSpecsFormComponent } from './component/td-configure-specs-form/td-configure-specs-form.component';
import { TdDocIoComponent } from './component/td-doc-io/td-doc-io.component';
import { TdDynamicEditableFormGroupComponent } from './component/td-dynamic-editable-form-group/td-dynamic-editable-form-group.component';
import { TdEditParamSpecDialogComponent } from './component/td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';
import { TdEditableParamSpecsTableComponent } from './component/td-editable-param-specs-table/td-editable-param-specs-table.component';
import { TdExpressionDisplayComponent } from './component/td-expression-display/td-expression-display.component';
import { TdExpressionHelpComponent } from './component/td-expression-help/td-expression-help.component';
import { TdExpressionInputComponent } from './component/td-expression-input/td-expression-input.component';
import { TdIoDocsComponent } from './component/td-io-docs/td-io-docs.component';
import { TdIoResourceComponent } from './component/td-io-resource/td-io-resource.component';
import { TdMainDocComponent } from './component/td-main-doc/td-main-doc.component';
import { TdOtherClassDocComponent } from './component/td-other-class-doc/td-other-class-doc.component';
import { TdParamSpecInlineComponent } from './component/td-param-spec-inline/td-param-spec-inline.component';
import { TdProcessDocComponent } from './component/td-process-doc/td-process-doc.component';
import { TdResourceDocComponent } from './component/td-resource-doc/td-resource-doc.component';
import { TdResourceDocFuncInfoComponent } from './component/td-resource-doc-func-info/td-resource-doc-func-info.component';
import { TdResourceDocFunctionSignatureComponent } from './component/td-resource-doc-function-signature/td-resource-doc-function-signature.component';
import { TdTechDocLinkComponent } from './component/td-tech-doc-link/td-tech-doc-link.component';
import { TdTechnicalDocComponent } from './component/td-technical-doc/td-technical-doc.component';
import { TdTechnicalDocHeaderComponent } from './component/td-technical-doc-header/td-technical-doc-header.component';
import { TdTypeIconComponent } from './component/td-type-icon/td-type-icon.component';
import { TdTypeIconBadgeComponent } from './component/td-type-icon-badge/td-type-icon-badge.component';
import { TdTypeInlineComponent } from './component/td-type-inline/td-type-inline.component';
import { TdTypeUnavailableComponent } from './component/td-type-unavailable/td-type-unavailable.component';
import { TdVarsMethodsDocComponent } from './component/td-vars-methods-doc/td-vars-methods-doc.component';
import { TdCleanTypePipe } from './pipe/td-clean-type.pipe';
import { TdIconAutoColorPipe } from './pipe/td-icon-auto-color.pipe';
import { TdIconBackgroundColorPipe } from './pipe/td-icon-background-color.pipe';
import { TdIconColorPipe } from './pipe/td-icon-color.pipe';
import { TdTypingNamePipe } from './pipe/td-typing-name.pipe';
import { TdTechnicalDocServiceConfig } from './service/td-technical-doc-service-config.config';
import { TD_TECHNICAL_DOC_I18N } from './td-technical-doc.i18n';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    ReactiveFormsModule,

    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    DragDropModule,

    FlCorePipeModule,
    FlCoreComponentModule,
    FlTranslateModule,
    FlKeyValueModule,
    FlIconModule,
    FlTextIconModule,
    FlThemeModule,
    FlDialogModule,
    FlFormModule,
    FlCoreDirectiveModule,
    FlUserModule,
    FlDynamicFieldModule,
    FlSectionModule,
    FlLoaderModule,
    FlMarkdownModule,
  ],
  declarations: [
    TdResourceDocComponent,
    TdTechnicalDocComponent,
    TdMainDocComponent,
    TdProcessDocComponent,
    TdIoDocsComponent,
    TdIoResourceComponent,
    TdTechDocLinkComponent,
    TdConfigComponent,
    TdTechnicalDocHeaderComponent,
    TdDocIoComponent,
    TdTypeUnavailableComponent,
    TdTypingNamePipe,
    TdTypeIconComponent,
    TdTypeInlineComponent,
    TdTypeIconBadgeComponent,
    TdResourceDocFunctionSignatureComponent,
    TdResourceDocFuncInfoComponent,
    TdVarsMethodsDocComponent,
    TdOtherClassDocComponent,
    TdCleanTypePipe,
    TdEditableParamSpecsTableComponent,
    TdEditParamSpecDialogComponent,
    TdExpressionDisplayComponent,
    TdExpressionInputComponent,
    TdExpressionHelpComponent,
    TdParamSpecInlineComponent,
    TdConfigureParamSpecsTableDialogComponent,
    TdIconBackgroundColorPipe,
    TdIconColorPipe,
    TdDynamicEditableFormGroupComponent,
    TdConfigureSpecsFormComponent,
    TdIconAutoColorPipe,
  ],
  exports: [
    TdTechnicalDocComponent,
    TdResourceDocComponent,
    TdMainDocComponent,
    TdTechnicalDocHeaderComponent,
    TdIoDocsComponent,
    TdDocIoComponent,
    TdTypeUnavailableComponent,
    TdTypingNamePipe,
    TdIoResourceComponent,
    TdConfigComponent,
    TdTypeIconComponent,
    TdTypeInlineComponent,
    TdTypeIconBadgeComponent,
    TdResourceDocFunctionSignatureComponent,
    TdResourceDocFuncInfoComponent,
    TdVarsMethodsDocComponent,
    TdOtherClassDocComponent,
    TdCleanTypePipe,
    TdEditableParamSpecsTableComponent,
    TdEditParamSpecDialogComponent,
    TdExpressionDisplayComponent,
    TdExpressionInputComponent,
    TdExpressionHelpComponent,
    TdParamSpecInlineComponent,
    TdConfigureParamSpecsTableDialogComponent,
    TdIconBackgroundColorPipe,
    TdIconColorPipe,
    TdDynamicEditableFormGroupComponent,
    TdConfigureSpecsFormComponent,
    TdIconAutoColorPipe,
  ],
})
export class TdTechnicalDocModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('TdTechnicalDocModule', TD_TECHNICAL_DOC_I18N);
  }

  public static forRoot(
    apiServiceConfig: Type<TdTechnicalDocServiceConfig>
  ): ModuleWithProviders<TdTechnicalDocModule> {
    const providers: Provider[] = [{ provide: TdTechnicalDocServiceConfig, useClass: apiServiceConfig }];

    return {
      ngModule: TdTechnicalDocModule,
      providers: providers,
    };
  }
}
