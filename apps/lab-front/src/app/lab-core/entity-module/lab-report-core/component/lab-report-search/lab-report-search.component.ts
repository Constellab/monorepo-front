import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  FlDatasourcePaginated,
  FlDialogService,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlTableColumnStatic,
  FlThemeService
} from '@monorepo/front-core-lib';
import {LabReportSearch, LabReportSearchFields} from '../../model/lab-report-search.class';
import {LabReport} from '../../../../model/entities/lab-report.entity';
import {LabReportService} from '../../../../entity-service/lab-report.service';
import {LabRouterService} from '../../../../service/lab-router.service';
import {
  LabReportFormDialogComponent,
  LabReportFormDialogInput
} from '../lab-report-form-dialog/lab-report-form-dialog.component';
import {
  LabSelectReportTemplateDialogComponent,
  LabSelectReportTemplateDialogInput
} from '../../../lab-report-template-core/component/lab-select-report-template-dialog/lab-select-report-template-dialog.component';


@Component({
  selector: 'lab-report-search',
  templateUrl: './lab-report-search.component.html',
  styleUrls: ['./lab-report-search.component.scss'],
  providers: [
    FlSearchState,
  ]
})
export class LabReportSearchComponent implements OnInit {

  @Input() reportSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() reportSelected: EventEmitter<LabReport> = new EventEmitter();

  datasource: FlDatasourcePaginated<LabReport>;

  columns: FlTableColumnStatic<LabReport>[] = ['title', 'lastModification', 'lastSynchro'];

  constructor(private searchState: FlSearchState<any>,
              private reportService: LabReportService,
              private routerService: LabRouterService,
              private dialogService: FlDialogService,
              private themeService: FlThemeService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabReportSearch.getAdvancedSearchForm,
      advancedFormClass: LabReportSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabReportSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: this.fullPageSearch
    };

    this.datasource = this.reportService.getSearchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'lab-report',
        id: 'current-reports',
        label: 'Current reports',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {isValidated: false, isArchived: false} as Partial<LabReportSearchFields>
      },
      {
        searchName: 'lab-report',
        id: 'all-reports',
        label: 'ALl reports',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: false,
        filtersCriteria: {isValidated: true, isArchived: true} as Partial<LabReportSearchFields>
      }
    ];
  }

  openCreateReportFormDialog(): void {
    const input: LabReportFormDialogInput = {
      mode: 'create'
    };

    this.dialogService.openSmallDialog(LabReportFormDialogComponent, {data: input}).afterClosed().subscribe(
      report => this.onFormClosed(report)
    );
  }

  private onFormClosed(report?: LabReport): void {
    if (report) {
      this.routerService.navigateToReportDetail(report.id);
    }
  }

  selectReport(report: LabReport): void {
    this.reportSelected.next(report);
  }

  openReportTemplatesSearch(): void {
    const data: LabSelectReportTemplateDialogInput = {mode: 'link'};
    this.dialogService.openBigDialog(LabSelectReportTemplateDialogComponent, {data});
  }
}
