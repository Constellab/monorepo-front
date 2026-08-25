import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoAgentType, CoCommunityLibModule, CoCreateAgentFormData, CoSpace } from '@monorepo/community-lib';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiCreateCommunityAgentVersionResDto, LiProtocolService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, CoCommunityLibModule, TranslatePipe],
})
export class LiCreateCommunityAgentDialogComponent implements OnInit {
  data = inject<LiCreateAgentCommunityDialogData>(MAT_DIALOG_DATA);
  private protocolService = inject(LiProtocolService);
  private dialogRef = inject<MatDialogRef<LiCreateCommunityAgentDialogComponent>>(MatDialogRef);

  title: string = 'li.create_community_agent';
  processId: string;
  spaces$: Observable<CoSpace[]>;
  formGp = new FormBuilder().group({
    title: [null as string | null, Validators.required],
    type: [null as CoAgentType | null, Validators.required],
    space: [null as CoSpace | null],
  });
  mode: LiCreateCommunityAgentDialogMode;
  agentVersionId?: string;

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
      const agentFormData = this.requireAgentFormData();
      if (this.mode === LiCreateCommunityAgentDialogMode.FORK) {
        const agentVersionId = this.agentVersionId;
        if (!agentVersionId) return;
        this.protocolService
          .forkIntoNewCommunityAgent(this.processId, agentFormData, agentVersionId)
          .subscribe((res: LiCreateCommunityAgentVersionResDto) => {
            this.dialogRef.close(res);
          });
      } else {
        this.protocolService
          .createCommunityAgent(this.processId, agentFormData)
          .subscribe((res: LiCreateCommunityAgentVersionResDto) => {
            this.dialogRef.close(res);
          });
      }
    }
  }

  /**
   * The form is only submitted after validation (title and type are required), so this
   * only throws if that invariant is ever broken.
   */
  private requireAgentFormData(): CoCreateAgentFormData {
    const { title, type, space } = this.formGp.getRawValue();
    if (title == null || type == null) {
      throw new Error('Cannot submit the community agent form without a title and a type');
    }
    return { title, type, space: space ?? undefined };
  }
}
