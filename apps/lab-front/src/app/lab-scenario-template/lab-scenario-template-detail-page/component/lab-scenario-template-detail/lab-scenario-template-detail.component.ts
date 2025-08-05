import { Component, inject,Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlArticleModule } from '@monorepo/front-core-lib/fl-article';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiScenarioTemplate,
  LiScenarioTemplateService,
  LiTagDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TeBasicConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'lab-scenario-template-detail',
  templateUrl: './lab-scenario-template-detail.component.html',
  styleUrls: ['./lab-scenario-template-detail.component.scss'],
  imports: [
    FlArticleModule,
    LiTagListComponent,
    FlUserModule,
    TeTextEditorModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class LabScenarioTemplateDetailComponent implements OnInit {
  private scenarioTemplateService = inject(LiScenarioTemplateService);
  private tagService = inject(LiTagService);

  @Input({ required: true }) template: LiScenarioTemplate;

  tags$: LiTagDatasource;

  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  saveDescriptionFunc = (value: TeRichText): Observable<any> =>
    this.scenarioTemplateService.updateScenarioTemplate(this.template.id, { description: value });

  ngOnInit(): void {
    this.formControl.patchValue(this.template.description, { emitEvent: false });

    this.tags$ = this.tagService.getEntityTagsDatasource('SCENARIO_TEMPLATE', this.template.id);
  }
}
