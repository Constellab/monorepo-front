import { Injectable, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { LabProcess } from '../../../lab-core/model/entities/process/lab-process.entity';
import {
  PrWorkflowActionEvent,
  PrWorkflowActionShowView,
  PrWorkflowActionState,
  PrWorkflowNode,
  PrWorkflowNodeProcess
} from '@monorepo/protocol';
import {
  LabResourceDetailDialogComponent
} from '../../../lab-core/entity-module/lab-resource-core/component/lab-resource-detail-dialog/lab-resource-detail-dialog.component';
import {
  LabResourceViewDetailDialogComponent,
  LabResourceViewDetailDialogInput
} from '../../../lab-core/entity-module/lab-resource-core/component/lab-resource-view-detail-dialog/lab-resource-view-detail-dialog.component';
import { FlDialogService, FlPortalConnectedPosition, FlPortalService } from '@monorepo/front-core-lib';
import {
  LabWorkflowAction,
  LabWorkflowEditConfig,
  LabWorkflowEventNodeAdditionalInfo
} from '../model/lab-workflow-edit-config.class';
import { TdIOSpec, TdTypingName } from '@monorepo/technical-doc';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { LabProcessDashboardComponent } from '../component/lab-process-dashboard/lab-process-dashboard.component';
import { LabScenarioDetailPageState } from './lab-scenario-detail-page.state';
import { LabProtocolService } from '../../../lab-core/entity-service/lab-protocol.service';
import {
  LabSelectResourceDialogComponent
} from '../../../lab-core/entity-module/lab-resource-core/component/lab-select-resource-dialog/lab-select-resource-dialog.component';
import { LabResource } from '../../../lab-core/model/entities/resource/lab-resource.entity';
import {
  LabResourceNextObjectsPortalComponent
} from '../component/lab-resource-next-objects-portal/lab-resource-next-objects-portal.component';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';

/**
 * State to manage the selected node to show it in the drawer
 */
@Injectable()
export class LabWorkflowNodeDetailState {

  private node$: BehaviorSubject<PrWorkflowNodeProcess>;

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private workflowEditConfig: LabWorkflowEditConfig,
              private actionState: PrWorkflowActionState,
              private dialogService: FlDialogService,
              private viewContainerRef: ViewContainerRef,
              private scenarioState: LabScenarioDetailPageState,
              private protocolService: LabProtocolService,
              private portalService: FlPortalService,
              private routerService: LabRouterService) {
  }

  public init(): void {
    this.node$ = new BehaviorSubject(null);

    this.subscription.add(this.actionState.getAction$().subscribe(
      action => this.onNewAction(action)
    ));

    this.subscription.add(this.workflowEditConfig.getActions$([LabWorkflowAction.DELETE_PROCESS]).subscribe(
      result => this.onNodeDeleted(result.additionalInformation)));
  }

  private onNewAction(action: PrWorkflowActionEvent): void {
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
      autoFocus: false
    });
  }

  /**
   * If the current selected node is deleted, set current node to null
   * @param info
   * @private
   */
  private onNodeDeleted(info: LabWorkflowEventNodeAdditionalInfo): void {
    const node = this.node$.value;
    if (info && node && info.node.instanceName == node.instanceName && info.node.parentLayerId == node.parentLayerId) {
      this.setNode(null);
    }
  }

  public setNode(node: PrWorkflowNodeProcess): void {
    this.node$.next(node);
  }

  public getNode$(): Observable<PrWorkflowNodeProcess> {
    return this.node$.asObservable();
  }

  public getProcess$(): Observable<LabProcess> {
    return this.getNode$().pipe(
      filter(node => node != null),
      switchMap(node =>
        this.scenarioState.getLabProcess$(node.parentLayerId, node.instanceName))
    );
  }


  public clear(): void {
    this.node$.complete();
    this.subscription?.unsubscribe();
  }

  public resetProcess(): void {
    const node = this.node$.value;
    this.workflowEditConfig.resetProcess(node.parentLayerId, node.instanceName);
  }

  public createDynamicInputPort(): void {
    this.workflowEditConfig.addDynamicInputPort(this.node$.value);
  }

  public createDynamicOutputPort(): void {
    this.workflowEditConfig.addDynamicOutputPort(this.node$.value);
  }

  public deleteDynamicInputPort(portName: string): void {
    this.workflowEditConfig.removeDynamicInputPort(this.node$.value, portName);
  }

  public deleteDynamicOutputPort(portName: string): void {
    this.workflowEditConfig.removeDynamicOutputPort(this.node$.value, portName);
  }

  public updateDynamicInputPort(portName: string, ioSpec: TdIOSpec): void {
    this.workflowEditConfig.updateDynamicInputPort(this.node$.value, portName, ioSpec);
  }

  public updateDynamicOutputPort(portName: string, ioSpec: TdIOSpec): void {
    this.workflowEditConfig.updateDynamicOutputPort(this.node$.value, portName, ioSpec);
  }

  private openResourceDetail(resourceId: string): void {
    this.dialogService.openBigDialog(LabResourceDetailDialogComponent,
      {
        data: resourceId, panelClass: 'g-dialog-main-background',
        closeOnNavigation: true
      });
  }

  private openViewDetail(event: PrWorkflowActionShowView): void {
    const data: LabResourceViewDetailDialogInput = {
      mode: 'view',
      resourceId: event.resourceId,
      resourceName: event.resourceName,
      viewMethodName: event.config.view_config.view_method_name,
      config: event.config.view_config.config_values,
      saveViewConfig: true
    };
    this.dialogService.openBigDialog(LabResourceViewDetailDialogComponent, { data: data });
  }

  private openResourceSelection(node: PrWorkflowNode): void {
    this.dialogService.openBigDialog(LabSelectResourceDialogComponent).afterClosed().subscribe(
      resource => this.onResourceSelectionClosed(node, resource)
    );
  }

  private onResourceSelectionClosed(node: PrWorkflowNode, resource?: LabResource): void {
    if (resource) {
      this.workflowEditConfig.updateProcessConfig(node.parentLayerId, node.instanceName, {
        [TdTypingName.task.source.configName]: resource.id
      });
    }
  }

  updateProcessName(process: LabProcess, newName: string): void {
    this.protocolService.renameProcess(process.parentProtocolId, process.instanceName, newName).subscribe(
      process => this.onUpdateProcessNameSuccess(process)
    );
  }

  private onUpdateProcessNameSuccess(process: LabProcess): void {
    this.scenarioState.refreshProcess(process);
  }

  private openScenariosUsingResourcePortal(resourceId: string, element: HTMLElement): void {
    const position: FlPortalConnectedPosition[] = ['right', 'left', 'bottom', 'top'];

    const config = this.portalService.configureRelativePortal(element, position, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true
    });

    this.portalService.createPortal(LabResourceNextObjectsPortalComponent, config, resourceId);
  }
}
