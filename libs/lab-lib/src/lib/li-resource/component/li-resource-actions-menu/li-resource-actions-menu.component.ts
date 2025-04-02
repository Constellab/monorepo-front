import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlPortalActionResult } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import {
  LiImportResourceDialogComponent,
  LiImportResourceDialogInput,
} from '../li-import-resource-dialog/li-import-resource-dialog.component';
import { LiNavigableEntityService, LiNavigableImpactConfig } from '@monorepo/lab-lib/li-navigable-entity';
import { LiResource, LiResourceService, LiRouterService, LiTagService } from '@monorepo/lab-lib/li-core';
import {
  LiResourceUpdateFolderDialogComponent,
  LiResourceUpdateFolderDialogInput,
  LiResourceUpdateFolderDialogOutput,
} from '../li-resource-update-folder-dialog/li-resource-update-folder-dialog.component';
import {
  LiUpdateResourceNameDialogComponent,
} from '../li-update-resource-name-dialog/li-update-resource-name-dialog.component';
import { LiUpdateResourceTypeComponent } from '../li-update-resource-type/li-update-resource-type.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LiSharedEntityInfoDialogComponent, LiSharedEntityInfoDialogInput } from '@monorepo/lab-lib/li-share';
import { LiManageEntityTagsDialogComponent, LiManageEntityTagsDialogInput } from '@monorepo/lab-lib/li-tag';
import { LiResourceDownloadService } from '../../service/li-resource-download.service';

/**
 * Action menu button for resources, it has a ng-content for custom buttons
 */
@Component({
  selector: 'li-resource-actions-menu',
  templateUrl: './li-resource-actions-menu.component.html',
  styleUrls: ['./li-resource-actions-menu.component.scss'],
  imports: [
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    FlIconModule,
    RouterLink,
    TranslatePipe,
  ],
})
export class LiResourceActionsMenuComponent implements OnInit {
  private resourceService = inject(LiResourceService);
  private dialogService = inject(FlDialogService);
  private resourceDownloadService = inject(LiResourceDownloadService);
  private translateService = inject(FlTranslateService);
  private snackBarService = inject(FlSnackBarService);
  private labImpactedService = inject(LiNavigableEntityService);
  private tagService = inject(LiTagService);

  @Input() resource: LiResource;

  @Input() readOnly: boolean = false;

  @Output() update: EventEmitter<LiResource> = new EventEmitter<LiResource>();
  @Output() delete: EventEmitter<LiResource> = new EventEmitter<LiResource>();

  resourceDocRoute: string;

  ngOnInit(): void {
    this.resourceDocRoute = LiRouterService.getTechnicalDocRoute(
      this.resource.resourceTypingName.replaceAll('-', '.')
    );
  }

  downloadResource(): void {
    this.resourceDownloadService.downloadResource(this.resource);
  }

  openImportResource(): void {
    const input: LiImportResourceDialogInput = {
      resourceId: this.resource.id,
      resourceHumanName: this.resource.resourceType.human_name,
      resourceTypingName: this.resource.resourceTypingName,
      nodeExtension: this.resource.fsNode.getExtension(),
    };

    this.dialogService.openMediumDialog(LiImportResourceDialogComponent, { data: input });
  }

  updateResourceType(): void {
    this.dialogService
      .openSmallDialog(LiUpdateResourceTypeComponent, { data: this.resource })
      .afterClosed()
      .subscribe((updatedResource) => this.onUpdateResourceClosed(updatedResource));
  }

  openUpdateName(): void {
    this.dialogService
      .openSmallDialog(LiUpdateResourceNameDialogComponent, { data: this.resource })
      .afterClosed()
      .subscribe((updatedResource) => this.onUpdateResourceClosed(updatedResource));
  }

  private onUpdateResourceClosed(resource?: LiResource): void {
    if (resource) {
      this.update.next(resource);
    }
  }

  openUpdateFolder(): void {
    const data: LiResourceUpdateFolderDialogInput = {
      resourceId: this.resource.id,
      scenario: this.resource.scenario,
      folder: this.resource.folder,
    };
    this.dialogService
      .openSmallDialog(LiResourceUpdateFolderDialogComponent, { data: data })
      .afterClosed()
      .subscribe((folder) => this.updateFolderClosed(folder));
  }

  private updateFolderClosed(result?: LiResourceUpdateFolderDialogOutput): void {
    if (result) {
      this.resource.folder = result.folder;
      this.update.next(this.resource);
    }
  }

  openShareDialog(): void {
    const data: LiSharedEntityInfoDialogInput = {
      entityType: 'RESOURCE',
      entityId: this.resource.id,
      autoSendConfig: {
        title: 'li.send_resource_to_lab',
        helpText: 'li.send_entity_to_lab_help',
        specs$: this.resourceService.getExportToLabConfigSpecs(),
      },
      autoSend: (configValues) => this.resourceService.exportResourceToLab(this.resource.id, configValues),
      shareResourceWithSpaceConfig: {
        resource: this.resource,
      },
    };

    this.dialogService.openMediumDialog(LiSharedEntityInfoDialogComponent, { data, autoFocus: false });
  }

  openTagDialog(): void {
    const data: LiManageEntityTagsDialogInput = {
      entityType: 'RESOURCE',
      entityId: this.resource.id,
      tags: this.tagService.getEntityTagsDatasource('RESOURCE', this.resource.id),
    };
    this.dialogService.openSmallDialog(LiManageEntityTagsDialogComponent, {
      data: data,
      autoFocus: false,
    });
  }

  deleteResource(): void {
    let confirmImpactHelpText: FlTranslatableText;
    // build the confirmation message
    let confirmation = `<p>${this.translateService.translate('li.delete_resource_confirmation')}</p>`;

    // for imported or transformed resources, we add an info message
    if (this.resource.scenario) {
      confirmation += `<p>${this.translateService.translate(
        'li.delete_generated_resource_confirmation',
        { param: { scenarioTitle: this.resource.scenario.title } }
      )}</p>`;

      const deleteResourceWithExp = this.translateService.translate(
        'li.delete_resource_with_exp_confirm_impact',
        { param: { title: this.resource.name, scenarioTitle: this.resource.scenario.title } }
      );
      const resetProcessImpact = this.translateService.translate('li.scenario_ressource_used_after', {
        param: { title: this.resource.scenario.title },
      });
      confirmImpactHelpText = {
        text: `<p>${deleteResourceWithExp}</p><p>${resetProcessImpact}</p>`,
        translateText: false,
      };
    } else {
      confirmImpactHelpText = {
        text: 'li.delete_resource_confirm_impact',
        translateText: true,
        translateParam: {
          param: { title: this.resource.name },
        },
      };
    }

    const impactData: LiNavigableImpactConfig = {
      title: 'li.delete_resource',
      confirmImpactConfirmText: confirmImpactHelpText,
      noImpactConfirmText: { text: confirmation, translateText: false },
      checkImpact: () => this.resourceService.checkImpactForDeleteResource(this.resource.id),
      callAction: () => this.resourceService.delete(this.resource.id),
    };

    this.labImpactedService
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onResourceDeleteSuccess(result));
  }

  private onResourceDeleteSuccess(result: FlPortalActionResult): void {
    if (result.status === 'success') {
      if (this.resource.scenario) {
        this.snackBarService.openSuccessMessage({
          text: 'li.resource_and_scenario_deleted',
          translateText: true,
        });
      } else {
        this.snackBarService.openSuccessMessage({ text: 'li.resource_deleted', translateText: true });
      }
      this.delete.next(this.resource);
    }
  }
}
