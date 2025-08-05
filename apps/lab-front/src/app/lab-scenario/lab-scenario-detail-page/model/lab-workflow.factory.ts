import { inject,Injectable, NgZone } from '@angular/core';
import { LiProcess, LiProcessLayout, LiProtocol } from '@monorepo/lab-lib/li-core';
import {
  PrAddNodeWithConnection,
  PrProtocolLink,
  PrWorkflow,
  PrWorkflowActionState,
  PrWorkflowLayer,
  PrWorkflowNode,
  PrWorkflowNodeInput,
  PrWorkflowNodeOutput,
  PrWorkflowNodeProcess,
  PrWorkflowNodeProtocol,
  PrWorkflowNodeViewer,
  PrWorkflowResourcesState,
} from '@monorepo/protocol';
import { Observable } from 'rxjs';

@Injectable()
export class LabWorkflowFactory {
  private ngZone = inject(NgZone);
  private resourceState = inject(PrWorkflowResourcesState);
  private actionState = inject(PrWorkflowActionState);

  private createSubLayer: (protocolId: string) => Observable<PrWorkflowLayer>;

  public initCreateSubLayerFunc(layerLoader: (protocolId: string) => Observable<PrWorkflowLayer>): void {
    this.createSubLayer = layerLoader;
  }

  public protocolToWorkflow(protocol: LiProtocol): PrWorkflow {
    const layer = this.createLayer(protocol, true);
    return new PrWorkflow(layer, 'edit', this.ngZone);
  }

  public createLayer(protocol: LiProtocol, rootLayer: boolean): PrWorkflowLayer {
    let layer: PrWorkflowLayer;
    if (rootLayer) {
      layer = PrWorkflowLayer.rootLayer(protocol.id, this.resourceState, this.actionState);
    } else {
      layer = new PrWorkflowLayer(
        protocol.id,
        protocol.id,
        protocol.instanceName,
        protocol.name,
        this.resourceState,
        this.actionState
      );
    }

    const protocolLayout = protocol.data.layout;

    for (const key in protocol.data.nodes) {
      const process: LiProcess = protocol.data.nodes[key];
      // retrieve the layout of the process if it exists
      const processLayout = protocolLayout?.getProcess(key) ?? null;
      const node = this.labProcessToWorkflowNode(process, processLayout);
      layer.addNode(node);
    }

    for (const link of protocol.data.links) {
      layer.addPrConnection({
        fromNode: link.from.node,
        fromPort: link.from.port,
        toNode: link.to.node,
        toPort: link.to.port,
      });
    }

    for (const inter of Object.values(protocol.data.interfaces)) {
      const layout = protocolLayout?.getInterface(inter.name) ?? null;
      layer.addInterface(inter.name, inter.process_instance_name, inter.port_name, layout);
    }
    for (const outer of Object.values(protocol.data.outerfaces)) {
      const layout = protocolLayout?.getOuterface(outer.name) ?? null;
      layer.addOuterface(outer.name, outer.process_instance_name, outer.port_name, layout);
    }
    layer.initNodesPositions();

    return layer;
  }

  public labProcessToWorkflowNode(process: LiProcess, processLayout?: LiProcessLayout): PrWorkflowNode {
    let processNode: PrWorkflowNode;
    if (process.isInput()) {
      processNode = new PrWorkflowNodeInput(
        process.instanceName,
        process.parentProtocolId,
        process.toPrProcess(),
        true,
        this.resourceState,
        this.actionState
      );
    } else if (process.isOutput()) {
      processNode = new PrWorkflowNodeOutput(
        process.instanceName,
        process.parentProtocolId,
        process.toPrProcess(),
        true,
        this.resourceState,
        this.actionState
      );
    } else if (process.isViewer()) {
      processNode = new PrWorkflowNodeViewer(
        process.instanceName,
        process.parentProtocolId,
        process.toPrProcess(),
        true,
        this.resourceState,
        this.actionState
      );
    } else if (process.isProtocol) {
      const loadSubLayer: () => Observable<PrWorkflowLayer> = () => this.createSubLayer(process.id);
      processNode = new PrWorkflowNodeProtocol(
        process.toPrProcess(),
        loadSubLayer,
        this.resourceState,
        this.actionState
      );
    } else {
      processNode = new PrWorkflowNodeProcess(process.toPrProcess(), this.resourceState, this.actionState);
    }

    // if the position of this process were saved in the protocol, use it
    if (processLayout) {
      processNode.setCoords(processLayout);
    }
    return processNode;
  }

  public labProcessWithLinkToNodeWithLink(process: LiProcess, link: PrProtocolLink): PrAddNodeWithConnection {
    const node = this.labProcessToWorkflowNode(process);

    return {
      node: node,
      connection: {
        fromNode: link.from.node,
        fromPort: link.from.port,
        toNode: link.to.node,
        toPort: link.to.port,
      },
    };
  }
}
