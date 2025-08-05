import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { ClStringHelper } from '@monorepo/core-lib';
import {
  TeBlockFigureUploadedResponse,
  TeCompleteConfig,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeTools,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { HaCommunityAppService } from '../../ha-core/ha-service/ha-community-app.service';

export class HaCommunityAppTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private appId: string,
    private appService: HaCommunityAppService
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.appService.uploadImage(file, this.appId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename) ? filename : this.appService.getImageUrl(this.appId, filename);
  }
}

export class HaCommunityAppTextEditorFileConfig implements TeFileBlockConfig {
  constructor(
    private appId: string,
    private appService: HaCommunityAppService
  ) {}

  fileUploader(file: File): Observable<any> {
    return this.appService.uploadFile(file, this.appId);
  }

  getFileUrl(filename: string): string {
    return this.appService.getAppFilePath(this.appId, filename);
  }
}

export class HaCommunityAppTextEditorConfig extends TeCompleteConfig {
  constructor(
    private appService: HaCommunityAppService,
    private appId: string
  ) {
    super();
    this.figureConfig = new HaCommunityAppTextEditorImageConfig(appId, appService);
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    tools.figure = this.getImageConfig(this.figureConfig, envInjector, applicationRef);

    // configure and add the file block
    const fileConfig = new HaCommunityAppTextEditorFileConfig(this.appId, this.appService);
    tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

    // TODO: add the view block
    // add the view block
    // tools.resourceView = teComponentBlockFactory(
    //   HaStoryContentViewBlock,
    //   envInjector,
    //   applicationRef,
    //   this.appId
    // );

    return tools;
  }
}
