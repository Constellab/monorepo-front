import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlCoord } from '@monorepo/front-core-lib/fl-core';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { TdIOSpec, TdIOSpecs } from '@monorepo/technical-doc';
import { DrawflowConnectionDetail, DrawflowNode } from 'drawflow';
import { BehaviorSubject, combineLatest, map, Observable, of, Subscription } from 'rxjs';

import { PrPort } from '../pr-io.class';
import { PrWorkflowPort, PrWorkflowPortType } from '../workflow/pr-workflow-port.class';

/**
 * Coordinates of a node; x/y are null until the node has been positioned
 */
export interface PrNodeCoord {
  x: number | null;
  y: number | null;
}

/**
 * Single node in the workflow
 */
export abstract class PrWorkflowNode<T = any> {
  public drawflowId: string;

  public inputPorts: PrWorkflowPort[];
  public outputPorts: PrWorkflowPort[];

  private getDrawflowNodeMethod: ((id: string) => DrawflowNode) | null;

  private object$: BehaviorSubject<T>;
  private inputPortsChange$: BehaviorSubject<PrWorkflowPort[]>;
  private outputPortsChange$: BehaviorSubject<PrWorkflowPort[]>;

  private objectSubscription: ClSubscriptionHandler;
  private currentTitle: FlTranslatableText;

  public x: number | null = null;
  public y: number | null = null;

  protected constructor(
    // unique node name in the layer
    public readonly instanceName: string,
    public readonly parentLayerId: string,
    object: T
  ) {
    this.object$ = new BehaviorSubject<T>(object);
    this.inputPorts = [];
    this.outputPorts = [];
    this.inputPortsChange$ = new BehaviorSubject(this.inputPorts);
    this.outputPortsChange$ = new BehaviorSubject(this.outputPorts);
    this.initPorts(object);
  }

  public initNode(nodeId: string, getDrawflowNodeMethod: (id: string) => DrawflowNode): void {
    this.drawflowId = nodeId;
    this.getDrawflowNodeMethod = getDrawflowNodeMethod;
    this.objectSubscription = new ClSubscriptionHandler();

    this.objectSubscription.add(this.getTitle$().subscribe((title) => (this.currentTitle = title)));
  }

  protected abstract initPorts(object: T): void;

  public abstract getHTML(): string;

  public abstract getClassName(): string;

  public abstract getTitle$(): Observable<FlTranslatableText>;

  public abstract inputIsProvided$(portName: string): Observable<boolean>;

  public abstract outputIsProvided$(portName: string): Observable<boolean>;

  public abstract getCurrentInputResourceId(portName: string): string | null;

  public abstract getCurrentOutputResourceId(portName: string): string | null;

  public abstract getNodeColor$(): Observable<string | undefined>;

  // call when the HTML node is clicked
  public abstract onNodeClick(event: MouseEvent): void;

  /////////////////////////////// OBJECT //////////////////////////////

  public get currentObject(): T {
    return this.object$.value;
  }

  public getObject$(): Observable<T> {
    return this.object$.asObservable();
  }

  public updateObject(object: T): void {
    this.object$.next(object);
  }

  /////////////////////////////// INPUT //////////////////////////////

  /**
   * Return the number of connection linked to a specific input
   */
  public countInputConnections(portName: string): number {
    const portDrawflowName = this.getInputPortDrawflowName(portName);
    // if the input port doesn't exist, consider it is not available
    if (portDrawflowName == null) return 2;

    const connection: DrawflowConnectionDetail[] | null =
      this.getDrawflowNode()?.inputs[portDrawflowName]?.connections || null;

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

  public findInputPortByName(name: string): PrWorkflowPort | undefined {
    return this.inputPorts.find((p) => p.name === name);
  }

  public findInputPortByDrawflowName(drawflowName: string): PrWorkflowPort | undefined {
    return this.inputPorts.find((p) => this.getInputPortDrawflowName(p.name) === drawflowName);
  }

  public hasInputs(): boolean {
    return this.countInputs() > 0;
  }

  public getInputSpecs$(): Observable<TdIOSpecs> {
    return this.getPortsSpecs$('input');
  }

  public deleteInputPort(portName: string): void {
    const port = this.findInputPortByName(portName);
    if (port == null) return;
    this.inputPorts = this.inputPorts.filter((p) => p.name !== portName);
    port.destroy();
    this.inputPortsChange$.next(this.inputPorts);
  }

  public getInputPortDrawflowName(portName: string): string | null {
    const index = this.inputPorts.findIndex((p) => p.name === portName);
    if (index === -1) return null;
    return PrWorkflowPort.getInputDrawflowName(index + 1);
  }

  public getInputPorts$(): Observable<PrWorkflowPort[]> {
    return this.inputPortsChange$.asObservable();
  }

  public hasDynamicInputPorts$(): Observable<boolean> {
    return of(false);
  }

  /////////////////////////////// OUTPUT //////////////////////////////

  public countOutputs(): number {
    return this.outputPorts.length;
  }

  public findOutputPortByName(name: string): PrWorkflowPort | undefined {
    return this.outputPorts.find((p) => p.name === name);
  }

  public findOutputPortByDrawflowName(drawflowName: string): PrWorkflowPort | undefined {
    return this.outputPorts.find((p) => this.getOutputPortDrawflowName(p.name) === drawflowName);
  }

  public hasOutputs(): boolean {
    return this.countOutputs() > 0;
  }

  public getOutputSpecs$(): Observable<TdIOSpecs> {
    return this.getPortsSpecs$('output');
  }

  public deleteOutputPort(portName: string): void {
    const port = this.findOutputPortByName(portName);
    if (port == null) return;
    this.outputPorts = this.outputPorts.filter((p) => p.name !== portName);
    this.outputPortsChange$.next(this.outputPorts);
    port.destroy();
  }

  public getOutputPortDrawflowName(portName: string): string | null {
    const index = this.outputPorts.findIndex((p) => p.name === portName);
    if (index === -1) return null;
    return PrWorkflowPort.getOutputDrawflowName(index + 1);
  }

  public getOutputPorts$(): Observable<PrWorkflowPort[]> {
    return this.outputPortsChange$.asObservable();
  }

  public hasDynamicOutputPorts$(): Observable<boolean> {
    return of(false);
  }

  /////////////////////////////// PORTS //////////////////////////////
  // generate ports base on input or output spec
  protected generatePorts(specs: Record<string, PrPort>, type: 'input' | 'output'): void {
    if (specs) {
      for (const property of Object.keys(specs)) {
        const port = specs[property];
        this.createPort(property, port, type);
      }
    }
  }

  public createPort(portName: string, portObject: PrPort, type: PrWorkflowPortType): PrWorkflowPort {
    const port = new PrWorkflowPort(portName, portObject, type);
    const ports: PrWorkflowPort[] = type === 'input' ? this.inputPorts : this.outputPorts;
    ports.push(port);

    if (type === 'input') {
      this.inputPortsChange$.next(ports);
    } else {
      this.outputPortsChange$.next(ports);
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

  public getPortDrawflowName(port: PrWorkflowPort): string | null {
    return port.type === 'input'
      ? this.getInputPortDrawflowName(port.name)
      : this.getOutputPortDrawflowName(port.name);
  }

  protected getPortElement(port: PrWorkflowPort): HTMLElement | null {
    // retrieve the node HTML element
    const element: HTMLElement | null = this.getHTMLElement();
    if (element == null) return null;

    const drawflowPortName = this.getPortDrawflowName(port);
    if (drawflowPortName == null) return null;

    const portElement: Element = element.getElementsByClassName(drawflowPortName)[0];

    if (portElement == null || !(portElement instanceof HTMLElement)) return null;
    return portElement;
  }

  protected setPortElementColor(portElement: HTMLElement, color: string): void {
    portElement.style.backgroundColor = color;
  }

  public findPortByName(name: string, portType: PrWorkflowPortType): PrWorkflowPort | undefined {
    return portType === 'input' ? this.findInputPortByName(name) : this.findOutputPortByName(name);
  }

  public getPorts$(type: PrWorkflowPortType): Observable<PrWorkflowPort[]> {
    return type === 'input' ? this.getInputPorts$() : this.getOutputPorts$();
  }

  public hasDynamicIOPorts$(type: PrWorkflowPortType): Observable<boolean> {
    if (type === 'input') {
      return this.hasDynamicInputPorts$();
    } else {
      return this.hasDynamicOutputPorts$();
    }
  }

  private getPortsSpecs$(type: PrWorkflowPortType): Observable<TdIOSpecs> {
    return combineLatest([this.getPorts$(type), this.hasDynamicIOPorts$(type)]).pipe(
      map(([ports, isDynamic]) => {
        const specs: Record<string, TdIOSpec> = {};

        for (const port of ports) {
          specs[port.name] = port.currentSpecs;
        }

        return {
          specs,
          is_dynamic: isDynamic,
        };
      })
    );
  }

  public colorPort(port: PrWorkflowPort, portType: PrWorkflowPortType): Subscription {
    return this.getPortColor(port.name, portType).subscribe((color) => {
      const portElement = this.getPortElement(port);
      if (portElement) {
        this.setPortElementColor(portElement, color);
      }
    });
  }

  public getPortColor(name: string, portType: PrWorkflowPortType): Observable<string> {
    const port = this.findPortByName(name, portType);
    if (!port) return of('#ffffff');

    return port.getDefaultColor$();
  }

  /////////////////////////////// OTHER //////////////////////////////

  private getDrawflowNode(): DrawflowNode | null {
    return this.getDrawflowNodeMethod?.(this.drawflowId) ?? null;
  }

  public getHTMLId(): string {
    return 'node-' + this.drawflowId;
  }

  protected getHTMLElement(): HTMLElement | null {
    return document.getElementById(this.getHTMLId());
  }

  public hasCoords(): boolean {
    return this.x != null && this.y != null;
  }

  public getCoords(): PrNodeCoord {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public setCoords(coords: PrNodeCoord): void {
    this.x = coords.x;
    this.y = coords.y;
  }

  private getNodeCoord(): FlCoord | null {
    const drawflowNode = this.getDrawflowNode();
    if (drawflowNode == null) return null;
    return {
      x: drawflowNode.pos_x,
      y: drawflowNode.pos_y,
    };
  }

  public refreshCoords(): void {
    const coord = this.getNodeCoord();
    if (coord == null) return;
    this.x = coord.x;
    this.y = coord.y;
  }

  public getCurrentTitle(): string {
    if (this.currentTitle == null) return '';
    return FlTranslateService.getInstance()?.translatableText(this.currentTitle) ?? '';
  }

  public deInitDrawflow(): void {
    // drawflowId is intentionally left set: the node is discarded after this call and nothing
    // reads drawflowId to detect a torn-down node, so keeping it non-nullable avoids widening it
    // everywhere it is used as a live node id
    this.getDrawflowNodeMethod = null;
    this.objectSubscription?.unsubscribe();
  }

  public destroy(): void {
    this.deInitDrawflow();
    this.object$.complete();
    this.inputPortsChange$.complete();
    this.outputPortsChange$.complete();
    const ports: PrWorkflowPort[] = [...this.inputPorts, ...this.outputPorts];
    for (const port of ports) {
      port.destroy();
    }
  }
}
