import {Injectable, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, filter, firstValueFrom, Observable, switchMap} from 'rxjs';
import {LabProcess} from '../../../../lab-core/model/entities/process/lab-process.entity';
import {
  PrConfigValues,
  PrWorkflowActionEvent,
  PrWorkflowActionShowView,
  PrWorkflowActionState,
  PrWorkflowNodeProcess
} from '@monorepo/protocol';
import {MatDrawer} from '@angular/material/sidenav';
import {
  LabResourceDetailDialogComponent
} from '../../../../lab-core/entity-module/lab-resource-core/component/lab-resource-detail-dialog/lab-resource-detail-dialog.component';
import {
  LabResourceViewDetailDialogComponent,
  LabResourceViewDetailDialogInput
} from '../../../../lab-core/entity-module/lab-resource-core/component/lab-resource-view-detail-dialog/lab-resource-view-detail-dialog.component';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  LabWorkflowAction,
  LabWorkflowEditConfig,
  LabWorkflowEventNodeAdditionalInfo
} from '../model/lab-workflow-edit-config.class';
import {TdIOSpec} from '@monorepo/technical-doc';
import {ClSubscriptionHandler} from '@monorepo/core-lib';
import {
  LabWorkflowNodeDashboardComponent
} from '../component/lab-workflow-node-dashboard/lab-workflow-node-dashboard.component';

/**
 * State to manage the selected node to show it in the drawer
 */
@Injectable()
export class LabWorkflowNodeDetailState {

  private node$: BehaviorSubject<PrWorkflowNodeProcess>;

  private drawer: MatDrawer;
  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private workflowEditConfig: LabWorkflowEditConfig,
              private actionState: PrWorkflowActionState,
              private dialogService: FlDialogService,
              private viewContainerRef: ViewContainerRef) {
  }

  public init(drawer: MatDrawer): void {
    this.node$ = new BehaviorSubject(null);
    this.drawer = drawer;

    this.subscription.add(this.actionState.getAction$().subscribe(
      action => this.onNewAction(action)
    ));

    this.subscription.add(this.workflowEditConfig.getActions$([LabWorkflowAction.DELETE_PROCESS]).subscribe(
      result => this.onNodeDeleted(result.additionalInformation)));
  }

  private onNewAction(action: PrWorkflowActionEvent): void {
    if (action == null) return;

    switch (action.action) {
      case 'selectNode':
        this.setNode(action.processNode);
        this.drawer.open();
        break;
      case 'configureNode':
        this.setNode(action.processNode);
        this.openProcessConfigDashboard();
        break;
      case 'showResource':
        this.openResourceDetail(action.resourceId);
        break;
      case 'showView':
        this.openViewDetail(action);
        break;

    }
  }

  openProcessConfigDashboard(): void {
    this.dialogService.openBigDialog(LabWorkflowNodeDashboardComponent, {
      panelClass: ['g-dialog-no-padding', 'g-dialog-main-background'],
      viewContainerRef: this.viewContainerRef,
      autoFocus: false
    });
  }

  /**
   * If the current selected node is deleted, close the drawer
   * @param info
   * @private
   */
  private onNodeDeleted(info: LabWorkflowEventNodeAdditionalInfo): void {
    const node = this.node$.value;
    if (info && node && info.node.nodeName == node.nodeName && info.node.parentLayerId == node.parentLayerId) {
      this.setNode(null);
    }
  }

  public setNode(node: PrWorkflowNodeProcess): void {
    this.node$.next(node);
    if (node == null) {
      this.drawer.close();
    }
  }

  public getNode$(): Observable<PrWorkflowNodeProcess> {
    return this.node$.asObservable();
  }

  public getProcess$(): Observable<LabProcess> {
    return this.getNode$().pipe(
      filter(node => node != null),
      switchMap(node => node.getObject$() as Observable<LabProcess>));
  }

  public getProcessPromise(): Promise<LabProcess> {
    return firstValueFrom(this.getProcess$());
  }

  public clear(): void {
    this.node$.complete();
    this.subscription?.unsubscribe();
  }

  public updateConfigValues(config: PrConfigValues): void {
    const node = this.node$.value;
    this.workflowEditConfig.updateProcessConfig(node.parentLayerId, node.nodeName, config);
  }

  public resetProcess(): void {
    const node = this.node$.value;
    this.workflowEditConfig.resetProcess(node.parentLayerId, node.nodeName);
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
      saveViewConfig: true,
    };
    this.dialogService.openBigDialog(LabResourceViewDetailDialogComponent, {data: data});
  }
}
