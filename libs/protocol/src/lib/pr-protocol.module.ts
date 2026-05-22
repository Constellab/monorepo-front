import { CommonModule } from '@angular/common';
import { inject, Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortHeader } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlMenuDynamicModule } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslateModule, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';

import { PrIofaceInfoPortalComponent } from './component/pr-ioface-info-portal/pr-ioface-info-portal.component';
import { PrProcessConfigInfoDialogComponent } from './component/pr-process-config-info-dialog/pr-process-config-info-dialog.component';
import { PrProcessInfoComponent } from './component/pr-process-info/pr-process-info.component';
import { PrProcessInfoDialogComponent } from './component/pr-process-info-dialog/pr-process-info-dialog.component';
import { PrWorkflowComponent } from './component/pr-workflow/pr-workflow.component';
import { PrWorkflowLayersBreadcrumbComponent } from './component/pr-workflow-layers-breadcrumb/pr-workflow-layers-breadcrumb.component';
import { PrWorkflowNodeContentComponent } from './component/pr-workflow-node-content/pr-workflow-node-content.component';
import { PrWorkflowNodeContentBottomComponent } from './component/pr-workflow-node-content-bottom/pr-workflow-node-content-bottom.component';
import { PrWorkflowNodeProcessComponent } from './component/pr-workflow-node-process/pr-workflow-node-process.component';
import { PrWorkflowNodeResourceComponent } from './component/pr-workflow-node-resource/pr-workflow-node-resource.component';
import { PrWorkflowPortActionPortalComponent } from './component/pr-workflow-port-action-portal/pr-workflow-port-action-portal.component';
import { PR_PROTOCOL_I18N } from './pr-protocol.i18n';
import { PrWorkflowActionState } from './state/pr-workflow-action-state';
import { PrWorkflowManagerState } from './state/pr-workflow-manager-state';
import { PrWorkflowEmptyResourcesState, PrWorkflowResourcesState } from './state/pr-workflow-resources.state';

@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatTableModule,

    FlTranslateModule,
    FlPortalModule,
    FlMenuDynamicModule,
    FlLoaderModule,
    FlIconModule,
    FlCoreComponentModule,
    FlDialogModule,
    FlJsonEditorModule,

    TdTechnicalDocModule,
    FlUserModule,
    FlCorePipeModule,
    FlKeyValueModule,
    MatSortHeader,
  ],
  exports: [
    PrWorkflowComponent,
    PrProcessInfoComponent,
    PrProcessInfoDialogComponent,
    PrIofaceInfoPortalComponent,
  ],
  declarations: [
    PrWorkflowComponent,
    PrWorkflowNodeProcessComponent,
    PrWorkflowLayersBreadcrumbComponent,
    PrWorkflowPortActionPortalComponent,
    PrProcessConfigInfoDialogComponent,
    PrWorkflowNodeContentComponent,
    PrWorkflowNodeContentBottomComponent,
    PrWorkflowNodeResourceComponent,
    PrProcessInfoComponent,
    PrProcessInfoDialogComponent,
    PrIofaceInfoPortalComponent,
  ],
})
export class PrProtocolModule {
  private static registered: boolean = false;

  constructor() {
    const injector = inject(Injector);
    const translateService = inject(FlTranslateService);

    if (PrProtocolModule.registered) return;

    customElements.define(
      'pr-workflow-node-process',
      createCustomElement(PrWorkflowNodeProcessComponent, {
        injector,
      })
    );

    customElements.define(
      'pr-workflow-node-resource',
      createCustomElement(PrWorkflowNodeResourceComponent, {
        injector,
      })
    );

    PrProtocolModule.registered = true;

    translateService.addModuleTranslation('PrProtocolModule', PR_PROTOCOL_I18N);
  }

  public static forRoot(
    resourceState: Type<PrWorkflowResourcesState> = PrWorkflowEmptyResourcesState
  ): ModuleWithProviders<PrProtocolModule> {
    return {
      ngModule: PrProtocolModule,
      providers: [
        PrWorkflowManagerState,
        PrWorkflowActionState,
        { provide: PrWorkflowResourcesState, useClass: resourceState },
      ],
    };
  }
}
