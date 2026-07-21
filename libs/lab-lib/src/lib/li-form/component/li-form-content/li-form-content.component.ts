import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  ViewChild} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { FlAiModule } from '@monorepo/front-core-lib/fl-ai';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { LiForm, LiFormContent } from '@monorepo/lab-lib/li-core';
import { TdParamTableComponent } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';

import { LiFormDisplayMode, LiFormStatus } from '../../../li-core/model/entities/form/li-form.enum';
import { liGetFormStatus } from '../../model/li-form-status.helper';
import { LiFormService } from '../../service/li-form.service';
import { LiFormEditorComponent } from '../li-form-editor/li-form-editor.component';
import { LiFormTemplateRefInlineComponent } from '../li-form-template-ref-inline/li-form-template-ref-inline.component';

@Component({
  selector: 'li-form-content',
  templateUrl: './li-form-content.component.html',
  styleUrl: './li-form-content.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LiFormEditorComponent,
    LiFormTemplateRefInlineComponent,
    TdParamTableComponent,
    FlAiModule,
    FlStatusModule,
    FlLoaderModule,
    FlJsonEditorModule,
    MatIcon,
    TranslatePipe,
  ],
})
export class LiFormContentComponent {
  private formService = inject(LiFormService);
  private destroyRef = inject(DestroyRef);

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
    this.formService
      .getById(this.formId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((form) => {
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
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
