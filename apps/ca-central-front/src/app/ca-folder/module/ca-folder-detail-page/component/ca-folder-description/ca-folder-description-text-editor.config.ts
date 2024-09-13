import {CaFolderService} from '../../../../../ca-core/service-api/ca-folder.service';
import {first, mergeMap, Observable} from 'rxjs';
import {TeCompleteConfig, TeFigureBlockConfig, TeTools, TeUploadedImage} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';

export class CaFolderDescriptionTextEditorImageConfig implements TeFigureBlockConfig {

  private folderId: string;

  constructor(private folderId$: Observable<string>,
              private folderService: CaFolderService) {
    // TODO TO IMPROVE
    this.folderId$.subscribe(folderId => this.folderId = folderId);
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.folderId$.pipe(
      first(),
      mergeMap(
        folderId => this.folderService.uploadDescriptionImage(folderId, file)
      )
    );
  }

  getImageUrl(filename: string): string {
    return this.folderService.getDescriptionImageUrl(this.folderId, filename);
  }


}

/**
 * Config for the text editor in the report to support view in the editor
 */
export class CaFolderDescriptionTextEditorConfig extends TeCompleteConfig {

  constructor(private folderId$: Observable<string>,
              private folderService: CaFolderService) {
    super({includeToolbarButton: true});
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaFolderDescriptionTextEditorImageConfig(this.folderId$, this.folderService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    return tools;
  }
}
