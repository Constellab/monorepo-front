import {Directive, Input} from '@angular/core';

/**
 * Parent class for component that are loaded inside the FlTextEditor
 */
@Directive()
export abstract class TeElementDirective {

  @Input() disabled: boolean;
}
