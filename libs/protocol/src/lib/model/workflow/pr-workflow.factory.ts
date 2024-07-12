import { Observable, of } from 'rxjs';
import { tdTypeStyleDefault, TdTypingName } from '@monorepo/technical-doc';
import { ClStringHelper } from '@monorepo/core-lib';
import { NgZone } from '@angular/core';
import { FlCoord } from '@monorepo/front-core-lib';
import { PrProtocol, PrProtocolGraph, PrProtocolLayout } from '../pr-protocol.class';
import { PrWorkflowResourcesState } from '../../state/pr-workflow-resources.state';
import { PrWorkflow } from './pr-workflow.class';
import { PrWorkflowLayer } from './pr-workflow-layer.class';

import { PrWorkflowNodeProcess } from '../node/pr-workflow-node-process.class';
import { PrWorkflowNodeSource } from '../node/pr-workflow-node-source.class';
import { PrWorkflowNodeOutput } from '../node/pr-workflow-node-output.class';
import { PrWorkflowNodeViewer } from '../node/pr-workflow-node-viewer.class';
import { PrWorkflowNodeProtocol } from '../node/pr-workflow-node-protocol.class';
import { PrProcess, prProcessStatusDict } from '../pr-process.class';
import { PrWorkflowNode } from '../node/pr-workflow-node.class';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';


export class PrWorkflowFactory {

  /**
   * Object to store the match between the PrProcess and the PrProtocol
   * key is the process id, value is the PrProtocol
   * @private
   */
  private conversionMatch: Record<string, PrProtocol> = {}

  constructor(private graph: PrProtocolGraph, private id: string,
              private ngZone: NgZone,
              private resourceState: PrWorkflowResourcesState,
              private actionState: PrWorkflowActionState) {
  }

  public createWorkflow(): PrWorkflow {
    const layer = this.createLayer(this.graph, true, this.id);

    return new PrWorkflow(layer, 'readOnly', this.ngZone);
  }

  private createLayer(graph: PrProtocolGraph, rootLayer: boolean,
                      id: string, title?: string): PrWorkflowLayer {

    let layer: PrWorkflowLayer;
    if (rootLayer) {
      layer = PrWorkflowLayer.rootLayer(id, this.resourceState, this.actionState);
    } else {
      layer = new PrWorkflowLayer(id, id, title, this.resourceState, this.actionState);
    }

    const layout: PrProtocolLayout = graph.layout;

    for (const key of Object.keys(graph.nodes)) {
      const caProcess = graph.nodes[key];
      const nodeLayout = layout?.process_layouts[key] ?? null;
      const node = this.createProcessNode(caProcess, key, id, nodeLayout);
      layer.addNode(node);
    }

    for (const link of graph.links) {
      layer.addPrConnection({
        fromNode: link.from.node,
        toNode: link.to.node,
        fromPort: link.from.port,
        toPort: link.to.port
      });
    }

    for (const key of Object.keys(graph.interfaces)) {
      const inter = graph.interfaces[key];
      const interfaceLayout = layout?.interface_layouts[key] ?? null;
      layer.addInterface(inter.name, inter.process_instance_name, inter.port_name, interfaceLayout);
    }

    for (const key of Object.keys(graph.outerfaces)) {
      const outer = graph.outerfaces[key];
      const outerfaceLayout = layout?.outerface_layouts[key] ?? null;
      layer.addOuterface(outer.name, outer.process_instance_name, outer.port_name, outerfaceLayout);
    }

    layer.initNodesPositions();

    return layer;
  }

  private createProcessNode(process: PrProtocol, name: string, protocolId: string,
                            layout?: FlCoord): PrWorkflowNode {
    const prProcess = this.caProcessToPrProcess(process, name, protocolId);
    this.conversionMatch[prProcess.id] = process;

    let processNode: PrWorkflowNode;
    if (process.process_typing_name === TdTypingName.task.source.typingName) {
      processNode = new PrWorkflowNodeSource(prProcess.instanceName, protocolId, prProcess,
        false, this.resourceState, this.actionState);
    } else if (process.process_typing_name === TdTypingName.task.output.typingName) {
      processNode = new PrWorkflowNodeOutput(prProcess.instanceName, protocolId, prProcess,
        false, this.resourceState, this.actionState);
    } else if (process.process_typing_name === TdTypingName.task.viewer) {
      processNode = new PrWorkflowNodeViewer(prProcess.instanceName, protocolId, prProcess,
        false, this.resourceState, this.actionState);
    } else if (process.graph != null) {
      const layer: () => Observable<PrWorkflowLayer> = () => of(this.createLayer(process.graph, false, prProcess.id, name));
      processNode = new PrWorkflowNodeProtocol(prProcess, layer, this.resourceState, this.actionState);
    } else {
      processNode = new PrWorkflowNodeProcess(prProcess, this.resourceState, this.actionState);
    }

    if (layout) {
      processNode.setCoords(layout);
    }

    return processNode;
  }

  private caProcessToPrProcess(process: PrProtocol, name: string, protocolId: string): PrProcess {
    return {
      id: ClStringHelper.generateUUID(),
      instanceName: name,
      name: process.name,
      config: process.config,
      parentProtocolId: protocolId,
      outputs: process.outputs,
      inputs: process.inputs,
      processTypingName: process.process_typing_name,
      status: prProcessStatusDict[process.status],
      typeStatus: null,
      processType: process.process_type,
      isProtocol: process.graph != null,
      style: process.style ?? tdTypeStyleDefault
    };
  }

  public findCaProcessByPrProcessId(processId: string): PrProtocol{
    return this.conversionMatch[processId];
  }
}
