import { CdkScrollable } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix, MatSuffix } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ClHelpService, ClStringHelper, ClTheme } from '@monorepo/core-lib';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { BaseHit } from 'instantsearch.js';
import { connectHits, connectSearchBox } from 'instantsearch.js/es/connectors';
import { configure, poweredBy } from 'instantsearch.js/es/widgets';

import { HaInstantSearchService } from '../../ha-service/ha-instant-search.service';

export class HaInstanceSearchDialogData {
  theme: ClTheme;
}

@Component({
  selector: 'ha-ha-instant-search-dialog',
  imports: [
    MatInput,
    MatFormField,
    MatIcon,
    MatPrefix,
    RouterLink,
    CdkScrollable,
    MatSuffix,
    NgClass,
    FlTranslateModule,
    MatDialogContent,
  ],
  templateUrl: './ha-instant-search-dialog.component.html',
  styleUrl: './ha-instant-search-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HaInstantSearchDialogComponent implements AfterContentInit, OnDestroy {
  private instantSearchService = inject(HaInstantSearchService);
  private dialogRef = inject<MatDialogRef<HaInstantSearchDialogComponent>>(MatDialogRef);
  private router = inject(Router);

  @HostListener('keydown', ['$event'])
  stopEventPropagation(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.dialogRef.close();
    else if (event.key === 'ArrowDown') this.highlightNextHit(event);
    else if (event.key === 'ArrowUp') this.highlightPreviousHit(event);
    else if (event.key === 'Enter') this.openHighlightedHit(event);
  }

  @ViewChild('hitsDiv', { static: true })
  hitsDivRef: ElementRef<HTMLDivElement>;

  theme: 'dark' | 'light';

  hits: BaseHit[] = [];
  highlightedHitIndex = 0;
  refine: (query: string) => void;
  query: string;

  constructor() {
    const dialogInput = inject<HaInstanceSearchDialogData>(MAT_DIALOG_DATA);

    // Init Algolia InstantSearch
    this.instantSearchService.addWidgets([
      configure({
        attributesToSnippet: ['content:10'],
        attributesToHighlight: ['title', 'content'],
      }),
      connectSearchBox(({ refine, query }) => {
        this.refine = refine;
        this.query = query;
      })({}),
      connectHits(({ hits }) => {
        this.hits = hits;
        if (hits.length > 0) this.highlightedHitIndex = 0;
        else this.highlightedHitIndex = undefined;
      })({}),
    ]);

    this.theme = dialogInput?.theme == 'dark-theme' ? 'dark' : 'light';
  }

  ngAfterContentInit(): void {
    // start Algolia InstantSearch
    this.instantSearchService.addWidgets([poweredBy({ container: '#powered-by-div', theme: this.theme })]);
    this.instantSearchService.start();
  }

  search(event: Event): void {
    this.refine!((event.target as HTMLInputElement).value);
  }

  isLink(str: string): boolean {
    return ClStringHelper.isHttpLink(str);
  }

  ngOnDestroy(): void {
    this.instantSearchService.stop();
  }

  private highlightNextHit(event: KeyboardEvent): void {
    ClHelpService.stopEventPropagation(event);
    if (this.highlightedHitIndex !== undefined && this.highlightedHitIndex < this.hits.length - 1) {
      this.highlightedHitIndex++;
      const hitsDiv = this.hitsDivRef.nativeElement as HTMLElement;
      const highlightedHit = hitsDiv.children[this.highlightedHitIndex] as HTMLElement;
      if (highlightedHit) {
        const hitsDivRect = hitsDiv.getBoundingClientRect();
        const highlightedHitRect = highlightedHit.getBoundingClientRect();
        if (highlightedHitRect.bottom > hitsDivRect.bottom) {
          hitsDiv.scrollTop += highlightedHitRect.bottom - hitsDivRect.bottom;
        }
      }
    }
  }

  private highlightPreviousHit(event: KeyboardEvent): void {
    ClHelpService.stopEventPropagation(event);
    if (this.highlightedHitIndex !== undefined && this.highlightedHitIndex > 0) {
      this.highlightedHitIndex--;
      const hitsDiv = this.hitsDivRef.nativeElement as HTMLElement;
      const highlightedHit = hitsDiv.children[this.highlightedHitIndex] as HTMLElement;
      if (highlightedHit) {
        const hitsDivRect = hitsDiv.getBoundingClientRect();
        const highlightedHitRect = highlightedHit.getBoundingClientRect();
        if (highlightedHitRect.top < hitsDivRect.top) {
          hitsDiv.scrollTop -= hitsDivRect.top - highlightedHitRect.top;
        }
      }
    }
  }

  private openHighlightedHit(event: KeyboardEvent): void {
    ClHelpService.stopEventPropagation(event);
    if (this.highlightedHitIndex !== undefined)
      this.router.navigate([this.hits[this.highlightedHitIndex].path]);
  }
}
