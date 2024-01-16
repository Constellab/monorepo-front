import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {TeCompleteConfig, TeFigureBlockConfig, TeTools, TeUploadedImage} from '@monorepo/text-editor';
import {Observable} from 'rxjs';
import {ClStringHelper} from '@monorepo/core-lib';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';

export class HaLiveTaskTextEditorImageConfig implements TeFigureBlockConfig {

  constructor(private liveTaskService: HaLiveTaskService,
              private liveTaskId: string) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.liveTaskService.uploadImage(file, this.liveTaskId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename) ? filename : this.liveTaskService.getImageUrl(filename);
  }
}

export class HaLiveTaskTextEditorConfig extends TeCompleteConfig {

  constructor(private liveTaskService: HaLiveTaskService,
              private liveTaskId: string) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new HaLiveTaskTextEditorImageConfig(this.liveTaskService, this.liveTaskId);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    return tools;
  }
}
