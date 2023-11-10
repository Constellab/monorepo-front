import {Component, Inject, OnInit} from '@angular/core';
import {FlTag, FlTagDatasource} from '../../fl-tag.class';
import {Observable} from 'rxjs';
import {UntypedFormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {first} from 'rxjs/operators';

export type FlTagUpdateMethod = (tags: FlTag[]) => Observable<FlTag[]>;

export interface FlTagFormDialogInput {
  updateMethod: FlTagUpdateMethod; // method to update the tags
  title?: string; // default to update tag
  tags: FlTag[] | FlTagDatasource; // list of current tags
}

/**
 * Form dialog to update the tags and save them
 */
@Component({
  selector: 'fl-tag-form-dialog',
  templateUrl: './fl-tag-form-dialog.component.html',
  styleUrls: ['./fl-tag-form-dialog.component.scss']
})
export class FlTagFormDialogComponent implements OnInit {

  formCtrl: UntypedFormControl;

  isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private input: FlTagFormDialogInput,
              private dialogRef: MatDialogRef<FlTagFormDialogComponent>) {
  }

  ngOnInit(): void {
    if (this.input.tags instanceof FlTagDatasource) {
      this.input.tags.connect().pipe(first()).subscribe({
        next: tags => this.initCtrl(tags)
      });
    } else {
      this.initCtrl(this.input.tags);
    }
  }

  get title(): string {
    return this.input.title ?? 'flTag.update_tags';
  }

  private initCtrl(tags: FlTag[]): void {
    this.formCtrl = new UntypedFormControl(tags);
  }

  submit(): void {
    if (this.formCtrl.valid && !this.isLoading) {
      this.updateTags(this.formCtrl.value);
    }
  }

  private updateTags(tags: FlTag[]): void {
    this.isLoading = true;
    this.input.updateMethod(tags).subscribe({
      next: newTags => this.onUpdateTagSuccess(newTags),
      error: () => this.isLoading = false
    });
  }

  private onUpdateTagSuccess(tags: FlTag[]): void {
    if(this.input.tags instanceof FlTagDatasource) {
      this.input.tags.array = tags;
    }
    this.isLoading = false;
    this.dialogRef.close(tags);

  }

}
