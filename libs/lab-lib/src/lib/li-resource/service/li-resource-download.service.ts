import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { inject, Injectable } from '@angular/core';
import {
  LiFileResourceService,
  LiProcessType,
  LiResource,
  LiResourceService,
} from '@monorepo/lab-lib/li-core';
import { Observable, of } from 'rxjs';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { mergeMap } from 'rxjs/operators';
import {
  LiQuickConfigureProcessDialogComponent,
  LiQuickConfigureProcessDialogInput,
} from '@monorepo/lab-lib/li-process';

/**
 * Service to download any downloadable resource
 */
@Injectable({ providedIn: 'root' })
export class LiResourceDownloadService {
  private resourceService = inject(LiResourceService);
  private dialogService = inject(FlDialogService);
  private fileService = inject(LiFileResourceService);
  private actionService = inject(FlPortalActionsService);

  private readonly downloadAction = 'download-resource';

  /**
   * Download any downloadable resource
   * @param resource
   */
  public downloadResource(resource: LiResource): void {
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

  private downloadBasicResource(resource: LiResource): Observable<LiResource> {
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
  private openExporterConfig(resource: LiResource, exporterType: LiProcessType): Observable<LiResource> {
    // if there is no config, call it directly without config
    if (!exporterType.hasConfigSpecs()) {
      return this.exportResource(resource.id, exporterType.typingName, {});
    }

    const input: LiQuickConfigureProcessDialogInput = {
      specs$: of(exporterType.configSpecs),
      title: 'biox.download_resource_title',
    };

    // open the configuration dialog
    return this.dialogService
      .openMediumDialog(LiQuickConfigureProcessDialogComponent, { data: input })
      .afterClosed()
      .pipe(mergeMap((config) => this.exportResource(resource.id, exporterType.typingName, config)));
  }

  private exportResource(
    resourceId: string,
    exporterTypingName: string,
    config?: TdParamSpecsValues
  ): Observable<LiResource> {
    // cancel the process
    if (config == null) {
      throw Error('Canceled');
    }

    return this.resourceService.exportResource(resourceId, exporterTypingName, config);
  }

  // on dialog closed, download the resource with the configuration (if it exists)
  private callDownloadResource(result: FlPortalActionResult<LiResource>): void {
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
