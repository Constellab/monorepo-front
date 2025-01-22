import { Component, OnInit, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { LabScenarioTemplate } from '../../../../lab-core/model/entities/process/lab-scenario-template.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { LabScenarioTemplateService } from '../../../../lab-core/entity-service/lab-scenario-template.service';
import { first } from 'rxjs/operators';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { LabScenarioTemplateDetailHeaderComponent } from '../lab-scenario-template-detail-header/lab-scenario-template-detail-header.component';
import { MatTabGroup, MatTab, MatTabContent } from '@angular/material/tabs';
import { LabScenarioTemplateWorkflowComponent } from '../lab-scenario-template-workflow/lab-scenario-template-workflow.component';
import { LabScenarioTemplateDetailComponent } from '../lab-scenario-template-detail/lab-scenario-template-detail.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-scenario-template-detail-page',
  templateUrl: './lab-scenario-template-detail-page.component.html',
  styleUrls: ['./lab-scenario-template-detail-page.component.scss'],
  imports: [
    FlSectionModule,
    LabScenarioTemplateDetailHeaderComponent,
    MatTabGroup,
    MatTab,
    MatTabContent,
    LabScenarioTemplateWorkflowComponent,
    LabScenarioTemplateDetailComponent,
    TranslatePipe,
  ],
})
export class LabScenarioTemplateDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scenarioTemplateService = inject(LabScenarioTemplateService);

  template$: Observable<LabScenarioTemplate>;

  selectedTabIndex: number = 0;

  ngOnInit(): void {
    this.template$ = this.route.params.pipe(
      switchMap((params) => this.scenarioTemplateService.getScenarioTemplate(params.id))
    );

    // init the tab base on query param
    this.route.queryParams
      .pipe(first())
      .subscribe((queryParams) => (this.selectedTabIndex = queryParams.tab ?? 0));
  }

  // on tab change, update the query param
  tabIndexChange(index: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: index },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
