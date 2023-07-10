import {computed, Directive, ElementRef, Input, OnDestroy, Renderer2, Signal} from '@angular/core';
import {PrWorkflowNodeProcess} from '../model/node/pr-workflow-node-process.class';
import {PrWorkflowManagerState} from '../state/pr-workflow-manager-state';
import {PrWorkflowActionState} from '../state/pr-workflow-action-state';
import {
  FlHtmlHelper,
  FlMenuDynamic,
  FlOverlayRef,
  FlPortalConnectedPosition,
  FlPortalService,
  FlStatus,
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

@Directive()
export abstract class PrWorkflowNodeProcessDirective extends PrWorkflowNodeDirective implements OnDestroy {

  static currentOverlayRef: FlOverlayRef = null;

  // Name of the node
  @Input() name: string;

  node: PrWorkflowNodeProcess;

  status: Signal<FlStatus>;

  private listener: () => void;

  constructor(workflowManager: PrWorkflowManagerState,
              elementRef: ElementRef,
              protected actionState: PrWorkflowActionState,
              protected renderer: Renderer2,
              private portalService: FlPortalService,
              protected workflowResourcesState: PrWorkflowResourcesState) {
    super(workflowManager, elementRef);
  }

  protected initNode(): void {
    super.initNode();


    this.status = this.node.status;

    this.listenToNodeClick();
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
    }
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
  protected getResourceTitle(resourceId: Signal<string>): Signal<Observable<FlTranslatableText>> {
    return computed(() => {
      return this.workflowResourcesState.getResource(resourceId()).pipe(
        map(resource => {
          if (resource?.status === 'success') {
            return resource.object != null ? resource.object.name : this.node.currentObject.title;
          } else if (resource?.status === 'error') {
            return {text: 'pr.error', translateText: true};
          } else {
            return this.node.currentObject.title;
          }
        })
      );
    });
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
  }
}
