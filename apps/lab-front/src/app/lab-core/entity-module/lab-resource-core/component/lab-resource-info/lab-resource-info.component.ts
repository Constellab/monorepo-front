import {Component, Input, OnInit} from '@angular/core';
import {LabResource} from '../../../../model/entities/resource/lab-resource.entity';
import {
  LabTypeDialogComponent,
  LabTypeDialogInput
} from '../../../lab-type-core/component/lab-type-dialog/lab-type-dialog.component';
import {FlDialogService, FlTagDatasource} from '@monorepo/front-core-lib';
import {
  LabSharedEntityOriginDialogComponent
} from '../../../lab-share-core/component/lab-shared-entity-origin-dialog/lab-shared-entity-origin-dialog.component';
import {LabTagService} from '../../../../entity-service/lab-tag.service';
import {
  LabAddTagToEntityDialogInput,
  LabManageEntityTagsDialogComponent
} from '../../../lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';

/**
 * Component to show info about a resource
 */
@Component({
  selector: 'lab-resource-info',
  templateUrl: './lab-resource-info.component.html',
  styleUrls: ['./lab-resource-info.component.scss']
})
export class LabResourceInfoComponent implements OnInit {

  @Input({required: true}) resource: LabResource;

  tags: FlTagDatasource;

  constructor(private dialogService: FlDialogService,
              private tagService: LabTagService) {
  }

  ngOnInit(): void {
    this.tags = this.tagService.getEntityTagsDatasource('RESOURCE', this.resource.id);
  }

  openTypingDoc(): void {
    const data: LabTypeDialogInput = {
      typingName: this.resource.resourceTypingName
    };
    this.dialogService.openMediumDialog(LabTypeDialogComponent, {data: data});
  }

  openResourceShareOrigin(): void {
    if (this.resource.origin === 'IMPORTED_FROM_LAB') {
      this.dialogService.openMediumDialog(LabSharedEntityOriginDialogComponent, {data: this.resource.id});
    }
  }

  openTagFormDialog(): void {
    const data: LabAddTagToEntityDialogInput = {
      entityType: 'RESOURCE',
      entityId: this.resource.id,
      tags: this.tags,
    };

    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, {data: data});
  }
}
