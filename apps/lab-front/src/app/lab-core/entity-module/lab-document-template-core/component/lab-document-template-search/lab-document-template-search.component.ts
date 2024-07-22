import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FlDialogService,
  FlFormDialogInput,
  FlSavedSearch,
  FlSearchConfig,
  FlSearchState,
  FlThemeService
} from '@monorepo/front-core-lib';
import {
  LabDocumentTemplate,
  LabDocumentTemplateDatasource
} from '../../../../model/entities/lab-document-template.entity';
import { LabDocumentTemplateService } from '../../../../entity-service/lab-document-template.service';
import { LabDocumentTemplateSearch, LabDocumentTemplateSearchFields } from '../../lab-document-template-search.class';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabDocumentTemplateFormDialogComponent
} from '../lab-document-template-form-dialog/lab-document-template-form-dialog.component';

@Component({
  selector: 'lab-document-template-search',
  templateUrl: './lab-document-template-search.component.html',
  styleUrls: ['./lab-document-template-search.component.scss'],
  providers: [FlSearchState]
})
export class LabDocumentTemplateSearchComponent implements OnInit {

  @Input() documentTemplateSelectable: boolean = false;

  @Input() fullPageSearch: boolean = true;

  @Output() documentTemplateSelected: EventEmitter<LabDocumentTemplate> = new EventEmitter();

  datasource: LabDocumentTemplateDatasource;

  constructor(private searchState: FlSearchState<any>,
              private documentTemplateService: LabDocumentTemplateService,
              private themeService: FlThemeService,
              private dialogService: FlDialogService,
              private routerService: LabRouterService) {
  }

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: LabDocumentTemplateSearch.getAdvancedSearchForm,
      advancedFormClass: LabDocumentTemplateSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: LabDocumentTemplateSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: this.fullPageSearch
    };

    this.datasource = this.documentTemplateService.getSearchDatasource();
    this.searchState.init(config, this.datasource);
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'lab-doc-template',
        id: 'all-doc-template',
        label: 'All templates',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {}
      }
    ];
  }

  selectTemplate(documentTemplate: LabDocumentTemplate): void {
    this.documentTemplateSelected.next(documentTemplate);
  }

  openCreateDocumentTemplateDialog(): void {
    const data: FlFormDialogInput = {
      mode: 'create'
    };

    this.dialogService.openSmallDialog(LabDocumentTemplateFormDialogComponent, {data}).afterClosed().subscribe(
      template => this.onCreateClosed(template)
    );
  }

  private onCreateClosed(documentTemplate?: LabDocumentTemplate): void {
    if (documentTemplate) {
      this.routerService.navigateToDocumentTemplateDetail(documentTemplate.id);
    }
  }
}

