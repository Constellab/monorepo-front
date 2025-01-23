import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { clLangNameMap, ClSupportedLanguage } from '@monorepo/core-lib';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';

/**
 * Embed option to generate the app language mat-options
 */
@Component({
  selector: 'fl-select-language-options',
  templateUrl: './fl-select-language-options.component.html',
  styleUrls: ['./fl-select-language-options.component.scss'],
  standalone: false,
})
export class FlSelectLanguageOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  private select: MatSelect;

  language: Record<ClSupportedLanguage, string> = clLangNameMap;

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
