import { ApplicationRef, EnvironmentInjector } from '@angular/core';
import { ClStringHelper } from '@monorepo/core-lib';
import {
  TeBlockFigureUploadedResponse,
  TeCompleteConfig,
  teComponentBlockFactory,
  TeFigureBlockConfig,
  TeFileBlockConfig,
  TeTools,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { HaFile } from '../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAgentContentViewBlock } from '../ha-agent-view/ha-agent-content-view.class';

export class HaAgentTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private agentService: HaAgentService,
    private agentId: string
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.agentService.uploadImage(file, this.agentId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename)
      ? filename
      : this.agentService.getImageUrl(this.agentId, filename);
  }
}

export class HaAgentTextEditorFileConfig implements TeFileBlockConfig {
  constructor(
    private agentService: HaAgentService,
    private agentId: string
  ) {}

  fileUploader(file: File): Observable<HaFile> {
    return this.agentService.uploadFile(file, this.agentId);
  }

  getFileUrl(filename: string): string {
    return this.agentService.getFilePath(this.agentId, filename);
  }
}

export class HaAgentTextEditorConfig extends TeCompleteConfig {
  constructor(
    private agentService: HaAgentService,
    private agentId: string,
    private withFile: boolean = true
  ) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    if (this.withFile) {
      // configure and add the image block
      const imageConfig = new HaAgentTextEditorImageConfig(this.agentService, this.agentId);
      tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

      // configure and add the file block
      const fileConfig = new HaAgentTextEditorFileConfig(this.agentService, this.agentId);
      tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);

      // add the view block
      tools.resourceView = teComponentBlockFactory(
        HaAgentContentViewBlock,
        envInjector,
        applicationRef,
        this.agentId
      );
    }

    return tools;
  }
}
