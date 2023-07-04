import {PrWorkflowPort, PrWorkflowPortType} from '../pr-workflow-port.class';
import {DrawflowConnectionDetail, DrawflowNode} from 'drawflow';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FlCoord, FlStatus, FlTranslatableText, FlTranslateService} from '@monorepo/front-core-lib';
import {TdIOSpec} from '@monorepo/technical-doc';
import {PrPort} from '../pr-io.class';


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

  private titleSubscription: Subscription;
  private currentTitle: FlTranslatableText;

  public x: number = null;
  public y: number = null;

  protected constructor(
    // unique node name in the layer
    public readonly nodeName: string,
    public readonly parentLayerId: string,
    object: T) {
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
    this.initPortColors();

    this.titleSubscription = this.getTitle$().subscribe(
      title => this.currentTitle = title
    );
  }

  public deInitDrawflow(): void {
    this.drawflowId = null;
    this.getDrawflowNodeMethod = null;
    this.titleSubscription?.unsubscribe();
  }

  protected abstract initPorts(object: T): void;

  public abstract getHTML(): string;

  public abstract getClassName(): string;

  public abstract getTitle$(): Observable<FlTranslatableText>;

  public abstract getSubTitle$(): Observable<string>;

  public abstract getStatus$(): Observable<FlStatus | null>;

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

  public getInputSpecs(): Record<string, TdIOSpec> {
    return this.getPortsSpecs(this.inputPorts);
  }

  public deleteInputPort(portName: string): void {
    const port = this.findInputPortByName(portName);
    if (port == null) return;
    this.inputPorts = this.inputPorts.filter(p => p.name !== portName);
    port.destroy();
    this.inputPortsChange$.next(this.inputPorts);
  }

  public getInputPortDrawflowName(portName: string): string {
    const index = this.inputPorts.findIndex(p => p.name === portName);
    if (index === -1) return null;
    return PrWorkflowPort.getInputDrawflowName(index + 1);
  }

  public getInputPorts$(): Observable<PrWorkflowPort[]> {
    return this.inputPortsChange$.asObservable();
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

  public getOutputSpecs(): Record<string, TdIOSpec> {
    return this.getPortsSpecs(this.outputPorts);
  }

  public deleteOutputPort(portName: string): void {
    const port = this.findOutputPortByName(portName);
    if (port == null) return;
    this.outputPorts = this.outputPorts.filter(p => p.name !== portName);
    this.outputPortsChange$.next(this.outputPorts);
    port.destroy();
  }

  public getOutputPortDrawflowName(portName: string): string {
    const index = this.outputPorts.findIndex(p => p.name === portName);
    if (index === -1) return null;
    return PrWorkflowPort.getOutputDrawflowName(index + 1);
  }

  public getOutputPorts$(): Observable<PrWorkflowPort[]> {
    return this.outputPortsChange$.asObservable();
  }

  /////////////////////////////// PORTS //////////////////////////////
  public createPort(portName: string, portObject: PrPort, type: PrWorkflowPortType): PrWorkflowPort {
    const port = new PrWorkflowPort(portName, portObject, type);
    const ports: PrWorkflowPort[] = type === 'input' ? this.inputPorts : this.outputPorts;
    ports.push(port);

    if (type === 'input') {
      this.inputPortsChange$.next(this.inputPorts);
    }else{
      this.outputPortsChange$.next(this.outputPorts);
    }
    return port;
  }

  public deletePort(portName: string, type: PrWorkflowPortType): void {
    if (type === 'input') {
      this.deleteInputPort(portName);
    }else{
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

  private getPortsSpecs(ports: PrWorkflowPort[]): Record<string, TdIOSpec> {
    const specs: Record<string, TdIOSpec> = {};

    for (const port of ports) {
      specs[port.name] = port.currentSpecs;
    }
    return specs;
  }

  public getCurrentTitle(): string {
    if (this.currentTitle == null) return '';
    return FlTranslateService.getInstance().translatableText(this.currentTitle);
  }


  public destroy(): void {
    this.object$.complete();
    this.inputPortsChange$.complete();
    this.outputPortsChange$.complete();
    this.titleSubscription?.unsubscribe();
    const ports: PrWorkflowPort[] = [...this.inputPorts, ...this.outputPorts];
    for (const port of ports) {
      port.destroy();
    }
  }

}
