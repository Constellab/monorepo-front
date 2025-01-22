import { Component, OnInit, inject } from '@angular/core';
import { FlFormDialogAbstractDirective } from '@monorepo/front-core-lib';
import { FormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabNoteTemplate, LabNoteTemplateForm } from '../../../../model/entities/lab-note-template.entity';
import { LabNoteTemplateService } from '../../../../entity-service/lab-note-template.service';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCoreDirectiveModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-directive/fl-core-directive.module';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-note-template-form-dialog',
  templateUrl: './lab-note-template-form-dialog.component.html',
  styleUrl: './lab-note-template-form-dialog.component.scss',
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
export class LabNoteTemplateFormDialogComponent
  extends FlFormDialogAbstractDirective<LabNoteTemplateForm, LabNoteTemplate>
  implements OnInit
{
  private noteTemplateService = inject(LabNoteTemplateService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  get title(): string {
    return this.isCreateMode() ? 'biox.create_note_template' : '';
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [null as string, Validators.required],
    });
  }

  create(formValue: LabNoteTemplateForm): Observable<LabNoteTemplate> {
    return this.noteTemplateService.createEmpty(formValue);
  }

  update(): Observable<LabNoteTemplate> {
    throw new Error('Not implemented');
  }

  getCreateSuccessMessage(): string {
    return 'biox.note_created';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }
}
