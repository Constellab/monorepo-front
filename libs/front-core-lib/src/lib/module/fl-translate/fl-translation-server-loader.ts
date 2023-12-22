import {Observable} from 'rxjs';
import {TranslateLoader} from '@ngx-translate/core';

// import * as fs from 'fs';
// import * as path from 'path';
import {makeStateKey, StateKey, TransferState} from '@angular/core';

export class TranslateServerLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private filenames: string[] = [''],
    private prefix: string = 'i18n',
    private suffix: string = '.json'
  ) {
  }

  public getTranslation(lang: string): Observable<any> {
    const jsonData = {};
    return new Observable((observer) => {

      // for (const file of this.filenames) {
      //   Object.assign(jsonData, JSON.parse(
      //     fs.readFileSync(path.resolve(__dirname, `../browser/assets/i18n/${file}${lang}${this.suffix}`), 'utf8')
      //   ));
      // }


      // Here we save the translations in the transfer-state
      const key: StateKey<number> = makeStateKey<number>(
        'transfer-translate-' + lang
      );
      this.transferState.set(key, jsonData);

      observer.next(jsonData);
      observer.complete();
    });
  }
}
