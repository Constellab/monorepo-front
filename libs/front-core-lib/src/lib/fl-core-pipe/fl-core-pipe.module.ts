import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlErrorRequiredPipe } from './fl-error-required/fl-error-required.pipe';
import { FlObjectKeysPipe } from './fl-object-keys/fl-object-keys.pipe';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlDebugPipe } from './fl-debug/fl-debug.pipe';
import { FlYesNoPipe } from './fl-yes-no/fl-yes-no.pipe';
import { FlBlobToSrcPipe } from './fl-blob-to-src/fl-blob-to-src.pipe';
import { FlCallMethodPipe } from './fl-call-method/fl-call-method.pipe';
import { FlByteTextPipe } from './fl-byte-text/fl-byte-text.pipe';
import { FlIsNotEmptyPipe } from './fl-is-not-empty/fl-is-not-empty.pipe';
import { FlDatasourceConnectPipe } from './fl-datasource-connect/fl-datasource-connect.pipe';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { flCorePipeI18n } from './fl-core-pipe.i18n';

/**
 * Core module containing pipes
 */
@NgModule({
  declarations: [
    FlErrorRequiredPipe,
    FlObjectKeysPipe,
    FlDebugPipe,
    FlYesNoPipe,
    FlBlobToSrcPipe,
    FlCallMethodPipe,
    FlByteTextPipe,
    FlIsNotEmptyPipe,
    FlDatasourceConnectPipe,
  ],
  exports: [
    FlErrorRequiredPipe,
    FlObjectKeysPipe,
    FlDebugPipe,
    FlYesNoPipe,
    FlBlobToSrcPipe,
    FlCallMethodPipe,
    FlByteTextPipe,
    FlIsNotEmptyPipe,
    FlDatasourceConnectPipe,
  ],
  imports: [CommonModule, FlTranslateModule],
})
export class FlCorePipeModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlCorePipeModule', flCorePipeI18n);
  }
}
