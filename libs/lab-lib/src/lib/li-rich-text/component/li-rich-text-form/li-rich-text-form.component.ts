import { Component, inject, Input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import {
  LiForm,
  LiFormContent,
  LiFormEditorComponent,
  LiFormService,
  LiFormStatus,
  LiFormTemplateRefInlineComponent,
  liGetFormStatus,
} from '@monorepo/lab-lib/li-form';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'li-rich-text-form',
  templateUrl: './li-rich-text-form.component.html',
  styleUrl: './li-rich-text-form.component.scss',
  imports: [
    LiFormEditorComponent,
    LiFormTemplateRefInlineComponent,
    FlStatusModule,
    FlLoaderModule,
    MatIcon,
    TranslatePipe,
  ],
})
export class LiRichTextFormComponent extends TeElementBlockDirective {
  private formService = inject(LiFormService);

  @Input() formId: string;
  @Input() isOwner: boolean;
  @Input() displayName: string;

  isLoading = signal(false);
  error = signal<string>(null);
  form = signal<LiForm>(null);
  formContent = signal<LiFormContent>(null);

  formStatus(): FlStatus<LiFormStatus> {
    const f = this.form();
    return f ? liGetFormStatus(f.status) : null;
  }

  isSubmitted(): boolean {
    return this.form()?.status === 'SUBMITTED';
  }

  loadForm(): void {
    if (!this.formId) return;

    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      form: this.formService.getById(this.formId),
      content: this.formService.getContent(this.formId),
    }).subscribe({
      next: ({ form, content }) => {
        this.form.set(form);
        this.formContent.set(content);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('li.form_not_found');
        this.isLoading.set(false);
      },
    });
  }

  onContentSaved(content: LiFormContent): void {
    this.formContent.set(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.formContent.set(content);
    const f = this.form();
    if (f) {
      f.status = 'SUBMITTED';
      this.form.set({ ...f } as LiForm);
    }
  }
}
