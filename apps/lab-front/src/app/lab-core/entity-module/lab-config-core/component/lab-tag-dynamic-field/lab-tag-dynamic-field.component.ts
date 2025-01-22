import { Component } from '@angular/core';
import { FlDynamicFieldAbstractDirective } from '@monorepo/front-core-lib';
import { FlFormModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { FlTagModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-tag/fl-tag.module';
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
