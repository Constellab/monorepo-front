import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityLibModule } from '@monorepo/community-lib';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  FlDialogModule,
  FlDialogService,
  FlFormDialogAbstractDirective,
} from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import {
  HaAgentEditStyleDialogComponent,
  HaAgentEditStyleDialogInputData,
} from '../ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';

export type HaAgentEditDialogInputData = FlFormDialogInput<HaAgentEditDialogData>;

export interface HaAgentEditDialogData {
  agent: HaAgent;
  version?: HaAgentVersion;
}

export interface HaAgentEditFormData {
  title: string;
}

@Component({
  selector: 'ha-agent-edit-dialog',
  templateUrl: './ha-agent-edit-dialog.component.html',
  styleUrl: './ha-agent-edit-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    CoCommunityLibModule,
    MatButton,
    TranslatePipe,
    MatFormField,
    FlCoreDirectiveModule,
    FlCorePipeModule,
    MatError,
    MatInput,
    MatLabel,
    MatTooltip,
    MatIcon,
  ],
})
export class HaAgentEditDialogComponent
  extends FlFormDialogAbstractDirective<HaAgent, HaAgent>
  implements OnInit
{
  private agentService = inject(HaAgentService);
  private dialogService = inject(FlDialogService);

  private agentPageState = inject(HaAgentPageState);

  agent: HaAgent;
  version: HaAgentVersion;

  constructor() {
    const dialogInput = inject<HaAgentEditDialogInputData>(MAT_DIALOG_DATA);

    super();
    this.agent = dialogInput.object.agent;
    this.version = dialogInput.object.version;
  }

  ngOnInit(): void {
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [this.agent.title],
    });
  }

  create(): Observable<HaAgent> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return 'agent_updated';
  }

  update(formValue: HaAgentEditFormData): Observable<HaAgent> {
    if (this.formGp.valid) {
      return this.agentService.updateTitle(this.agent.id, formValue.title);
    }
    throw new Error('Form is invalid');
  }

  openEditStyleDialog(): void {
    if (!this.version) {
      return;
    }
    const dialogData: HaAgentEditStyleDialogInputData = {
      mode: 'update',
      object: {
        style: this.version.style,
        isVersion: true,
        entityId: this.version.id,
      },
    };

    this.dialogService
      .openMediumDialog(HaAgentEditStyleDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((result: HaAgentVersion) => {
        if (result) {
          this.agentPageState.setAgent(result.agent);
          this.agentPageState.setAgentVersion(result);
        }
      });
  }
}
