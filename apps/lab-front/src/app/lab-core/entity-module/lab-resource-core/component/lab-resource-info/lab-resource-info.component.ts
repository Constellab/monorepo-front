import {Component, Input, OnInit} from '@angular/core';
import {LabResource} from '../../../../model/entities/resource/lab-resource.entity';
import {
  LabTypeDialogComponent,
  LabTypeDialogInput
} from '../../../lab-type-core/component/lab-type-dialog/lab-type-dialog.component';
import {FlDialogService, FlTagDatasource, FlTagDialogService} from '@monorepo/front-core-lib';
import {
  LabSharedEntityOriginDialogComponent
} from '../../../lab-share-core/component/lab-shared-entity-origin-dialog/lab-shared-entity-origin-dialog.component';
import {LabResourceService} from '../../../../entity-service/lab-resource.service';
import {LabTagService} from '../../../../entity-service/lab-tag.service';

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
              private tagDialogService: FlTagDialogService,
              private resourceService: LabResourceService,
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
    this.tagDialogService.openUpdateTagDialog({
      tags: this.tags,
      updateMethod: (tags) => this.resourceService.saveTags(this.resource.id, tags)
    });
  }
}
