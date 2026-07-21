import { ChangeDetectionStrategy,Component, Input, OnInit } from '@angular/core';
import { FlBasicDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';

import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';

/**
 * Dynamic field to show a search with autocomplete
 */
@Component({
  selector: 'fl-dynamic-field-select-search',
  templateUrl: './fl-dynamic-field-select-search.component.html',
  styleUrl: './fl-dynamic-field-select-search.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { '[class.cell-rendering]': 'cellRendering' },
})
export class FlDynamicFieldSelectSearchComponent extends FlDynamicFieldAbstractDirective implements OnInit {
  @Input() selectOptions: string[];

  datasource: FlBasicDatasourcePaginated<string>;

  ngOnInit(): void {
    this.datasource = FlBasicDatasourcePaginated.fromStringArray(this.selectOptions);
  }

  selectOption(option: string): void {
    this.formCtrl.setValue(option);
  }
}
