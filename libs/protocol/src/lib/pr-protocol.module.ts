import {Injector, ModuleWithProviders, NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrWorkflowManagerState} from './state/pr-workflow-manager-state';
import {PrWorkflowComponent} from './component/pr-workflow/pr-workflow.component';
import {
  FlCoreComponentModule,
  FlDrawerModule,
  FlIconModule,
  FlLoaderModule,
  FlMenuDynamicModule,
  FlPortalModule,
  FlStatusModule,
  FlTranslateModule,
  FlTranslateService
} from '@monorepo/front-core-lib';

import {PrWorkflowNodeProcessComponent} from './component/pr-workflow-node-process/pr-workflow-node-process.component';
import {TdTechnicalDocModule} from '@monorepo/technical-doc';
import {MatIconModule} from '@angular/material/icon';
import {createCustomElement} from '@angular/elements';
import {PrWorkflowActionState} from './state/pr-workflow-action-state';
import {
  PrWorkflowLayersBreadcrumbComponent
} from './component/pr-workflow-layers-breadcrumb/pr-workflow-layers-breadcrumb.component';
import {prProtocolI18n} from './pr-protocol.i18n';
import {
  PrWorkflowPortActionPortalComponent
} from './component/pr-workflow-port-action-portal/pr-workflow-port-action-portal.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {
  PrWorkflowProcessConfigInfoDialogComponent
} from './component/pr-workflow-process-config-info-dialog/pr-workflow-process-config-info-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {PrWorkflowEmptyResourcesState, PrWorkflowResourcesState} from './state/pr-workflow-resources.state';
import {PrWorkflowNodeContentComponent} from './component/pr-workflow-node-content/pr-workflow-node-content.component';
import {
  PrWorkflowNodeContentBottomComponent
} from './component/pr-workflow-node-content-bottom/pr-workflow-node-content-bottom.component';
import {
  PrWorkflowNodeResourceComponent
} from './component/pr-workflow-node-resource/pr-workflow-node-resource.component';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,

    FlStatusModule,
    FlTranslateModule,
    FlPortalModule,
    FlMenuDynamicModule,
    FlDrawerModule,
    FlLoaderModule,
    FlCoreComponentModule,
    FlIconModule,

    TdTechnicalDocModule,
    MatTableModule,
  ],
  exports: [
    PrWorkflowComponent
  ],
  declarations: [
    PrWorkflowComponent,
    PrWorkflowNodeProcessComponent,
    PrWorkflowLayersBreadcrumbComponent,
    PrWorkflowPortActionPortalComponent,
    PrWorkflowProcessConfigInfoDialogComponent,
    PrWorkflowNodeContentComponent,
    PrWorkflowNodeContentBottomComponent,
    PrWorkflowNodeResourceComponent
  ]
})
export class PrProtocolModule {
  private static registered: boolean = false;

  constructor(injector: Injector, translateService: FlTranslateService) {

    if (PrProtocolModule.registered) return;

    customElements.define('pr-workflow-node-process',
      createCustomElement(PrWorkflowNodeProcessComponent, {
        injector
      }));

    customElements.define('pr-workflow-node-resource',
      createCustomElement(PrWorkflowNodeResourceComponent, {
        injector,
      }));

    PrProtocolModule.registered = true;

    translateService.addModuleTranslation('PrProtocolModule', prProtocolI18n);
  }

  public static forRoot(resourceState: Type<PrWorkflowResourcesState> = PrWorkflowEmptyResourcesState)
    : ModuleWithProviders<PrProtocolModule> {
    return {
      ngModule: PrProtocolModule,
      providers: [
        PrWorkflowManagerState,
        PrWorkflowActionState,
        {provide: PrWorkflowResourcesState, useClass: resourceState}
      ]
    };
  }
}
