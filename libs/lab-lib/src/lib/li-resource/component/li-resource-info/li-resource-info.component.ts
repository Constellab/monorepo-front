import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiDetailRoutePipe,
  LiResource,
  LiSharedEntityOriginDialogData,
  LiTagDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { LiFolderInlineComponent } from '@monorepo/lab-lib/li-folder';
import { LiSharedEntityOriginDialogComponent } from '@monorepo/lab-lib/li-share';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { LiTypeDialogComponent, LiTypeDialogInput } from '@monorepo/lab-lib/li-type';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show info about a resource
 */
@Component({
  selector: 'li-resource-info',
  templateUrl: './li-resource-info.component.html',
  styleUrls: ['./li-resource-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    RouterLink,
    NgClass,
    TdTechnicalDocModule,
    FlUserModule,
    FlCorePipeModule,
    TranslatePipe,
    LiDetailRoutePipe,
    LiFolderInlineComponent,
    LiTagListComponent,
  ],
})
export class LiResourceInfoComponent implements OnInit {
  private dialogService = inject(FlDialogService);
  private tagService = inject(LiTagService);
  private clipboardService = inject(FlClipboardService);

  @Input({ required: true }) resource: LiResource;

  tags: LiTagDatasource;

  ngOnInit(): void {
    this.tags = this.tagService.getEntityTagsDatasource('RESOURCE', this.resource.id);
  }

  openTypingDoc(): void {
    const data: LiTypeDialogInput = {
      typingName: this.resource.resourceTypingName,
    };
    this.dialogService.openMediumDialog(LiTypeDialogComponent, {
      data: data,
      panelClass: 'g-dialog-main-background',
    });
  }

  openResourceShareOrigin(): void {
    if (this.resource.origin === 'IMPORTED_FROM_LAB') {
      const data: LiSharedEntityOriginDialogData = { entityType: 'RESOURCE', entityId: this.resource.id };
      this.dialogService.openMediumDialog(LiSharedEntityOriginDialogComponent, { data });
    }
  }

  copyIdToClipboard(): void {
    this.clipboardService.copy(this.resource.id, { text: 'li.id_copied_to_clipboard', translateText: true });
  }
}
