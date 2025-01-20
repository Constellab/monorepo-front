import { Component, Input } from '@angular/core';
import { LabScenarioTemplate } from '../../../../lab-core/model/entities/process/lab-scenario-template.entity';
import { LabScenarioTemplateService } from '../../../../lab-core/entity-service/lab-scenario-template.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalActionsService,
} from '@monorepo/front-core-lib';
import { LabRouterService } from '../../../../lab-core/service/lab-router.service';

@Component({
    selector: 'lab-scenario-template-detail-header',
    templateUrl: './lab-scenario-template-detail-header.component.html',
    styleUrl: './lab-scenario-template-detail-header.component.scss',
    standalone: false
})
export class LabScenarioTemplateDetailHeaderComponent {
  @Input() template: LabScenarioTemplate;

  constructor(
    private scenarioTemplateService: LabScenarioTemplateService,
    private dialogService: FlDialogService,
    private routerService: LabRouterService,
    private actionsService: FlPortalActionsService
  ) {}

  updateName(name: string): void {
    this.scenarioTemplateService
      .updateScenarioTemplateName(this.template.id, name)
      .subscribe((updatedScenarioTemplate: LabScenarioTemplate) => {
        this.template.name = updatedScenarioTemplate.name;
      });
  }

  downloadScenarioTemplate(): void {
    this.actionsService.addAction({
      type: 'download-scenario-template',
      action: this.scenarioTemplateService.downloadScenarioTemplate(this.template.id),
      text: { text: 'biox.download_scenario_template', translateText: true },
    });
  }

  openDeleteDialog(): void {
    const data: FlConfirmDialogInput = {
      title: 'biox.delete_scenario_template',
      content: 'biox.delete_scenario_template_confirmation',
      observable: this.scenarioTemplateService.deleteScenarioTemplate(this.template.id),
      successMessage: 'biox.scenario_template_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((res: FlConfirmDialogResult) => this.onDeleteClosed(res));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.routerService.navigateToScenarioTemplates();
    }
  }
}
