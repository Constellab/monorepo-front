import {Component} from '@angular/core';
import {FlDynamicFieldAbstractDirective} from '@monorepo/front-core-lib';
import {TeCompleteConfig} from '@monorepo/text-editor';

@Component({
  selector: 'lab-rich-text-dynamic-field',
  templateUrl: './lab-rich-text-dynamic-field.component.html',
  styleUrl: './lab-rich-text-dynamic-field.component.scss',
})
export class LabRichTextDynamicFieldComponent extends FlDynamicFieldAbstractDirective{

  config = new TeCompleteConfig()
}
