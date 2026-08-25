import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FlEmbeddedOptionsAbstractDirective } from '@monorepo/front-core-lib/fl-core';
import { LiTagValueFormat } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-tag-value-format-options',
  imports: [MatOption, TranslatePipe],
  templateUrl: './li-tag-value-format-options.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './li-tag-value-format-options.component.scss',
})
export class LiTagValueFormatOptionsComponent
  extends FlEmbeddedOptionsAbstractDirective
  implements AfterViewInit
{
  select: MatSelect;

  valueFormatOptions: LiTagValueFormat[] = ['STRING', 'INTEGER', 'FLOAT', 'BOOLEAN', 'DATETIME'];

  constructor() {
    const select = inject(MatSelect, { host: true });

    super(select);

    this.select = select;
  }

  ngAfterViewInit(): void {
    this.initOptions();
  }
}
