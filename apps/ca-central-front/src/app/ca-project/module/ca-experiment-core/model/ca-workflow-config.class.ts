import {PrConfigView, PrWorkflowMode, PrWorkflowNodeProcess, PrWorkflowPort} from '@monorepo/protocol';
import {FlMenuDynamicButton, FlSnackBarService} from '@monorepo/front-core-lib';
import {ClHelpService} from '@monorepo/core-lib';
import {CaLabInstance} from '../../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {CaLabHelper} from '../../../../ca-core/utils/ca-lab.helper';

export class CaWorkflowConfig extends PrConfigView {

  constructor(private labInstance: CaLabInstance,
              private snackBarService: FlSnackBarService) {
    super();
  }


  getInputMenu(port: PrWorkflowPort, node: PrWorkflowNodeProcess,
               workflowMode: PrWorkflowMode): FlMenuDynamicButton[] {
    const resourceId: string = node.currentObject.inputs.ports[port.name]?.resource_id ?? null;

    return [
      this.getResourceDetailContextButton(resourceId)
    ];
  }

  getOutputMenu(port: PrWorkflowPort, node: PrWorkflowNodeProcess,
                workflowMode: PrWorkflowMode): FlMenuDynamicButton[] {
    const resourceId: string = node.currentObject.outputs.ports[port.name]?.resource_id ?? null;

    return [
      this.getResourceDetailContextButton(resourceId)
    ];
  }

  private getResourceDetailContextButton(resourceId: string | null): FlMenuDynamicButton {
    return {
      type: 'button',
      text: {text: 'view_resource_in_lab', translateText: true},
      icon: 'resource',
      onClick: () => this.openResourceDetail(resourceId),
      disabled: ClHelpService.isNullOrEmpty(resourceId) || !this.labInstance.isRunning()
    };
  }

  public openResourceDetail(resourceId: string): void {
    if (this.labInstance.isRunning()) {
      window.location.href = CaLabHelper.getResourceUrl(this.labInstance.frontUrl, resourceId);
    } else {
      this.snackBarService.openErrorMessage({text: 'view_resource_lab_not_running', translateText: true});
    }
  }

}
