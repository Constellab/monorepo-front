import { ModuleWithProviders, NgModule, Provider, Type, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TdResourceDocComponent } from './component/td-resource-doc/td-resource-doc.component';
import { TdTechnicalDocComponent } from './component/td-technical-doc/td-technical-doc.component';
import { RouterModule } from '@angular/router';
import { TdMainDocComponent } from './component/td-main-doc/td-main-doc.component';
import { TdProcessDocComponent } from './component/td-process-doc/td-process-doc.component';
import { MatIconModule } from '@angular/material/icon';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlDynamicFieldModule } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeModule } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { TdIoDocsComponent } from './component/td-io-docs/td-io-docs.component';
import { MatDividerModule } from '@angular/material/divider';
import { TdIoResourceComponent } from './component/td-io-resource/td-io-resource.component';
import { tdTechnicalDocI18n } from './td-technical-doc.i18n';
import { TdTechnicalDocServiceConfig } from './service/td-technical-doc-service-config.config';
import { TdTechDocLinkComponent } from './component/td-tech-doc-link/td-tech-doc-link.component';
import { TdMarkdownPipe } from './pipe/td-markdown.pipe';
import { TdConfigComponent } from './component/td-config/td-config.component';
import { TdTechnicalDocHeaderComponent } from './component/td-technical-doc-header/td-technical-doc-header.component';
import { TdDocIoComponent } from './component/td-doc-io/td-doc-io.component';
import { TdTypeUnavailableComponent } from './component/td-type-unavailable/td-type-unavailable.component';
import { TdTypingNamePipe } from './pipe/td-typing-name.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TdTypeIconComponent } from './component/td-type-icon/td-type-icon.component';
import { tdTypeInlineComponent } from './component/td-type-inline/td-type-inline.component';
import { TdTypeIconBadgeComponent } from './component/td-type-icon-badge/td-type-icon-badge.component';
import { TdResourceDocFunctionSignatureComponent } from './component/td-resource-doc-function-signature/td-resource-doc-function-signature.component';
import { TdResourceDocFuncInfoComponent } from './component/td-resource-doc-func-info/td-resource-doc-func-info.component';
import { TdCleanTypePipe } from './pipe/td-clean-type.pipe';
import { TdVarsMethodsDocComponent } from './component/td-vars-methods-doc/td-vars-methods-doc.component';
import { TdOtherClassDocComponent } from './component/td-other-class-doc/td-other-class-doc.component';
import { MatDialogContent } from '@angular/material/dialog';
import { TdEditableParamSpecsTableComponent } from './component/td-editable-param-specs-table/td-editable-param-specs-table.component';
import { MatTableModule } from '@angular/material/table';
import { TdEditParamSpecDialogComponent } from './component/td-edit-param-spec-dialog/td-edit-param-spec-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { TdConfigureParamSpecsTableDialogComponent } from './component/td-configure-param-specs-table-dialog/td-configure-param-specs-table-dialog.component';
import { TdIconBackgroundColorPipe } from './pipe/td-icon-background-color.pipe';
import { TdIconColorPipe } from './pipe/td-icon-color.pipe';
import { TdDynamicEditableFormGroupComponent } from './component/td-dynamic-editable-form-group/td-dynamic-editable-form-group.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,

    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,

    FlCorePipeModule,
    FlCoreComponentModule,
    FlTranslateModule,
    FlKeyValueModule,
    FlIconModule,
    FlTextIconModule,
    FlThemeModule,
    MatDialogContent,
    FlDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    FlFormModule,
    FlCoreDirectiveModule,
    MatError,
    MatInput,
    MatLabel,
    MatFormField,
    FlUserModule,
    MatOption,
    MatSelect,
    MatCheckbox,
    FlDynamicFieldModule,
    FlSectionModule,
    FlLoaderModule,
  ],
  declarations: [
    TdResourceDocComponent,
    TdTechnicalDocComponent,
    TdMainDocComponent,
    TdProcessDocComponent,
    TdIoDocsComponent,
    TdIoResourceComponent,
    TdTechDocLinkComponent,
    TdMarkdownPipe,
    TdConfigComponent,
    TdTechnicalDocHeaderComponent,
    TdDocIoComponent,
    TdTypeUnavailableComponent,
    TdTypingNamePipe,
    TdTypeIconComponent,
    tdTypeInlineComponent,
    TdTypeIconBadgeComponent,
    TdResourceDocFunctionSignatureComponent,
    TdResourceDocFuncInfoComponent,
    TdVarsMethodsDocComponent,
    TdOtherClassDocComponent,
    TdCleanTypePipe,
    TdEditableParamSpecsTableComponent,
    TdEditParamSpecDialogComponent,
    TdConfigureParamSpecsTableDialogComponent,
    TdIconBackgroundColorPipe,
    TdIconColorPipe,
    TdDynamicEditableFormGroupComponent,
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
    TdMarkdownPipe,
    TdIoResourceComponent,
    TdConfigComponent,
    TdTypeIconComponent,
    tdTypeInlineComponent,
    TdTypeIconBadgeComponent,
    TdResourceDocFunctionSignatureComponent,
    TdResourceDocFuncInfoComponent,
    TdVarsMethodsDocComponent,
    TdOtherClassDocComponent,
    TdCleanTypePipe,
    TdEditableParamSpecsTableComponent,
    TdEditParamSpecDialogComponent,
    TdConfigureParamSpecsTableDialogComponent,
    TdIconBackgroundColorPipe,
    TdIconColorPipe,
    TdDynamicEditableFormGroupComponent,
  ],
})
export class TdTechnicalDocModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('TdTechnicalDocModule', tdTechnicalDocI18n);
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
