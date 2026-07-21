import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiNoteTemplate, LiNoteTemplateForm, LiNoteTemplateService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'li-note-template-form-dialog',
  templateUrl: './li-note-template-form-dialog.component.html',
  styleUrl: './li-note-template-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlCoreDirectiveModule,
    MatError,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LiNoteTemplateFormDialogComponent
  extends FlFormDialogAbstractDirective<LiNoteTemplateForm, LiNoteTemplate>
  implements OnInit
{
  private noteTemplateService = inject(LiNoteTemplateService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'li.create_note_template' : '';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [null as string, Validators.required],
    });
  }

  create(formValue: LiNoteTemplateForm): Observable<LiNoteTemplate> {
    return this.noteTemplateService.createEmpty(formValue);
  }

  update(): Observable<LiNoteTemplate> {
    throw new Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'li.note_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
