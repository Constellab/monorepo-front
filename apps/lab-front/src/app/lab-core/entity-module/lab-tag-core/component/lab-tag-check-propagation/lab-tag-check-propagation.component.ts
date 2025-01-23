import { Component, inject } from '@angular/core';
import { LabTagDatasource, TagPropagationImpactDTO } from '../../../../model/entities/lab-tag.entity';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlConfirmDialogResult } from '@monorepo/front-core-lib/fl-dialog';
import { Observable, share } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabTagListComponent } from '../lab-tag-list/lab-tag-list.component';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LabNavigableEntityGroupsComponent } from '../../../lab-navigable-entity-core/component/lab-navigable-entity-groups/lab-navigable-entity-groups.component';

export interface LabTagCheckPropagationInput {
  impactDTO$: Observable<TagPropagationImpactDTO>;
  mode: 'ADD' | 'REMOVE';
}

/**
 * Dialog before adding a tag to check the propagation impact
 */
@Component({
  selector: 'lab-tag-check-propagation',
  templateUrl: './lab-tag-check-propagation.component.html',
  styleUrls: ['./lab-tag-check-propagation.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    LabTagListComponent,
    LabNavigableEntityGroupsComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabTagCheckPropagationComponent {
  private dialogRef = inject<MatDialogRef<LabTagCheckPropagationComponent>>(MatDialogRef);

  impactDTO$: Observable<TagPropagationImpactDTO>;

  tags: LabTagDatasource;

  title: string;
  tagListText: string;
  helpText: string;

  constructor() {
    const input = inject<LabTagCheckPropagationInput>(MAT_DIALOG_DATA);

    this.impactDTO$ = input.impactDTO$.pipe(share());
    this.tags = new LabTagDatasource(this.impactDTO$.pipe(map((impactDTO) => impactDTO.tags)));

    this.title = input.mode === 'ADD' ? 'add_tag_propagation_title' : 'delete_tag_propagation_title';
    this.tagListText = input.mode === 'ADD' ? 'tags_to_propagate' : 'tag_to_delete';
    this.helpText = input.mode === 'ADD' ? 'add_tag_propagation_help' : 'delete_tag_propagation_help';
  }

  closeDialog(choice: boolean): void {
    const result: FlConfirmDialogResult = {
      choice: choice,
      result: null,
    };
    this.dialogRef.close(result);
  }
}
