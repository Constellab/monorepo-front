import { Component, Input, OnInit } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import {
  LabTypeDialogComponent,
  LabTypeDialogInput,
} from '../../../lab-type-core/component/lab-type-dialog/lab-type-dialog.component';
import { FlClipboardService, FlDialogService } from '@monorepo/front-core-lib';
import { LabSharedEntityOriginDialogComponent } from '../../../lab-share-core/component/lab-shared-entity-origin-dialog/lab-shared-entity-origin-dialog.component';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { LabTagDatasource } from '../../../../model/entities/lab-tag.entity';

/**
 * Component to show info about a resource
 */
@Component({
  selector: 'lab-resource-info',
  templateUrl: './lab-resource-info.component.html',
  styleUrls: ['./lab-resource-info.component.scss'],
})
export class LabResourceInfoComponent implements OnInit {
  @Input({ required: true }) resource: LabResource;

  tags: LabTagDatasource;

  constructor(
    private dialogService: FlDialogService,
    private tagService: LabTagService,
    private clipboardService: FlClipboardService
  ) {}

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
