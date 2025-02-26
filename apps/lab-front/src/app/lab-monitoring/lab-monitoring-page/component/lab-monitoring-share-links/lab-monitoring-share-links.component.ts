import { Component, inject } from '@angular/core';
import { LabShareLinkService } from '../../../../lab-core/entity-service/lab-share-link.service';
import {
  LabCleanShareLinks,
  LabShareLink,
  LabShareLinkDatasource,
} from '../../../../lab-core/model/entities/lab-share.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { LabShareLinkTableComponent } from '../../../../lab-core/entity-module/lab-share-core/component/lab-share-link-table/lab-share-link-table.component';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FlDynamicFieldFormDialogComponent,
  FlDynamicFieldFormDialogInput,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'lab-monitoring-share-links',
  templateUrl: './lab-monitoring-share-links.component.html',
  styleUrls: ['./lab-monitoring-share-links.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlInfiniteScrollModule,
    LabShareLinkTableComponent,
    TranslatePipe,
    MatButton,
  ],
})
export class LabMonitoringShareLinksComponent {
  private shareLinkService = inject(LabShareLinkService);

  shareLinks: LabShareLinkDatasource = this.shareLinkService.getAllDatasource();

  columns: FlTableColumnStatic<LabShareLink>[] = [
    'entityType',
    'entityName',
    'validUntil',
    'downloadLink',
    'created',
    'actions',
  ];

  private translateService = inject(FlTranslateService);
  private dialogService = inject(FlDialogService);

  cleanLinks(): void {
    const data: FlDynamicFieldFormDialogInput = {
      title: 'monitoring.clean_share_links',
      config: {
        controlType: 'formGroup',
        subConfigs: {
          clean_expired_links: {
            controlType: 'formControl',
            type: 'boolean',
            placeholder: this.translateService.translate('monitoring.clean_expired_share_links'),
            fullWidth: true,
          },
          clean_invalid_links: {
            controlType: 'formControl',
            type: 'boolean',
            placeholder: this.translateService.translate('monitoring.clean_invalid_share_links'),
            fullWidth: true,
          },
        },
      },
      submit: (data: LabCleanShareLinks) => this.shareLinkService.cleanLinks(data),
      data: { clean_expired_links: true, clean_invalid_links: true } as LabCleanShareLinks,
      successMessage: 'monitoring.share_links_cleaned',
    };

    this.dialogService.openSmallDialog(FlDynamicFieldFormDialogComponent, { data: data });
  }
}
