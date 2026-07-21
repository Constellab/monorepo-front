import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  FlSavedSearch,
  FlSearchConfig,
  FlSearchModule,
  FlSearchState,
} from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { HaPartner, HaPartnerDatasourcePaginated } from '../../../ha-core/ha-model/ha-entities/ha-partner';
import { HaPartnerService } from '../../../ha-core/ha-service/ha-partner.service';
import {
  HaAdminPanelPartnerSearch,
  HaAdminPanelPartnerSearchFields,
} from '../../model/ha-admin-panel-partner-search.class';
import { HaAdminPanelPartnersSearchFormComponent } from '../ha-admin-panel-partners-search-form/ha-admin-panel-partners-search-form.component';
import {
  HaAdminPanelPartnersTableActionEvent,
  HaAdminPanelPartnersTableComponent,
} from '../ha-admin-panel-partners-table/ha-admin-panel-partners-table.component';

@Component({
  selector: 'ha-admin-panel-users',
  templateUrl: './ha-admin-panel-partners.component.html',
  styleUrls: ['./ha-admin-panel-partners.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIcon,
    FlUserModule,
    FlCorePipeModule,
    TranslatePipe,
    FlCardModule,
    FlIconModule,
    FlSearchModule,
    FlTextIconModule,
    HaAdminPanelPartnersSearchFormComponent,
    HaAdminPanelPartnersTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [FlSearchState],
})
export class HaAdminPanelPartnersComponent implements OnInit {
  private searchState = inject<FlSearchState<HaPartner>>(FlSearchState);
  private partnerService = inject(HaPartnerService);
  private themeService = inject(FlThemeService);
  private dialogService = inject(FlDialogService);

  datasource: HaPartnerDatasourcePaginated<HaAdminPanelPartnerSearchFields>;

  isLoading: boolean = false;

  ngOnInit(): void {
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: HaAdminPanelPartnerSearch.getSearchForm,
      advancedFormClass: HaAdminPanelPartnerSearchFields,
      savedSearch: this.getSavedSearch(),
      advancedFormManager: {
        config: HaAdminPanelPartnerSearch.searchManagerConfig,
      },
      storeSearchInUrl: true,
      defaultSort: { key: 'created', direction: 'DESC' },
    };

    this.datasource = new FlEntityPaginatedDatasource(
      (page, size, filters) => this.partnerService.searchForAdmin(page, size, filters),
      20,
      { initFirstPage: false }
    );
    this.searchState.init(config, this.datasource);
  }

  onAction(actionEvent: HaAdminPanelPartnersTableActionEvent): void {
    switch (actionEvent.type) {
      case 'certify_partner':
        this.certifyPartner(actionEvent.partner.id);
        break;
      case 'decertify_partner':
        this.decertifyPartner(actionEvent.partner.id);
        break;
    }
  }

  certifyPartner(partnerId: string): void {
    const confirmDialogInput: FlConfirmDialogInput = {
      content: 'confirm_grant_certification',
      title: 'grant_certification',
      successMessage: 'partner_certification_granted',
      observable: this.partnerService.certifyPartner(partnerId),
    };

    this.dialogService
      .openConfirmDialog(confirmDialogInput)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<HaPartner>) => {
        if (result.choice && result.result) this.datasource.updateItem(result.result);
      });
  }

  decertifyPartner(partnerId: string): void {
    const confirmDialogInput: FlConfirmDialogInput = {
      content: 'confirm_revoke_certification',
      title: 'revoke_certification',
      successMessage: 'partner_certification_revoked',
      observable: this.partnerService.decertifyPartner(partnerId),
    };

    this.dialogService
      .openConfirmDialog(confirmDialogInput)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult<HaPartner>) => {
        if (result.choice && result.result) this.datasource.updateItem(result.result);
      });
  }

  private getSavedSearch(): FlSavedSearch[] {
    return [
      {
        searchName: 'ha-partner',
        id: null,
        label: 'All partners',
        color: this.themeService.getCurrentThemeDetail().primary,
        version: 1,
        default: true,
        filtersCriteria: {} as Partial<HaAdminPanelPartnerSearchFields>,
      },
    ];
  }
}
