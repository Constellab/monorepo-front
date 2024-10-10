import {
  PrAddNodeWithConnection,
  PrConfigValues,
  PrNodeRelativeCoord,
  PrProcess,
  PrProcessStatusHelper,
  PrProtocolIntOut,
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
import { Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { LabProtocolService } from '../../../lab-core/entity-service/lab-protocol.service';
import { Injectable, OnDestroy } from '@angular/core';
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
import { LabWorkflowFactory } from './lab-workflow.factory';
import { LabProtocolUpdateDTO } from './lab-workflow-action.class';
import { LabScenarioDetailPageState } from '../state/lab-scenario-detail-page.state';
import { TdIOSpec } from '@monorepo/technical-doc';
import { map } from 'rxjs/operators';
import {
  LabNavigableCallActionResult,
  LabNavigableEntityService,
  LabNavigableImpactConfig
} from '../../../lab-core/entity-module/lab-navigable-entity-core/lab-navigable-entity.service';

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
  ADD_INTERFACE = 'workflow-add-interface',
  ADD_OUTERFACE = 'workflow-add-outerface',
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

export interface LabWorkflowEventBasicAdditionalInfo {
  protocolId: string;
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
              private scenarioState: LabScenarioDetailPageState,
              private dialogService: FlDialogService,
              private labNavigableService: LabNavigableEntityService,
              private translateService: FlTranslateService) {

    // listen to the new Process actions
    this.actionSubscription = this.getAllActions$().subscribe(
      result => this.onLabWorkflowActionResult(result)
    );
  }

  public init(workflow: PrWorkflow): void {
    this.workflow = workflow;
    workflow.getWorkflowEvent$().subscribe(
      event => this.onWorkflowEvent(event)
    );
  }


  ////////////////////////////// ACTIONS CALL BY LAB APP //////////////////////////////

  public addNode(typingName: string, processName: string): void {
    const obs = this.protocolService.addProcessToProtocol(this.workflow.currentLayer.id, typingName);
    this.addProcessAction(obs,
      {
        text: 'pr.adding_process', translateText: true,
        translateParam: { param: { processName: processName } }
      });
  }

  public addScenarioTemplate(scenarioTemplateId: string, scenarioTemplateName: string): void {
    const obs = this.protocolService.addScenarioTemplateToProtocol(this.workflow.currentLayer.id, scenarioTemplateId);
    this.addProcessAction(obs,
      {
        text: 'pr.adding_process', translateText: true,
        translateParam: { param: { processName: scenarioTemplateName } }
      });
  }

  public duplicateProcess(processInstanceName: string, processName: string): void {
    const obs = this.protocolService.addDuplicateProcessToProtocol(this.workflow.currentLayer.id, processInstanceName);
    this.addProcessAction(obs,
      {
        text: 'pr.duplicating_process', translateText: true,
        translateParam: { param: { processName: processName } }
      });
  }

  public addCommunityLiveTask(liveTaskVersionId: string, liveTaskTitle: string): void {
    const obs = this.protocolService.addCommunityLiveTaskToProtocol(this.workflow.currentLayer.id, liveTaskVersionId);
    this.addProcessAction(obs,
      {
        text: 'pr.adding_community_live_task', translateText: true,
        translateParam: { param: { processName: liveTaskTitle } }
      });
  }

  public addSource(resourceId: string, resourceName: string): void {
    const obs = this.protocolService.addSource(this.workflow.currentLayer.id, resourceId);

    this.addProcessAction(obs,
      {
        text: 'pr.adding_source', translateText: true,
        translateParam: { param: { resourceName: resourceName } }
      });
  }

  public addSourceToProcessInput(resourceId: string, processNodeName: string, inputPortName: string,
                                 resourceName: string): void {
    const obs = this.protocolService.addSourceToProcessInput(
      this.workflow.currentLayer.id, resourceId, processNodeName, inputPortName);
    this.addProcessWithLinkAction(
      obs,
      processNodeName,
      'before',
      {
        text: 'pr.adding_source', translateText: true,
        translateParam: { param: { resourceName: resourceName } }
      });
  }

  public addTaskOutput(processNodeName: string, outputPortName: string): void {
    const obs = this.protocolService.addTaskOutput(this.workflow.currentLayer.id, processNodeName, outputPortName);

    this.addProcessWithLinkAction(
      obs,
      processNodeName,
      'after',
      {
        text: 'pr.adding_output', translateText: true
      });
  }

  public addProcessConnectedToOutput(processTypingName: string, processHumanName: string,
                                     outputProcessName: string, outputPortName: string): void {
    const processWithLink$ = this.protocolService.addProcessConnectedToOutput(
      this.workflow.currentLayer.id, processTypingName, outputProcessName, outputPortName);

    this.addProcessWithLinkAction(
      processWithLink$,
      outputProcessName,
      'after',
      {
        text: 'pr.adding_process', translateText: true,
        translateParam: { param: { processName: processHumanName } }
      });
  }

  public addProcessConnectedToInput(processTypingName: string, processHumanName: string,
                                    inputProcessName: string, inputPortName: string): void {
    const processWithLink$ = this.protocolService.addProcessConnectedToInput(
      this.workflow.currentLayer.id, processTypingName, inputProcessName, inputPortName);

    this.addProcessWithLinkAction(
      processWithLink$,
      inputProcessName,
      'before',
      {
        text: 'pr.adding_process', translateText: true,
        translateParam: { param: { processName: processHumanName } }
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
      additionalInformation: {
        protocolId: this.workflow.currentLayer.id
      } as LabWorkflowEventBasicAdditionalInfo
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

    let process: PrProcess = null;
    // only provide the process if the new connection before the existing process
    if (newProcessPosition === 'before') {
      process = this.workflow.currentLayer.findNodeByName(processNodeName).currentObject;
    }
    this.executeUpdateAction(action, process);
  }

  public addEmptyProtocol(): Observable<FlPortalActionResult | null> {
    const protocolId = this.workflow.currentLayer.id;

    const obs = this.protocolService.addEmptyProtocolToProtocol(protocolId);
    const action: FlPortalAction = {
      type: LabWorkflowAction.ADD_PROCESS,
      action: obs,
      text: { text: 'pr.adding_empty_protocol', translateText: true },
      additionalInformation: {
        protocolId: protocolId
      } as LabWorkflowEventBasicAdditionalInfo
    };
    return this.executeUpdateAction(action, null);
  }

  public updateProcessConfig(protocolId: string, processInstanceName: string,
                             config: PrConfigValues): Observable<FlPortalActionResult | null> {
    const labProcess = this.getAndCheckProcessNodeObject(protocolId, processInstanceName);
    if (labProcess == null) return of(null);

    const obs = this.protocolService.saveProcessConfig(protocolId, processInstanceName, config);
    const action: FlPortalAction = {
      type: LabWorkflowAction.UPDATE_PROCESS_CONFIG,
      action: obs,
      text: { text: 'biox.saving_config', translateText: true }
    };
    return this.executeUpdateAction(action, labProcess);
  }

  public runProcess(protocolId: string, processInstanceName: string): void {
    const labProcess = this.getAndCheckProcessNodeObject(protocolId, processInstanceName);
    if (labProcess == null) return;

    const obs = this.protocolService.runProcessInProtocol(protocolId, processInstanceName);
    const action: FlPortalAction = {
      type: LabWorkflowAction.RUN_PROCESS,
      action: obs,
      text: { text: 'biox.running_process', translateText: true }
    };
    this.executeUpdateAction(action, labProcess);
  }

  public resetProcess(protocolId: string, processInstanceName: string): void {
    const obs = this.callResetProcess(protocolId, processInstanceName,
      'biox.reset_process', 'biox.reset_process_confirmation');
    const action: FlPortalAction = {
      type: LabWorkflowAction.RESET_PROCESS,
      action: obs,
      text: { text: 'biox.resetting_process', translateText: true }
    };
    this.actionsService.addAction(action, true);
  }

  public addDynamicInputPort(node: PrWorkflowNodeProcess): void {
    this.modifyDynamicPort(
      this.protocolService.createDynamicInputPort(node.parentLayerId, node.instanceName),
      node,
      'biox.adding_input_port');
  }

  public addDynamicOutputPort(node: PrWorkflowNodeProcess): void {
    this.modifyDynamicPort(
      this.protocolService.createDynamicOutputPort(node.parentLayerId, node.instanceName),
      node,
      'biox.adding_output_port');
  }


  public removeDynamicInputPort(node: PrWorkflowNodeProcess, portName: string): void {
    this.modifyDynamicPort(
      this.protocolService.deleteDynamicInputPort(node.parentLayerId, node.instanceName, portName),
      node,
      'biox.removing_input_port');
  }

  public removeDynamicOutputPort(node: PrWorkflowNodeProcess, portName: string): void {
    this.modifyDynamicPort(
      this.protocolService.deleteDynamicOutputPort(node.parentLayerId, node.instanceName, portName),
      node,
      'biox.removing_output_port');
  }


  public updateDynamicInputPort(node: PrWorkflowNodeProcess, portName: string, spec: TdIOSpec): void {
    this.modifyDynamicPort(
      this.protocolService.updateDynamicInputPort(node.parentLayerId, node.instanceName, portName, spec),
      node,
      'biox.configuring_port');
  }

  public updateDynamicOutputPort(node: PrWorkflowNodeProcess, portName: string, spec: TdIOSpec): void {
    this.modifyDynamicPort(
      this.protocolService.updateDynamicOutputPort(node.parentLayerId, node.instanceName, portName, spec),
      node,
      'biox.configuring_port');
  }

  private modifyDynamicPort(obs: Observable<LabProtocolUpdateDTO>, node: PrWorkflowNodeProcess,
                            text: string): void {
    const action: FlPortalAction = {
      type: LabWorkflowAction.MODIFY_DYNAMIC_PORT,
      action: obs,
      text: { text: text, translateText: true }
    };

    this.executeUpdateAction(action, node.currentObject);
  }

  public addInterface(processInstanceName: string,
                      portName: string): Observable<FlPortalActionResult | null> {
    const protocolId = this.workflow.currentLayer.id;
    const obs = this.protocolService.addInterface(protocolId, processInstanceName, portName);
    const action: FlPortalAction = {
      type: LabWorkflowAction.ADD_INTERFACE,
      action: obs,
      text: { text: 'pr.adding_interface', translateText: true },
      additionalInformation: {
        protocolId: protocolId
      } as LabWorkflowEventBasicAdditionalInfo
    };
    return this.addIoFace(action, protocolId, processInstanceName);
  }

  public addOuterface(processInstanceName: string,
                      portName: string): Observable<FlPortalActionResult | null> {
    const protocolId = this.workflow.currentLayer.id;
    const obs = this.protocolService.addOuterface(protocolId, processInstanceName, portName);
    const action: FlPortalAction = {
      type: LabWorkflowAction.ADD_OUTERFACE,
      action: obs,
      text: { text: 'pr.adding_outerface', translateText: true },
      additionalInformation: {
        protocolId: protocolId
      } as LabWorkflowEventBasicAdditionalInfo
    };

    return this.addIoFace(action, protocolId, processInstanceName);
  }

  private addIoFace(action: FlPortalAction, protocolId: string, processInstanceName: string): Observable<FlPortalActionResult | null> {
    if(this.workflow.currentLayer.isRootLayer()){
      console.error('Cannot add IOFace to root layer');
      return of(null);
    }
    const labProcess = this.getAndCheckProcessNodeObject(protocolId, processInstanceName);
    if (labProcess == null) return of(null);

    // find the PrProcess object corresponding to current protocol using parent
    // to reset the protocol
    const protocolNode = this.getAndCheckProcessNodeObject(this.workflow.currentLayer.parentLayer.id,
      this.workflow.currentLayer.instanceName);
    return this.executeUpdateAction(action, protocolNode);
  }

  private getAndCheckProcessNodeObject(protocolId: string, processInstanceName: string): PrProcess {
    const layer = this.workflow.findLayerById(protocolId);
    const node = layer.findNodeByName(processInstanceName);

    if (node == null) {
      console.error(`Could not find node with name ${processInstanceName} in protocol ${protocolId}`);
      return null;
    }

    return node.currentObject;
  }

  private saveNodePosition(node: PrWorkflowNode, protocolId: string): void {
    if (node instanceof PrWorkflowNodeInterface) {
      this.protocolService.saveInterfaceLayout(protocolId, node.interfaceName,
        node.getCoords()).subscribe();
    } else if (node instanceof PrWorkflowNodeOuterface) {
      this.protocolService.saveOuterfaceLayout(protocolId, node.outerfaceName,
        node.getCoords()).subscribe();
    } else {
      // save the node positions
      this.protocolService.saveProcessLayout(protocolId, node.instanceName,
        node.getCoords()).subscribe();
    }
  }

  private onNewNode(node: PrWorkflowNode, layerId: string): void {
    // add the node to the workflow
    const layer: PrWorkflowLayer = this.workflow.findLayerById(layerId);
    layer.addNode(node);

    // save the node positions after the creation
    this.saveNodePosition(node, layerId);
  }

  private onNewNodeWithConnector(processWithLink: PrAddNodeWithConnection, relativeCoord: PrNodeRelativeCoord): void {

    // add the node to the workflow
    const layer: PrWorkflowLayer = this.workflow.findLayerById(relativeCoord.layerId);

    // set the correct position for the new node
    const coord = layer.getRelativeNodePosition(relativeCoord.nodeName, relativeCoord.position);
    const node = processWithLink.node;
    node.setCoords(coord);

    this.onNewNode(processWithLink.node, relativeCoord.layerId);

    layer.addPrConnection(processWithLink.connection);
  }

  private onNewIoFace(layerId: string, ioface: PrProtocolIntOut,
                      mode: 'interface' | 'outerface'): void {
    if (!ioface) return;
    // add the node to the workflow
    const layer: PrWorkflowLayer = this.workflow.findLayerById(layerId);

    if (mode === 'interface') {
      layer.addInterface(ioface.name, ioface.process_instance_name, ioface.port_name);
    } else {
      layer.addOuterface(ioface.name, ioface.process_instance_name, ioface.port_name);
    }
  }


  private executeUpdateAction(action: FlPortalAction, process: PrProcess): Observable<FlPortalActionResult | null> {
    let dialogInput: FlConfirmDialogInput;

    // if the action is not attached to a node
    // we check if this is a finished scenario
    if (!process && this.scenarioState.currentScenario.isFinished()) {
      dialogInput = {
        title: 'biox.update_finished_scenario',
        content: 'biox.update_finished_scenario_confirmation'
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
    } else if (process && !this.scenarioState.currentScenario.isDraft() &&
      PrProcessStatusHelper.wasRun(process.status.value)) {

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
    const resetProcessImpact = this.translateService.translate('biox.scenario_ressource_used_after',
      { param: { title: this.scenarioState.currentScenario.title } });

    const impactData: LabNavigableImpactConfig = {
      title: { text: title, translateText: true },
      confirmImpactConfirmText: {
        text: `<p>${updateFinishedProcess}</p><p>${resetProcessImpact}</p>`,
        translateText: false
      },
      noImpactConfirmText: { text: noImpactConfirmText, translateText: true },
      checkImpact: () => this.protocolService.checkImpactForProcessReset(protocolId, processInstanceName),
      callAction: () => this.protocolService.resetProcessInProtocol(protocolId, processInstanceName).pipe(
        // on reset result, refresh the protocol, the process will be refreshed by the event
        // we need the protocol here because the next request (like configure process) might not refresh the protocol
        tap((result: LabProtocolUpdateDTO) => {
          if (result.protocolUpdated && result.protocol) {
            this.scenarioState.refreshProtocolAndOthers(result.protocol);
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


  /////////////////////////////////////////////// HANDLING WORKFLOW EVENTS ///////////////////////////////////////////////

  private onWorkflowEvent(workflowEvent: PrWorkflowEvent): void {

    let portalAction: FlPortalAction;
    let process: PrProcess;

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
              translateParam: { param: { name: node.getCurrentTitle() } }
            },
            action: this.protocolService.deleteInterface(workflowEvent.protocolId, node.interfaceName),
            additionalInformation: additionalInfo
          };
        } else if (node instanceof PrWorkflowNodeOuterface) {
          portalAction = {
            type: LabWorkflowAction.DELETE_OUTERFACE,
            text: {
              text: 'pr.deleting_outerface',
              translateText: true,
              translateParam: { param: { name: node.getCurrentTitle() } }
            },
            action: this.protocolService.deleteOuterface(workflowEvent.protocolId, node.outerfaceName),
            additionalInformation: additionalInfo
          };
        } else {
          process = node.currentObject;
          portalAction = {
            type: LabWorkflowAction.DELETE_PROCESS,
            text: {
              text: 'pr.deleting_process',
              translateText: true,
              translateParam: { param: { processName: node.getCurrentTitle() } }
            },
            action: this.protocolService.deleteProcessInProtocol(workflowEvent.protocolId, workflowEvent.node.instanceName),
            additionalInformation: additionalInfo
          };
        }
        break;
      case 'addConnection' :
      case 'deleteConnection' :
        if (workflowEvent.connection.isIOFaceConnection()) {
          this.snackBarService.openErrorMessage({ text: 'pr.delete_link_interface_error', translateText: true });
          // re-create the connection
          const layer = this.workflow.findLayerById(workflowEvent.protocolId);
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
            action: this.protocolService.addConnection(
              workflowEvent.protocolId, {
                input_port_name: workflowEvent.connection.inputPort.name,
                input_process_name: workflowEvent.connection.inputNode.instanceName,
                output_port_name: workflowEvent.connection.outputPort.name,
                output_process_name: workflowEvent.connection.outputNode.instanceName
              }),
            additionalInformation: additionalInformation
          };
        } else {
          portalAction = {
            type: LabWorkflowAction.DELETE_CONNECTION,
            text: {
              text: 'pr.deleting_connection',
              translateText: true
            },
            action: this.protocolService.deleteConnection(workflowEvent.protocolId,
              workflowEvent.connection.inputNode.instanceName, workflowEvent.connection.inputPort.name),
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


  ////////////////////////////////////////////////// LAB WORKFLOW ACTIONS /////////////////////////////////////////////////

  /**
   * Method call on the result of a workflow action
   * If the action was trigger from the lab workflow, we update the workflow
   * Also handle the revert of actions (actions triggered from the workflow)
   * @param actionResult
   * @private
   */
  private onLabWorkflowActionResult(actionResult: FlPortalActionResult<LabProtocolUpdateDTO>): void {
    if (actionResult.status === 'error') {
      this.revertWorkflowEvent(actionResult.action.type as LabWorkflowAction, actionResult.additionalInformation);
      return;
    }

    // success
    if (actionResult.action.type === LabWorkflowAction.ADD_PROCESS) {
      const node = this.workflowFactory.labProcessToWorkflowNode(actionResult.result.process);
      this.onNewNode(node, (actionResult.additionalInformation as LabWorkflowEventBasicAdditionalInfo).protocolId);
    } else if (actionResult.action.type === LabWorkflowAction.ADD_PROCESS_WITH_CONNECTIONS) {
      const processWithLink = this.workflowFactory.labProcessWithLinkToNodeWithLink(actionResult.result.process,
        actionResult.result.link);
      this.onNewNodeWithConnector(processWithLink, actionResult.additionalInformation);
    } else if (actionResult.action.type === LabWorkflowAction.DELETE_PROCESS) {
      // clear the node observable, if the deletion worked
      const info: LabWorkflowEventNodeAdditionalInfo = actionResult.additionalInformation;
      info.node.destroy();

      if (info.node instanceof PrWorkflowNodeProtocol) {
        this.scenarioState.deleteProtocol(info.node.currentObject.id);
      }
      // clear interface and outerface
      const layer = this.workflow.findLayerById(info.protocolId);
      layer.removeDanglingIOFaces();
    } else if (actionResult.action.type === LabWorkflowAction.ADD_INTERFACE ||
      actionResult.action.type === LabWorkflowAction.ADD_OUTERFACE) {
      const info: LabWorkflowEventBasicAdditionalInfo = actionResult.additionalInformation;
      this.onNewIoFace(info.protocolId, actionResult.result.ioface,
        actionResult.action.type === LabWorkflowAction.ADD_INTERFACE ? 'interface' : 'outerface');

    }
    this.refreshProtocolAndParent(actionResult.result);

  }

  private revertWorkflowEvent(actionType: LabWorkflowAction, additionalInfo: any): void {
    // revert the DELETE and ADD_CONNECTION actions
    if (actionType === LabWorkflowAction.DELETE_CONNECTION) {
      const info: LabWorkflowEventConnectionAdditionalInfo = additionalInfo;
      const layer = this.workflow.findLayerById(info.protocolId);
      layer.addConnection(info.connection);
    } else if (actionType === LabWorkflowAction.ADD_CONNECTION) {
      const info: LabWorkflowEventConnectionAdditionalInfo = additionalInfo;
      const layer = this.workflow.findLayerById(info.protocolId);
      layer.removeConnection(info.connection);
    } else if ([LabWorkflowAction.DELETE_PROCESS, LabWorkflowAction.DELETE_INTERFACE, LabWorkflowAction.DELETE_OUTERFACE]
      .includes(actionType)) {
      // re-create the node and connection
      const info: LabWorkflowEventNodeAdditionalInfo = additionalInfo;

      // re-create the node
      this.onNewNode(info.node, info.protocolId);

      const layer: PrWorkflowLayer = this.workflow.findLayerById(info.protocolId);
      // re-create the connections
      for (const connection of info.connections) {
        layer.addConnection(connection);
      }
    }
  }

  public getAllActions$(): Observable<FlPortalActionResult> {
    return this.actionsService.getResult$([
      LabWorkflowAction.ADD_PROCESS, LabWorkflowAction.ADD_PROCESS_WITH_CONNECTIONS,
      LabWorkflowAction.DELETE_PROCESS,
      LabWorkflowAction.DELETE_INTERFACE, LabWorkflowAction.DELETE_OUTERFACE,
      LabWorkflowAction.DELETE_CONNECTION, LabWorkflowAction.ADD_CONNECTION,
      LabWorkflowAction.UPDATE_PROCESS_CONFIG, LabWorkflowAction.RESET_PROCESS,
      LabWorkflowAction.MODIFY_DYNAMIC_PORT, LabWorkflowAction.RUN_PROCESS,
      LabWorkflowAction.ADD_INTERFACE, LabWorkflowAction.ADD_OUTERFACE]);
  }

  public getActions$(actions: LabWorkflowAction[]): Observable<FlPortalActionResult> {
    return this.actionsService.getResult$(actions);
  }


  /////////////////////////////////////////////// OTHER ///////////////////////////////////////////////
  // call after an update action has been performed to check if the protocol has been updated
  private refreshProtocolAndParent(protocolUpdate: LabProtocolUpdateDTO): void {
    if (!(protocolUpdate instanceof LabProtocolUpdateDTO)) return;

    if (protocolUpdate.protocolUpdated && protocolUpdate.protocol) {
      this.scenarioState.refreshProtocolAndOthers(protocolUpdate.protocol);
      // if the protocol has not been updated, we check if the process has been updated
    } else if (protocolUpdate.process) {
      this.scenarioState.refreshProcess(protocolUpdate.process);
    }

    if (protocolUpdate.subProtocols) {
      this.scenarioState.refreshProtocolsSuccess(protocolUpdate.subProtocols);
    }
  }

  ngOnDestroy(): void {
    this.workflowSubscription?.unsubscribe();
    this.actionSubscription?.unsubscribe();
  }


}
