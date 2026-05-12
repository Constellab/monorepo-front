import { Component, computed, effect, inject, input, model, output, signal, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { FlAiModule } from '@monorepo/front-core-lib/fl-ai';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';

import { LiForm, LiFormContent } from '../../../li-core/model/entities/form/li-form.entity';
import { LiFormDisplayMode, LiFormStatus } from '../../../li-core/model/entities/form/li-form.enum';
import { liGetFormStatus } from '../../model/li-form-status.helper';
import { LiFormService } from '../../service/li-form.service';
import { LiFormEditorComponent } from '../li-form-editor/li-form-editor.component';
import { liIsFieldComputed } from '../li-form-editor/li-form-editor.logic';
import { liGetFieldDisplayName } from '../li-form-history/li-form-history.logic';
import { LiFormTemplateRefInlineComponent } from '../li-form-template-ref-inline/li-form-template-ref-inline.component';

export interface LiFormTableRow {
  key: string;
  name: string;
  shortDescription: string;
  value: string;
}

function liFormatTableValue(value: unknown): string {
  if (value == null) return '';
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? '')).join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

@Component({
  selector: 'li-form-content',
  templateUrl: './li-form-content.component.html',
  styleUrl: './li-form-content.component.scss',
  imports: [
    LiFormEditorComponent,
    LiFormTemplateRefInlineComponent,
    FlAiModule,
    FlStatusModule,
    FlLoaderModule,
    FlJsonEditorModule,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class LiFormContentComponent {
  private formService = inject(LiFormService);

  @ViewChild(LiFormEditorComponent) private editor: LiFormEditorComponent;

  formId = input.required<string>();
  readonly = input(false);
  displayMode = model<LiFormDisplayMode>('form');
  showHeader = input(true);

  contentSaved = output<LiFormContent>();
  contentSubmitted = output<LiFormContent>();
  formLoaded = output<LiForm>();

  isLoading = signal(false);
  error = signal<string>(null);
  form = signal<LiForm>(null);
  formContent = signal<LiFormContent>(null);

  tableData = computed<LiFormTableRow[]>(() => {
    const content = this.formContent();
    if (!content?.values) return [];

    const specs = content.specs;
    return Object.entries(content.values).map(([key, raw]) => {
      const resolved = specs && liIsFieldComputed(specs, key) ? (raw as { value?: unknown })?.value : raw;
      return {
        key,
        name: liGetFieldDisplayName(key, specs),
        shortDescription: specs?.[key]?.short_description ?? '',
        value: liFormatTableValue(resolved),
      };
    });
  });

  tableColumns = ['name', 'value'];

  formStatus = computed<FlStatus<LiFormStatus>>(() => {
    const f = this.form();
    return f ? liGetFormStatus(f.status) : null;
  });

  isSubmitted = computed(() => this.form()?.status === 'SUBMITTED');
  isDraft = computed(() => this.form()?.status === 'DRAFT');

  aiFillFromText = (text: string): Observable<LiFormContent> => {
    return this.editor.aiFillFromText(text);
  };

  onAiFillResult(result: unknown): void {
    this.editor.onAiFillResult(result);
  }

  constructor() {
    effect(() => {
      const id = this.formId();
      if (id) {
        this.loadForm(id);
      }
    });
  }

  onContentSaved(content: LiFormContent): void {
    this.formContent.set(content);
    this.contentSaved.emit(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.formContent.set(content);
    const f = this.form();
    if (f) {
      this.form.set({ ...f, status: 'SUBMITTED' } as LiForm);
    }
    this.contentSubmitted.emit(content);
    this.formService.getById(this.formId()).subscribe((form) => {
      this.form.set(form);
      this.formLoaded.emit(form);
    });
  }

  private loadForm(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      form: this.formService.getById(id),
      content: this.formService.getContent(id),
    }).subscribe({
      next: ({ form, content }) => {
        this.form.set(form);
        this.formContent.set(content);
        this.isLoading.set(false);
        this.formLoaded.emit(form);
      },
      error: () => {
        this.error.set('li.form_not_found');
        this.isLoading.set(false);
      },
    });
  }
}
