import { Component, inject, Input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormTemplateService } from '../../service/li-form-template.service';
import { LiSelectFormTemplateDialogComponent } from '../li-select-form-template-dialog/li-select-form-template-dialog.component';

@Component({
  selector: 'li-rich-text-form-template',
  templateUrl: './li-rich-text-form-template.component.html',
  styleUrl: './li-rich-text-form-template.component.scss',
  imports: [MatIcon, MatButton, FlLoaderModule, TranslatePipe, FlIconModule],
})
export class LiRichTextFormTemplateComponent extends TeElementBlockDirective {
  @Input() formTemplateId: string;
  @Input() formTemplateVersionId: string;
  @Input() displayName: string;

  isLoading = signal(false);
  templateName = signal<string>(null);
  versionNumber = signal<number>(null);
  hasError = signal(false);

  private dialogService = inject(FlDialogService);
  private formTemplateService = inject(LiFormTemplateService);

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

  async openSelectTemplate(): Promise<void> {
    this.dialogService
      .openBigDialog(LiSelectFormTemplateDialogComponent)
      .afterClosed()
      .subscribe((template) => {
        if (template == null) return;
        this.selectTemplateVersion(template);
      });
  }

  loadVersionInfo(formTemplateId: string, formTemplateVersionId: string, displayName: string): void {
    this.setLoading();
    this.formTemplateService.getVersion(formTemplateId, formTemplateVersionId).subscribe({
      next: (version) => {
        this.setVersionInfo(displayName || formTemplateId, version.version);
      },
      error: () => {
        this.setError();
      },
    });
  }

  private selectTemplateVersion(template: { id: string; name: string }): void {
    this.setLoading();
    this.formTemplateService.getVersions(template.id).subscribe((versions) => {
      const published = versions.find((v) => v.status === 'PUBLISHED');
      const version = published ?? versions[0];
      if (!version) return;

      this.formTemplateId = template.id;
      this.formTemplateVersionId = version.id;
      this.displayName = template.name;
      this.setVersionInfo(template.name, version.version);
    });
  }
}
