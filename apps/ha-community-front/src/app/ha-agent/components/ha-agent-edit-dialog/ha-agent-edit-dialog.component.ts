import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
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
import { Observable, switchMap } from 'rxjs';

import { HaAgent } from '../../../ha-core/ha-model/ha-entities/ha-agent.class';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaSpace } from '../../../ha-core/ha-model/ha-entities/ha-space.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaSpaceService } from '../../../ha-core/ha-service/ha-space.service';
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
  spaceId: string | null;
}

@Component({
  selector: 'ha-agent-edit-dialog',
  templateUrl: './ha-agent-edit-dialog.component.html',
  styleUrl: './ha-agent-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
    MatRadioButton,
    MatRadioGroup,
    AsyncPipe,
  ],
})
export class HaAgentEditDialogComponent
  extends FlFormDialogAbstractDirective<HaAgentEditFormData, HaAgent>
  implements OnInit
{
  private agentService = inject(HaAgentService);
  private dialogService = inject(FlDialogService);
  private spaceService = inject(HaSpaceService);

  private agentPageState = inject(HaAgentPageState);

  agent: HaAgent;
  version: HaAgentVersion;
  spaces$: Observable<HaSpace[]>;

  constructor() {
    const dialogInput = inject<HaAgentEditDialogInputData>(MAT_DIALOG_DATA);

    super();
    this.agent = dialogInput.object.agent;
    this.version = dialogInput.object.version;
  }

  ngOnInit(): void {
    this.spaces$ = this.spaceService.getSpacesOfCurrentUser();
    this.init();
  }

  buildForm(): UntypedFormGroup {
    return new FormBuilder().group({
      title: [this.agent.title],
      spaceId: [this.agent.space?.id ?? null],
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
      return this.agentService.updateTitle(this.agent.id, formValue.title).pipe(
        switchMap(() => this.agentService.updateSpace(this.agent.id, formValue.spaceId))
      );
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
