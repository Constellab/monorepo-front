import {Component, HostListener, Input} from '@angular/core';
import {TeElementDirective} from '../../model/te-element.directive';
import {FormControl} from '@angular/forms';
import {FlCodeEditorLanguage} from '@monorepo/front-core-lib';

@Component({
  selector: 'te-code',
  templateUrl: './te-code.component.html',
  styleUrl: './te-code.component.scss'
})
export class TeCodeComponent extends TeElementDirective {

  @Input() formControl: FormControl<string>;

  @Input() language: FlCodeEditorLanguage;

  // use to prevent the enter and tab key to be propagated to the text editor
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();
  }

}
