import { Component, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  FlDynamicFieldFormDialogComponent,
  FlDynamicFieldFormDialogInput,
} from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import {
  LiCleanShareLinks,
  LiShareLink,
  LiShareLinkDatasource,
  LiShareLinkService,
} from '@monorepo/lab-lib/li-core';
import { LiShareLinkTableComponent } from '@monorepo/lab-lib/li-share';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-monitoring-share-links',
  templateUrl: './lab-monitoring-share-links.component.html',
  styleUrls: ['./lab-monitoring-share-links.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlInfiniteScrollModule,
    LiShareLinkTableComponent,
    TranslatePipe,
    MatButton,
  ],
})
export class LabMonitoringShareLinksComponent {
  private shareLinkService = inject(LiShareLinkService);

  shareLinks: LiShareLinkDatasource = this.shareLinkService.getAllDatasource();

  columns: FlTableColumnStatic<LiShareLink>[] = [
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
      submit: (data: LiCleanShareLinks) => this.shareLinkService.cleanLinks(data),
      data: { clean_expired_links: true, clean_invalid_links: true } as LiCleanShareLinks,
      successMessage: 'monitoring.share_links_cleaned',
    };

    this.dialogService.openSmallDialog(FlDynamicFieldFormDialogComponent, { data: data });
  }
}
