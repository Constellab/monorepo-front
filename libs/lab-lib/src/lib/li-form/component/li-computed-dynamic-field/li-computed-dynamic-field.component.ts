import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';

@Component({
  selector: 'li-computed-dynamic-field',
  templateUrl: './li-computed-dynamic-field.component.html',
  styleUrl: './li-computed-dynamic-field.component.scss',
  imports: [MatIconModule, MatTooltipModule],
})
export class LiComputedDynamicFieldComponent extends FlDynamicFieldAbstractDirective {
  @Input() expression: string;
}
