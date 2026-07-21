import { ChangeDetectionStrategy,Component, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { flCheckLanguage, FlCodeEditorComponent } from '@monorepo/front-core-lib/fl-code-editor';
import { FlCodeEditorLanguage } from '@monorepo/front-core-lib/fl-code-editor';

import { TeElementBlockDirective } from '../../model/te-element.directive';

@Component({
  selector: 'te-code',
  templateUrl: './te-code.component.html',
  styleUrl: './te-code.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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

  public setValue(value: string, language: string): void {
    this.formControl.setValue(value);
    this.language = flCheckLanguage(language);
  }
}
