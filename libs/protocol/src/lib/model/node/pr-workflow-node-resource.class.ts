import { first, map, Observable, switchMap } from 'rxjs';
import { PrResource } from '../pr-resource.class';
import { PrWorkflowResourcesState } from '../../state/pr-workflow-resources.state';
import { FlColorHelper, FlStatusEvent, FlTranslatableText } from '@monorepo/front-core-lib';
import { PrWorkflowNode } from './pr-workflow-node.class';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';
import { PrWorkflowNodeIcon } from '../../component/pr-workflow-node-content/pr-workflow-node-content.component';

export interface PrWorkNodeIoExternalButton {
  position: 'before' | 'after';
  icon: string;
  action: (event: MouseEvent) => void;
  tooltip: string;
}

/**
 * Specific node that has only 1 input or output and where 1 resource define it status
 */
export abstract class PrWorkflowNodeResource<T = any> extends PrWorkflowNode<T> {
  constructor(
    instanceName: string,
    // observable of the resource defined in the config
    parentLayerId: string,
    object: T,
    protected showExternalButtons: boolean,
    protected resourceState: PrWorkflowResourcesState,
    protected actionState: PrWorkflowActionState
  ) {
    super(instanceName, parentLayerId, object);
  }

  protected abstract getDefaultIcon(): string;

  protected abstract getDefaultColor(): string;

  protected abstract getDefaultName(): string;

  abstract getResourceId$(): Observable<string | null>;

  abstract getExternalButtons$(): Observable<PrWorkNodeIoExternalButton | null>;

  onNodeClick(): void {
    this.getResourceId$()
      .pipe(first())
      .subscribe((resourceId) => {
        if (resourceId) {
          this.actionState.newAction({
            action: 'showResource',
            resourceId: resourceId,
          });
        }
      });
  }

  getHTML(): string {
    return `<pr-workflow-node-resource name="${this.instanceName}"></pr-workflow-node-resource>`;
  }

  getTitle$(): Observable<FlTranslatableText> {
    return this.getResource$().pipe(
      map((resource) => {
        if (resource?.status === 'success') {
          return {
            text: resource.object != null ? resource.object.name : this.getDefaultName(),
            translateText: false,
          };
        } else if (resource?.status === 'error') {
          return { text: 'pr.error', translateText: true };
        } else {
          return { text: this.getDefaultName(), translateText: false };
        }
      })
    );
  }

  getNodeColor$(): Observable<string> {
    return this.getResource$().pipe(map((resource) => this.getResourceColor(resource)));
  }

  getPortColor(): Observable<string> {
    return this.getResource$().pipe(map((resource) => this.getResourceColor(resource)));
  }

  private getResourceColor(resource: FlStatusEvent<PrResource>): string {
    if (resource && resource.status === 'success' && resource.object.style?.background_color) {
      return resource.object.style.background_color;
    }
    return this.getDefaultColor();
  }

  public getResource$(): Observable<FlStatusEvent<PrResource>> {
    return this.getResourceId$().pipe(switchMap((resourceId) => this.resourceState.getResource(resourceId)));
  }

  public getIcon$(): Observable<PrWorkflowNodeIcon> {
    return this.getResource$().pipe(map((resource) => this.getResourceIcon(resource)));
  }

  private getResourceIcon(resource: FlStatusEvent<PrResource>): PrWorkflowNodeIcon {
    const defaultIcon: PrWorkflowNodeIcon = {
      icon: this.getDefaultIcon(),
      iconType: 'MATERIAL_ICON',
    };
    if (!resource) return defaultIcon;

    if (resource.status === 'error') {
      return {
        icon: 'error',
        iconType: 'MATERIAL_ICON',
        iconTooltip: 'pr.resource_load_error',
      };
    }

    if (resource && resource.status === 'success' && resource.object.style?.icon_technical_name != null) {
      let iconColor = resource.object.style.icon_color;
      // calculate the icon color if not defined
      if (!iconColor) {
        const resourceColor = this.getResourceColor(resource);
        iconColor = FlColorHelper.getContrastColor(resourceColor);
      }
      return {
        icon: resource.object.style.icon_technical_name,
        iconType: resource.object.style.icon_type,
        iconColor: iconColor,
      };
    }

    return defaultIcon;
  }
}
