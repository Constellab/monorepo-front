import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { FlDebouncer } from '@monorepo/front-core-lib';
import { FormControl } from '@angular/forms';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaFolderDescriptionTextEditorConfig } from './ca-folder-description-text-editor.config';
import { TeRichTextContent } from '@monorepo/text-editor';
import { CaGetFolderDescriptionDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaHierarchyObject } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

@Component({
  selector: 'ca-folder-description',
  templateUrl: './ca-folder-description.component.html',
  styleUrls: ['./ca-folder-description.component.scss']
})
export class CaFolderDescriptionComponent implements OnInit, OnDestroy {

  @Input({ required: true }) folderId: string;

  folder$: Observable<CaHierarchyObject>;

  @Input({ required: true }) folderName: string;

  canEdit: boolean;
  edit: boolean = false;

  formControl: FormControl;

  textEditorConfig: CaFolderDescriptionTextEditorConfig;

  isLoading: boolean = false;

  private subscription: Subscription;

  constructor(private folderService: CaFolderService,
              private state: CaHierarchyObjectDetailState) {
  }

  ngOnInit(): void {
    this.textEditorConfig = new CaFolderDescriptionTextEditorConfig(this.folderId,
      this.folderService);
    this.formControl = new FormControl({ disabled: true, value: null });

    this.isLoading = true;
    this.subscription = this.folderService.getFolderDescription(this.folderId).subscribe({
      next: description => this.descriptionLoaded(description),
      error: () => this.isLoading = false
    });

    this.formControl.valueChanges.pipe(
      debounceTime(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME)
    ).subscribe(
      value => this.saveDescription(value)
    );

    this.folder$ = this.state.getFolder$(this.folderId);
  }

  private descriptionLoaded(description: CaGetFolderDescriptionDTO): void {
    // patch the value without emitting an event
    this.formControl.patchValue(description.description, { emitEvent: false });
    this.canEdit = description.canEdit;
    this.isLoading = false;
  }

  private saveDescription(description: TeRichTextContent): void {
    this.folderService.updateDescription(this.folderId, description).subscribe();
  }

  toggleEdit(): void {
    this.edit = !this.edit;
    if (this.edit) {
      this.formControl.enable();
    } else {
      this.formControl.disable();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
