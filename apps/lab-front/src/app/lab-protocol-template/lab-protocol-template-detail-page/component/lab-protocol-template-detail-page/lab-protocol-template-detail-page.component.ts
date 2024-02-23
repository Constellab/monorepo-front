import {Component, OnInit} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {LabProtocolTemplate} from '../../../../lab-core/model/entities/process/lab-protocol-template.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {LabProtocolTemplateService} from '../../../../lab-core/entity-service/lab-protocol-template.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'lab-protocol-template-detail-page',
  templateUrl: './lab-protocol-template-detail-page.component.html',
  styleUrls: ['./lab-protocol-template-detail-page.component.scss']
})
export class LabProtocolTemplateDetailPageComponent implements OnInit {

  template$: Observable<LabProtocolTemplate>;

  selectedTabIndex: number = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private protocolTemplateService: LabProtocolTemplateService) {
  }

  ngOnInit(): void {
    this.template$ = this.route.params.pipe(
      switchMap(params => this.protocolTemplateService.getProtocolTemplate(params.id))
    );

    // init the tab base on query param
    this.route.queryParams.pipe(first()).subscribe(
      queryParams => this.selectedTabIndex = queryParams.tab ?? 0
    );
  }

  // on tab change, update the query param
  tabIndexChange(index: number): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {tab: index},
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
  }


}
