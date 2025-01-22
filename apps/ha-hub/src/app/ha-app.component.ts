import { Component, makeStateKey, OnInit, PLATFORM_ID, TransferState, inject } from '@angular/core';

import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'ha-monorepo-root',
  templateUrl: './ha-app.component.html',
  styleUrls: ['./ha-app.component.scss'],
  standalone: false,
})
export class HaAppComponent implements OnInit {
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  title = 'ha-documentation';
  message: string;

  ngOnInit(): void {
    const MESSAGE_KEY = makeStateKey<string>('message');

    if (isPlatformServer(this.platformId)) {
      this.transferState.set(MESSAGE_KEY, this.message);
    } else {
      this.message = this.transferState.get(MESSAGE_KEY, '');
      this.transferState.remove(MESSAGE_KEY);
    }
  }
}
