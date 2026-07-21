import { ChangeDetectionStrategy,Component, input } from '@angular/core';

import { TdParamSpecEntry } from '../../model/td-config-spec.class';

@Component({
  selector: 'td-param-spec-inline',
  templateUrl: './td-param-spec-inline.component.html',
  styleUrl: './td-param-spec-inline.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdParamSpecInlineComponent {
  entry = input.required<TdParamSpecEntry>();
}
