import { Component, Input, OnDestroy, ViewEncapsulation, inject } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import katex from 'katex';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'fl-formula-standalone',
  imports: [],
  templateUrl: './fl-formula-standalone.component.html',
  styleUrl: './fl-formula-standalone.component.scss',
  // use encapsulation to import KaTeX styles
  encapsulation: ViewEncapsulation.None,
})
export class FlFormulaStandaloneComponent implements OnDestroy {
  private sanitizer = inject(DomSanitizer);

  @Input() set formula(formula: string | Observable<string>) {
    this.clear();
    if (formula instanceof Observable) {
      this.subscription = formula.subscribe((formula) => this.onFormulaChange(formula));
    } else {
      this.onFormulaChange(formula);
    }
  }

  @Input() mode: 'view' | 'edit' = 'view';

  private subscription: Subscription;

  katexResult: SafeHtml;
  katexError: string;

  private onFormulaChange(formula: string): void {
    const macros = {
      '\\f': '#1f(#2)',
    };

    try {
      const katexResult = katex.renderToString(formula ?? '', {
        macros,
        throwOnError: true,
      });

      this.katexResult = this.sanitizer.bypassSecurityTrustHtml(katexResult);
      this.katexError = null;
    } catch (e: any) {
      this.katexResult = null;
      if (this.mode === 'view' || !e.message) {
        this.katexError = formula;
      } else {
        this.katexError = e.message;
      }
    }
  }

  private clear(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  ngOnDestroy(): void {
    this.clear();
  }
}
