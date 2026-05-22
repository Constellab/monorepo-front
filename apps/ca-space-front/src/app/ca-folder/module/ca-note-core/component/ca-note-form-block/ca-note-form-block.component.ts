import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatus, FlStatusHelper, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TdParamSpecs, TdParamTableComponent } from '@monorepo/technical-doc';
import { TeElementBlockDirective } from '@monorepo/text-editor';

import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';

export interface CaNoteFormData {
  name: string;
  status: string;
  template?: {
    template_name: string;
    version_number: number;
  };
}

@Component({
  selector: 'ca-note-form-block',
  templateUrl: './ca-note-form-block.component.html',
  styleUrl: './ca-note-form-block.component.scss',
  imports: [TdParamTableComponent, MatIcon, FlIconModule, FlLoaderModule, FlStatusModule],
})
export class CaNoteFormBlockComponent extends TeElementBlockDirective {
  private noteService = inject(CaNoteService);

  isLoading = signal(false);
  form = signal<CaNoteFormData>(null);
  specs = signal<TdParamSpecs>(null);
  values = signal<Record<string, unknown>>(null);

  formStatus = computed<FlStatus | null>(() => {
    const f = this.form();
    if (!f) return null;
    if (f.status === 'SUBMITTED') {
      return FlStatusHelper.getSuccessStatus('SUBMITTED', 'form_status_SUBMITTED');
    }
    return FlStatusHelper.getDraftStatus('DRAFT', 'form_status_DRAFT');
  });

  setFormInputs(noteId: string, formId: string): void {
    this.isLoading.set(true);

    this.noteService.getNoteJsonFileContent(noteId, formId).subscribe({
      next: (result: any) => {
        this.form.set(result.form);
        this.specs.set(result.content?.specs);
        this.values.set(result.content?.values);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
