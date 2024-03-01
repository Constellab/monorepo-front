import {Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';
import {PrWorkflowNodeProcess} from '../model/node/pr-workflow-node-process.class';
import {PrWorkflowManagerState} from '../state/pr-workflow-manager-state';
import {PrWorkflowActionState} from '../state/pr-workflow-action-state';
import {
  FlColorHelper,
  FlCoord,
  FlHtmlHelper,
  FlMenuDynamic,
  FlOverlayRef,
  FlPortalConnectedPosition,
  FlPortalService,
  FlStatus,
  FlStatusEvent,
  FlThemeService,
  FlTranslatableText
} from '@monorepo/front-core-lib';
import {
  PrWorkflowPortActionPortalComponent,
  PrWorkflowPortActionPortalInput
} from '../component/pr-workflow-port-action-portal/pr-workflow-port-action-portal.component';
import {PrWorkflowPort} from '../model/pr-workflow-port.class';
import {map, Observable} from 'rxjs';
import {PrWorkflowNodeDirective} from './pr-workflow-node.directive';
import {PrWorkflowResourcesState} from '../state/pr-workflow-resources.state';
import {PrResource} from '../model/pr-resource.class';
import {PrProcess} from '../model/pr-process.class';

@Directive()
export abstract class PrWorkflowNodeProcessDirective extends PrWorkflowNodeDirective implements OnDestroy {

  static currentOverlayRef: FlOverlayRef = null;

  // Name of the node
  @Input() name: string;

  node: PrWorkflowNodeProcess;

  subTitle$: Observable<string>;
  status$: Observable<FlStatus>;

  private listener: () => void;
  private listener2: () => void;

  private mouseDownCoords: FlCoord;

  constructor(workflowManager: PrWorkflowManagerState,
              elementRef: ElementRef,
              protected actionState: PrWorkflowActionState,
              protected renderer: Renderer2,
              protected portalService: FlPortalService,
              protected workflowResourcesState: PrWorkflowResourcesState,
              protected themeService: FlThemeService) {
    super(workflowManager, elementRef);
  }

  abstract drawflowNodeClick(): void;


  protected initNode(): void {
    super.initNode();

    this.subTitle$ = this.node.getSubTitle$();
    this.status$ = this.node.getStatus$();

    this.listenToNodeClick();

    // TODO to remove
    this.node.getObject$().subscribe((process) => {
      this.colorNode(process);
    });
  }

  openNodeDetail(): void {
    this.actionState.newAction({
      action: 'selectNode',
      processNode: this.node,
    });
  }

  openResourceDetail(resourceId: string): void {
    this.actionState.newAction({
      action: 'showResource',
      resourceId: resourceId,
    });
  }


  protected listenToNodeClick(): void {
    // retrieve the drawflow element that wrap the node
    const parent: HTMLElement = FlHtmlHelper.getParent(this.elementRef.nativeElement, {className: 'parent-node'});

    if (parent == null) return;

    this.listener = this.renderer.listen(parent, 'click', event => this.onNodeClick(event));

    this.listener2 = this.renderer.listen(parent, 'mousedown',
      (event: MouseEvent) => {
        this.mouseDownCoords = {
          x: event.clientX,
          y: event.clientY
        };
      });
  }

  private onNodeClick(event: PointerEvent): void {
    const element: HTMLElement = event.target as any;

    const classes: string[] = FlHtmlHelper.domTokenListToArray(element.classList);

    if (classes.includes('input')) {
      const inputName: string = classes.find((cls) => cls.startsWith('input_'));
      if (inputName == null) return;

      const port = this.node.findInputPortByDrawflowName(inputName);
      if (port == null) return;

      this.onInputClick(port, element);
    } else if (classes.includes('output')) {
      const outputName: string = classes.find((cls) => cls.startsWith('output_'));
      if (outputName == null) return;

      const port = this.node.findOutputPortByDrawflowName(outputName);
      if (port == null) return;

      this.onOutputClick(port, element);
    } else {
      // if the mouse didn't move from the mouse down to click event, we consider it as a click
      if (this.mouseDownCoords != null && Math.abs(this.mouseDownCoords.x - event.clientX) < 5
        && Math.abs(this.mouseDownCoords.y - event.clientY) < 5) {
        this.drawflowNodeClick();
      }
    }

    this.mouseDownCoords = null;
  }


  private onInputClick(port: PrWorkflowPort, element: Element): void {
    const menuDynamics: FlMenuDynamic[] = this.workflowManager.viewConfig.getInputMenu(port, this.node,
      this.workflowManager.getCurrentMode());
    this.openPortPortal(port, menuDynamics, element);
  }

  private onOutputClick(port: PrWorkflowPort, element: Element): void {
    const menuDynamics: FlMenuDynamic[] = this.workflowManager.viewConfig.getOutputMenu(port, this.node,
      this.workflowManager.getCurrentMode());
    this.openPortPortal(port, menuDynamics, element);
  }

  // open the portal for the input or output port
  private openPortPortal(port: PrWorkflowPort, menuDynamics: FlMenuDynamic[], element: Element): void {
    const data: PrWorkflowPortActionPortalInput = {
      port: port,
      menuDynamics: menuDynamics
    };

    const position: FlPortalConnectedPosition[] = [
      {originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top'},
      'right', 'top', 'left', 'bottom'];

    const config = this.portalService.configureRelativePortal(element, position, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true,
    });

    if (PrWorkflowNodeProcessDirective.currentOverlayRef) {
      PrWorkflowNodeProcessDirective.currentOverlayRef.dispose();
    }
    PrWorkflowNodeProcessDirective.currentOverlayRef = this.portalService.createPortal(PrWorkflowPortActionPortalComponent, config, data);
  }

  // get the title of the process if it is linked to a Resource (process IO)
  protected getResource(resourceId: Observable<string>): Observable<FlStatusEvent<PrResource>> {
    return this.workflowResourcesState.getResourceFromObs(resourceId);
  }

  // get the title of the process if it is linked to a Resource (process IO)
  protected getResourceTitle(resourceId: Observable<string>): Observable<FlTranslatableText> {
    return this.getResource(resourceId).pipe(
      map(resource => {
        if (resource?.status === 'success') {
          return resource.object != null ? resource.object.name : this.node.currentObject.name;
        } else if (resource?.status === 'error') {
          return {text: 'pr.error', translateText: true};
        } else {
          return this.node.currentObject.name;
        }
      })
    );
  }

  protected colorNode(node: PrProcess): void {

    // retrieve the drawflow element that wrap the node
    const parent: HTMLElement = FlHtmlHelper.getParent(this.elementRef.nativeElement, {className: 'node-process'});

    if (parent == null) return;

    const color = this.getNodeColor(node);
    this.renderer.setStyle(parent, 'background-color', color);
  }

  protected getNodeColor(node: PrProcess): string {
    // TODO TO REMOVE
    if (node.processTypingName === 'TASK.gws_core.Wait') {
      return '#c9c9c9';
    }

    let typingName: string;
    if (Object.values(node.inputs.ports).length > 0) {
      typingName = Object.values(node.inputs.ports)[0].specs.resource_types[0].typing_name;
    } else if (Object.values(node.outputs.ports).length > 0) {
      typingName = Object.values(node.outputs.ports)[0].specs.resource_types[0].typing_name;
    } else {
      typingName = node.processTypingName;
    }
    return FlColorHelper.stringToRGBColor(typingName);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
    if (this.listener2) {
      this.listener2();
    }
  }
}
