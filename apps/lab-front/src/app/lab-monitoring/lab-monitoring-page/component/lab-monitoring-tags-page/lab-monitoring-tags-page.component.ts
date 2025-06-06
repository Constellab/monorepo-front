import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlEntityPaginatedDatasource, FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  LiCreateTagResponse,
  LiTagKeyModel,
  LiTagKeyModelDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import {
  LiTagEntityDetailComponent,
  LiTagFormDialogComponent,
  LiTagHelpDialogComponent,
} from '@monorepo/lab-lib/li-tag';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-monitoring-tags-page',
  templateUrl: './lab-monitoring-tags-page.component.html',
  styleUrls: ['./lab-monitoring-tags-page.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInfiniteScrollModule,
    LiTagEntityDetailComponent,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    FlIconModule,
  ],
})
export class LabMonitoringTagsPageComponent implements OnInit {
  private tagService = inject(LiTagService);
  private dialogService = inject(FlDialogService);

  tagKeys: LiTagKeyModelDatasource;

  ngOnInit(): void {
    this.tagKeys = new FlEntityPaginatedDatasource(
      (page, size) => this.tagService.searchKeys(null, page, size),
      20
    );

    this.tagService.getAllCommunityAgentsWithFilters([], '', false, 0, 20).subscribe((response) => {
      if (response && response.objects) {
        for (const obj of response.objects) {
          this.tagService.getCommunityTagValues(obj.key, 0, 20).subscribe((tagValues) => {
            console.log('TAG VALUES', tagValues);
          });
        }
      }
      console.log('RES', response);
    });
  }

  openAddTagDialog(): void {
    const input: FlFormDialogInput<FlTag> = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(LiTagFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((createResponse) => this.onAddClosed(createResponse));
  }

  private onAddClosed(createResponse?: LiCreateTagResponse): void {
    if (createResponse) {
      this.tagKeys.addItem(createResponse.keyModel);
    }
  }

  openTagHelpDialog(): void {
    this.dialogService.openSmallDialog(LiTagHelpDialogComponent, { panelClass: 'g-dialog-main-background' });
  }

  lastTagValueDeleted(tagKey: LiTagKeyModel): void {
    this.tagKeys.removeItem(tagKey);
  }
}
