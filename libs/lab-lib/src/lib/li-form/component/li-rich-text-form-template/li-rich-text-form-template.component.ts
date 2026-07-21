import { ChangeDetectionStrategy,Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LiFormTemplate } from '@monorepo/lab-lib/li-core';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormTemplateService } from '../../service/li-form-template.service';
import { LiSelectFormTemplateDialogComponent } from '../li-select-form-template-dialog/li-select-form-template-dialog.component';

@Component({
  selector: 'li-rich-text-form-template',
  templateUrl: './li-rich-text-form-template.component.html',
  styleUrl: './li-rich-text-form-template.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, MatButton, FlLoaderModule, TranslatePipe, FlIconModule],
})
export class LiRichTextFormTemplateComponent extends TeElementBlockDirective implements OnInit {
  @Input() formTemplateId: string;
  @Input() formTemplateVersionId: string;

  isLoading = signal(false);
  templateName = signal<string>(null);
  versionNumber = signal<number>(null);
  hasError = signal(false);

  private dialogService = inject(FlDialogService);
  private formTemplateService = inject(LiFormTemplateService);

  get hasTemplate(): boolean {
    return !!this.formTemplateId;
  }

  ngOnInit(): void {
    if (this.formTemplateId) {
      this.loadVersionInfo(this.formTemplateId, this.formTemplateVersionId);
    }
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

  loadVersionInfo(formTemplateId: string, formTemplateVersionId?: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.formTemplateService.getById(formTemplateId).subscribe({
      next: (template) => {
        this.templateName.set(template.name);
        if (!this.isLoading()) return;
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });

    if (formTemplateVersionId) {
      this.formTemplateService.getVersion(formTemplateId, formTemplateVersionId).subscribe({
        next: (version) => {
          this.versionNumber.set(version.version);
          if (!this.isLoading()) return;
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
    }
  }

  private selectTemplateVersion(template: LiFormTemplate): void {
    this.formTemplateId = template.id;
    this.formTemplateVersionId = null;
    this.templateName.set(template.name);
    this.versionNumber.set(null);
  }
}
