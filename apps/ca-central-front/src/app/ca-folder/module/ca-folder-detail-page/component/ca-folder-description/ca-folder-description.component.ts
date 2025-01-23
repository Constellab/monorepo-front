import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaFolderDescriptionTextEditorConfig } from './ca-folder-description-text-editor.config';
import { TeRichText } from '@monorepo/text-editor';
import { CaGetFolderDescriptionDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObject } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { TeTextEditorModule } from '../../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-description',
  templateUrl: './ca-folder-description.component.html',
  styleUrls: ['./ca-folder-description.component.scss'],
  imports: [
    FlSectionModule,
    CaHierarchyObjectIconComponent,
    TeTextEditorModule,
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaFolderDescriptionComponent implements OnInit {
  private folderService = inject(CaFolderService);
  private state = inject(CaHierarchyObjectDetailState);

  @Input({ required: true }) folderId: string;

  folder$: Observable<CaHierarchyObject>;

  @Input({ required: true }) folderName: string;

  canEdit: boolean;

  textEditorConfig: CaFolderDescriptionTextEditorConfig;
  formControl: FormControl<TeRichText> = new FormControl({ disabled: true, value: null });
  saveDescriptionFunc = (value: TeRichText): Observable<void> =>
    this.folderService.updateDescription(this.folderId, value);

  getIsLoading: boolean = false;

  ngOnInit(): void {
    this.textEditorConfig = new CaFolderDescriptionTextEditorConfig(this.folderId, this.folderService);

    this.getIsLoading = true;
    this.folderService.getFolderDescription(this.folderId).subscribe({
      next: (description) => this.descriptionLoaded(description),
      error: () => (this.getIsLoading = false),
    });

    this.folder$ = this.state.getFolder$(this.folderId);
  }

  private descriptionLoaded(description: CaGetFolderDescriptionDTO): void {
    // patch the value without emitting an event
    this.formControl.patchValue(description.description, { emitEvent: false });
    this.canEdit = description.canEdit;
    this.getIsLoading = false;
  }

  toggleEdit(): void {
    if (this.formControl.disabled) {
      // use emitFalse to avoid the value change event
      this.formControl.enable({ emitEvent: false });
    } else {
      this.formControl.disable({ emitEvent: false });
    }
  }
}
