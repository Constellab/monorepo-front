import { ClHelpService } from '@monorepo/core-lib';
import { FlMenuDynamicButton } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { PrWorkflowNode, PrWorkflowNodeMenuConfig, PrWorkflowPort } from '@monorepo/protocol';

import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabHelper } from '../../../../ca-core/utils/ca-lab.helper';

export class CaWorkflowNodeMenuConfig extends PrWorkflowNodeMenuConfig {
  constructor(
    private lab: CaLab,
    private snackBarService: FlSnackBarService
  ) {
    super();
  }

  getInputMenu(port: PrWorkflowPort, node: PrWorkflowNode): FlMenuDynamicButton[] {
    const resourceId: string | null = node.currentObject.inputs.ports[port.name]?.resource_id ?? null;

    return [this.getResourceDetailContextButton(resourceId)];
  }

  getOutputMenu(port: PrWorkflowPort, node: PrWorkflowNode): FlMenuDynamicButton[] {
    const resourceId: string | null = node.currentObject.outputs.ports[port.name]?.resource_id ?? null;

    return [this.getResourceDetailContextButton(resourceId)];
  }

  private getResourceDetailContextButton(resourceId: string | null): FlMenuDynamicButton {
    return {
      type: 'button',
      text: { text: 'view_resource_in_lab', translateText: true },
      icon: 'resource',
      onClick: () => this.openResourceDetail(resourceId),
      disabled: ClHelpService.isNullOrEmpty(resourceId) || !this.lab.isRunning(),
    };
  }

  public openResourceDetail(resourceId: string | null): void {
    if (resourceId == null) return;
    if (this.lab.isRunning()) {
      window.location.href = CaLabHelper.getResourceUrl(this.lab.frontUrl, resourceId);
    } else {
      this.snackBarService.openErrorMessage({ text: 'view_resource_lab_not_running', translateText: true });
    }
  }
}
