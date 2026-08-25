import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import {
  LiCreateTriggeredJobFromTemplateDTO,
  LiScenarioTemplate,
  LiTriggeredJob,
  LiTriggeredJobService,
} from '@monorepo/lab-lib/li-core';
import { LiSelectScenarioTemplateComponent } from '@monorepo/lab-lib/li-scenario-template';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LiCronHumanPipe } from '../li-cron-human.pipe';

export type LiTriggeredJobFormDialogInput = FlFormDialogInput<LiCreateTriggeredJobFromTemplateDTO>;

interface LiCronPreset {
  cron: string;
  labelKey: string;
}

@Component({
  selector: 'li-triggered-job-form-dialog',
  templateUrl: './li-triggered-job-form-dialog.component.html',
  styleUrls: ['./li-triggered-job-form-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSlideToggle,
    FlCoreDirectiveModule,
    FlFormModule,
    FlLoaderModule,
    MatDialogActions,
    MatButton,
    LiSelectScenarioTemplateComponent,
    TranslatePipe,
    FlCorePipeModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [LiCronHumanPipe],
})
export class LiTriggeredJobFormDialogComponent
  extends FlFormDialogAbstractDirective<LiCreateTriggeredJobFromTemplateDTO, LiTriggeredJob>
  implements OnInit
{
  private triggeredJobService = inject(LiTriggeredJobService);

  cronPresets: LiCronPreset[] = [
    { cron: '0 * * * *', labelKey: 'li.job_cron_every_hour' },
    { cron: '0 0 * * *', labelKey: 'li.job_cron_every_day' },
    { cron: '0 0 * * 1', labelKey: 'li.job_cron_every_week' },
  ];

  selectedPreset: string | null = this.cronPresets[0].cron;
  cronHumanText: string | null = null;

  private cronHumanPipe = inject(LiCronHumanPipe);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
    this.selectPreset(this.cronPresets[0].cron);

    this.formGp.get('cronExpression')?.valueChanges.subscribe((value: string) => {
      if (this.cronPresets.some((p) => p.cron === value)) {
        this.selectedPreset = value;
      } else {
        this.selectedPreset = null;
      }
      this.updateCronHumanText(value);
    });
  }

  selectPreset(cron: string): void {
    this.selectedPreset = cron;
    this.formGp.patchValue({ cronExpression: cron });
  }

  private updateCronHumanText(value: string): void {
    if (!value) {
      this.cronHumanText = null;
      return;
    }
    const humanText = this.cronHumanPipe.transform(value);
    this.cronHumanText = humanText !== value ? humanText : null;
  }

  get title(): string {
    return 'li.job_create';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      scenarioTemplate: [null, Validators.required],
      name: [null, Validators.required],
      description: [null],
      cronExpression: [null, Validators.required],
      isActive: [false],
    });
  }

  create(formValue: any): Observable<LiTriggeredJob> {
    const dto: LiCreateTriggeredJobFromTemplateDTO = {
      scenario_template_id: formValue.scenarioTemplate.id,
      name: formValue.name,
      description: formValue.description,
      cron_expression: formValue.cronExpression,
      is_active: formValue.isActive,
    };
    return this.triggeredJobService.createFromTemplate(dto);
  }

  update(): Observable<LiTriggeredJob> {
    throw new Error('Update not supported');
  }

  getCreateSuccessMessage(): string {
    return 'li.job_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  onTemplateSelected(template: LiScenarioTemplate): void {
    if (!this.formGp.value.name) {
      this.formGp.patchValue({ name: template.name });
    }
  }
}
