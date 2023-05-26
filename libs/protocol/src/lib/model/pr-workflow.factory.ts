import {Observable, of} from 'rxjs';
import {TdTypingName} from '@monorepo/technical-doc';
import {ClStringHelper} from '@monorepo/core-lib';
import {NgZone} from '@angular/core';
import {FlCoord} from '@monorepo/front-core-lib';
import {PrProtocolGraph, PrProtocolLayout, PrProtocolProcess} from './pr-protocol.class';
import {PrWorkflowResourcesState} from '../state/pr-workflow-resources.state';
import {PrWorkflow} from './pr-workflow.class';
import {PrWorkflowLayer} from './pr-workflow-layer.class';

import {PrWorkflowNodeProcess} from './node/pr-workflow-node-process.class';
import {PrWorkflowNodeSource} from './node/pr-workflow-node-source.class';
import {PrWorkflowNodeOutput} from './node/pr-workflow-node-output.class';
import {PrWorkflowNodeViewer} from './node/pr-workflow-node-viewer.class';
import {PrWorkflowNodeProtocol} from './node/pr-workflow-node-protocol.class';
import {PrProcess, prProcessStatusDict} from './pr-process.class';


export class PrWorkflowFactory {

  constructor(private graph: PrProtocolGraph, private id: string,
              private ngZone: NgZone,
              private resourceState: PrWorkflowResourcesState) {
  }

  public createWorkflow(): PrWorkflow {
    const layer = this.createLayer(this.graph, true, this.id);
    return new PrWorkflow(layer, 'readOnly', this.ngZone);
  }

  private createLayer(graph: PrProtocolGraph, rootLayer: boolean,
                      id: string, title?: string): PrWorkflowLayer {

    let layer: PrWorkflowLayer;
    if (rootLayer) {
      layer = PrWorkflowLayer.rootLayer(id);
    } else {
      layer = new PrWorkflowLayer(id, id, title);
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
      layer.addInterface(inter.name, inter.to.node, inter.to.port, interfaceLayout);
    }

    for (const key of Object.keys(graph.outerfaces)) {
      const outer = graph.outerfaces[key];
      const outerfaceLayout = layout?.outerface_layouts[key] ?? null;
      layer.addOuterface(outer.name, outer.from.node, outer.from.port, outerfaceLayout);
    }

    layer.initNodesPositions();

    return layer;
  }

  private createProcessNode(caProcess: PrProtocolProcess, name: string, protocolId: string,
                            layout?: FlCoord): PrWorkflowNodeProcess {
    const prProcess = this.caProcessToPrProcess(caProcess, name, protocolId);

    let processNode: PrWorkflowNodeProcess;
    if (caProcess.process_typing_name === TdTypingName.task.source) {
      processNode = new PrWorkflowNodeSource(prProcess, this.resourceState);
    } else if (caProcess.process_typing_name === TdTypingName.task.output.typingName) {
      processNode = new PrWorkflowNodeOutput(prProcess, this.resourceState);
    } else if (caProcess.process_typing_name === TdTypingName.task.viewer) {
      processNode = new PrWorkflowNodeViewer(prProcess, this.resourceState);
    } else if (caProcess.graph != null) {
      const layer$: Observable<PrWorkflowLayer> = of(this.createLayer(caProcess.graph, false, prProcess.id, name));
      processNode = new PrWorkflowNodeProtocol(prProcess, layer$, this.resourceState);
    } else {
      processNode = new PrWorkflowNodeProcess(prProcess, this.resourceState);
    }

    if (layout) {
      processNode.setCoords(layout);
    }

    return processNode;
  }

  private caProcessToPrProcess(caProcess: PrProtocolProcess, name: string, protocolId: string): PrProcess {
    return {
      id: ClStringHelper.generateUUID(),
      instanceName: name,
      title: caProcess.human_name,
      config: caProcess.config,
      parentProtocolId: protocolId,
      outputs: caProcess.outputs,
      inputs: caProcess.inputs,
      processTypingName: caProcess.process_typing_name,
      status: prProcessStatusDict[caProcess.status],
      typeStatus: null,
    };
  }

}
