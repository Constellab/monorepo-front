import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlBlobToSrcPipe } from './fl-blob-to-src/fl-blob-to-src.pipe';
import { FlByteTextPipe } from './fl-byte-text/fl-byte-text.pipe';
import { FlCallMethodPipe } from './fl-call-method/fl-call-method.pipe';
import { FL_CORE_PIPE_I18N } from './fl-core-pipe.i18n';
import { FlDatasourceConnectPipe } from './fl-datasource-connect/fl-datasource-connect.pipe';
import { FlDebugPipe } from './fl-debug/fl-debug.pipe';
import { FlErrorRequiredPipe } from './fl-error-required/fl-error-required.pipe';
import { FlIsNotEmptyPipe } from './fl-is-not-empty/fl-is-not-empty.pipe';
import { FlObjectKeysPipe } from './fl-object-keys/fl-object-keys.pipe';
import { FlYesNoPipe } from './fl-yes-no/fl-yes-no.pipe';

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

    translateService.addModuleTranslation('FlCorePipeModule', FL_CORE_PIPE_I18N);
  }
}
