import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';

export type TeVariableFormType = 'string' | 'number' | 'boolean';

export interface TeVariableFormInfo {
  name?: string;
  description?: string;
  value?: string;
  type?: TeVariableFormType;
}

@Component({
  selector: 'te-variable-form',
  templateUrl: './te-variable-form.component.html',
  styleUrl: './te-variable-form.component.scss',
})
export class TeVariableFormComponent implements OnDestroy{

  @Input() formGroup: FormGroup

  constructor() {
    console.log('create');
  }


  ngOnDestroy(): void {
    console.log('destroy');
  }


}
