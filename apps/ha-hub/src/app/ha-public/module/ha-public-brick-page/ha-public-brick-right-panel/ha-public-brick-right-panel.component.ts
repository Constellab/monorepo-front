import {Component, Inject, Input, makeStateKey, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {BlockToolData} from '@editorjs/editorjs/types/tools';

@Component({
  selector: 'ha-public-brick-right-panel',
  templateUrl: './ha-public-brick-right-panel.component.html',
  styleUrls: ['./ha-public-brick-right-panel.component.scss']
})
export class HaPublicBrickRightPanelComponent implements OnInit {

  @Input() brickName: string;
  @Input() docTitles?: BlockToolData[];

  DOC_TITLES_KEY: StateKey<object>;

  constructor(@Inject(PLATFORM_ID) private platformId: object,
              private transferState: TransferState) {
  }

  ngOnInit(): void {
    this.DOC_TITLES_KEY = makeStateKey<object>('docTitles');

    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOC_TITLES_KEY)) {
      this.docTitles = this.transferState.get(this.DOC_TITLES_KEY, null) as BlockToolData[];
      this.transferState.remove(this.DOC_TITLES_KEY);
    }

    if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.DOC_TITLES_KEY)) {
      this.transferState.set(this.DOC_TITLES_KEY, this.docTitles);
    }
  }
}
