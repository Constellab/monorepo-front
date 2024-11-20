import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaFolderDescriptionTextEditorConfig } from './ca-folder-description-text-editor.config';
import { TeRichText } from '@monorepo/text-editor';
import { CaGetFolderDescriptionDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObject } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

@Component({
  selector: 'ca-folder-description',
  templateUrl: './ca-folder-description.component.html',
  styleUrls: ['./ca-folder-description.component.scss'],
})
export class CaFolderDescriptionComponent implements OnInit {
  @Input({ required: true }) folderId: string;

  folder$: Observable<CaHierarchyObject>;

  @Input({ required: true }) folderName: string;

  canEdit: boolean;

  textEditorConfig: CaFolderDescriptionTextEditorConfig;
  formControl: FormControl<TeRichText> = new FormControl({ disabled: true, value: null });
  saveDescriptionFunc = (value: TeRichText): Observable<void> =>
    this.folderService.updateDescription(this.folderId, value);

  getIsLoading: boolean = false;

  constructor(
    private folderService: CaFolderService,
    private state: CaHierarchyObjectDetailState
  ) {}

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
