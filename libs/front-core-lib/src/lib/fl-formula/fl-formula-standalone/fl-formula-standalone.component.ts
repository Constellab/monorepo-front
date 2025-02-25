import { Component, effect, inject, input, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';
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

  formula = input.required<string>();

  mode = input<'view' | 'edit'>('view');

  private subscription: Subscription;

  katexResult: SafeHtml;
  katexError: string;

  constructor() {
    effect(() => {
      this.clear();
      this.onFormulaChange(this.formula(), this.mode());
    });
  }

  private onFormulaChange(formula: string, mode: 'view' | 'edit'): void {
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
      if (mode === 'view' || !e.message) {
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
