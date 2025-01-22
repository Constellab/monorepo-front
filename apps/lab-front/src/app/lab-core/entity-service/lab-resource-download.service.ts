import { Injectable, inject } from '@angular/core';
import { LabResource } from '../model/entities/resource/lab-resource.entity';
import { FlDialogService, FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib';
import { LabFileResourceService } from './lab-file-resource.service';
import { LabResourceService } from './lab-resource.service';
import { LabProcessType } from '../model/entities/lab-type/lab-process-type.entity';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PrConfigValues } from '@monorepo/protocol';
import {
  LabQuickConfigureProcessDialogComponent,
  LabQuickConfigureProcessDialogInput,
} from '../entity-module/lab-process-core/component/lab-quick-configure-process-dialog/lab-quick-configure-process-dialog.component';

/**
 * Service to download any downloadable resource
 */
@Injectable({ providedIn: 'root' })
export class LabResourceDownloadService {
  private resourceService = inject(LabResourceService);
  private dialogService = inject(FlDialogService);
  private fileService = inject(LabFileResourceService);
  private actionService = inject(FlPortalActionsService);

  private readonly downloadAction = 'download-resource';

  /**
   * Download any downloadable resource
   * @param resource
   */
  public downloadResource(resource: LabResource): void {
    // if it's a fsNode, directly download it, otherwise, call exporter
    if (resource.isFile()) {
      this.fileService.downloadFile(resource.id);
      return;
    }

    const action = this.actionService.addAction(
      {
        type: this.downloadAction,
        text: {
          text: 'biox.preparing_resource_download',
          translateText: true,
          translateParam: { param: { resourceName: resource.name } },
        },
        action: this.downloadBasicResource(resource),
      },
      true
    );
    action.subscribe((result) => this.callDownloadResource(result));
  }

  private downloadBasicResource(resource: LabResource): Observable<LabResource> {
    return this.resourceService
      .getResourceExporterConfig(resource.resourceTypingName)
      .pipe(mergeMap((type) => this.openExporterConfig(resource, type)));
  }

  /**
   * Once we got the configuration of the task, open the Dialog to configure it
   * @param resource
   * @param exporterType
   * @private
   */
  private openExporterConfig(resource: LabResource, exporterType: LabProcessType): Observable<LabResource> {
    // if there is no config, call it directly without config
    if (!exporterType.hasConfigSpecs()) {
      return this.exportResource(resource.id, exporterType.typingName, {});
    }

    const input: LabQuickConfigureProcessDialogInput = {
      specs$: of(exporterType.configSpecs),
      title: 'biox.download_resource_title',
    };

    // open the configuration dialog
    return this.dialogService
      .openMediumDialog(LabQuickConfigureProcessDialogComponent, { data: input })
      .afterClosed()
      .pipe(mergeMap((config) => this.exportResource(resource.id, exporterType.typingName, config)));
  }

  private exportResource(
    resourceId: string,
    exporterTypingName: string,
    config?: PrConfigValues
  ): Observable<LabResource> {
    // cancel the process
    if (config == null) {
      throw Error('Canceled');
    }

    return this.resourceService.exportResource(resourceId, exporterTypingName, config);
  }

  // on dialog closed, download the resource with the configuration (if it exists)
  private callDownloadResource(result: FlPortalActionResult<LabResource>): void {
    if (result.status !== 'success') return;

    const resource = result.result;
    // cancel the process
    if (resource == null) {
      throw Error('Canceled');
    }

    if (!resource.isFile()) {
      throw Error('Error during the exporter, the resource is not a file');
    }

    this.fileService.downloadFile(resource.id);
  }
}
