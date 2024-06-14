import { Component, Inject } from '@angular/core';
import { LabTagDatasource, TagPropagationImpactDTO } from '../../../../model/entities/lab-tag.entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlConfirmDialogResult } from '@monorepo/front-core-lib';
import { Observable, share } from 'rxjs';
import { map } from 'rxjs/operators';

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
  styleUrls: ['./lab-tag-check-propagation.component.scss']
})
export class LabTagCheckPropagationComponent {

  impactDTO$: Observable<TagPropagationImpactDTO>;

  tags: LabTagDatasource;

  title: string;
  tagListText: string;
  helpText: string;

  constructor(@Inject(MAT_DIALOG_DATA) input: LabTagCheckPropagationInput,
              private dialogRef: MatDialogRef<LabTagCheckPropagationComponent>) {
    this.impactDTO$ = input.impactDTO$.pipe(share());
    this.tags = new LabTagDatasource(this.impactDTO$.pipe(
      map(impactDTO => impactDTO.tags)
    ));


    this.title = input.mode === 'ADD' ? 'add_tag_propagation_title' : 'delete_tag_propagation_title';
    this.tagListText = input.mode === 'ADD' ? 'tags_to_propagate' : 'tag_to_delete';
    this.helpText = input.mode === 'ADD' ? 'add_tag_propagation_help' : 'delete_tag_propagation_help';
  }

  closeDialog(choice: boolean): void {
    const result: FlConfirmDialogResult = {
      choice: choice,
      result: null
    };
    this.dialogRef.close(result);
  }

}
