import { Component, OnInit } from '@angular/core';
import { FlFormDialogAbstractDirective, FlTag, FlTagHelper } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabCreateTagResponse } from '../../../../model/entities/lab-tag.entity';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';


/**
 * Dialog to create of update a tag
 */
@Component({
  selector: 'lab-tag-form-dialog',
  templateUrl: './lab-tag-form-dialog.component.html',
  styleUrls: ['./lab-tag-form-dialog.component.scss']
})
export class LabTagFormDialogComponent extends FlFormDialogAbstractDirective<FlTag, LabCreateTagResponse>
  implements OnInit {

  maxLength = FlTagHelper.MAX_LENGTH;

  constructor(private tagService: LabTagService) {
    super();
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    const defaultKey = this.dialogInput.object?.key ?? null;
    return new FormBuilder().group({
      key: [{
        value: defaultKey,
        disabled: defaultKey != null
      }, Validators.required],
      value: [null, Validators.required],
    });
  }

  create(formValue: FlTag): Observable<LabCreateTagResponse> {
    return this.tagService.createTag(formValue.key, formValue.value);
  }

  getCreateSuccessMessage(): string {
    return 'tag_created';
  }

  getUpdateSuccessMessage(): string {
    return 'tag_updated';
  }

  update(formValue: FlTag): Observable<LabCreateTagResponse> {
    return this.tagService.updateTag(this.dialogInput.object.key,
      this.dialogInput.object.value, formValue.value);
  }


  get title(): string {
    return this.isCreateMode() ? 'tag_create' : 'tag_update';
  }

}
