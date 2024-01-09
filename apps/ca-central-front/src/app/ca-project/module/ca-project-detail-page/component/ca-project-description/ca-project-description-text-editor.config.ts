import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {first, mergeMap, Observable} from 'rxjs';
import {TeCompleteConfig, TeFigureBlockConfig, TeTools, TeUploadedImage} from '@monorepo/text-editor';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';

export class CaProjectDescriptionTextEditorImageConfig implements TeFigureBlockConfig {

  private projectId: string;

  constructor(private projectId$: Observable<string>,
              private projectService: CaProjectService) {
    // TODO TO IMPROVE
    this.projectId$.subscribe(projectId => this.projectId = projectId);
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.projectId$.pipe(
      first(),
      mergeMap(
        projectId => this.projectService.uploadDescriptionImage(projectId, file)
      )
    );
  }

  getImageUrl(filename: string): string {
    return this.projectService.getDescriptionImageUrl(this.projectId, filename);
  }


}

/**
 * Config for the text editor in the report to support view in the editor
 */
export class CaProjectDescriptionTextEditorConfig extends TeCompleteConfig {


  constructor(private projectId$: Observable<string>,
              private projectService: CaProjectService) {
    super();
  }

  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new CaProjectDescriptionTextEditorImageConfig(this.projectId$, this.projectService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    return tools;
  }
}
