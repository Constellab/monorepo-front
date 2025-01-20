import { Component, Input, OnInit } from '@angular/core';
import { LabScenarioTemplate } from '../../../../lab-core/model/entities/process/lab-scenario-template.entity';
import { LabScenarioTemplateService } from '../../../../lab-core/entity-service/lab-scenario-template.service';
import { TeBasicConfig, TeRichText } from '@monorepo/text-editor';
import { LabTagService } from '../../../../lab-core/entity-service/lab-tag.service';
import { LabTagDatasource } from '../../../../lab-core/model/entities/lab-tag.entity';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'lab-scenario-template-detail',
    templateUrl: './lab-scenario-template-detail.component.html',
    styleUrls: ['./lab-scenario-template-detail.component.scss'],
    standalone: false
})
export class LabScenarioTemplateDetailComponent implements OnInit {
  @Input({ required: true }) template: LabScenarioTemplate;

  tags$: LabTagDatasource;

  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  saveDescriptionFunc = (value: TeRichText): Observable<any> =>
    this.scenarioTemplateService.updateScenarioTemplate(this.template.id, { description: value });

  constructor(
    private scenarioTemplateService: LabScenarioTemplateService,
    private tagService: LabTagService
  ) {}

  ngOnInit(): void {
    this.formControl.patchValue(this.template.description, { emitEvent: false });

    this.tags$ = this.tagService.getEntityTagsDatasource('SCENARIO_TEMPLATE', this.template.id);
  }
}
