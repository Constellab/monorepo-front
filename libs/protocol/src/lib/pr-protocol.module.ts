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

import {PrWorkflowNodeComponent} from './component/pr-workflow-node/pr-workflow-node.component';
import {TdTechnicalDocModule} from '@monorepo/technical-doc';
import {MatIconModule} from '@angular/material/icon';
import {createCustomElement} from '@angular/elements';
import {PrWorkflowNodeSourceComponent} from './component/pr-workflow-node-source/pr-workflow-node-source.component';
import {PrWorkflowNodeOutputComponent} from './component/pr-workflow-node-output/pr-workflow-node-output.component';
import {
  PrWorkflowNodeInterfaceComponent
} from './component/pr-workflow-node-interface/pr-workflow-node-interface.component';
import {PrWorkflowActionState} from './state/pr-workflow-action-state';
import {
  PrWorkflowLayersBreadcrumbComponent
} from './component/pr-workflow-layers-breadcrumb/pr-workflow-layers-breadcrumb.component';
import {prProtocolI18n} from './pr-protocol.i18n';
import {
  PrWorkflowPortActionPortalComponent
} from './component/pr-workflow-port-action-portal/pr-workflow-port-action-portal.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {PrWorkflowNodeViewerComponent} from './component/pr-workflow-node-viewer/pr-workflow-node-viewer.component';
import {
  PrWorkflowProcessConfigInfoDialogComponent
} from './component/pr-workflow-process-config-info-dialog/pr-workflow-process-config-info-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {PrWorkflowEmptyResourcesState, PrWorkflowResourcesState} from './state/pr-workflow-resources.state';
import {PrWorkflowNodeContentComponent} from './component/pr-workflow-node-content/pr-workflow-node-content.component';
import {PrWorkflowLeftButtonComponent} from './component/pr-workflow-left-button/pr-workflow-left-button.component';
import {PrWorkflowRightButtonComponent} from './component/pr-workflow-right-button/pr-workflow-right-button.component';


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
    PrWorkflowNodeComponent,
    PrWorkflowNodeSourceComponent,
    PrWorkflowNodeOutputComponent,
    PrWorkflowNodeInterfaceComponent,
    PrWorkflowLayersBreadcrumbComponent,
    PrWorkflowPortActionPortalComponent,
    PrWorkflowNodeViewerComponent,
    PrWorkflowProcessConfigInfoDialogComponent,
    PrWorkflowNodeContentComponent,
    PrWorkflowLeftButtonComponent,
    PrWorkflowRightButtonComponent
  ]
})
export class PrProtocolModule {
  private static registered: boolean = false;

  constructor(injector: Injector, translateService: FlTranslateService) {

    if (PrProtocolModule.registered) return;

    customElements.define('pr-workflow-node',
      createCustomElement(PrWorkflowNodeComponent, {
        injector
      }));

    customElements.define('pr-workflow-node-source',
      createCustomElement(PrWorkflowNodeSourceComponent, {
        injector
      }));

    customElements.define('pr-workflow-node-output',
      createCustomElement(PrWorkflowNodeOutputComponent, {
        injector
      }));

    customElements.define('pr-workflow-node-viewer',
      createCustomElement(PrWorkflowNodeViewerComponent, {
        injector,
      }));

    customElements.define('pr-workflow-node-interface',
      createCustomElement(PrWorkflowNodeInterfaceComponent, {
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
