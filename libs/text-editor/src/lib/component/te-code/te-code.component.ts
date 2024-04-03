import {Component, HostListener, Input, ViewChild} from '@angular/core';
import {TeElementBlockDirective} from '../../model/te-element.directive';
import {FormControl} from '@angular/forms';
import {FlCodeEditorComponent, FlCodeEditorLanguage} from '@monorepo/front-core-lib';

@Component({
  selector: 'te-code',
  templateUrl: './te-code.component.html',
  styleUrl: './te-code.component.scss'
})
export class TeCodeComponent extends TeElementBlockDirective {

  @Input({required: true}) formControl: FormControl<string>;

  @Input({required: true}) language: FlCodeEditorLanguage;

  @ViewChild(FlCodeEditorComponent, {static: true}) codeEditor: FlCodeEditorComponent;

  // use to prevent the enter and tab key to be propagated to the text editor
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
