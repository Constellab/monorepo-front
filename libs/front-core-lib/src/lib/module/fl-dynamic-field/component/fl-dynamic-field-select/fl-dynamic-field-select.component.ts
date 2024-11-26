import { Component, Input, OnInit } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '../../model/fl-dynamic-field-abstract.directive';

@Component({
  selector: 'fl-dynamic-field-select',
  templateUrl: './fl-dynamic-field-select.component.html',
  styleUrls: ['./fl-dynamic-field-select.component.scss'],
})
export class FlDynamicFieldSelectComponent extends FlDynamicFieldAbstractDirective implements OnInit {
  @Input() selectOptions: any[] | Record<string, any>;

  @Input() prefix: string;

  @Input() suffix: string;

  isArray: boolean = true;

  ngOnInit(): void {
    console.log(this.selectOptions);
    this.isArray = Array.isArray(this.selectOptions);
  }

  protected readonly Object = Object;
  protected readonly Array = Array;
}
