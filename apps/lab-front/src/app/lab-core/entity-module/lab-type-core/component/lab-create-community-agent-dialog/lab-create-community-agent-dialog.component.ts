import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabProtocolService } from '../../../../entity-service/lab-protocol.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LabCreateCommunityAgentVersionResDto } from '../../../../model/entities/lab-agent.entity';
import { CoAgentType, CoCreateAgentFormData, CoSpace } from '@monorepo/community-lib';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CoCommunityLibModule } from '../../../../../../../../../libs/community-lib/src/lib/co-community-lib.module';
import { TranslatePipe } from '@ngx-translate/core';

export enum LabCreateCommunityAgentDialogMode {
  CREATE = 'CREATE',
  FORK = 'FORK',
}

export interface LabShareAgentCommunityDialogData {
  processId: string;
  mode: LabCreateCommunityAgentDialogMode;
  agentVersionId?: string;
}

@Component({
  selector: 'lab-create-community-agent-dialog',
  templateUrl: './lab-create-community-agent-dialog.component.html',
  styleUrls: ['./lab-create-community-agent-dialog.component.scss'],
  imports: [FlDialogModule, CoCommunityLibModule, TranslatePipe],
})
export class LabCreateCommunityAgentDialogComponent implements OnInit {
  data = inject<LabShareAgentCommunityDialogData>(MAT_DIALOG_DATA);
  private protocolService = inject(LabProtocolService);
  private dialogRef = inject<MatDialogRef<LabCreateCommunityAgentDialogComponent>>(MatDialogRef);

  title: string = 'biox.create_community_agent';
  processId: string;
  spaces$: Observable<CoSpace[]>;
  formGp = new FormBuilder().group({
    title: [null as string, Validators.required],
    type: [null as CoAgentType, Validators.required],
    space: [null as CoSpace],
  });
  mode: LabCreateCommunityAgentDialogMode;
  agentVersionId: string;

  constructor() {
    const data = this.data;

    this.processId = data.processId;
    this.mode = data.mode;
    this.agentVersionId = data.agentVersionId;
  }

  ngOnInit(): void {
    this.spaces$ = this.protocolService.getCommunitySpaces();
  }

  submit(formData: CoCreateAgentFormData): void {
    this.formGp.patchValue(formData);
    if (this.formGp.valid) {
      if (this.mode === LabCreateCommunityAgentDialogMode.FORK) {
        if (!this.agentVersionId) return;
        this.protocolService
          .forkIntoNewCommunityAgent(this.processId, this.formGp.getRawValue(), this.agentVersionId)
          .subscribe((res: LabCreateCommunityAgentVersionResDto) => {
            this.dialogRef.close(res);
          });
      } else {
        this.protocolService
          .createCommunityAgent(this.processId, this.formGp.getRawValue())
          .subscribe((res: LabCreateCommunityAgentVersionResDto) => {
            this.dialogRef.close(res);
          });
      }
    }
  }
}
