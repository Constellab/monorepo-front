import { HaLiveTaskService } from '../../../ha-core/ha-service/ha-live-task.service';
import {
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeTools,
  TeUploadedImage
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { ClStringHelper } from '@monorepo/core-lib';
import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { HaFile } from '../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaLiveTaskContentViewBlock } from '../ha-live-task-view/ha-live-task-content-view.class';

export class HaLiveTaskTextEditorImageConfig implements TeFigureBlockConfig {

  constructor(private liveTaskService: HaLiveTaskService,
              private liveTaskId: string) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.liveTaskService.uploadImage(file, this.liveTaskId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename) ? filename : this.liveTaskService.getImageUrl(this.liveTaskId, filename);
  }
}

export class HaLiveTaskTextEditorFileConfig implements TeFileBlockConfig {

  constructor(private liveTaskService: HaLiveTaskService,
              private liveTaskId: string) {
  }

  fileUploader(file: File): Observable<HaFile> {
    return this.liveTaskService.uploadFile(file, this.liveTaskId);
  }

  getFileUrl(filename: string): string {
    return this.liveTaskService.getFilePath(this.liveTaskId, filename);
  }
}

export class HaLiveTaskTextEditorConfig extends TeCompleteConfig {

  constructor(private liveTaskService: HaLiveTaskService,
              private liveTaskId: string,
              private withFile: boolean = true) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    if (this.withFile){
      // configure and add the image block
      const imageConfig = new HaLiveTaskTextEditorImageConfig(this.liveTaskService, this.liveTaskId);
      tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

      // configure and add the file block
      const fileConfig = new HaLiveTaskTextEditorFileConfig(this.liveTaskService, this.liveTaskId);
      tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

      // add the view block
      tools.resourceView = teComponentBlockFactory(HaLiveTaskContentViewBlock, envInjector, applicationRef, this.liveTaskId);
    }


    return tools;
  }
}
