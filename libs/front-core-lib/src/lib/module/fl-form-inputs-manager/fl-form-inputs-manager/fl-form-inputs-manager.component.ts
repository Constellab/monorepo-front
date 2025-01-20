import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlFormFilledInput, FlFormInputsManagerConfig } from '../fl-form-inputs-manager.class';
import { FlFormHelper } from '../../../model/fl-form-helper';
import { FlMouseButton } from '../../../utils/fl-keyboard.helper';
import { FlTranslatableText } from '../../fl-translate/model/fl-translate-param';

/**
 * Component that works with form to display the list of form input not null in a chip list
 * with a possibility to clear the form control
 *
 * If placed under a form, it works automatically (works with NgModel and Reactive forms),
 * otherwise the formGp input is mandatory
 *
 * /!\ It doesn't support FormArray
 */
@Component({
    selector: 'fl-form-inputs-manager',
    templateUrl: './fl-form-inputs-manager.component.html',
    styleUrls: ['./fl-form-inputs-manager.component.scss'],
    standalone: false
})
export class FlFormInputsManagerComponent implements OnInit, OnDestroy {
  /**
   * Config for the name and group displayed in the chips
   */
  @Input({ required: true }) config: FlFormInputsManagerConfig = {};

  /**
   * FormGroup of the form. To be provided only if this component is not under the wanted form
   */
  @Input() formGp: UntypedFormGroup;

  /**
   * If true, the false values are considered as null and the chip will not be created
   */
  @Input() skipFalseBoolean: boolean = false;

  /**
   * Event called whenever the chip list is refreshed (on form value change)
   */
  @Output() chipListChange: EventEmitter<FlFormFilledInput[]> = new EventEmitter<FlFormFilledInput[]>();

  /**
   * Event called when a chip or multi chip are deleted.
   */
  @Output() chipDelete: EventEmitter<FlFormFilledInput[]> = new EventEmitter();

  filledInputs: FlFormFilledInput[] = [];

  private subscription: Subscription;

  constructor(
    @Optional() private ngForm: NgForm,
    @Optional() private formGroupDirective: FormGroupDirective
  ) {}

  ngOnInit(): void {
    // check input
    if (
      (this.ngForm == null || this.ngForm.control == null) &&
      this.formGroupDirective == null &&
      this.formGp == null
    ) {
      console.error('There is no control form associated');
      return;
    }

    // get the formGroup if it doesn't exist
    if (this.formGp == null) {
      // case of NgModel form
      if (this.ngForm) {
        this.formGp = this.ngForm.form;
      }
      // case of reactive form
      else if (this.formGroupDirective) {
        this.formGp = this.formGroupDirective.form;
      } else {
        return;
      }
    }

    this.subscription = this.formGp.valueChanges.subscribe(() => this.refreshChipList());

    // call the refresh on start
    this.refreshChipList();
  }

  // function to refresh the chip list
  private refreshChipList(): void {
    this.filledInputs = [];

    // loop through each control
    for (const key of Object.keys(this.formGp.controls)) {
      // check control value
      this.checkControlValue(key, this.formGp.get(key), this.config[key]);
    }

    this.emitChipListChange();
  }

  // check a control value to see if it's empty or not
  private checkControlValue(key: string, control: AbstractControl, config?: FlTranslatableText): void {
    if (control == null) {
      return;
    }

    // skip false boolean, consider them like null
    if (this.skipFalseBoolean && control.value === false) {
      return;
    }

    if (!FlFormHelper.isControlEmpty(control)) {
      this.filledInputs.push(this.getFilledInputName(key, control, config));
    }
  }

  onChipClick(formInput: FlFormFilledInput, event: MouseEvent): void {
    if (event.button === FlMouseButton.MIDDLE) {
      this.clearInput(formInput);
    }
  }

  clearInput(formInput: FlFormFilledInput): void {
    // clear the form control value
    formInput.control.reset();

    this.emitChipDeleted([formInput]);
  }

  // return the name of the input with the config
  private getFilledInputName(
    key: string,
    control: AbstractControl,
    config?: FlTranslatableText
  ): FlFormFilledInput {
    return {
      key: key,
      name: config ?? { text: key, translateText: true },
      control: control,
    };
  }

  private emitChipListChange(): void {
    this.chipListChange.emit(this.filledInputs);
  }

  private emitChipDeleted(formInputs: FlFormFilledInput[]): void {
    this.chipDelete.emit(formInputs);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
