import {ModuleWithProviders, NgModule, Provider, Type} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {TdResourceDocComponent} from './component/td-resource-doc/td-resource-doc.component';
import {TdTechnicalDocComponent} from './component/td-technical-doc/td-technical-doc.component';
import {RouterModule} from '@angular/router';
import {TdMainDocComponent} from './component/td-main-doc/td-main-doc.component';
import {TdProcessDocComponent} from './component/td-process-doc/td-process-doc.component';
import {MatIconModule} from '@angular/material/icon';
import {
  FlCoreComponentModule,
  FlCorePipeModule,
  FlIconModule,
  FlKeyValueModule,
  FlTextIconModule,
  FlThemeModule,
  FlTranslateModule,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {TdIoDocsComponent} from './component/td-io-docs/td-io-docs.component';
import {MatDividerModule} from '@angular/material/divider';
import {TdIoResourceComponent} from './component/td-io-resource/td-io-resource.component';
import {tdTechnicalDocI18n} from './td-technical-doc.i18n';
import {TdServiceConfig} from './service/td-service-config.config';
import {TdTechDocLinkComponent} from './component/td-tech-doc-link/td-tech-doc-link.component';
import {TdMarkdownPipe} from './pipe/td-markdown.pipe';
import {TdConfigComponent} from './component/td-config/td-config.component';
import {TdTechnicalDocHeaderComponent} from './component/td-technical-doc-header/td-technical-doc-header.component';
import {TdDocIoComponent} from './component/td-doc-io/td-doc-io.component';
import {TdTypeUnavailableComponent} from './component/td-type-unavailable/td-type-unavailable.component';
import {TdTypingNamePipe} from './pipe/td-typing-name.pipe';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {TdTypeIconComponent} from './component/td-type-icon/td-type-icon.component';
import {tdTypeInlineComponent} from './component/td-type-inline/td-type-inline.component';
import {TdTypeIconBadgeComponent} from './component/td-type-icon-badge/td-type-icon-badge.component';
import {
  TdResourceDocFunctionSignatureComponent
} from './component/td-resource-doc-function-signature/td-resource-doc-function-signature.component';
import {
  TdResourceDocFuncInfoComponent
} from './component/td-resource-doc-func-info/td-resource-doc-func-info.component';
import {TdCleanTypePipe} from './pipe/td-clean-type.pipe';
import {TdVarsMethodsDocComponent} from './component/td-vars-methods-doc/td-vars-methods-doc.component';
import {TdOtherClassDocComponent} from './component/td-other-class-doc/td-other-class-doc.component';

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
    TdCleanTypePipe
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
    TdCleanTypePipe
  ]
})
export class TdTechnicalDocModule {

  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('TdTechnicalDocModule', tdTechnicalDocI18n);
  }

  public static forRoot(apiServiceConfig: Type<TdServiceConfig>): ModuleWithProviders<TdTechnicalDocModule> {

    const providers: Provider[] = [
      {provide: TdServiceConfig, useClass: apiServiceConfig}
    ];

    return {
      ngModule: TdTechnicalDocModule,
      providers: providers
    };
  }
}
