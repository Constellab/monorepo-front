import {computed, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {BehaviorSubject, filter, firstValueFrom, Observable, Subscription, switchMap} from 'rxjs';
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
import {LabWorkflowEditConfig} from '../model/lab-workflow-edit-config.class';
import {TdIOSpec} from '@monorepo/technical-doc';


export class A {
  a: WritableSignal<number>;

  constructor(a: number) {
    this.a = signal(a);
  }
}

/**
 * State to manage the selected node to show it in the drawer
 */
@Injectable()
export class LabWorkflowNodeDetailState {

  private node$: BehaviorSubject<PrWorkflowNodeProcess>;
  private nodeSignal: WritableSignal<PrWorkflowNodeProcess>;

  private drawer: MatDrawer;
  private subscription: Subscription;

  public a: WritableSignal<A>;

  constructor(private workflowEditConfig: LabWorkflowEditConfig,
              private actionState: PrWorkflowActionState,
              private dialogService: FlDialogService) {
  }

  public getA(): Signal<A> {
    return this.a;
  }

  public getC(): Signal<number> {
    return computed(() => this.a().a());
  }

  public init(drawer: MatDrawer): void {
    this.node$ = new BehaviorSubject(null);
    this.nodeSignal = signal(null);

      this.a = signal(new A(1));
    this.drawer = drawer;

    this.subscription = this.actionState.getAction$().subscribe(
      action => this.onNewAction(action)
    );
  }

  private onNewAction(action: PrWorkflowActionEvent): void {
    if (action == null) return;

    switch (action.action) {
      case 'selectNode':
        this.setNode(action.processNode);
        this.drawer.open();
        break;
      case 'showResource':
        this.openResourceDetail(action.resourceId);
        break;
      case 'showView':
        this.openViewDetail(action);
        break;

    }
  }

  public setNode(node: PrWorkflowNodeProcess): void {
    this.node$.next(node);
    this.nodeSignal.set(node);
    console.log('setNode', node.nodeName);
  }

  public getNode$(): Observable<PrWorkflowNodeProcess> {
    return this.node$.asObservable();
  }

  public getProcess$(): Observable<LabProcess> {
    return this.getNode$().pipe(
      filter(node => node != null),
      switchMap(node => node.getObject$() as Observable<LabProcess>));
  }

  public get node2(): Signal<PrWorkflowNodeProcess> {
    return this.nodeSignal.asReadonly();
  }

  public get process2(): Signal<LabProcess> {
    return computed(() => {
      const node = this.node2();
      if (node == null) return null;
      return node.objectSignal() as LabProcess;
    });
  }

  public getProcess22(): Signal<LabProcess> {
    return computed(() => {
      const node = this.node2();
      if (node == null) return null;
      return node.objectSignal() as LabProcess;
    });
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
