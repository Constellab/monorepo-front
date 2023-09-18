import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FlSavedSearch, FlSearchConfig, FlSearchState, FlThemeService} from '@monorepo/front-core-lib';
import {LabReportTemplate, LabReportTemplateDatasource} from '../../../../model/entities/lab-report-template.entity';
import {LabReportTemplateService} from '../../../../entity-service/lab-report-template.service';
import {LabReportTemplateSearch, LabReportTemplateSearchFields} from '../../lab-report-template-search.class';

@Component({
  selector: 'lab-report-template-search',
  templateUrl: './lab-report-template-search.component.html',
  styleUrls: ['./lab-report-template-search.component.scss'],
  providers: [FlSearchState]
})
export class LabReportTemplateSearchComponent implements OnInit {

  @Input() reportTemplateSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() reportTemplateSelected: EventEmitter<LabReportTemplate> = new EventEmitter();

  datasource: LabReportTemplateDatasource;

  constructor(private searchState: FlSearchState<any>,
              private reportTemplateService: LabReportTemplateService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabReportTemplateSearch.getAdvancedSearchForm,
      advancedFormClass: LabReportTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabReportTemplateSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: this.fullPageSearch
    };

    this.datasource = this.reportTemplateService.getSearchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'lab-report-template',
        id: 'all-report-template',
        label: 'All templates',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {}
      }
    ];
  }

  selectReport(reportTemplate: LabReportTemplate): void {
    this.reportTemplateSelected.next(reportTemplate);
  }
}

