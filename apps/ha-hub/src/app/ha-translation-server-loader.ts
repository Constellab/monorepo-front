import {Observable} from 'rxjs';
import {TranslateLoader} from '@ngx-translate/core';

import {makeStateKey, StateKey, TransferState} from '@angular/core';
import {dirname, resolve} from 'path';
import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {environment} from '../environments/ha-environment';

export class TranslateServerLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private filenames: string[] = [''],
    private prefix: string = 'i18n',
    private suffix: string = '.json',
  ) {
  }

  public getTranslation(lang: string): Observable<any> {
    const jsonData = {};
    return new Observable((observer) => {
      if (typeof window === 'undefined') {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        for (const file of this.filenames) {
          Object.assign(jsonData, JSON.parse(
            environment.production ?
              readFileSync(resolve(__dirname, `../browser/assets/i18n/${file}${lang}${this.suffix}`), 'utf8') :
              readFileSync(resolve(__dirname, `../../../apps/ha-hub/src/assets/i18n/${file}${lang}${this.suffix}`), 'utf8')
          ));
          // eslint-disable-next-line max-len
          // Object.assign(jsonData, JSON.parse(readFileSync(resolve(__dirname, `../browser/assets/i18n/${file}${lang}${this.suffix}`), 'utf8')));
        }

        // Here we save the translations in the transfer-state
        const key: StateKey<number> = makeStateKey<number>(
          'transfer-translate-' + lang
        );
        this.transferState.set(key, jsonData);
        observer.next(jsonData);
        observer.complete();
      }
    });
  }
}
