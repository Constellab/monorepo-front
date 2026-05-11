import { Component, Input, signal } from '@angular/core';
import { LiForm, LiFormContent, LiFormContentComponent } from '@monorepo/lab-lib/li-form';
import { TeElementBlockDirective } from '@monorepo/text-editor';

import { LiRichTextFormDisplayMode } from '../../model/li-rich-text-form-block.model';

@Component({
  selector: 'li-rich-text-form',
  templateUrl: './li-rich-text-form.component.html',
  styleUrl: './li-rich-text-form.component.scss',
  imports: [LiFormContentComponent],
})
export class LiRichTextFormComponent extends TeElementBlockDirective {
  @Input() formId: string;
  @Input() isOwner: boolean;

  displayMode = signal<LiRichTextFormDisplayMode>('form');

  form = signal<LiForm>(null);
  formContent = signal<LiFormContent>(null);

  onContentSaved(content: LiFormContent): void {
    this.formContent.set(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.formContent.set(content);
    const f = this.form();
    if (f) {
      this.form.set({ ...f, status: 'SUBMITTED' } as LiForm);
    }
  }

  onFormLoaded(form: LiForm): void {
    this.form.set(form);
  }
}
