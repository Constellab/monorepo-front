import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener, Inject,
  Input, OnInit, PLATFORM_ID,
  QueryList,
  ViewChildren
} from '@angular/core';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

export interface HaDocTitle {
  title: string;
  id: string;
  level: number;
}

@Component({
  selector: 'ha-public-brick-right-panel',
  templateUrl: './ha-public-brick-right-panel.component.html',
  styleUrls: ['./ha-public-brick-right-panel.component.scss']
})
export class HaPublicBrickRightPanelComponent implements OnInit{

  @Input()
  brickName: string;
  @Input()
  brickVersion: string;
  @Input()
  currentPage: string;
  @Input()
  docTitles?: HaDocTitle[];

  @Input()
  currentPageAsTranslation: boolean = false;

  DOC_TITLES_KEY: StateKey<object>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState,
  ) {
  }

  ngOnInit(): void {
    this.DOC_TITLES_KEY = makeStateKey<object>('docTitles');

    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOC_TITLES_KEY)) {
      this.docTitles = this.transferState.get(this.DOC_TITLES_KEY, null) as HaDocTitle[];
      this.transferState.remove(this.DOC_TITLES_KEY);
    }

    if (isPlatformServer(this.platformId) && !this.transferState.hasKey(this.DOC_TITLES_KEY)) {
      this.transferState.set(this.DOC_TITLES_KEY, this.docTitles);
    }
  }
}
