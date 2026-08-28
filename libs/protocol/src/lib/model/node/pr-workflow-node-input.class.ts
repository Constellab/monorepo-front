import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TdTaskSourceConfig } from '@monorepo/technical-doc';
import { first, map, Observable, of } from 'rxjs';

import { PrWorkflowNodeIcon } from '../../component/pr-workflow-node-content/pr-workflow-node-content.component';
import { PrProcess } from '../pr-process.class';
import { PrResource } from '../pr-resource.class';
import { PrWorkflowNodeResource, PrWorkNodeIoExternalButton } from './pr-workflow-node-resource.class';

export class PrWorkflowNodeInput extends PrWorkflowNodeResource<PrProcess> {
  protected initPorts(object: PrProcess): void {
    this.generatePorts(object.inputs.ports, 'input');
    this.generatePorts(object.outputs.ports, 'output');
  }

  protected getDefaultBackgroundColor(): string {
    return FlThemeService.getInstance().getCurrentThemeDetail().primary;
  }

  getClassName(): string {
    return 'task-source';
  }

  protected getResourceId(process: PrProcess): string | null {
    const config: TdTaskSourceConfig = process.config.values as TdTaskSourceConfig;
    return config?.resource_id ?? null;
  }

  public getCurrentResource(): PrResource | null {
    return this.resourceState.getCurrentResource(this.getResourceId(this.currentObject));
  }

  getCurrentInputResourceId(): string | null {
    return null;
  }

  getCurrentOutputResourceId(): string | null {
    return this.getResourceId(this.currentObject);
  }

  protected getDefaultName(): string {
    return 'Source';
  }

  getResourceId$(): Observable<string | null> {
    return this.getObject$().pipe(map((process) => this.getResourceId(process)));
  }

  inputIsProvided$(): Observable<boolean> {
    return of(false);
  }

  outputIsProvided$(): Observable<boolean> {
    return this.getResourceId$().pipe(map((resourceId) => resourceId != null));
  }

  // generate a button on the left to navigate to the scenario that generated the resource
  getExternalButtons$(): Observable<PrWorkNodeIoExternalButton | null> {
    if (!this.showExternalButtons) return of(null);
    return this.getResource$().pipe(
      map((resource) => {
        if (!resource) return null;
        if (resource.status !== 'success' || !resource.object.scenario) return null;

        const scenarioId = resource.object.scenario.id;

        return {
          position: 'before',
          icon: 'arrow_backward',
          tooltip: 'pr.open_resource_scenario',
          action: () => {
            this.actionState.newAction({
              action: 'navigateToScenario',
              scenarioId: scenarioId,
            });
          },
        };
      })
    );
  }

  onNodeClick(): void {
    this.getResourceId$()
      .pipe(first())
      .subscribe((resourceId) => {
        if (resourceId) {
          this.actionState.newAction({
            action: 'showResource',
            resourceId: resourceId,
          });
        } else {
          this.actionState.newAction({
            action: 'openSelectResource',
            processNode: this,
          });
        }
      });
  }

  protected getDefaultIcon(): PrWorkflowNodeIcon {
    return {
      icon: 'login',
      iconType: 'MATERIAL_ICON',
      iconColor: FlThemeService.getInstance().getCurrentThemeDetail().primaryContrast,
    };
  }
}
