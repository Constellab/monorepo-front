import { Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { PrWorkflowManagerState } from '../state/pr-workflow-manager-state';
import {
  FlCoord,
  FlHtmlHelper,
  FlMenuDynamic,
  FlOverlayRef,
  FlPortalConnectedPosition,
  FlPortalService
} from '@monorepo/front-core-lib';
import { PrWorkflowNode } from '../model/node/pr-workflow-node.class';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { PrWorkflowPort } from '../model/workflow/pr-workflow-port.class';
import {
  PrWorkflowPortActionPortalComponent,
  PrWorkflowPortActionPortalInput
} from '../component/pr-workflow-port-action-portal/pr-workflow-port-action-portal.component';
import { PrWorkflowNodeProtocol } from '../model/node/pr-workflow-node-protocol.class';
import { PrWorkflowNodeInterface } from '../model/node/pr-workflow-node-interface.class';
import { PrWorkflowNodeOuterface } from '../model/node/pr-workflow-node-outerface.class';

@Directive()
export abstract class PrWorkflowNodeDirective implements OnDestroy {

  static currentOverlayRef: FlOverlayRef = null;


  // Name of the node
  @Input() name: string;

  node: PrWorkflowNode;

  protected subscriptions: ClSubscriptionHandler = new ClSubscriptionHandler();

  private mouseClickListener: () => void;
  private mouseDownListener: () => void;
  private mouseDownCoords: FlCoord;

  protected constructor(protected workflowManager: PrWorkflowManagerState,
                        protected elementRef: ElementRef,
                        protected renderer: Renderer2,
                        protected portalService: FlPortalService) {
  }

  protected initNode(): void {
    this.node = this.workflowManager.findNodeWithNameInCurrentLayer(this.name);
    if (this.node == null) {
      console.error('Couldn\'t find node with name : ' + this.name);
    }
    this.listenToNodeClick();

    this.subscriptions.add(this.node.getNodeColor$().subscribe(color => {
      this.colorNode(color);
    }));
  }


  protected colorNode(color: string): void {
    // retrieve the drawflow element that wrap the node
    const node: HTMLElement = this.getNodeElement();
    if (node == null) return;

    this.renderer.setStyle(node, 'background-color', color);
  }

  protected getNodeElement(): HTMLElement | null {
    return FlHtmlHelper.getParent(this.elementRef.nativeElement, { className: 'drawflow-node' });
  }

  protected getNodeParentElement(): HTMLElement | null {
    return FlHtmlHelper.getParent(this.elementRef.nativeElement, { className: 'parent-node' });
  }

  ////////////////////////////////////////////// HANDLE CLICK //////////////////////////////////////////////

  protected listenToNodeClick(): void {
    // retrieve the drawflow element that wrap the node
    const parent: HTMLElement = this.getNodeParentElement();
    if (parent == null) return;

    this.mouseClickListener = this.renderer.listen(parent, 'click', event => this.onNodeClick(event));

    this.mouseDownListener = this.renderer.listen(parent, 'mousedown',
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
        this.node.onNodeClick(event);
      }
    }

    this.mouseDownCoords = null;
  }

  onInputClick(port: PrWorkflowPort, element: Element): void {
    const menuDynamics: FlMenuDynamic[] = this.workflowManager.viewConfig.getInputMenu(port, this.node,
      this.workflowManager.getCurrentMode());
    this.openPortPortal(port, menuDynamics, element);
  }

  onOutputClick(port: PrWorkflowPort, element: Element): void {
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

    if (this.node instanceof PrWorkflowNodeProtocol) {
      data.ioface = {
        name: port.name,
        type: port.type === 'input' ? 'interface' : 'outerface'
      };
    } else if (this.node instanceof PrWorkflowNodeInterface ||
      this.node instanceof PrWorkflowNodeOuterface) {
      data.ioface = {
        name: port.name,
        type: this.node instanceof PrWorkflowNodeInterface ? 'interface' : 'outerface'
      };
    }

    const position: FlPortalConnectedPosition[] = [
      { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
      'right', 'top', 'left', 'bottom'];

    const config = this.portalService.configureRelativePortal(element, position, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true
    });

    if (PrWorkflowNodeDirective.currentOverlayRef) {
      PrWorkflowNodeDirective.currentOverlayRef.dispose();
    }
    PrWorkflowNodeDirective.currentOverlayRef = this.portalService.createPortal(PrWorkflowPortActionPortalComponent, config, data);
  }


  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    if (this.mouseDownListener) {
      this.mouseClickListener();
    }
    if (this.mouseDownListener) {
      this.mouseDownListener();
    }
  }
}
