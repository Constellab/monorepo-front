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
  PrWorkflowNodeProcess
} from '@monorepo/protocol';
import {Observable, of, share, Subscription, switchMap} from 'rxjs';
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
  FlTranslatableText
} from '@monorepo/front-core-lib';
import {LabWorkflowFactory} from './lab-workflow.factory';
import {LabProtocolUpdateDTO} from './lab-workflow-action.class';
import {LabExperimentDetailPageState} from '../state/lab-experiment-detail-page.state';
import {LabProcess} from '../../../../lab-core/model/entities/process/lab-process.entity';

enum LabWorkflowAction {
  ADD_PROCESS = 'workflow-add-process',
  ADD_PROCESS_WITH_CONNECTIONS = 'workflow-add-process-with-connections',
  DELETE_PROCESS = 'workflow-remove-process',
  ADD_CONNECTION = 'workflow-add-connection',
  DELETE_CONNECTION = 'workflow-delete-connection',
  DELETE_INTERFACE = 'workflow-delete-interface',
  DELETE_OUTERFACE = 'workflow-delete-outerface',
  UPDATE_PROCESS_CONFIG = 'workflow-update-process-config',
  RESET_PROCESS = 'reset-process',
}

interface LabWorkflowEventConnectionAdditionalInfo {
  protocolId: string;
  connection: PrWorkflowConnection;
}

interface LabWorkflowEventNodeAdditionalInfo {
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
              private dialogService: FlDialogService) {

    // listen to the new Process actions
    this.actionSubscription = this.getActions$().subscribe(
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
    return this.executeUpdateAction(action, node.currentObject as LabProcess, true);
  }

  public resetProcess(protocolId: string, processInstanceName: string): void {
    const obs = this.protocolService.resetProcessInProtocol(protocolId, processInstanceName);
    const action: FlPortalAction = {
      type: LabWorkflowAction.RESET_PROCESS,
      action: obs,
      text: {text: 'biox.resetting_process', translateText: true},
    };

    const dialogInfo: FlConfirmDialogInput = {
      title: 'biox.reset_process',
      content: 'biox.reset_process_confirmation',
      translateTitleAndContent: true,
    };

    this.dialogService.openConfirmDialog(dialogInfo).afterClosed().subscribe(
      (result: FlConfirmDialogResult) => {
        if (result.choice) {
          this.actionsService.addAction(action, true);
        }
      });
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
            action: this.deleteInterface(workflowEvent.protocolId, node.getPort().name),
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
            action: this.deleteOuterface(workflowEvent.protocolId, node.getPort().name),
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

    this.executeUpdateAction(portalAction, process, true);
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
      }
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

  public getActions$(): Observable<FlPortalActionResult> {
    return this.actionsService.getResult$([
      LabWorkflowAction.ADD_PROCESS, LabWorkflowAction.ADD_PROCESS_WITH_CONNECTIONS,
      LabWorkflowAction.DELETE_PROCESS,
      LabWorkflowAction.DELETE_INTERFACE, LabWorkflowAction.DELETE_OUTERFACE,
      LabWorkflowAction.DELETE_CONNECTION, LabWorkflowAction.ADD_CONNECTION,
      LabWorkflowAction.UPDATE_PROCESS_CONFIG, LabWorkflowAction.RESET_PROCESS]);
  }

  private executeUpdateAction(action: FlPortalAction, process: LabProcess,
                              revertIfRefuse: boolean = false): Observable<FlPortalActionResult | null> {
    let dialogInput: FlConfirmDialogInput;

    // if the action is not attached to a node
    // we check if this is a finished experiment
    if (!process && this.experimentState.currentExperiment.isFinished()) {
      dialogInput = {
        title: 'biox.update_finished_experiment',
        content: 'biox.update_finished_experiment_confirmation',
        translateTitleAndContent: true,
      };

      // if the action is attached to an existing node
      // we check if this is a finished process
    } else if (process && process instanceof LabProcess && process.isFinished()) {
      dialogInput = {
        title: 'biox.update_finished_process',
        content: 'biox.update_finished_process_confirmation',
        translateTitleAndContent: true,
      };
    }

    if (dialogInput) {
      const obs: Observable<FlPortalActionResult | null> = this.dialogService.openConfirmDialog(dialogInput).afterClosed().pipe(
        switchMap(
          (result: FlConfirmDialogResult) => {
            if (result.choice) {
              return this.actionsService.addAction(action, true);
            } else {
              // revert the action if the user refuse
              if (revertIfRefuse) {
                this.revertWorkflowEvent(action.type as any, action.additionalInformation);
              }
              return of(null);
            }
          }
        ),
        share()); // share prevent the switchMap to be executed twice

      // directly subscribe to call the action
      obs.subscribe();
      // return obs to be able to subscribe to the result
      return obs;
    } else {
      return this.actionsService.addAction(action, true);
    }
  }

  // call after an update action has been performed to check if the protocol has been updated
  private refreshProtocolAndParent(protocolUpdate: LabProtocolUpdateDTO): void {
    if (!(protocolUpdate instanceof LabProtocolUpdateDTO)) return;

    if (protocolUpdate.protocolUpdated && protocolUpdate.protocol) {
      this.experimentState.refreshProtocolAndParents(protocolUpdate.protocol);
      // if the protocol has not been updated, we check if the process has been updated
    } else if (protocolUpdate.process) {
      this.experimentState.refreshProcess(protocolUpdate.process);
    }

  }

  ngOnDestroy(): void {
    this.workflowSubscription?.unsubscribe();
    this.actionSubscription?.unsubscribe();
  }


}
