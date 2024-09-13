import {Component, OnDestroy, OnInit} from '@angular/core';
import {CaFolderDetailState} from '../../state/ca-folder-detail.state';
import {debounceTime, Observable, Subscription, switchMap} from 'rxjs';
import {FlDebouncer} from '@monorepo/front-core-lib';
import {FormControl} from '@angular/forms';
import {CaFolder} from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import {CaFolderService} from '../../../../../ca-core/service-api/ca-folder.service';
import {CaFolderDescriptionTextEditorConfig} from './ca-folder-description-text-editor.config';
import {TeRichTextContent} from '@monorepo/text-editor';

@Component({
  selector: 'ca-folder-description',
  templateUrl: './ca-folder-description.component.html',
  styleUrls: ['./ca-folder-description.component.scss']
})
export class CaFolderDescriptionComponent implements OnInit, OnDestroy {

  folder$: Observable<CaFolder>;
  canEdit$: Observable<boolean>;

  edit: boolean = false;
  formControl: FormControl;

  textEditorConfig: CaFolderDescriptionTextEditorConfig;

  isLoading: boolean = false;

  private subscription: Subscription;

  constructor(private state: CaFolderDetailState,
              private folderService: CaFolderService) {
  }

  ngOnInit(): void {
    this.textEditorConfig = new CaFolderDescriptionTextEditorConfig(this.state.getFolderId$(),
      this.folderService);
    this.folder$ = this.state.getFolder$();
    this.formControl = new FormControl({disabled: true, value: null});

    this.isLoading = true;
    this.subscription = this.state.getFolderId$().pipe(
      switchMap(folderId => this.folderService.getFolderDescription(folderId)),
    ).subscribe({
      next: description => this.descriptionLoaded(description),
      error: () => this.isLoading = false
    });

    this.canEdit$ = this.state.canEditFolder$();

    this.formControl.valueChanges.pipe(
      debounceTime(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME)
    ).subscribe(
      value => this.saveDescription(value)
    );
  }

  private descriptionLoaded(description: TeRichTextContent): void {
    // patch the value without emitting an event
    this.formControl.patchValue(description, {emitEvent: false});
    this.isLoading = false;
  }

  private saveDescription(description: TeRichTextContent): void {
    this.state.updateDescription(description);
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
