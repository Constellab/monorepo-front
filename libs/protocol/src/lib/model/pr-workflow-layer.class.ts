import Drawflow, {ConnectionEvent, ConnectionStartEvent} from 'drawflow';
import {PrWorkflowNode} from './node/pr-workflow-node.class';
import {PrWorkflowConnection} from './pr-workflow-connection.class';
import {PrWorkflowPort, PrWorkflowPortType} from './pr-workflow-port.class';
import {PrConnection} from './pr-workflow-action.class';
import {PrWorkflowNodeProcess} from './node/pr-workflow-node-process.class';
import {PrWorkflowNodeInterface} from './node/pr-workflow-node-interface.class';
import {PrWorkflowNodeOuterface} from './node/pr-workflow-node-outerface.class';
import {FlCoord} from '@monorepo/front-core-lib';
import {PrWorkflowNodeProtocol} from './node/pr-workflow-node-protocol.class';
import {PrProcess} from './pr-process.class';
import {PrOI, PrPort} from './pr-io.class';

export class PrWorkflowLayer {

  public readonly children: Record<string, PrWorkflowLayer> = {};

  public readonly nodes: PrWorkflowNode[] = [];

  public readonly connections: PrWorkflowConnection[] = [];

  public parentLayer: PrWorkflowLayer = null;

  private editor: Drawflow;

  private readonly htmlNodeWidth: number = 200;
  private readonly htmlNodeHeight: number = 100;
  private readonly htmlDefaultNodeSpaceX: number = 30;
  private readonly htmlDefaultNodeSpaceY: number = 20;
  private readonly htmlOffsetX: number = 10;
  private readonly htmlOffsetY: number = 10;

  constructor(public readonly id: string,
              public readonly drawflowId: string,
              public readonly title: string) {
  }

  public static rootLayer(id: string): PrWorkflowLayer {
    // for the root layer, the id MUST be home (required by drawflow)
    return new PrWorkflowLayer(id, 'Home', 'Main protocol');
  }

  public init(editor: Drawflow): void {
    this.editor = editor;

    for (const node of this.nodes) {
      this.createAndInitDrawflowNode(node);
    }
    for (const connection of this.connections) {
      this.createDrawflowConnection(connection);
    }
  }

  // function to call when this layer is selected
  // if node exists in this layer we reset their port color
  public initOnSelect(): void {
    this.resetPortColors();
  }


  ///////////////////////////// NODE ////////////////////////////////

  public addNode(node: PrWorkflowNode): void {
    this.nodes.push(node);

    if (this.isDrawflowReady()) {
      this.createAndInitDrawflowNode(node);
    }
  }

  public findNodeByDrawflowId(nodeId: string): PrWorkflowNode {
    return this.findNode((node) => node.drawflowId === nodeId);
  }

  public findNodeByProcessId(nodeId: string): PrWorkflowNodeProcess {
    return this.findNode((node) => node instanceof PrWorkflowNodeProcess
      && node.currentObject.id === nodeId) as PrWorkflowNodeProcess;
  }

  public findNodeByName(nodeName: string): PrWorkflowNode {
    return this.findNode((node) => node.nodeName === nodeName);
  }

  public findNode(predicate: (node: PrWorkflowNode) => boolean): PrWorkflowNode {
    return this.nodes.find((node) => predicate(node));
  }

  public removeNode(nodeId: string): PrWorkflowNode | undefined {
    // remove the node in the local array
    const index: number = this.nodes.findIndex((node) => node.drawflowId === nodeId);
    if (index >= 0) {
      const node: PrWorkflowNode = this.nodes[index];
      this.nodes.splice(index, 1);

      return node;
    } else {
      console.error('Couldn\'t find node with id ' + nodeId);
      return null;
    }
  }

  public updateProcessObject(process: PrProcess): void {
    const node = this.findNodeByName(process.instanceName);
    if (!node) return;

    this.refreshPorts(node, node.inputPorts, process.inputs, 'input');
    this.refreshPorts(node, node.outputPorts, process.outputs, 'output');

    node.updateObject(process);
  }

  /**
   * Method to refresh the input or output port of a node from a new PrOI object
   * @private
   */
  private refreshPorts(node: PrWorkflowNode,
                       currentPorts: PrWorkflowPort[],
                       newPorts: PrOI,
                       portType: PrWorkflowPortType): void {
    for (const currentPort of currentPorts) {
      // if a port is not in the object anymore, delete it
      if (!newPorts.ports[currentPort.name]) {
        this.deleteNodePort(node.nodeName, currentPort.name, portType);
      } else {
        currentPort.updateObject(newPorts.ports[currentPort.name]);
      }
    }

    for (const oiName of Object.keys(newPorts.ports)) {
      // if a port is in the object but not in the inputPorts, create it
      if (!node.findPortByName(oiName, portType)) {
        this.addNodePort(node.nodeName, oiName, newPorts.ports[oiName], portType);
      }
    }
  }

  private addNodePort(nodeName: string, portName: string, port: PrPort,
                      portType: PrWorkflowPortType): void {
    const node = this.findNodeByName(nodeName);

    if (portType === 'input') {
      this.editor.addNodeInput(node.drawflowId);
    } else {
      this.editor.addNodeOutput(node.drawflowId);
    }
    node.createPort(portName, port, portType);
  }

  private deleteNodePort(nodeName: string, portName: string, portType: PrWorkflowPortType): void {
    const node = this.findNodeByName(nodeName);
    if (portType === 'input') {
      this.editor.removeNodeInput(node.drawflowId, node.getInputPortDrawflowName(portName));
    } else {
      this.editor.removeNodeOutput(node.drawflowId, node.getOutputPortDrawflowName(portName));
    }
    node.deletePort(portName, portType);
  }

  // return the nodes that do not have any inputs
  public getRootNodes(): PrWorkflowNode[] {
    const roots: PrWorkflowNode[] = [];

    for (const node of this.nodes) {
      // the nodes that are not connected to any other node (in input) are root nodes
      if (this.connections.find(connection => connection.inputNode.nodeName === node.nodeName) == undefined) {
        roots.push(node);
      }
    }

    return roots;
  }

  public getNextNodes(nodeName: string): PrWorkflowNode[] {
    const nextNodes: PrWorkflowNode[] = [];

    for (const connection of this.connections) {
      if (connection.outputNode.nodeName === nodeName) {
        nextNodes.push(connection.inputNode);
      }
    }

    return nextNodes;
  }

  public getProcessNodes(): PrWorkflowNodeProcess[] {
    return this.nodes.filter(node => node instanceof PrWorkflowNodeProcess) as PrWorkflowNodeProcess[];
  }


  public initNodesPositions(): void {
    this.setNodesPositionRecursively(this.getRootNodes(), 0, 0,);
  }

  /**
   * Set the node positions recursively
   */
  private setNodesPositionRecursively(nodes: PrWorkflowNode[],
                                      previousX: number, previousY: number): void {
    let shiftY: number = 0;
    for (const node of nodes) {

      if (!node.hasCoords()) {
        // specific case for the first node
        if (previousX == 0) {
          node.x = this.htmlOffsetX;
        } else {
          // convert the 2D position to coords
          // Override the coords
          node.x = this.htmlNodeWidth + this.htmlDefaultNodeSpaceX + previousX;
        }

        if (previousY == 0 && shiftY == 0) {
          node.y = this.htmlOffsetY;
        } else {
          node.y = ((this.htmlNodeHeight + this.htmlDefaultNodeSpaceY) * shiftY) + previousY;
        }
        shiftY++;
      }

      const nextNodes = this.getNextNodes(node.nodeName);
      this.setNodesPositionRecursively(nextNodes, node.x, node.y);
    }

  }

  /**
   * Return a relative node position based on another node
   * @private
   */
  public getRelativeNodePosition(nodeName: string, position: 'before' | 'after'): FlCoord {
    const node: PrWorkflowNode = this.findNodeByName(nodeName);
    if (node == null || !node.hasCoords()) return {x: null, y: null};

    // calculate the X pos based on relative node
    const baseNodeCoord = node.getCoords();

    let xCoord: number;
    if (position === 'before') {
      xCoord = baseNodeCoord.x - (this.htmlNodeWidth + this.htmlDefaultNodeSpaceX);
    } else {
      xCoord = baseNodeCoord.x + (this.htmlNodeWidth + this.htmlDefaultNodeSpaceX);
    }
    return {
      x: xCoord,
      y: baseNodeCoord.y
    };
  }

  public getSubProtocolNodes(): PrWorkflowNodeProtocol[] {
    return this.nodes.filter(node => node instanceof PrWorkflowNodeProtocol) as PrWorkflowNodeProtocol[];
  }

  ////////////////////////////////// INTERFACE & OUTERFACE ////////////////////////////////
  public addInterface(interfaceName: string, nodeName: string, portName: string, coords?: FlCoord): void {
    const node = this.findNodeByName(nodeName);

    if (node == null) {
      console.error('[PrWorkflowLayer] can\'t find node with name ' + nodeName);
      return;
    }
    const port = node.findInputPortByName(portName);
    const interfaceNode = new PrWorkflowNodeInterface({
      // append 'i_' to name to make it unique with outerface
      name: 'i_' + interfaceName,
      portName: port.name,
      portType: port.currentSpecs
    }, this.id, interfaceName);

    if (coords == null) {
      // calculate and set the position of the interface node
      coords = this.getRelativeNodePosition(nodeName, 'before');
    }
    interfaceNode.setCoords(coords);

    this.nodes.push(interfaceNode);

    // add to connection of the interface
    const connection = new PrWorkflowConnection(interfaceNode, node,
      interfaceNode.getPort(), port);
    this.connections.push(connection);
  }

  public addOuterface(outerfaceName: string, nodeName: string, portName: string, coords?: FlCoord): void {
    const node = this.findNodeByName(nodeName);

    if (node == null) {
      console.error('[PrWorkflowLayer] can\'t find node with name ' + nodeName);
      return;
    }
    const port = node.findOutputPortByName(portName);
    const outerfaceNode = new PrWorkflowNodeOuterface({
      // append 'o_' to name to make it unique with interface
      name: 'o_' + outerfaceName,
      portName: port.name,
      portType: port.currentSpecs
    }, this.id, outerfaceName);

    if (coords == null) {
      // calculate and set the position of the outerface node
      coords = this.getRelativeNodePosition(nodeName, 'after');
    }
    outerfaceNode.setCoords(coords);

    this.nodes.push(outerfaceNode);

    // add to connection of the outerface
    const connection = new PrWorkflowConnection(node, outerfaceNode,
      port, outerfaceNode.getPort());
    this.connections.push(connection);
  }

  ///////////////////////////////// CONNECTION //////////////////////////////////////


  // this method is triggered when the connection is created by program
  public addConnection(connection: PrWorkflowConnection): void {
    this.connections.push(connection);

    if (this.isDrawflowReady()) {
      this.createDrawflowConnection(connection);
    }
  }

  private createDrawflowConnection(connection: PrWorkflowConnection): void {
    const outputPortDrawflowName = connection.outputNode.getOutputPortDrawflowName(connection.outputPort.name);
    if (outputPortDrawflowName == null) {
      console.error('[PrProtocol] can\'t find output port drawflow name for port ' + connection.outputPort.name);
      return;
    }
    const inputPortDrawflowName = connection.inputNode.getInputPortDrawflowName(connection.inputPort.name);
    if (inputPortDrawflowName == null) {
      console.error('[PrProtocol] can\'t find input port drawflow name for port ' + connection.inputPort.name);
      return;
    }
    this.editor.addConnection(connection.outputNode.drawflowId, connection.inputNode.drawflowId,
      outputPortDrawflowName, inputPortDrawflowName);
  }

  public addPrConnection(connection: PrConnection): PrWorkflowConnection {
    // check if input is available for the node
    const outputNode: PrWorkflowNode = this.findNodeByName(connection.fromNode);
    if (outputNode == null) {
      console.error('[PrProtocol] can\'t find output node with name ' + connection.fromNode);
      return null;
    }
    const inputNode: PrWorkflowNode = this.findNodeByName(connection.toNode);
    if (inputNode == null) {
      console.error('[PrProtocol] can\'t find input node with name ' + connection.toNode);
      return null;
    }

    const outputPort: PrWorkflowPort = outputNode.findOutputPortByName(connection.fromPort);
    if (outputPort == null) {
      console.error('[PrProtocol] can\'t find output port with name ' + connection.fromPort);
      return null;
    }
    const inputPort: PrWorkflowPort = inputNode.findInputPortByName(connection.toPort);
    if (inputPort == null) {
      console.error('[PrProtocol] can\'t find input port with name ' + connection.toPort);
      return null;
    }

    const workflowConnection: PrWorkflowConnection = new PrWorkflowConnection(outputNode, inputNode,
      outputPort, inputPort);
    this.addConnection(workflowConnection);
    return workflowConnection;
  }

  // this method is triggered when the user manually creates a connection
  public saveUserConnectionAdded(outputNode: PrWorkflowNode, inputNode: PrWorkflowNode,
                                 outputPort: PrWorkflowPort, inputPort: PrWorkflowPort): PrWorkflowConnection | undefined {

    this.resetPortColors();

    // only add the connection if it doesn't exist
    if (this.findConnection(outputNode.drawflowId, inputNode.drawflowId, outputPort.name, inputPort.name) != null) return null;

    const workflowConnection: PrWorkflowConnection = new PrWorkflowConnection(outputNode, inputNode,
      outputPort, inputPort);
    this.connections.push(workflowConnection);
    return workflowConnection;
  }

  // add the connection in the local array and in the editor

  // this method is triggered when the connection is deleted by program
  public removeConnection(connection: PrWorkflowConnection): PrWorkflowConnection | undefined {
    const removedConnection = this.saveUserConnectionRemoved(connection);

    if (removedConnection) {
      this.editor.removeSingleConnection(
        removedConnection.outputNode.drawflowId,
        removedConnection.inputNode.drawflowId,
        removedConnection.outputNode.getOutputPortDrawflowName(removedConnection.outputPort.name),
        removedConnection.inputNode.getInputPortDrawflowName(removedConnection.inputPort.name)
      );
      return removedConnection;
    }
    return null;
  }

  // add the connection to the local list
  // this method is triggered when the user manually remove a connection
  public saveUserConnectionRemoved(connection: PrWorkflowConnection): PrWorkflowConnection | undefined {

    const connectionIndex: number = this.findConnectionIndex(connection.outputNode.drawflowId,
      connection.inputNode.drawflowId, connection.outputPort.name, connection.inputPort.name);
    if (connectionIndex >= 0) {
      const connection: PrWorkflowConnection = this.connections[connectionIndex];
      this.connections.splice(connectionIndex, 1);
      return connection;
    }
    return null;
  }

  // remove the connection from the local array and in the editor
  public findConnectionByConnectionEvent(connectionEvent: ConnectionEvent): PrWorkflowConnection {
    const index = this.findConnectionIndexByConnectionEvent(connectionEvent);
    return this.connections[index];
  }

  // remove the connection from the local list
  public findConnectionIndexByConnectionEvent(connectionEvent: ConnectionEvent): number {
    // check if input is available for the node
    const inputNode: PrWorkflowNode = this.findNodeByDrawflowId(connectionEvent.input_id);
    const outputNode: PrWorkflowNode = this.findNodeByDrawflowId(connectionEvent.output_id);
    const inputPort: PrWorkflowPort = inputNode.findInputPortByDrawflowName(connectionEvent.input_class);
    const outputPort: PrWorkflowPort = outputNode.findOutputPortByDrawflowName(connectionEvent.output_class);

    return this.findConnectionIndex(outputNode.drawflowId, inputNode.drawflowId,
      outputPort.name, inputPort.name);
  }

  public findConnection(outputNodeId: string, inputNodeId: string,
                        outputPortName: string, inputPortName: string): PrWorkflowConnection {
    const connectionIndex: number = this.findConnectionIndex(outputNodeId, inputNodeId, outputPortName, inputPortName);
    return connectionIndex >= 0 ? this.connections[connectionIndex] : null;
  }

  public findConnectionIndex(outputNodeId: string, inputNodeId: string,
                             outputPortName: string, inputPortName: string): number {
    return this.connections.findIndex(c =>
      c.outputNode.drawflowId === outputNodeId && c.inputNode.drawflowId === inputNodeId &&
      c.outputPort.name === outputPortName && c.inputPort.name === inputPortName);
  }

  public findConnectionsByNode(nodeName: string): PrWorkflowConnection[] {
    return this.connections.filter(connection => connection.isConnectedToNode(nodeName));
  }

  public getLayerHierarchy(): PrWorkflowLayer[] {
    const layers: PrWorkflowLayer[] = [this];
    if (this.parentLayer == null) {
      return layers;
    }

    return [...this.parentLayer.getLayerHierarchy(), ...layers];
  }

  ///////////////////////// OTHER //////////////////////////

  public onConnectionStarted(event: ConnectionStartEvent): void {
    const outputNode: PrWorkflowNode = this.findNodeByDrawflowId(event.output_id);
    const port: PrWorkflowPort = outputNode.findOutputPortByDrawflowName(event.output_class);
    this.disableIncompatiblePorts(outputNode, port);
  }

  public resetPortColors(): void {
    for (const node of this.nodes) {
      node.initPortColors();
    }
  }

  /**
   * Create the node in the editor and init those values
   */
  private createAndInitDrawflowNode(node: PrWorkflowNode): void {
    const nodeId: number = this.editor.addNode(node.getCurrentTitle(),
      node.countInputs(), node.countOutputs(), node.x ?? 0,
      node.y ?? 0, node.getClassName(), {}, node.getHTML(), false);

    // set the nodeId in workflow node
    node.initNode(nodeId.toString(), (id: string) => this.editor.getNodeFromId(id));
  }

  /**
   * Disable incompatible port when a new connection starts
   */
  private disableIncompatiblePorts(outputNode: PrWorkflowNode, port: PrWorkflowPort): void {
    for (const node of this.nodes) {
      node.disableIncompatibleInputPort(port);
      if (node.drawflowId !== outputNode.drawflowId) {
        node.disableOutputPorts();
      }
    }
  }

  public isDrawflowReady(): boolean {
    return this.editor != null;
  }

  public deInitDrawflow(): void {
    this.editor = null;
    for (const node of this.nodes) {
      node.deInitDrawflow();
    }
  }

  public destroy(): void {
    // destroy all nodes
    for (const node of this.nodes) {
      node.destroy();
    }
  }

  public exportLayout(): Record<string, FlCoord> {
    const layout: Record<string, FlCoord> = {};
    for (const node of this.nodes) {
      layout[node.nodeName] = {x: node.x, y: node.y};
    }
    return layout;
  }
}
