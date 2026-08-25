import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TeRichText, TeTextEditorComponent, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom, Observable } from 'rxjs';

import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaGetFolderDescriptionDTO } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectSimple } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaFolderDescriptionTextEditorConfig } from './ca-folder-description-text-editor.config';

@Component({
  selector: 'ca-folder-description',
  templateUrl: './ca-folder-description.component.html',
  styleUrls: ['./ca-folder-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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

  folder$: Observable<CaHierarchyObjectSimple>;

  @Input({ required: true }) folderName: string;

  textEditorRef = viewChild(TeTextEditorComponent);

  canEdit: boolean;

  textEditorConfig: CaFolderDescriptionTextEditorConfig;
  formControl: FormControl<TeRichText | null> = new FormControl({ disabled: true, value: null });
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

  private async descriptionLoaded(description: CaGetFolderDescriptionDTO): Promise<void> {
    // patch the value without emitting an event
    this.formControl.patchValue(description.description, { emitEvent: false });
    const canEditRole = await firstValueFrom(this.state.canEditHierarchyObject$());
    this.canEdit = description.canEdit && canEditRole;
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
