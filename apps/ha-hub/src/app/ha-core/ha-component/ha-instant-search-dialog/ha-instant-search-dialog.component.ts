import {
  AfterContentInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HaInstantSearchService } from '../../ha-service/ha-instant-search.service';
import { BaseHit } from 'instantsearch.js';
import { connectHits, connectSearchBox } from 'instantsearch.js/es/connectors';
import { MatFormField, MatInput, MatPrefix, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/overlay';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClHelpService, ClTheme } from '@monorepo/core-lib';
import { configure, poweredBy } from 'instantsearch.js/es/widgets';
import { NgClass } from '@angular/common';

export class HaInstanceSearchDialogData {
  theme: ClTheme;
}

@Component({
  selector: 'ha-ha-instant-search-dialog',
  standalone: true,
  imports: [MatInput, MatFormField, MatIcon, MatPrefix, RouterLink, CdkScrollable, MatSuffix, NgClass],
  templateUrl: './ha-instant-search-dialog.component.html',
  styleUrl: './ha-instant-search-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HaInstantSearchDialogComponent implements AfterContentInit {
  @HostListener('window:keydown.escape', ['$event'])
  closeDialog(event: KeyboardEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.dialogRef.close();
  }

  @HostListener('window:keydown.arrowdown', ['$event'])
  highlightNextHit(event: KeyboardEvent): void {
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

  @HostListener('window:keydown.arrowup', ['$event'])
  highlightPreviousHit(event: KeyboardEvent): void {
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

  @HostListener('window:keydown.enter', ['$event'])
  openHighlightedHit(event: KeyboardEvent): void {
    ClHelpService.stopEventPropagation(event);
    if (this.highlightedHitIndex !== undefined)
      this.router.navigate([this.hits[this.highlightedHitIndex].path]);
  }

  @ViewChild('hitsDiv', { static: true })
  hitsDivRef: ElementRef<HTMLDivElement>;

  theme: 'dark' | 'light';

  hits: BaseHit[] = [];
  highlightedHitIndex = 0;
  refine: (query: string) => void;
  query: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogInput: HaInstanceSearchDialogData,
    private instantSearchService: HaInstantSearchService,
    private dialogRef: MatDialogRef<HaInstantSearchDialogComponent>,
    private router: Router
  ) {
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
}
