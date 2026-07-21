import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiScenarioTemplate, LiScenarioTemplateService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';

import { LabScenarioTemplateDetailComponent } from '../lab-scenario-template-detail/lab-scenario-template-detail.component';
import { LabScenarioTemplateDetailHeaderComponent } from '../lab-scenario-template-detail-header/lab-scenario-template-detail-header.component';
import { LabScenarioTemplateWorkflowComponent } from '../lab-scenario-template-workflow/lab-scenario-template-workflow.component';

@Component({
  selector: 'lab-scenario-template-detail-page',
  templateUrl: './lab-scenario-template-detail-page.component.html',
  styleUrls: ['./lab-scenario-template-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private scenarioTemplateService = inject(LiScenarioTemplateService);

  template$: Observable<LiScenarioTemplate>;

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
