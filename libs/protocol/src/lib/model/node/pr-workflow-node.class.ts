import {PrWorkflowPort, PrWorkflowPortType} from '../pr-workflow-port.class';
import {DrawflowConnectionDetail, DrawflowNode} from 'drawflow';
import {BehaviorSubject, Observable} from 'rxjs';
import {FlCoord} from '@monorepo/front-core-lib';
import {TdIOSpec, TdIOSpecs} from '@monorepo/technical-doc';
import {PrPort} from '../pr-io.class';
import {computed, Signal, signal, WritableSignal} from '@angular/core';


/**
 * Single node in the workflow
 */
export abstract class PrWorkflowNode<T = any> {

  public drawflowId: string;

  public inputPorts: PrWorkflowPort[];
  public outputPorts: PrWorkflowPort[];

  private getDrawflowNodeMethod: (id: string) => DrawflowNode;

  private object$: BehaviorSubject<T>;
  private inputPortsChange$: BehaviorSubject<PrWorkflowPort[]>;
  private outputPortsChange$: BehaviorSubject<PrWorkflowPort[]>;

  private readonly objSignal: WritableSignal<T>;
  private readonly inputPortsSignal: WritableSignal<PrWorkflowPort[]>;
  private readonly outputPortsSignal: WritableSignal<PrWorkflowPort[]>;

  public x: number = null;
  public y: number = null;

  protected constructor(
    // unique node name in the layer
    public readonly nodeName: string,
    public readonly parentLayerId: string,
    object: T) {
    this.object$ = new BehaviorSubject<T>(object);
    this.objSignal = signal(object);
    this.inputPorts = [];
    this.outputPorts = [];
    this.inputPortsChange$ = new BehaviorSubject(this.inputPorts);
    this.outputPortsChange$ = new BehaviorSubject(this.outputPorts);
    this.inputPortsSignal = signal(this.inputPorts);
    this.outputPortsSignal = signal(this.outputPorts);
    this.initPorts(object);
  }

  public initNode(nodeId: string, getDrawflowNodeMethod: (id: string) => DrawflowNode): void {
    this.drawflowId = nodeId;
    this.getDrawflowNodeMethod = getDrawflowNodeMethod;
    this.initPortColors();
  }

  public deInitDrawflow(): void {
    this.drawflowId = null;
    this.getDrawflowNodeMethod = null;
  }

  protected abstract initPorts(object: T): void;

  public abstract getHTML(): string;

  public abstract getClassName(): string;

  public abstract get title(): Signal<string>;

  /////////////////////////////// OBJECT //////////////////////////////

  public get currentObject(): T {
    return this.object$.value;
  }

  public getObject$(): Observable<T> {
    return this.object$.asObservable();
  }

  public updateObject(object: T): void {
    this.object$.next(object);
    this.objSignal.set(object);
  }

  public get objectSignal(): Signal<T> {
    return this.objSignal.asReadonly();
  }


  /////////////////////////////// INPUT //////////////////////////////

  /**
   * Return the number of connection linked to a specific input
   */
  public countInputConnections(portName: string): number {
    const portDrawflowName = this.getInputPortDrawflowName(portName);
    const connection: DrawflowConnectionDetail[] = this.getDrawflowNode().inputs[portDrawflowName]?.connections || null;

    // if the input doesn't exist, consider it is not available
    if (connection == null) {
      return 2;
    }

    // if the connection is empty, the input is available
    return connection.length;
  }

  // return true if the port is already connected
  public inputPortIsConnected(portName: string): boolean {
    return this.countInputConnections(portName) > 0;
  }

  public countInputs(): number {
    return this.inputPorts.length;
  }

  public findInputPortByName(name: string): PrWorkflowPort {
    return this.inputPorts.find(p => p.name === name);
  }

  public findInputPortByDrawflowName(drawflowName: string): PrWorkflowPort {
    return this.inputPorts.find(p => this.getInputPortDrawflowName(p.name) === drawflowName);
  }

  /**
   * For each input port,
   * If it is not available --> disable it
   * If is not compatible with arg port --> disable it
   */
  public disableIncompatibleInputPort(outputPort: PrWorkflowPort): void {
    for (const port of this.inputPorts) {
      if (this.countInputConnections(port.name) > 0 ||
        !port.isCompatible(outputPort)) {
        this.disabledPort(port);
      }
    }
  }

  public hasInputs(): boolean {
    return this.countInputs() > 0;
  }

  public get inputSpecs(): Signal<TdIOSpecs> {
    return this.getPortsSpecs2('input');
  }

  public deleteInputPort(portName: string): void {
    const port = this.findInputPortByName(portName);
    if (port == null) return;
    this.inputPorts = this.inputPorts.filter(p => p.name !== portName);
    port.destroy();
    this.inputPortsChange$.next(this.inputPorts);
    this.inputPortsSignal.set(this.inputPorts);
  }

  public getInputPortDrawflowName(portName: string): string {
    const index = this.inputPorts.findIndex(p => p.name === portName);
    if (index === -1) return null;
    return PrWorkflowPort.getInputDrawflowName(index + 1);
  }

  public hasDynamicInputPorts2(): Signal<boolean> {
    return signal(false).asReadonly();
  }


  /////////////////////////////// OUTPUT //////////////////////////////

  public countOutputs(): number {
    return this.outputPorts.length;
  }

  public findOutputPortByName(name: string): PrWorkflowPort {
    return this.outputPorts.find(p => p.name === name);
  }

  public findOutputPortByDrawflowName(drawflowName: string): PrWorkflowPort {
    return this.outputPorts.find(p => this.getOutputPortDrawflowName(p.name) === drawflowName);
  }

  public disableOutputPorts(): void {
    for (const port of this.outputPorts) {
      this.disabledPort(port);
    }
  }

  public hasOutputs(): boolean {
    return this.countOutputs() > 0;
  }

  public get outputSpecs(): Signal<TdIOSpecs> {
    return this.getPortsSpecs2('output');
  }

  public deleteOutputPort(portName: string): void {
    const port = this.findOutputPortByName(portName);
    if (port == null) return;
    this.outputPorts = this.outputPorts.filter(p => p.name !== portName);
    this.outputPortsChange$.next(this.outputPorts);
    this.outputPortsSignal.set(this.outputPorts);
    port.destroy();
  }

  public getOutputPortDrawflowName(portName: string): string {
    const index = this.outputPorts.findIndex(p => p.name === portName);
    if (index === -1) return null;
    return PrWorkflowPort.getOutputDrawflowName(index + 1);
  }

  public hasDynamicOutputPorts2(): Signal<boolean> {
    return signal(false).asReadonly();
  }

  /////////////////////////////// PORTS //////////////////////////////
  public createPort(portName: string, portObject: PrPort, type: PrWorkflowPortType): PrWorkflowPort {
    const port = new PrWorkflowPort(portName, portObject, type);
    const ports: PrWorkflowPort[] = type === 'input' ? this.inputPorts : this.outputPorts;
    ports.push(port);

    if (type === 'input') {
      this.inputPortsChange$.next(this.inputPorts);
      this.inputPortsSignal.set(this.inputPorts);
    } else {
      this.outputPortsChange$.next(this.outputPorts);
      this.outputPortsSignal.set(this.outputPorts);
    }

    return port;
  }

  public deletePort(portName: string, type: PrWorkflowPortType): void {
    if (type === 'input') {
      this.deleteInputPort(portName);
    } else {
      this.deleteOutputPort(portName);
    }
  }

  public getPortDrawflowName(port: PrWorkflowPort): string {
    return port.type === 'input' ? this.getInputPortDrawflowName(port.name) : this.getOutputPortDrawflowName(port.name);
  }

  /**
   * set the port color based on port type
   */
  public initPortColors(): void {
    for (const port of [...this.inputPorts, ...this.outputPorts]) {
      const portElement: HTMLElement = this.getPortElement(port);
      if (portElement) {
        this.setPortElementColor(portElement, port.getDefaultColor());
      }
    }
  }

  protected getPortElement(port: PrWorkflowPort): HTMLElement | null {
    // retrieve the node HTML element
    const element: HTMLElement = this.getHTMLElement();
    if (element == null) return null;

    const drawflowPortName = this.getPortDrawflowName(port);

    const portElement: Element = element.getElementsByClassName(drawflowPortName)[0];

    if (portElement == null || !(portElement instanceof HTMLElement)) return null;
    return portElement;
  }

  protected setPortElementColor(portElement: HTMLElement, color: string): void {
    portElement.style.backgroundColor = color;
  }

  /**
   * Mark the port as disable by setting its color to grey
   * @param port
   */
  public disabledPort(port: PrWorkflowPort): void {
    // retrieve the node HTML element
    const element: HTMLElement = this.getHTMLElement();

    const portElement: Element = element.getElementsByClassName(this.getPortDrawflowName(port))[0];

    if (portElement && portElement instanceof HTMLElement) {
      // set the color
      portElement.style.backgroundColor = 'grey';
    }
  }

  public findPortByName(name: string, portType: PrWorkflowPortType): PrWorkflowPort {
    return portType === 'input' ? this.findInputPortByName(name) : this.findOutputPortByName(name);
  }

  public getPorts(type: PrWorkflowPortType): Signal<PrWorkflowPort[]> {
    return type === 'input' ? this.inputPortsSignal.asReadonly() : this.outputPortsSignal.asReadonly();
  }

  public hasDynamicIOPorts2(type: PrWorkflowPortType): Signal<boolean> {
    if (type === 'input') {
      return this.hasDynamicInputPorts2();
    } else {
      return this.hasDynamicOutputPorts2();
    }
  }

  private getPortsSpecs2(type: PrWorkflowPortType): Signal<TdIOSpecs> {
    return computed(() => {
      const ports = this.getPorts(type)();
      const isDynamic = this.hasDynamicIOPorts2(type)();

      const specs: Record<string, TdIOSpec> = {};

      for (const port of ports) {
        specs[port.name] = port.currentSpecs;
      }

      return {
        specs,
        is_dynamic: isDynamic
      };
    });
  }

  public portChange(type: PrWorkflowPortType): Signal<PrWorkflowPort[]> {
    return type === 'input' ? this.inputPortsSignal : this.outputPortsSignal;
  }

  /////////////////////////////// OTHER //////////////////////////////

  private getDrawflowNode(): DrawflowNode {
    return this.getDrawflowNodeMethod(this.drawflowId);
  }

  private getHTMLId(): string {
    return 'node-' + this.drawflowId;
  }

  private getHTMLElement(): HTMLElement {
    return document.getElementById(this.getHTMLId());
  }

  public hasCoords(): boolean {
    return this.x != null && this.y != null;
  }

  public getCoords(): FlCoord {
    return {
      x: this.x,
      y: this.y
    };
  }

  public setCoords(coords: FlCoord): void {
    this.x = coords.x;
    this.y = coords.y;
  }

  private getNodeCoord(): FlCoord {
    const drawflowNode: DrawflowNode = this.getDrawflowNode();
    return {
      x: drawflowNode.pos_x,
      y: drawflowNode.pos_y
    };
  }

  public refreshCoords(): void {
    const coord: FlCoord = this.getNodeCoord();
    this.x = coord.x;
    this.y = coord.y;
  }


  public destroy(): void {
    this.object$.complete();
    this.inputPortsChange$.complete();
    this.outputPortsChange$.complete();
    const ports: PrWorkflowPort[] = [...this.inputPorts, ...this.outputPorts];
    for (const port of ports) {
      port.destroy();
    }
  }

}
