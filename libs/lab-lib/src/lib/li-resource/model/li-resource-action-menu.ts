import { Injector } from '@angular/core';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicInput } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalActionResult } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { LiResource, LiResourceService, LiRouterService } from '@monorepo/lab-lib/li-core';
import { LiEntityActionMenu } from '@monorepo/lab-lib/li-entity';
import { LiNavigableEntityService, LiNavigableImpactConfig } from '@monorepo/lab-lib/li-navigable-entity';
import { LiSharedEntityInfoDialogComponent, LiSharedEntityInfoDialogInput } from '@monorepo/lab-lib/li-share';
import { Observable } from 'rxjs';

import {
  LiImportResourceDialogComponent,
  LiImportResourceDialogInput,
} from '../component/li-import-resource-dialog/li-import-resource-dialog.component';
import {
  LiResourceUpdateFolderDialogComponent,
  LiResourceUpdateFolderDialogInput,
  LiResourceUpdateFolderDialogOutput,
} from '../component/li-resource-update-folder-dialog/li-resource-update-folder-dialog.component';
import { LiUpdateResourceNameDialogComponent } from '../component/li-update-resource-name-dialog/li-update-resource-name-dialog.component';
import { LiUpdateResourceTypeComponent } from '../component/li-update-resource-type/li-update-resource-type.component';
import { LiResourceDownloadService } from '../service/li-resource-download.service';

export type LiResourceActionEvent = {
  action: 'update' | 'delete';
  resource: LiResource;
};

export interface LiResourceActionMenuOptions {
  readOnly?: boolean;
  extraItems?: FlMenuDynamic[];
}

/**
 * Class-based action menu for resources.
 * Follows the same pattern as LiScenarioActionMenu.
 */
export class LiResourceActionMenu extends LiEntityActionMenu {
  constructor(
    injector: Injector,
    protected resource: LiResource,
    protected options: LiResourceActionMenuOptions = {}
  ) {
    super(injector);
  }

  public openActionMenu(event: MouseEvent): Observable<LiResourceActionEvent> {
    const menu = this.buildStaticMenu();

    return this.generateMenu(menu, event);
  }

  //////////////////////////////////// MENU BUILDER ////////////////////////////////////

  private buildStaticMenu(): FlMenuDynamicInput {
    const menu: FlMenuDynamicInput = [];

    if (!this.options.readOnly && this.resource.isFsNode()) {
      menu.push(this.getImportButton());
    }

    if (this.resource.isDownloadable) {
      menu.push(this.getDownloadButton());
    }

    if (this.resource.contentIsDeleted && this.resource.origin === 'IMPORTED_FROM_LAB') {
      menu.push(this.getDownloadFromOriginButton());
    }

    if (this.resource.isUpdatable()) {
      menu.push(this.getRenameButton());
      menu.push(this.getFolderButton());
    }

    menu.push(this.getTagsButton('RESOURCE', this.resource.id));
    menu.push(this.getShareButton());

    if (this.resource.canUpdateType() && !this.options.readOnly) {
      menu.push(this.getUpdateTypeButton());
    }

    menu.push(this.getDocLinkButton());

    if (this.options.extraItems?.length) {
      menu.push(...this.options.extraItems);
    }

    const extensions$ = this.getExtensionsButton('RESOURCE', this.resource.id);
    menu.push(extensions$);

    if (this.resource.isDeletable() && !this.options.readOnly) {
      menu.push(this.getDeleteButton());
    }

    return menu;
  }

  //////////////////////////////////// BUTTONS ////////////////////////////////////

  private getImportButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.import_resource',
      icon: 'system_update_alt',
      color: 'primary',
      onClick: () => this.openImportResource(),
    };
  }

  private getDownloadButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.download_resource',
      icon: 'cloud_download',
      onClick: () => this.downloadResource(),
    };
  }

  private getDownloadFromOriginButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.download_content_from_origin_lab',
      icon: 'cloud_sync',
      onClick: () => this.downloadContentFromOriginLab(),
    };
  }

  private getRenameButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.update_resource_name',
      icon: 'edit',
      onClick: () => this.openUpdateName(),
    };
  }

  private getFolderButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.update_folder',
      icon: 'folder',
      onClick: () => this.openUpdateFolder(),
    };
  }

  private getShareButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.share',
      icon: 'share',
      onClick: () => this.openShareDialog(),
    };
  }

  private getUpdateTypeButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.update_resource_type',
      icon: 'edit',
      onClick: () => this.updateResourceType(),
    };
  }

  private getDocLinkButton(): FlMenuDynamic {
    const route = LiRouterService.getTechnicalDocRoute(this.resource.resourceTypingName.replaceAll('-', '.'));
    return {
      type: 'link',
      text: 'li.resource_doc',
      icon: 'help',
      link: route,
    };
  }

  private getDeleteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.delete_resource',
      icon: 'delete',
      color: 'warn',
      divider: true,
      onClick: () => this.deleteResource(),
    };
  }

  //////////////////////////////////// ACTIONS ////////////////////////////////////

  private downloadResource(): void {
    this.injector.get(LiResourceDownloadService).downloadResource(this.resource);
  }

  private downloadContentFromOriginLab(): void {
    const input: FlConfirmDialogInput = {
      title: { text: 'li.download_content_from_origin_lab', translateText: true },
      content: { text: 'li.download_content_from_origin_lab_confirm', translateText: true },
      observable: this.injector.get(LiResourceService).downloadContent(this.resource.id),
      successMessage: { text: 'li.download_content_from_origin_lab_success', translateText: true },
    };
    this.injector.get(FlDialogService).openConfirmDialog(input);
  }

  private openImportResource(): void {
    const input: LiImportResourceDialogInput = {
      resourceId: this.resource.id,
      resourceHumanName: this.resource.resourceType.human_name,
      resourceTypingName: this.resource.resourceTypingName,
      nodeExtension: this.resource.fsNode.getExtension(),
    };

    this.injector.get(FlDialogService).openMediumDialog(LiImportResourceDialogComponent, { data: input });
  }

  private updateResourceType(): void {
    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiUpdateResourceTypeComponent, { data: this.resource })
      .afterClosed()
      .subscribe((updatedResource) => this.onUpdateResourceClosed(updatedResource));
  }

  private openUpdateName(): void {
    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiUpdateResourceNameDialogComponent, { data: this.resource })
      .afterClosed()
      .subscribe((updatedResource) => this.onUpdateResourceClosed(updatedResource));
  }

  private onUpdateResourceClosed(resource?: LiResource): void {
    if (resource) {
      this.subject.next({ action: 'update', resource });
    }
    this.subject.complete();
  }

  private openUpdateFolder(): void {
    const data: LiResourceUpdateFolderDialogInput = {
      resourceId: this.resource.id,
      scenario: this.resource.scenario,
      folder: this.resource.folder,
    };
    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiResourceUpdateFolderDialogComponent, { data })
      .afterClosed()
      .subscribe((result) => this.updateFolderClosed(result));
  }

  private updateFolderClosed(result?: LiResourceUpdateFolderDialogOutput): void {
    if (result) {
      this.resource.folder = result.folder;
      this.subject.next({ action: 'update', resource: this.resource });
    }
    this.subject.complete();
  }

  private openShareDialog(): void {
    const resourceService = this.injector.get(LiResourceService);
    const data: LiSharedEntityInfoDialogInput = {
      entityType: 'RESOURCE',
      entityId: this.resource.id,
      autoSendConfig: {
        title: 'li.send_resource_to_lab',
        helpText: 'li.send_entity_to_lab_help',
        specs$: resourceService.getExportToLabConfigSpecs(),
      },
      autoSend: (configValues) => resourceService.exportResourceToLab(this.resource.id, configValues),
      shareResourceWithSpaceConfig: {
        resource: this.resource,
      },
    };

    this.injector
      .get(FlDialogService)
      .openMediumDialog(LiSharedEntityInfoDialogComponent, { data, autoFocus: false })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private deleteResource(): void {
    const resourceService = this.injector.get(LiResourceService);
    const translateService = this.injector.get(FlTranslateService);

    let confirmImpactHelpText: FlTranslatableText;
    let confirmation = `<p>${translateService.translate('li.delete_resource_confirmation')}</p>`;

    if (this.resource.scenario) {
      confirmation += `<p>${translateService.translate('li.delete_generated_resource_confirmation', {
        param: { scenarioTitle: this.resource.scenario.title },
      })}</p>`;

      const deleteResourceWithExp = translateService.translate('li.delete_resource_with_exp_confirm_impact', {
        param: { title: this.resource.name, scenarioTitle: this.resource.scenario.title },
      });
      const resetProcessImpact = translateService.translate('li.scenario_ressource_used_after', {
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
      checkImpact: () => resourceService.checkImpactForDeleteResource(this.resource.id),
      callAction: () => resourceService.delete(this.resource.id),
    };

    this.injector
      .get(LiNavigableEntityService)
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onResourceDeleteSuccess(result));
  }

  private onResourceDeleteSuccess(result: FlPortalActionResult): void {
    if (result.status === 'success') {
      const snackBarService = this.injector.get(FlSnackBarService);
      if (this.resource.scenario) {
        snackBarService.openSuccessMessage({
          text: 'li.resource_and_scenario_deleted',
          translateText: true,
        });
      } else {
        snackBarService.openSuccessMessage({ text: 'li.resource_deleted', translateText: true });
      }
      this.subject.next({ action: 'delete', resource: this.resource });
    }
    this.subject.complete();
  }
}
