import {
  PrAddNodeWithConnection,
  PrConfigValues,
  PrNodeRelativeCoord,
  PrWorkflow,
  PrWorkflowConnection,
  PrWorkflowEvent,
  PrWorkflowLayer,
  PrWorkflowNode,
  PrWorkflowNodeInterface,
  PrWorkflowNodeOuterface,
  PrWorkflowNodeProcess,
  PrWorkflowNodeProtocol
} from '@monorepo/protocol';
import {Observable, of, Subscription, switchMap, tap} from 'rxjs';
import {LabProtocolService} from '../../../../lab-core/entity-service/lab-protocol.service';
import {Injectable, OnDestroy} from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalAction,
  FlPortalActionResult,
  FlPortalActionsService,
  FlSnackBarService,
  FlTranslatableText,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {LabWorkflowFactory} from './lab-workflow.factory';
import {LabProtocolUpdateDTO} from './lab-workflow-action.class';
import {LabExperimentDetailPageState} from '../state/lab-experiment-detail-page.state';
import {LabProcess} from '../../../../lab-core/model/entities/process/lab-process.entity';
import {TdIOSpec} from '@monorepo/technical-doc';
import {map} from 'rxjs/operators';
import {
  LabNavigableCallActionResult,
  LabNavigableEntityService,
  LabNavigableImpactConfig
} from '../../../../lab-core/entity-module/lab-navigable-entity-core/lab-navigable-entity.service';

export enum LabWorkflowAction {
  ADD_PROCESS = 'workflow-add-process',
  ADD_PROCESS_WITH_CONNECTIONS = 'workflow-add-process-with-connections',
  DELETE_PROCESS = 'workflow-remove-process',
  ADD_CONNECTION = 'workflow-add-connection',
  DELETE_CONNECTION = 'workflow-delete-connection',
  DELETE_INTERFACE = 'workflow-delete-interface',
  DELETE_OUTERFACE = 'workflow-delete-outerface',
  UPDATE_PROCESS_CONFIG = 'workflow-update-process-config',
  RESET_PROCESS = 'reset-process',
  MODIFY_DYNAMIC_PORT = 'workflow-update-dynamic-port',
  RUN_PROCESS = 'workflow-run-process',
}

interface LabWorkflowEventConnectionAdditionalInfo {
  protocolId: string;
  connection: PrWorkflowConnection;
}

export interface LabWorkflowEventNodeAdditionalInfo {
  protocolId: string;
  node: PrWorkflowNode;
  connections: PrWorkflowConnection[];
}


@Injectable()
export class LabWorkflowEditConfig implements OnDestroy {

  private workflow: PrWorkflow;

  private actionSubscription: Subscription;
  private workflowSubscription: Subscription;

  constructor(private protocolService: LabProtocolService,
              private actionsService: FlPortalActionsService,
              private snackBarService: FlSnackBarService,
              private workflowFactory: LabWorkflowFactory,
              private experimentState: LabExperimentDetailPageState,
              private dialogService: FlDialogService,
              private labNavigableService: LabNavigableEntityService,
              private translateService: FlTranslateService) {

    // listen to the new Process actions
    this.actionSubscription = this.getAllActions$().subscribe(
      result => this.onActionResult(result)
    );
  }

  public init(workflow: PrWorkflow): void {
    this.workflow = workflow;
    workflow.getWorkflowEvent$().subscribe(
      event => this.onWorkflowEvent(event)
    );
  }

  public addNode(typingName: string, processName: string): void {
    const obs = this.saveProcess(this.workflow.currentLayer.id, typingName);

    this.addProcessAction(obs,
      {
        text: 'pr.adding_process', translateText: true,
        translateParam: {param: {processName: processName}}
      });
  }

  public addCommunityLiveTask(liveTaskVersionId: string, liveTaskTitle: string): void {
    const obs = this.saveCommunityLiveTask(this.workflow.currentLayer.id, liveTaskVersionId);
    this.addProcessAction(obs,
      {
        text: 'pr.adding_community_live_task', translateText: true,
        translateParam: {param: {processName: liveTaskTitle}}
      });
  }

  public addSource(resourceId: string, resourceName: string): void {
    const obs = this.saveSource(this.workflow.currentLayer.id, resourceId);

    this.addProcessAction(obs,
      {
        text: 'pr.adding_source', translateText: true,
        translateParam: {param: {resourceName: resourceName}}
      });
  }

  public addSourceToProcessInput(resourceId: string, processNodeName: string, inputPortName: string,
                                 resourceName: string): void {
    const obs = this.saveSourceToProcessInput(this.workflow.currentLayer.id, resourceId, processNodeName, inputPortName);
    this.addProcessWithLinkAction(
      obs,
      processNodeName,
      'before',
      {
        text: 'pr.adding_source', translateText: true,
        translateParam: {param: {resourceName: resourceName}}
      });
  }

  public addTaskOutput(processNodeName: string, outputPortName: string): void {
    const obs = this.saveTaskOutput(this.workflow.currentLayer.id, processNodeName, outputPortName);

    this.addProcessWithLinkAction(
      obs,
      processNodeName,
      'after',
      {
        text: 'pr.adding_output', translateText: true,
      });
  }

  public addViewerToOutput(processNodeName: string, outputPortName: string): void {
    // retrieve the protocol of the layer
    const obs = this.saveViewer(this.workflow.currentLayer.id, processNodeName, outputPortName);

    this.addProcessWithLinkAction(
      obs,
      processNodeName,
      'after',
      {
        text: 'pr.adding_viewer', translateText: true,
      });
  }

  public addProcessConnectedToOutput(processTypingName: string, processHumanName: string,
                                     outputProcessName: string, outputPortName: string): void {
    const processWithLink$ = this.saveProcessConnectedToOutput(this.workflow.currentLayer.id,
      processTypingName, outputProcessName, outputPortName);

    this.addProcessWithLinkAction(
      processWithLink$,
      outputProcessName,
      'after',
      {
        text: 'pr.adding_process', translateText: true,
        translateParam: {param: {processName: processHumanName}}
      });
  }

  public addProcessConnectedToInput(processTypingName: string, processHumanName: string,
                                    inputProcessName: string, inputPortName: string): void {
    const processWithLink$ = this.saveProcessConnectedToInput(this.workflow.currentLayer.id,
      processTypingName, inputProcessName, inputPortName);

    this.addProcessWithLinkAction(
      processWithLink$,
      inputProcessName,
      'before',
      {
        text: 'pr.adding_process', translateText: true,
        translateParam: {param: {processName: processHumanName}}
      });
  }

  // create the action to add a process
  private addProcessAction(process$: Observable<LabProtocolUpdateDTO>, actionText: FlTranslatableText): void {
    // create an action to add this process
    const action: FlPortalAction = {
      text: actionText,
      type: LabWorkflowAction.ADD_PROCESS,
      // create the process in the API and get the process
      action: process$,
      additionalInformation: this.workflow.currentLayer.id
    };

    this.executeUpdateAction(action, null);
  }

  // create the action to add a process with a link
  private addProcessWithLinkAction(processWithLink$: Observable<LabProtocolUpdateDTO>,
                                   processNodeName: string,
                                   newProcessPosition: 'before' | 'after',
                                   actionText: FlTranslatableText): void {
    // relative coord to place the source node before the process
    const relativeCoord: PrNodeRelativeCoord = {
      nodeName: processNodeName,
      position: newProcessPosition,
      layerId: this.workflow.currentLayer.id
    };
    // create an action to add this process
    const action: FlPortalAction = {
      text: actionText,
      type: LabWorkflowAction.ADD_PROCESS_WITH_CONNECTIONS,
      // create the process in the API and get the process
      action: processWithLink$,
      additionalInformation: relativeCoord
    };

    let process: LabProcess = null;
    // only provide the process if the new connection before the existing process
    if (newProcessPosition === 'before') {
      process = this.workflow.currentLayer.findNodeByName(processNodeName).currentObject;
    }
    this.executeUpdateAction(action, process);
  }

  public updateProcessConfig(protocolId: string, processInstanceName: string,
                             config: PrConfigValues): Observable<FlPortalActionResult | null> {
    const node = this.getAndCheckProcessNode(protocolId, processInstanceName);
    if (node == null) return of(null);

    const obs = this.protocolService.saveProcessConfig(protocolId, processInstanceName, config);
    const action: FlPortalAction = {
      type: LabWorkflowAction.UPDATE_PROCESS_CONFIG,
      action: obs,
      text: {text: 'biox.saving_config', translateText: true},
    };
    return this.executeUpdateAction(action, node.currentObject as LabProcess);
  }

  public runProcess(protocolId: string, processInstanceName: string): void {
    const node = this.getAndCheckProcessNode(protocolId, processInstanceName);
    if (node == null) return;

    const obs = this.protocolService.runProcessInProtocol(protocolId, processInstanceName);
    const action: FlPortalAction = {
      type: LabWorkflowAction.RUN_PROCESS,
      action: obs,
      text: {text: 'biox.running_process', translateText: true},
    };
    this.executeUpdateAction(action, node.currentObject as LabProcess);
  }

  public resetProcess(protocolId: string, processInstanceName: string): void {
    const obs = this.callResetProcess(protocolId, processInstanceName,
      'biox.reset_process', 'biox.reset_process_confirmation');
    const action: FlPortalAction = {
      type: LabWorkflowAction.RESET_PROCESS,
      action: obs,
      text: {text: 'biox.resetting_process', translateText: true},
    };
    this.actionsService.addAction(action, true);
  }

  public addDynamicInputPort(node: PrWorkflowNodeProcess): void {
    this.modifyDynamicPort(
      this.protocolService.createDynamicInputPort(node.parentLayerId, node.nodeName),
      node,
      'biox.adding_input_port');
  }

  public addDynamicOutputPort(node: PrWorkflowNodeProcess): void {
    this.modifyDynamicPort(
      this.protocolService.createDynamicOutputPort(node.parentLayerId, node.nodeName),
      node,
      'biox.adding_output_port');
  }


  public removeDynamicInputPort(node: PrWorkflowNodeProcess, portName: string): void {
    this.modifyDynamicPort(
      this.protocolService.deleteDynamicInputPort(node.parentLayerId, node.nodeName, portName),
      node,
      'biox.removing_input_port');
  }

  public removeDynamicOutputPort(node: PrWorkflowNodeProcess, portName: string): void {
    this.modifyDynamicPort(
      this.protocolService.deleteDynamicOutputPort(node.parentLayerId, node.nodeName, portName),
      node,
      'biox.removing_output_port');
  }


  public updateDynamicInputPort(node: PrWorkflowNodeProcess, portName: string, spec: TdIOSpec): void {
    this.modifyDynamicPort(
      this.protocolService.updateDynamicInputPort(node.parentLayerId, node.nodeName, portName, spec),
      node,
      'biox.configuring_port');
  }

  public updateDynamicOutputPort(node: PrWorkflowNodeProcess, portName: string, spec: TdIOSpec): void {
    this.modifyDynamicPort(
      this.protocolService.updateDynamicOutputPort(node.parentLayerId, node.nodeName, portName, spec),
      node,
      'biox.configuring_port');
  }

  private modifyDynamicPort(obs: Observable<LabProtocolUpdateDTO>, node: PrWorkflowNodeProcess,
                            text: string): void {
    const action: FlPortalAction = {
      type: LabWorkflowAction.MODIFY_DYNAMIC_PORT,
      action: obs,
      text: {text: text, translateText: true},
    };

    this.executeUpdateAction(action, node.currentObject as LabProcess);
  }


  private getAndCheckProcessNode(protocolId: string, processInstanceName: string): PrWorkflowNodeProcess {
    const layer = this.workflow.findLayerWithId(protocolId);
    const node = layer.findNodeByName(processInstanceName);

    if (node == null) {
      console.error(`Could not find node with name ${processInstanceName} in protocol ${protocolId}`);
      return null;
    }

    if (!(node instanceof PrWorkflowNodeProcess)) {
      console.error(`Node with name ${processInstanceName} in protocol ${protocolId} is not a process node, it can't be configured`);
      return null;
    }

    return node;
  }

  private onWorkflowEvent(workflowEvent: PrWorkflowEvent): void {

    let portalAction: FlPortalAction;
    let process: LabProcess;

    switch (workflowEvent.action) {
      case 'deleteNode':
        const node: PrWorkflowNode = workflowEvent.node;
        const additionalInfo: LabWorkflowEventNodeAdditionalInfo = {
          protocolId: workflowEvent.protocolId,
          node: workflowEvent.node,
          connections: workflowEvent.connections
        };

        if (node instanceof PrWorkflowNodeInterface) {
          portalAction = {
            type: LabWorkflowAction.DELETE_INTERFACE,
            text: {
              text: 'pr.deleting_interface',
              translateText: true,
              translateParam: {param: {name: node.getCurrentTitle()}}
            },
            action: this.deleteInterface(workflowEvent.protocolId, node.interfaceName),
            additionalInformation: additionalInfo
          };
        } else if (node instanceof PrWorkflowNodeOuterface) {
          portalAction = {
            type: LabWorkflowAction.DELETE_OUTERFACE,
            text: {
              text: 'pr.deleting_outerface',
              translateText: true,
              translateParam: {param: {name: node.getCurrentTitle()}},
            },
            action: this.deleteOuterface(workflowEvent.protocolId, node.outerfaceName),
            additionalInformation: additionalInfo
          };
        } else {
          process = node.currentObject;
          portalAction = {
            type: LabWorkflowAction.DELETE_PROCESS,
            text: {
              text: 'pr.deleting_process',
              translateText: true,
              translateParam: {param: {processName: node.getCurrentTitle()}}
            },
            action: this.onDeleteNode(workflowEvent.protocolId, workflowEvent.node),
            additionalInformation: additionalInfo
          };
        }
        break;
      case 'addConnection' :
      case 'deleteConnection' :
        if (workflowEvent.connection.isIOFaceConnection()) {
          this.snackBarService.openErrorMessage({text: 'pr.delete_link_interface_error', translateText: true});
          // re-create the connection
          const layer = this.workflow.findLayerWithId(workflowEvent.protocolId);
          layer.addConnection(workflowEvent.connection);
          return;
        }

        const additionalInformation: LabWorkflowEventConnectionAdditionalInfo = {
          protocolId: workflowEvent.protocolId,
          connection: workflowEvent.connection
        };

        // associate the right process of the connection for the action
        process = workflowEvent.connection.inputNode.currentObject;

        if (workflowEvent.action === 'addConnection') {
          portalAction = {
            type: LabWorkflowAction.ADD_CONNECTION,
            text: {
              text: 'pr.adding_connection',
              translateText: true
            },
            action: this.onAddConnection(workflowEvent.protocolId, workflowEvent.connection),
            additionalInformation: additionalInformation
          };
        } else {
          portalAction = {
            type: LabWorkflowAction.DELETE_CONNECTION,
            text: {
              text: 'pr.deleting_connection',
              translateText: true
            },
            action: this.onDeleteConnection(workflowEvent.protocolId, workflowEvent.connection),
            additionalInformation: additionalInformation
          };
        }
        break;
      case 'nodeMoved':
        this.saveNodePosition(workflowEvent.node, workflowEvent.protocolId);
        return;
    }

    this.executeUpdateAction(portalAction, process);
  }

  private saveNodePosition(node: PrWorkflowNode, protocolId: string): void {
    if (node instanceof PrWorkflowNodeProcess) {
      // save the node positions
      this.protocolService.saveProcessLayout(protocolId, node.nodeName,
        node.getCoords()).subscribe();
    } else if (node instanceof PrWorkflowNodeInterface) {
      this.protocolService.saveInterfaceLayout(protocolId, node.interfaceName,
        node.getCoords()).subscribe();
    } else if (node instanceof PrWorkflowNodeOuterface) {
      this.protocolService.saveOuterfaceLayout(protocolId, node.outerfaceName,
        node.getCoords()).subscribe();
    }
  }

  private onActionResult(actionResult: FlPortalActionResult<LabProtocolUpdateDTO>): void {
    if (actionResult.status === 'success') {
      if (actionResult.action.type === LabWorkflowAction.ADD_PROCESS) {
        const node = this.workflowFactory.labProcessToWorkflowNode(actionResult.result.process);
        this.onNewNode(node, actionResult.additionalInformation);
      } else if (actionResult.action.type === LabWorkflowAction.ADD_PROCESS_WITH_CONNECTIONS) {
        const processWithLink = this.workflowFactory.labProcessWithLinkToNodeWithLink(actionResult.result.process,
          actionResult.result.link);
        this.onNewNodeWithConnector(processWithLink, actionResult.additionalInformation);
      } else if (actionResult.action.type === LabWorkflowAction.DELETE_PROCESS) {
        // clear the node observable, if the deletion worked
        const info: LabWorkflowEventNodeAdditionalInfo = actionResult.additionalInformation;
        info.node.destroy();

        if(info.node instanceof PrWorkflowNodeProtocol){
          this.experimentState.deleteProtocol(info.node.currentObject.id);
        }
      }
      // else if (actionResult.action.type === LabWorkflowAction.ADD_DYNAMIC_INPUT_PORT) {
      //   const protocolUpdate: LabProtocolUpdateDTO = actionResult.result;
      //   const layer = this.workflow.findLayerWithId(protocolUpdate.process.parentProtocolId);
      //
      //   layer.addNodeInputPort(protocolUpdate.process.instanceName);
      //   return;
      // } else if (actionResult.action.type === LabWorkflowAction.DELETE_DYNAMIC_INPUT_PORT) {
      //   const protocolUpdate: LabProtocolUpdateDTO = actionResult.result;
      //   const layer = this.workflow.findLayerWithId(protocolUpdate.process.parentProtocolId);
      //   const info: LabWorkflowPortAdditionalInfo = actionResult.additionalInformation;
      //   layer.deleteInputNodePort(protocolUpdate.process.instanceName, info.portName);
      //   return;
      // }
      this.refreshProtocolAndParent(actionResult.result);
    } else {
      this.revertWorkflowEvent(actionResult.action.type as LabWorkflowAction, actionResult.additionalInformation);
    }
  }

  private revertWorkflowEvent(actionType: LabWorkflowAction, additionalInfo: any): void {
    // revert the DELETE and ADD_CONNECTION actions
    if (actionType === LabWorkflowAction.DELETE_CONNECTION) {
      const info: LabWorkflowEventConnectionAdditionalInfo = additionalInfo;
      const layer = this.workflow.findLayerWithId(info.protocolId);
      layer.addConnection(info.connection);
    } else if (actionType === LabWorkflowAction.ADD_CONNECTION) {
      const info: LabWorkflowEventConnectionAdditionalInfo = additionalInfo;
      const layer = this.workflow.findLayerWithId(info.protocolId);
      layer.removeConnection(info.connection);
    } else if ([LabWorkflowAction.DELETE_PROCESS, LabWorkflowAction.DELETE_INTERFACE, LabWorkflowAction.DELETE_OUTERFACE]
      .includes(actionType)) {
      // re-create the node and connection
      const info: LabWorkflowEventNodeAdditionalInfo = additionalInfo;

      // re-create the node
      this.onNewNode(info.node, info.protocolId);

      const layer: PrWorkflowLayer = this.workflow.findLayerWithId(info.protocolId);
      // re-create the connections
      for (const connection of info.connections) {
        layer.addConnection(connection);
      }
    }
  }

  private onNewNode(node: PrWorkflowNode, layerId: string,): void {
    // add the node to the workflow
    const layer: PrWorkflowLayer = this.workflow.findLayerWithId(layerId);
    layer.addNode(node);

    // save the node positions after the creation
    this.saveNodePosition(node, layerId);
  }

  private onNewNodeWithConnector(processWithLink: PrAddNodeWithConnection, relativeCoord: PrNodeRelativeCoord): void {

    // add the node to the workflow
    const layer: PrWorkflowLayer = this.workflow.findLayerWithId(relativeCoord.layerId);

    // set the correct position for the new node
    const coord = layer.getRelativeNodePosition(relativeCoord.nodeName, relativeCoord.position);
    const node = processWithLink.node;
    node.setCoords(coord);

    this.onNewNode(processWithLink.node, relativeCoord.layerId);

    layer.addPrConnection(processWithLink.connection);
  }

  saveProcess(protocolId: string, typingName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addProcessToProtocol(protocolId, typingName);
  }

  saveCommunityLiveTask(protocolId: string, liveTaskVersionId: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addCommunityLiveTaskToProtocol(protocolId, liveTaskVersionId);
  }

  saveSource(protocolId: string, resourceId: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addSource(protocolId, resourceId);
  }


  saveSourceToProcessInput(protocolId: string, resourceId: string,
                           processNodeName: string, inputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addSourceToProcessInput(protocolId, resourceId, processNodeName, inputPortName);
  }

  saveTaskOutput(protocolId: string, processNodeName: string, outputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addTaskOutput(protocolId, processNodeName, outputPortName);
  }

  saveViewer(protocolId: string, processName: string, outputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addViewerToProcessOutput(protocolId, processName, outputPortName);
  }


  saveProcessConnectedToOutput(protocolId: string, processTypingName: string, outputProcessName: string,
                               outputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addProcessConnectedToOutput(protocolId, processTypingName, outputProcessName, outputPortName);
  }

  saveProcessConnectedToInput(protocolId: string, processTypingName: string,
                              inputProcessName: string, inputPortName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addProcessConnectedToInput(protocolId, processTypingName, inputProcessName, inputPortName);
  }

  deleteInterface(protocolId: string, portName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.deleteInterface(protocolId, portName);
  }

  deleteOuterface(protocolId: string, portName: string): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.deleteOuterface(protocolId, portName);
  }

  onDeleteConnection(protocolId: string, connection: PrWorkflowConnection): Observable<void> {
    return this.protocolService.deleteConnection(protocolId, connection.inputNode.nodeName, connection.inputPort.name);
  }

  onAddConnection(protocolId: string, connection: PrWorkflowConnection): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.addConnection(protocolId, {
      input_port_name: connection.inputPort.name,
      input_process_name: connection.inputNode.nodeName,
      output_port_name: connection.outputPort.name,
      output_process_name: connection.outputNode.nodeName
    });
  }

  onDeleteNode(protocolId: string, node: PrWorkflowNode): Observable<LabProtocolUpdateDTO> {
    return this.protocolService.deleteProcessInProtocol(protocolId, node.nodeName);
  }

  public getAllActions$(): Observable<FlPortalActionResult> {
    return this.actionsService.getResult$([
      LabWorkflowAction.ADD_PROCESS, LabWorkflowAction.ADD_PROCESS_WITH_CONNECTIONS,
      LabWorkflowAction.DELETE_PROCESS,
      LabWorkflowAction.DELETE_INTERFACE, LabWorkflowAction.DELETE_OUTERFACE,
      LabWorkflowAction.DELETE_CONNECTION, LabWorkflowAction.ADD_CONNECTION,
      LabWorkflowAction.UPDATE_PROCESS_CONFIG, LabWorkflowAction.RESET_PROCESS,
      LabWorkflowAction.MODIFY_DYNAMIC_PORT, LabWorkflowAction.RUN_PROCESS]);
  }

  public getActions$(actions: LabWorkflowAction[]): Observable<FlPortalActionResult> {
    return this.actionsService.getResult$(actions);
  }

  private executeUpdateAction(action: FlPortalAction, process: LabProcess): Observable<FlPortalActionResult | null> {
    let dialogInput: FlConfirmDialogInput;

    // if the action is not attached to a node
    // we check if this is a finished experiment
    if (!process && this.experimentState.currentExperiment.isFinished()) {
      dialogInput = {
        title: 'biox.update_finished_experiment',
        content: 'biox.update_finished_experiment_confirmation',
        translateTitleAndContent: true,
      };

      const resetObs = this.dialogService.openConfirmDialog(dialogInput).afterClosed();
      const actionObs = action.action;
      action.action = resetObs.pipe(
        switchMap((result: FlConfirmDialogResult) => {
          if (result.choice) {
            return actionObs;
          } else {
            throw Error('Canceled');
          }
        })
      );

      // if the action is attached to an existing node
      // we check if this is a finished process
    } else if (process && !this.experimentState.currentExperiment.isDraft() &&
      process instanceof LabProcess && process.wasRun()) {

      const resetObs = this.callResetProcess(process.parentProtocolId, process.instanceName,
        'biox.update_finished_process', 'biox.update_finished_process_confirmation');
      const actionObs = action.action;
      action.action = resetObs.pipe(
        switchMap(() => actionObs)
      );
    }
    return this.actionsService.addAction(action, true);
  }


  /**
   * Method to reset a process and return the reset result (by calling the force reset dialog if needed).
   * If the reset is a success, return the reset result
   * If the reset needs a force reset, open the force reset dialog and then return the reset result
   * @private
   */
  private callResetProcess(protocolId: string, processInstanceName: string, title: string, noImpactConfirmText: string):
    Observable<LabNavigableCallActionResult<LabProtocolUpdateDTO>> {

    const updateFinishedProcess = this.translateService.translate(noImpactConfirmText);
    const resetProcessImpact = this.translateService.translate('biox.reset_process_confirm_impact',
      {param: {title: this.experimentState.currentExperiment.title}});

    const impactData: LabNavigableImpactConfig = {
      title: {text: title, translateText: true},
      confirmImpactConfirmText: `<p>${updateFinishedProcess}</p><p>${resetProcessImpact}</p>`,
      noImpactConfirmText: {text: noImpactConfirmText, translateText: true},
      checkImpact: () => this.protocolService.checkImpactForProcessReset(protocolId, processInstanceName),
      callAction: () => this.protocolService.resetProcessInProtocol(protocolId, processInstanceName).pipe(
        // on reset result, refresh the protocol, the process will be refreshed by the event
        // we need the protocol here because the next request (like configure process) might not refresh the protocol
        tap((result: LabProtocolUpdateDTO) => {
          if (result.protocolUpdated && result.protocol) {
            this.experimentState.refreshProtocolAndOthers(result.protocol);
          }
        })
      )
    };

    return this.labNavigableService.callImpactMethod(impactData).pipe(
      map(
        resetResult => {
          // if the reset was canceled or failed, throw an error
          if (resetResult == null || !resetResult.success) {
            throw new Error('Cancel');
          }

          return resetResult.result;
        }
      )
    );
  }

  // call after an update action has been performed to check if the protocol has been updated
  private refreshProtocolAndParent(protocolUpdate: LabProtocolUpdateDTO): void {
    if (!(protocolUpdate instanceof LabProtocolUpdateDTO)) return;

    if (protocolUpdate.protocolUpdated && protocolUpdate.protocol) {
      this.experimentState.refreshProtocolAndOthers(protocolUpdate.protocol);
      // if the protocol has not been updated, we check if the process has been updated
    } else if (protocolUpdate.process) {
      this.experimentState.refreshProcess(protocolUpdate.process);
    }

    if (protocolUpdate.subProtocols) {
      this.experimentState.refreshProtocolsSuccess(protocolUpdate.subProtocols);
    }

  }

  ngOnDestroy(): void {
    this.workflowSubscription?.unsubscribe();
    this.actionSubscription?.unsubscribe();
  }


}
