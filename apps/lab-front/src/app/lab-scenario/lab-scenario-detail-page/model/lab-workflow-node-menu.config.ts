import { ClHelpService } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamicButton } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import { FL_THEME_DETAIL_LIGHT } from '@monorepo/front-core-lib/fl-theme';
import { LiResource, LiResourceSearchFields, LiTypeEntity } from '@monorepo/lab-lib/li-core';
import {
  LI_RESOURCE_SEARCH_NAME,
  LiResourceDetailDialogComponent,
  LiSelectResourceDialogComponent,
  LiSelectResourceDialogInput,
} from '@monorepo/lab-lib/li-resource';
import { LiSelectTypeDialogComponent, LiSelectTypeDialogInput } from '@monorepo/lab-lib/li-type';
import {
  PrWorkflowLayer,
  PrWorkflowMode,
  PrWorkflowNode,
  PrWorkflowNodeInput,
  PrWorkflowNodeMenuConfig,
  PrWorkflowPort,
} from '@monorepo/protocol';

import { LabWorkflowEditConfig } from './lab-workflow-edit-config.class';

export class LabWorkflowNodeMenuConfig extends PrWorkflowNodeMenuConfig {
  constructor(
    private dialogService: FlDialogService,
    private editState: LabWorkflowEditConfig
  ) {
    super();
  }

  getInputMenu(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    currentLayer: PrWorkflowLayer,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton[] {
    const resourceId: string = node.getCurrentInputResourceId(port.name);

    const buttons: FlMenuDynamicButton[] = [];

    // for the root layer, we can add a source
    // for the other layers, we can add an interface
    if (currentLayer.isRootLayer()) {
      buttons.push(this.getAddSourceButton(port, node, workflowMode));
    } else {
      buttons.push(this.getAddInterfaceButton(port, node, workflowMode));
    }

    buttons.push(
      this.getProcessSuggestionButton(port, node, 'input', workflowMode),
      this.getResourceDetailContextButton(resourceId)
    );
    return buttons;
  }

  getOutputMenu(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    currentLayer: PrWorkflowLayer,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton[] {
    const resourceId: string = node.getCurrentOutputResourceId(port.name);

    // {
    //   type: 'button',
    //   text: {text: 'biox.add_viewer', translateText: true},
    //   icon: 'view',
    //   onClick: () => this.addViewerToOutput(node.nodeName, port.name),
    //   disabled: workflowMode === 'readOnly'
    // },

    const buttons: FlMenuDynamicButton[] = [];
    // for the root layer, we can add an output
    // for the other layers, we can add an outerface
    if (currentLayer.isRootLayer()) {
      buttons.push(this.getAddOutputButton(port, node, workflowMode));
    } else {
      buttons.push(this.getAddOuterfaceButton(port, node, workflowMode));
    }

    buttons.push(
      this.getAddTransformerButton(port, node, workflowMode),
      this.getProcessSuggestionButton(port, node, 'output', workflowMode),
      this.getResourceDetailContextButton(resourceId)
    );
    return buttons;
  }

  private getAddSourceButton(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'biox.add_source', translateText: true },
      icon: 'resource',
      onClick: () => this.openResourceSelection(port, node),
      // only activated if is editable and the port is not connected
      disabled: workflowMode === 'readOnly' || node.inputPortIsConnected(port.name),
    };
  }

  private openResourceSelection(port: PrWorkflowPort, node: PrWorkflowNode): void {
    // add a default search filtered by resource type
    const filter: Partial<LiResourceSearchFields> = {
      resourceTypingNames: port.currentSpecs.resource_types.map((type) => type.typing_name),
    };
    const savedSearch: FlSavedSearch = {
      searchName: LI_RESOURCE_SEARCH_NAME,
      id: null,
      label: 'Compatible resources',
      color: FL_THEME_DETAIL_LIGHT.primary,
      version: 1,
      default: true,
      filtersCriteria: filter,
    };

    const data: LiSelectResourceDialogInput = {
      savedSearches: [savedSearch],
    };

    this.dialogService
      .openBigDialog(LiSelectResourceDialogComponent, { data: data })
      .afterClosed()
      .subscribe((resource) => this.addSource(resource, port, node));
  }

  private addSource(resource: LiResource | null, port: PrWorkflowPort, node: PrWorkflowNode): void {
    if (resource == null) return;

    this.editState.addSourceToProcessInput(resource.id, node.instanceName, port.name, resource.name);
  }

  private getAddOutputButton(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'biox.add_output', translateText: true },
      icon: 'output',
      onClick: () => this.addTaskOutput(node.instanceName, port.name),
      disabled: workflowMode === 'readOnly',
    };
  }

  private addTaskOutput(processNodeName: string, outputPortName: string): void {
    this.editState.addTaskOutput(processNodeName, outputPortName);
  }

  private getResourceDetailContextButton(resourceId: string | null): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'g.resource', translateText: true },
      icon: 'resource',
      onClick: () => this.openResourceDetail(resourceId),
      disabled: ClHelpService.isNullOrEmpty(resourceId),
    };
  }

  private getProcessSuggestionButton(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    portType: 'input' | 'output',
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'biox.suggested_processes', translateText: true },
      icon: 'tips_and_updates',
      onClick: () => this.openProcessSuggestion(port, node, portType),
      disabled: workflowMode === 'readOnly' || (portType === 'input' && node.inputPortIsConnected(port.name)),
    };
  }

  private openResourceDetail(resourceId: string): void {
    this.dialogService.openBigDialog(LiResourceDetailDialogComponent, {
      data: resourceId,
      panelClass: 'g-dialog-main-background',
      closeOnNavigation: true,
    });
  }

  private openProcessSuggestion(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    portType: 'input' | 'output'
  ): void {
    const data: LiSelectTypeDialogInput = {
      searchConfig: {
        mode: 'processSuggestion',
        // if the port type selected is an input, we need to suggest process where output matches the input
        suggestBy: portType === 'input' ? 'outputs' : 'inputs',
        resourceTypingNames: this.getPortTypingNames(port, node),
      },
    };
    this.dialogService
      .openBigDialog(LiSelectTypeDialogComponent, { data: data })
      .afterClosed()
      .subscribe((processType) => {
        // if the process where suggested
        if (portType == 'input') {
          this.addProcessConnectedToInput(processType, node.instanceName, port.name);
        } else {
          this.addProcessConnectedToOutput(processType, node.instanceName, port.name);
        }
      });
  }

  private addProcessConnectedToOutput(
    processType: LiTypeEntity | null,
    outputProcessName: string,
    outputPortName: string
  ): void {
    if (processType == null) return;

    this.editState.addProcessConnectedToOutput(
      processType.typingName,
      processType.humanName,
      outputProcessName,
      outputPortName
    );
  }

  private addProcessConnectedToInput(
    processType: LiTypeEntity | null,
    inputProcessName: string,
    inputPortName: string
  ): void {
    if (processType == null) return;

    this.editState.addProcessConnectedToInput(
      processType.typingName,
      processType.humanName,
      inputProcessName,
      inputPortName
    );
  }

  ///////////////////////////////// TRANSFORMER /////////////////////////////////

  private getAddTransformerButton(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'biox.add_transformer', translateText: true },
      icon: 'transformer',
      onClick: () => this.openTransformerSelection(node.instanceName, port, node),
      disabled: workflowMode === 'readOnly',
    };
  }

  private openTransformerSelection(
    outputProcessName: string,
    port: PrWorkflowPort,
    node: PrWorkflowNode
  ): void {
    const data: LiSelectTypeDialogInput = {
      searchConfig: {
        mode: 'transformer',
        resourceTypingNames: this.getPortTypingNames(port, node),
      },
    };
    this.dialogService
      .openBigDialog(LiSelectTypeDialogComponent, { data: data })
      .afterClosed()
      .subscribe((processType) =>
        this.addProcessConnectedToOutput(processType, outputProcessName, port.name)
      );
  }

  /**
   * Return the typing names for a port.
   * If the node is a Source, we take the type of the resource instead (if configured)
   */
  private getPortTypingNames(port: PrWorkflowPort, node: PrWorkflowNode): string[] {
    // special case
    // of the type of the port
    if (node instanceof PrWorkflowNodeInput && node.getCurrentResource() != null) {
      return [node.getCurrentResource().resourceTypingName];
    } else {
      // use the port typing names
      return port.getResourceTypingNames();
    }
  }

  //////////////////////////////////////// IOFACE ////////////////////////////////////////

  private getAddInterfaceButton(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'pr.add_interface', translateText: true },
      icon: 'login',
      onClick: () => this.addInterface(port, node),
      disabled: workflowMode === 'readOnly' || node.inputPortIsConnected(port.name),
    };
  }

  private getAddOuterfaceButton(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'pr.add_outerface', translateText: true },
      icon: 'logout',
      onClick: () => this.addOuterface(port, node),
      disabled: workflowMode === 'readOnly',
    };
  }

  private addInterface(port: PrWorkflowPort, node: PrWorkflowNode): void {
    this.editState.addInterface(node.instanceName, port.name);
  }

  private addOuterface(port: PrWorkflowPort, node: PrWorkflowNode): void {
    this.editState.addOuterface(node.instanceName, port.name);
  }
}
