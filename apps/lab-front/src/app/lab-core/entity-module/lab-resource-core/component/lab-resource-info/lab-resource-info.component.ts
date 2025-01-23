import { Component, inject, Input, OnInit } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import {
  LabTypeDialogComponent,
  LabTypeDialogInput,
} from '../../../lab-type-core/component/lab-type-dialog/lab-type-dialog.component';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LabSharedEntityOriginDialogComponent } from '../../../lab-share-core/component/lab-shared-entity-origin-dialog/lab-shared-entity-origin-dialog.component';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { LabTagDatasource } from '../../../../model/entities/lab-tag.entity';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { RouterLink } from '@angular/router';
import {
  LabFolderInlineComponent
} from '../../../lab-folder-core/component/lab-folder-inline/lab-folder-inline.component';
import { NgClass } from '@angular/common';
import {
  TdTechnicalDocModule,
} from '@monorepo/technical-doc';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

/**
 * Component to show info about a resource
 */
@Component({
  selector: 'lab-resource-info',
  templateUrl: './lab-resource-info.component.html',
  styleUrls: ['./lab-resource-info.component.scss'],
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
    LabDetailRoutePipe,
    LabFolderInlineComponent,
    LabTagListComponent,
  ],
})
export class LabResourceInfoComponent implements OnInit {
  private dialogService = inject(FlDialogService);
  private tagService = inject(LabTagService);
  private clipboardService = inject(FlClipboardService);

  @Input({ required: true }) resource: LabResource;

  tags: LabTagDatasource;

  ngOnInit(): void {
    this.tags = this.tagService.getEntityTagsDatasource('RESOURCE', this.resource.id);
  }

  openTypingDoc(): void {
    const data: LabTypeDialogInput = {
      typingName: this.resource.resourceTypingName,
    };
    this.dialogService.openMediumDialog(LabTypeDialogComponent, {
      data: data,
      panelClass: 'g-dialog-main-background',
    });
  }

  openResourceShareOrigin(): void {
    if (this.resource.origin === 'IMPORTED_FROM_LAB') {
      this.dialogService.openMediumDialog(LabSharedEntityOriginDialogComponent, { data: this.resource.id });
    }
  }

  copyIdToClipboard(): void {
    this.clipboardService.copy(this.resource.id, { text: 'id_copied_to_clipboard', translateText: true });
  }
}
