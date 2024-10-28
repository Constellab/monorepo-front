import { Component, Inject, OnInit } from '@angular/core';
import { TdTypeStyle } from '@monorepo/technical-doc';
import {
  FlFormDialogAbstractDirective,
  FlFormDialogInput,
} from '@monorepo/front-core-lib';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';

export type HaAgentEditStyleDialogInputData =
  FlFormDialogInput<HaAgentEditStyleDialogData>;

export interface HaAgentEditStyleDialogData {
  style: TdTypeStyle;
  entityId: string;
  isVersion: boolean;
}

export interface HaAgentEditStyleFormData extends TdTypeStyle {
  isVersion: boolean;
  allVersionsChecked: boolean;
}

@Component({
  selector: 'ha-agent-edit-style-dialog',
  templateUrl: './ha-agent-edit-style-dialog.component.html',
  styleUrl: './ha-agent-edit-style-dialog.component.scss',
})
export class HaAgentEditStyleDialogComponent
  extends FlFormDialogAbstractDirective<
    HaAgentEditStyleFormData,
    HaAgent | HaAgentVersion
  >
  implements OnInit
{
  style: TdTypeStyle;
  isVersion: boolean;
  entityId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogInput: HaAgentEditStyleDialogInputData,
    private agentService: HaAgentService
  ) {
    super();
    this.style = dialogInput.object.style;
    this.isVersion = dialogInput.object.isVersion;
    this.entityId = dialogInput.object.entityId;
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      isVersion: [this.isVersion, Validators.required],
      allVersionsChecked: [false, Validators.required],
      icon_type: [this.style.icon_type, Validators.required],
      icon_color: [this.style.icon_color, Validators.required],
      icon_technical_name: [
        this.style.icon_technical_name,
        [Validators.required],
      ],
      background_color: [this.style.background_color, Validators.required],
    });
  }

  create(
    formValue: HaAgentEditStyleFormData
  ): Observable<HaAgent | HaAgentVersion> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'style_updated_successfully';
  }

  update(
    formValue: HaAgentEditStyleFormData
  ): Observable<HaAgent | HaAgentVersion> {
    if (this.formGp.valid) {
      return this.isVersion
        ? this.agentService.updateAgentVersionStyle(this.entityId, formValue)
        : this.agentService.updateAgentStyle(this.entityId, formValue);
    }
    return null;
  }
}
