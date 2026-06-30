import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-computed-dynamic-field',
  templateUrl: './li-computed-dynamic-field.component.html',
  styleUrl: './li-computed-dynamic-field.component.scss',
  imports: [MatIconModule, MatTooltipModule, TranslatePipe],
})
export class LiComputedDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  expression = input<string>();

  get displayValue(): string {
    const value = this.formCtrl().value?.value;
    if (value == null) return '-';
    const num = Number(value);
    if (!isNaN(num) && typeof value !== 'boolean') {
      return num % 1 !== 0 ? num.toFixed(2) : String(num);
    }
    return String(value);
  }
}
