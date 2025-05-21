import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlConfirmDialogResult, FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiTagDatasource, TagPropagationImpactDTO } from '@monorepo/lab-lib/li-core';
import { LiNavigableEntityGroupsComponent } from '@monorepo/lab-lib/li-navigable-entity';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, share } from 'rxjs';
import { map } from 'rxjs/operators';
import { LiTagListComponent } from '../li-tag-list/li-tag-list.component';

export interface LiTagCheckPropagationInput {
  impactDTO$: Observable<TagPropagationImpactDTO>;
  mode: 'ADD' | 'REMOVE';
}

/**
 * Dialog before adding a tag to check the propagation impact
 */
@Component({
  selector: 'li-tag-check-propagation',
  templateUrl: './li-tag-check-propagation.component.html',
  styleUrls: ['./li-tag-check-propagation.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    LiTagListComponent,
    LiNavigableEntityGroupsComponent,
    MatDialogActions,
    MatButton,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LiTagCheckPropagationComponent {
  private dialogRef = inject<MatDialogRef<LiTagCheckPropagationComponent>>(MatDialogRef);

  impactDTO$: Observable<TagPropagationImpactDTO>;

  tags: LiTagDatasource;

  title: string;
  tagListText: string;
  helpText: string;

  constructor() {
    const input = inject<LiTagCheckPropagationInput>(MAT_DIALOG_DATA);

    this.impactDTO$ = input.impactDTO$.pipe(share());
    this.tags = new LiTagDatasource(this.impactDTO$.pipe(map((impactDTO) => impactDTO.tags)));

    this.title = input.mode === 'ADD' ? 'li.add_tag_propagation_title' : 'li.delete_tag_propagation_title';
    this.tagListText = input.mode === 'ADD' ? 'li.tags_to_propagate' : 'li.tag_to_delete';
    this.helpText = input.mode === 'ADD' ? 'li.add_tag_propagation_help' : 'li.delete_tag_propagation_help';
  }

  closeDialog(choice: boolean): void {
    const result: FlConfirmDialogResult = {
      choice: choice,
      result: null,
    };
    this.dialogRef.close(result);
  }
}
