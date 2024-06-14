import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import {
  LabImportResourceDialogComponent,
  LabImportResourceDialogInput
} from '../lab-import-resource-dialog/lab-import-resource-dialog.component';
import {
  FlDialogService,
  FlPortalActionResult,
  FlSnackBarService,
  FlTranslatableText,
  FlTranslateService
} from '@monorepo/front-core-lib';
import { LabUpdateResourceTypeComponent } from '../lab-update-resource-type/lab-update-resource-type.component';
import {
  LabUpdateResourceNameDialogComponent
} from '../lab-update-resource-name-dialog/lab-update-resource-name-dialog.component';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResourceDownloadService } from '../../../../entity-service/lab-resource-download.service';
import {
  LabResourceUpdateProjectDialogComponent,
  LabResourceUpdateProjectDialogInput,
  LabResourceUpdateProjectDialogOutput
} from '../lab-resource-update-project-dialog/lab-resource-update-project-dialog.component';
import {
  LabNavigableEntityService,
  LabNavigableImpactConfig
} from '../../../lab-navigable-entity-core/lab-navigable-entity.service';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabSharedEntityInfoDialogComponent,
  LabSharedEntityInfoDialogInput
} from '../../../lab-share-core/component/lab-shared-entity-info-dialog/lab-shared-entity-info-dialog.component';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput
} from '../../../lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import { LabTagService } from '../../../../entity-service/lab-tag.service';

/**
 * Action menu button for resources, it has a ng-content for custom buttons
 */
@Component({
  selector: 'lab-resource-actions-menu',
  templateUrl: './lab-resource-actions-menu.component.html',
  styleUrls: ['./lab-resource-actions-menu.component.scss']
})
export class LabResourceActionsMenuComponent implements OnInit {

  @Input() resource: LabResource;

  @Input() readOnly: boolean = false;

  @Output() update: EventEmitter<LabResource> = new EventEmitter<LabResource>();
  @Output() delete: EventEmitter<LabResource> = new EventEmitter<LabResource>();

  resourceDocRoute: string;

  constructor(private resourceService: LabResourceService,
              private dialogService: FlDialogService,
              private resourceDownloadService: LabResourceDownloadService,
              private translateService: FlTranslateService,
              private snackBarService: FlSnackBarService,
              private labImpactedService: LabNavigableEntityService,
              private tagService: LabTagService) {
  }

  ngOnInit(): void {
    this.resourceDocRoute = LabRouterService.getTechnicalDocRoute(
      this.resource.resourceTypingName.replaceAll('-', '.'));
  }

  downloadResource(): void {
    this.resourceDownloadService.downloadResource(this.resource);
  }

  openImportResource(): void {
    const input: LabImportResourceDialogInput = {
      resourceId: this.resource.id,
      resourceHumanName: this.resource.resourceType.human_name,
      resourceTypingName: this.resource.resourceTypingName,
      nodeExtension: this.resource.fsNode.getExtension()
    };

    this.dialogService.openMediumDialog(LabImportResourceDialogComponent, {data: input});
  }

  updateResourceType(): void {
    this.dialogService.openSmallDialog(LabUpdateResourceTypeComponent, {data: this.resource}).afterClosed().subscribe(
      updatedResource => this.onUpdateResourceClosed(updatedResource)
    );
  }

  openUpdateName(): void {
    this.dialogService.openSmallDialog(LabUpdateResourceNameDialogComponent, {data: this.resource}).afterClosed().subscribe(
      updatedResource => this.onUpdateResourceClosed(updatedResource)
    );
  }

  private onUpdateResourceClosed(resource?: LabResource): void {
    if (resource) {
      this.update.next(resource);
    }
  }

  openUpdateProject(): void {
    const data: LabResourceUpdateProjectDialogInput = {
      resourceId: this.resource.id,
      experiment: this.resource.experiment,
      project: this.resource.project
    };
    this.dialogService.openSmallDialog(LabResourceUpdateProjectDialogComponent, {data: data})
      .afterClosed().subscribe(project => this.updateProjectClosed(project));
  }

  private updateProjectClosed(result?: LabResourceUpdateProjectDialogOutput): void {
    if (result) {
      this.resource.project = result.project;
      this.update.next(this.resource);
    }
  }

  openShareDialog(): void {
    const data: LabSharedEntityInfoDialogInput = {
      entityType: 'RESOURCE',
      entityId: this.resource.id
    };

    this.dialogService.openMediumDialog(LabSharedEntityInfoDialogComponent, {data});
  }

  openTagDialog(): void {
    const data: LabManageEntityTagsDialogInput = {
      entityType: 'RESOURCE',
      entityId: this.resource.id,
      tags: this.tagService.getEntityTagsDatasource('RESOURCE', this.resource.id)
    };
    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, {
      data: data, autoFocus: false
    });
  }

  deleteResource(): void {
    let confirmImpactHelpText: FlTranslatableText;
    // build the confirmation message
    let confirmation = `<p>${this.translateService.translate('databox.delete_resource_confirmation')}</p>`;


    // for imported or transformed resources, we add an info message
    if (this.resource.experiment) {
      confirmation += `<p>${this.translateService.translate('databox.delete_generated_resource_confirmation',
        {param: {experimentTitle: this.resource.experiment.title}})}</p>`;

      const deleteResourceWithExp = this.translateService.translate('biox.delete_resource_with_exp_confirm_impact',
        {param: {title: this.resource.name, experimentTitle: this.resource.experiment.title}});
      const resetProcessImpact = this.translateService.translate('biox.experiment_ressource_used_after',
        {param: {title: this.resource.experiment.title}});
      confirmImpactHelpText = `<p>${deleteResourceWithExp}</p><p>${resetProcessImpact}</p>`;
    } else {
      confirmImpactHelpText = {
        text: 'biox.delete_resource_confirm_impact', translateText: true, translateParam: {
          param: {title: this.resource.name}
        }
      };
    }

    const impactData: LabNavigableImpactConfig = {
      title: {text: 'databox.delete_resource', translateText: true},
      confirmImpactConfirmText: confirmImpactHelpText,
      noImpactConfirmText: {text: confirmation, translateText: false},
      checkImpact: () => this.resourceService.checkImpactForDeleteResource(this.resource.id),
      callAction: () => this.resourceService.delete(this.resource.id)
    };

    this.labImpactedService.callImpactMethodOnAction(impactData).subscribe(
      result => this.onResourceDeleteSuccess(result)
    );
  }


  private onResourceDeleteSuccess(result: FlPortalActionResult): void {
    if (result.status === 'success') {
      if (this.resource.experiment) {
        this.snackBarService.openSuccessMessage({text: 'databox.resource_and_experiment_deleted', translateText: true});
      } else {
        this.snackBarService.openSuccessMessage({text: 'databox.resource_deleted', translateText: true});
      }
      this.delete.next(this.resource);
    }
  }
}
