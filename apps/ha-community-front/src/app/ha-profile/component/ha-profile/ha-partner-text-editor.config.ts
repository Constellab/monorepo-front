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

import { HaFile } from '../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaPartnerService } from '../../../ha-core/ha-service/ha-partner.service';

export class HaPartnerTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(
    private partnerService: HaPartnerService,
    private partnerId: string
  ) {}

  imageUploader(file: File): Observable<TeBlockFigureUploadedResponse> {
    return this.partnerService.uploadImage(file, this.partnerId);
  }

  getImageUrl(filename: string): string {
    return ClStringHelper.isHttpLink(filename)
      ? filename
      : this.partnerService.getImageUrl(this.partnerId, filename);
  }
}

export class HaPartnerTextEditorFileConfig implements TeFileBlockConfig {
  constructor(
    private partnerService: HaPartnerService,
    private partnerId: string
  ) {}

  fileUploader(file: File): Observable<HaFile> {
    return this.partnerService.uploadFile(file, this.partnerId);
  }

  getFileUrl(filename: string): string {
    return this.partnerService.getFilePath(this.partnerId, filename);
  }
}

export class HaPartnerTextEditorConfig extends TeCompleteConfig {
  constructor(
    private partnerService: HaPartnerService,
    private partnerId: string,
    private withFile: boolean = true
  ) {
    super();
  }

  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    if (this.withFile) {
      const imageConfig = new HaPartnerTextEditorImageConfig(this.partnerService, this.partnerId);
      tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

      const fileConfig = new HaPartnerTextEditorFileConfig(this.partnerService, this.partnerId);
      tools.file = this.getFileConfig(fileConfig, envInjector, applicationRef);
    }

    return tools;
  }
}
