import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogModule, FlFormDialogAbstractDirective } from '@monorepo/front-core-lib/fl-dialog';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';

export type HaAgentEditStyleDialogInputData = FlFormDialogInput<HaAgentEditStyleDialogData>;

export interface HaAgentEditStyleDialogData {
  style: TdTypeStyle;
  entityId: string;
  isVersion: boolean;
}

export interface HaAgentEditStyleFormData {
  isVersion: boolean;
  allVersionsChecked: boolean;
  style: TdTypeStyle;
}

@Component({
  selector: 'ha-agent-edit-style-dialog',
  templateUrl: './ha-agent-edit-style-dialog.component.html',
  styleUrl: './ha-agent-edit-style-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    CoCommunityLibModule,
    MatCheckbox,
    MatButton,
    TranslatePipe,
  ],
})
export class HaAgentEditStyleDialogComponent
  extends FlFormDialogAbstractDirective<HaAgentEditStyleFormData, HaAgent | HaAgentVersion>
  implements OnInit
{
  private agentService = inject(HaAgentService);

  style: TdTypeStyle;
  isVersion: boolean;
  entityId: string;

  constructor() {
    const dialogInput = inject<HaAgentEditStyleDialogInputData>(MAT_DIALOG_DATA);

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
      style: [this.style, Validators.required],
    });
  }

  create(): Observable<HaAgent | HaAgentVersion> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'style_updated_successfully';
  }

  update(formValue: HaAgentEditStyleFormData): Observable<HaAgent | HaAgentVersion> {
    if (this.formGp.valid) {
      return this.isVersion
        ? this.agentService.updateAgentVersionStyle(this.entityId, formValue)
        : this.agentService.updateAgentStyle(this.entityId, formValue);
    }
    throw new Error('Form is invalid');
  }
}
