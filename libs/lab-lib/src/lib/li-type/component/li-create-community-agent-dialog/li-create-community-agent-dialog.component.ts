import { CoAgentType, CoCommunityLibModule, CoCreateAgentFormData, CoSpace } from '@monorepo/community-lib';
import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { LiCreateCommunityAgentVersionResDto, LiProtocolService } from '@monorepo/lab-lib/li-core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

export enum LiCreateCommunityAgentDialogMode {
  CREATE = 'CREATE',
  FORK = 'FORK',
}

export interface LiCreateAgentCommunityDialogData {
  processId: string;
  mode: LiCreateCommunityAgentDialogMode;
  agentVersionId?: string;
}

@Component({
  selector: 'li-create-community-agent-dialog',
  templateUrl: './li-create-community-agent-dialog.component.html',
  styleUrls: ['./li-create-community-agent-dialog.component.scss'],
  imports: [FlDialogModule, CoCommunityLibModule, TranslatePipe],
})
export class LiCreateCommunityAgentDialogComponent implements OnInit {
  data = inject<LiCreateAgentCommunityDialogData>(MAT_DIALOG_DATA);
  private protocolService = inject(LiProtocolService);
  private dialogRef = inject<MatDialogRef<LiCreateCommunityAgentDialogComponent>>(MatDialogRef);

  title: string = 'biox.create_community_agent';
  processId: string;
  spaces$: Observable<CoSpace[]>;
  formGp = new FormBuilder().group({
    title: [null as string, Validators.required],
    type: [null as CoAgentType, Validators.required],
    space: [null as CoSpace],
  });
  mode: LiCreateCommunityAgentDialogMode;
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
      if (this.mode === LiCreateCommunityAgentDialogMode.FORK) {
        if (!this.agentVersionId) return;
        this.protocolService
          .forkIntoNewCommunityAgent(this.processId, this.formGp.getRawValue(), this.agentVersionId)
          .subscribe((res: LiCreateCommunityAgentVersionResDto) => {
            this.dialogRef.close(res);
          });
      } else {
        this.protocolService
          .createCommunityAgent(this.processId, this.formGp.getRawValue())
          .subscribe((res: LiCreateCommunityAgentVersionResDto) => {
            this.dialogRef.close(res);
          });
      }
    }
  }
}
