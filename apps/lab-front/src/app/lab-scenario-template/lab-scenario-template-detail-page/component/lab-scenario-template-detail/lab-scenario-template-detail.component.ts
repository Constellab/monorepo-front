import { Component, Input, OnInit, inject } from '@angular/core';
import { LabScenarioTemplate } from '../../../../lab-core/model/entities/process/lab-scenario-template.entity';
import { LabScenarioTemplateService } from '../../../../lab-core/entity-service/lab-scenario-template.service';
import { TeBasicConfig, TeRichText } from '@monorepo/text-editor';
import { LabTagService } from '../../../../lab-core/entity-service/lab-tag.service';
import { LabTagDatasource } from '../../../../lab-core/model/entities/lab-tag.entity';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FlArticleModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-article/fl-article.module';
import { LabTagListComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { FlUserModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TeTextEditorModule } from '../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-template-detail',
  templateUrl: './lab-scenario-template-detail.component.html',
  styleUrls: ['./lab-scenario-template-detail.component.scss'],
  imports: [
    FlArticleModule,
    LabTagListComponent,
    FlUserModule,
    TeTextEditorModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class LabScenarioTemplateDetailComponent implements OnInit {
  private scenarioTemplateService = inject(LabScenarioTemplateService);
  private tagService = inject(LabTagService);

  @Input({ required: true }) template: LabScenarioTemplate;

  tags$: LabTagDatasource;

  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  saveDescriptionFunc = (value: TeRichText): Observable<any> =>
    this.scenarioTemplateService.updateScenarioTemplate(this.template.id, { description: value });

  ngOnInit(): void {
    this.formControl.patchValue(this.template.description, { emitEvent: false });

    this.tags$ = this.tagService.getEntityTagsDatasource('SCENARIO_TEMPLATE', this.template.id);
  }
}
