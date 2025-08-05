import { Component, inject,OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import {
  LiCreateScenarioTemplateDTO,
  LiProtocolService,
  LiScenarioTemplate,
  LiScenarioTemplateService,
} from '@monorepo/lab-lib/li-core';
import { TeBasicConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface LiScenarioTemplateFormDialogInput extends FlFormDialogInput<LiScenarioTemplate> {
  protocolId?: string;
  defaultName?: string;
  defaultDescription?: TeRichText;
}

@Component({
  selector: 'li-scenario-template-form-dialog',
  templateUrl: './li-scenario-template-form-dialog.component.html',
  styleUrls: ['./li-scenario-template-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    TeTextEditorModule,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiScenarioTemplateFormDialogComponent
  extends FlFormDialogAbstractDirective<LiCreateScenarioTemplateDTO, LiScenarioTemplate>
  implements OnInit
{
  private protocolService = inject(LiProtocolService);
  private scenarioTemplateService = inject(LiScenarioTemplateService);

  dialogInput: LiScenarioTemplateFormDialogInput = inject(MAT_DIALOG_DATA);

  textEditorConfig: TeBasicConfig = new TeBasicConfig({ includeToolbarButton: true });

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      name: [this.dialogInput.defaultName, Validators.required],
      description: [this.dialogInput.defaultDescription],
    });
  }

  create(formValue: LiCreateScenarioTemplateDTO): Observable<LiScenarioTemplate> {
    return this.protocolService.createScenarioTemplate(this.dialogInput.protocolId, formValue);
  }

  update(formValue: LiCreateScenarioTemplateDTO): Observable<LiScenarioTemplate> {
    return this.scenarioTemplateService.updateScenarioTemplate(this.dialogInput.object.id, formValue);
  }

  get title(): string {
    return this.isCreateMode() ? 'li.create_scenario_template' : 'li.update_scenario_template';
  }

  getCreateSuccessMessage(): string {
    return 'li.scenario_template_created';
  }

  getUpdateSuccessMessage(): string {
    return 'li.scenario_template_updated';
  }
}
