import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalConnectedPosition, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LiProcess, LiProtocolService, LiResource, LiRouterService } from '@monorepo/lab-lib/li-core';
import {
  LiResourceDetailDialogComponent,
  LiResourceViewDetailDialogComponent,
  LiResourceViewDetailDialogInput,
  LiSelectResourceDialogComponent,
} from '@monorepo/lab-lib/li-resource';
import {
  PrWorkflowActionEvent,
  PrWorkflowActionShowView,
  PrWorkflowActionState,
  PrWorkflowNode,
  PrWorkflowNodeProcess,
} from '@monorepo/protocol';
import { TdIOSpec, TdParamSpecVisibility, TdTypingName } from '@monorepo/technical-doc';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';

import { LabProcessDashboardComponent } from '../component/lab-process-dashboard/lab-process-dashboard.component';
import { LabResourceNextObjectsPortalComponent } from '../component/lab-resource-next-objects-portal/lab-resource-next-objects-portal.component';
import {
  LabWorkflowAction,
  LabWorkflowEditConfig,
  LabWorkflowEventNodeAdditionalInfo,
} from '../model/lab-workflow-edit-config.class';
import { LabScenarioDetailPageState } from './lab-scenario-detail-page.state';

/**
 * State to manage the selected node to show it in the drawer
 */
@Injectable()
export class LabWorkflowNodeDetailState {
  private workflowEditConfig = inject(LabWorkflowEditConfig);
  private actionState = inject(PrWorkflowActionState);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);
  private scenarioState = inject(LabScenarioDetailPageState);
  private protocolService = inject(LiProtocolService);
  private portalService = inject(FlPortalService);
  private routerService = inject(LiRouterService);

  private node$: BehaviorSubject<PrWorkflowNodeProcess | null>;

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  public init(): void {
    this.node$ = new BehaviorSubject<PrWorkflowNodeProcess | null>(null);

    this.subscription.add(this.actionState.getAction$().subscribe((action) => this.onNewAction(action)));

    this.subscription.add(
      this.workflowEditConfig
        .getActions$([LabWorkflowAction.DELETE_PROCESS])
        .subscribe((result) => this.onNodeDeleted(result.additionalInformation))
    );
  }

  private onNewAction(action: PrWorkflowActionEvent | null): void {
    if (action == null) return;

    switch (action.action) {
      case 'selectProcessNode':
        this.setNode(action.processNode);
        this.openProcessConfigDashboard();
        break;
      case 'showResource':
        this.openResourceDetail(action.resourceId);
        break;
      case 'showView':
        this.openViewDetail(action);
        break;
      case 'openSelectResource':
        this.openResourceSelection(action.processNode);
        break;
      case 'showNextScenarios':
        this.openScenariosUsingResourcePortal(action.resourceId, action.element);
        break;
      case 'navigateToScenario':
        this.routerService.navigateToScenarioDetail(action.scenarioId);
        break;
    }
  }

  openProcessConfigDashboard(): void {
    this.dialogService.openBigDialog(LabProcessDashboardComponent, {
      panelClass: ['g-dialog-no-padding', 'g-dialog-main-background'],
      viewContainerRef: this.viewContainerRef,
      autoFocus: false,
    });
  }

  /**
   * If the current selected node is deleted, set current node to null
   * @param info
   * @private
   */
  private onNodeDeleted(info: LabWorkflowEventNodeAdditionalInfo): void {
    const node = this.node$.value;
    if (
      info &&
      node &&
      info.node.instanceName == node.instanceName &&
      info.node.parentLayerId == node.parentLayerId
    ) {
      this.setNode(null);
    }
  }

  public setNode(node: PrWorkflowNodeProcess | null): void {
    this.node$.next(node);
  }

  public getNode$(): Observable<PrWorkflowNodeProcess | null> {
    return this.node$.asObservable();
  }

  public getProcess$(): Observable<LiProcess> {
    return this.getNode$().pipe(
      filter((node): node is PrWorkflowNodeProcess => node != null),
      switchMap((node) => this.scenarioState.getLabProcess$(node.currentObject.id))
    );
  }

  public clear(): void {
    this.node$.complete();
    this.subscription?.unsubscribe();
  }

  public resetProcess(): void {
    const node = this.requireNode();
    this.workflowEditConfig.resetProcess(node.parentLayerId, node.instanceName);
  }

  public createDynamicInputPort(): void {
    this.workflowEditConfig.addDynamicInputPort(this.requireNode());
  }

  public createDynamicOutputPort(): void {
    this.workflowEditConfig.addDynamicOutputPort(this.requireNode());
  }

  public deleteDynamicInputPort(portName: string): void {
    this.workflowEditConfig.removeDynamicInputPort(this.requireNode(), portName);
  }

  public deleteDynamicOutputPort(portName: string): void {
    this.workflowEditConfig.removeDynamicOutputPort(this.requireNode(), portName);
  }

  public updateDynamicInputPort(portName: string, ioSpec: TdIOSpec): void {
    this.workflowEditConfig.updateDynamicInputPort(this.requireNode(), portName, ioSpec);
  }

  public updateDynamicOutputPort(portName: string, ioSpec: TdIOSpec): void {
    this.workflowEditConfig.updateDynamicOutputPort(this.requireNode(), portName, ioSpec);
  }

  private requireNode(): PrWorkflowNodeProcess {
    const node = this.node$.value;
    if (node == null) {
      throw new Error('No workflow node selected');
    }
    return node;
  }

  private openResourceDetail(resourceId: string): void {
    this.dialogService.openBigDialog(LiResourceDetailDialogComponent, {
      data: resourceId,
      panelClass: 'g-dialog-main-background',
      closeOnNavigation: true,
    });
  }

  private openViewDetail(event: PrWorkflowActionShowView): void {
    const data: LiResourceViewDetailDialogInput = {
      mode: 'view',
      resourceId: event.resourceId,
      resourceName: event.resourceName,
      viewMethodName: event.config.view_config.view_method_name,
      config: event.config.view_config.config_values,
      saveViewConfig: true,
    };
    this.dialogService.openBigDialog(LiResourceViewDetailDialogComponent, { data: data });
  }

  private openResourceSelection(node: PrWorkflowNode): void {
    this.dialogService
      .openBigDialog(LiSelectResourceDialogComponent)
      .afterClosed()
      .subscribe((resource) => this.onResourceSelectionClosed(node, resource));
  }

  private onResourceSelectionClosed(node: PrWorkflowNode, resource?: LiResource): void {
    if (resource) {
      this.workflowEditConfig.saveProcessConfig(node.parentLayerId, node.instanceName, {
        [TdTypingName.task.input.configName]: resource.id,
      });
    }
  }

  updateProcessName(process: LiProcess, newName: string): void {
    this.protocolService
      .renameProcess(process.parentProtocolId, process.instanceName, newName)
      .subscribe((process) => this.onProcessUpdateSuccess(process));
  }

  updateCommunityAgentCodeParamsVisibility(process: LiProcess, visibility: TdParamSpecVisibility): void {
    this.protocolService
      .updateCommunityAgentCodeParamsVisibility(process.parentProtocolId, process.instanceName, visibility)
      .subscribe((process) => this.onProcessUpdateSuccess(process));
  }

  private onProcessUpdateSuccess(process: LiProcess): void {
    this.scenarioState.refreshProcess(process);
  }

  private openScenariosUsingResourcePortal(resourceId: string, element: HTMLElement): void {
    const position: FlPortalConnectedPosition[] = ['right', 'left', 'bottom', 'top'];

    const config = this.portalService.configureRelativePortal(element, position, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true,
    });

    this.portalService.createPortal(LabResourceNextObjectsPortalComponent, config, resourceId);
  }
}
