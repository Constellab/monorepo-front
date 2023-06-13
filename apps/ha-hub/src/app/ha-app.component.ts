import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'ha-monorepo-root',
  templateUrl: './ha-app.component.html',
  styleUrls: ['./ha-app.component.scss'],
})
export class HaAppComponent implements OnInit {
  title = 'ha-documentation';
  message: string;

  constructor(private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId: object) {
  }

  ngOnInit(): void {

    const MESSAGE_KEY = makeStateKey<string>('message');

    if(isPlatformServer(this.platformId)) {
      this.transferState.set(MESSAGE_KEY, this.message);
    } else {
      this.message = this.transferState.get(MESSAGE_KEY, '');
      this.transferState.remove(MESSAGE_KEY);
    }
  }

}
