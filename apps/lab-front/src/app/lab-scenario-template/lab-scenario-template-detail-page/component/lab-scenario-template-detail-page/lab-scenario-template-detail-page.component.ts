import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { LabScenarioTemplate } from '../../../../lab-core/model/entities/process/lab-scenario-template.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { LabScenarioTemplateService } from '../../../../lab-core/entity-service/lab-scenario-template.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'lab-scenario-template-detail-page',
  templateUrl: './lab-scenario-template-detail-page.component.html',
  styleUrls: ['./lab-scenario-template-detail-page.component.scss'],
})
export class LabScenarioTemplateDetailPageComponent implements OnInit {
  template$: Observable<LabScenarioTemplate>;

  selectedTabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scenarioTemplateService: LabScenarioTemplateService
  ) {}

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
