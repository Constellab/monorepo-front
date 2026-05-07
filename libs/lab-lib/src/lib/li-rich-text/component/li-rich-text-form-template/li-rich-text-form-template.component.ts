import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-rich-text-form-template',
  templateUrl: './li-rich-text-form-template.component.html',
  styleUrl: './li-rich-text-form-template.component.scss',
  imports: [MatIcon, MatButton, FlLoaderModule, TranslatePipe],
})
export class LiRichTextFormTemplateComponent extends TeElementBlockDirective {
  @Input() formTemplateId: string;
  @Input() formTemplateVersionId: string;
  @Input() displayName: string;

  @Output() selectTemplateRequested = new EventEmitter<void>();

  isLoading = signal(false);
  templateName = signal<string>(null);
  versionNumber = signal<number>(null);
  hasError = signal(false);

  get hasTemplate(): boolean {
    return !!this.formTemplateId && !!this.formTemplateVersionId;
  }

  setVersionInfo(name: string, version: number): void {
    this.templateName.set(name);
    this.versionNumber.set(version);
    this.isLoading.set(false);
    this.hasError.set(false);
  }

  setLoading(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
  }

  setError(): void {
    this.hasError.set(true);
    this.isLoading.set(false);
  }

  onSelectTemplate(): void {
    this.selectTemplateRequested.emit();
  }
}
