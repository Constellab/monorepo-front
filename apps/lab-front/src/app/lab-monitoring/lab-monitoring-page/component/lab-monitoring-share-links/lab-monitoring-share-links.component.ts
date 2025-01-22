import { Component, inject } from '@angular/core';
import { LabShareLinkService } from '../../../../lab-core/entity-service/lab-share-link.service';
import { LabShareLink, LabShareLinkDatasource } from '../../../../lab-core/model/entities/lab-share.entity';
import { FlTableColumnStatic } from '@monorepo/front-core-lib';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlInfiniteScrollModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { LabShareLinkTableComponent } from '../../../../lab-core/entity-module/lab-share-core/component/lab-share-link-table/lab-share-link-table.component';
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
    LabShareLinkTableComponent,
    TranslatePipe,
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
}
