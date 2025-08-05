import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FlCodeEditorComponent } from '@monorepo/front-core-lib/fl-code-editor';
import { FlCodeEditorLanguage } from '@monorepo/front-core-lib/fl-code-editor';

import { TeElementBlockDirective } from '../../model/te-element.directive';

@Component({
  selector: 'te-code',
  templateUrl: './te-code.component.html',
  styleUrl: './te-code.component.scss',
  standalone: false,
})
export class TeCodeComponent extends TeElementBlockDirective {
  @Input({ required: true }) formControl: FormControl<string>;

  @Input({ required: true }) language: FlCodeEditorLanguage;

  @ViewChild(FlCodeEditorComponent, { static: true }) codeEditor: FlCodeEditorComponent;

  // use to prevent the enter and tab key to be propagated to the text editor
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
