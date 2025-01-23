import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib/fl-dynamic-field';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Component used under {@link FlDynamicFieldComponent} to show
 * tag input
 */
@Component({
  selector: 'lab-tag-dynamic-field',
  templateUrl: './lab-tag-dynamic-field.component.html',
  styleUrls: ['./lab-tag-dynamic-field.component.scss'],
  imports: [FlFormModule, FlTagModule, ReactiveFormsModule],
})
export class LabTagDynamicFieldComponent extends FlDynamicFieldAbstractDirective {}
