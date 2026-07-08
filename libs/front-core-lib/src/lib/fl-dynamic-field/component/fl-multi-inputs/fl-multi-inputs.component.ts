import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';

/**
 * Input to handle multiple string values
 */
@Component({
  selector: 'fl-multi-inputs',
  templateUrl: './fl-multi-inputs.component.html',
  styleUrls: ['./fl-multi-inputs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FlFormFieldDirective, useExisting: FlMultiInputsComponent }],
  standalone: false,
})
export class FlMultiInputsComponent extends FlFormFieldDirective<string, string[]> {
  private cdr = inject(ChangeDetectorRef);

  @Input() placeholder: string;

  @Input() hint: string;
  @Input() prefix: string;
  @Input() suffix: string;

  @Input() rows: number = 3;

  @Output() valuesChange: EventEmitter<string[]> = new EventEmitter();

  private readonly separator: string = '\n';

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  onValueChange(): void {
    this.emitCurrentValue();
  }

  callChangeEvent(value: string[]): void {
    this.valuesChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: string[]): void {
    if (obj == null) {
      this.value = '';
      return;
    }
    this.value = this.convertOuterToInner(obj);
  }

  protected convertOuterToInner(outerValue: string[]): string {
    // remove empty and null values and return a string
    return outerValue.filter((value) => value).join(this.separator);
  }

  protected convertInnerToOuter(innerValue: string): string[] {
    if (innerValue == null) return [];
    return innerValue.split(this.separator).filter((value) => value);
  }

  setErrorState(isError: boolean): void {
    super.setErrorState(isError);
    this.cdr.markForCheck();
  }
}
