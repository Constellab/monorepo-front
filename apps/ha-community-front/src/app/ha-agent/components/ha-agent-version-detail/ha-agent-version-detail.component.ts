import { Component, computed, inject, input, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCodeEditorLanguage, FlCodeEditorModule } from '@monorepo/front-core-lib/fl-code-editor';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { TeBasicConfig, TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ha-agent-version-detail',
  templateUrl: './ha-agent-version-detail.component.html',
  styleUrls: ['./ha-agent-version-detail.component.scss'],
  imports: [
    MatButton,
    TeTextEditorModule,
    ReactiveFormsModule,
    FlCardModule,
    TdTechnicalDocModule,
    FlCodeEditorModule,
    FlCorePipeModule,
    TranslatePipe,
    FlKeyValueModule,
    FlLoaderModule,
    MatIcon,
  ],
})
export class HaAgentVersionDetailComponent {
  private agentService = inject(HaAgentService);
  private agentPageState = inject(HaAgentPageState);
  private clipboardService = inject(FlClipboardService);

  isOverview = input<boolean>(false);

  canEdit: Signal<boolean> = this.agentPageState.canEditAgent;
  isEditable: Signal<boolean> = this.agentPageState.agentVersionIsEditable;
  agentVersion: Signal<HaAgentVersion> = this.agentPageState.agentVersion;

  languageCode: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.agentVersion()?.type as string)?.includes('PYTHON') ? 'python' : 'r';
  });

  languageEnvironment: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.agentVersion()?.environment as string)?.includes('PIP') ? null : 'yaml';
  });

  versionInfosFormControl = computed(() => {
    const agentVersion = this.agentVersion();
    const formControl = new FormControl<TeRichText>(agentVersion ? agentVersion.versionInfos : null);
    formControl.disable();
    return formControl;
  });

  environmentFormControl = computed(() => {
    const agentVersion = this.agentVersion();
    const formControl = new FormControl<string>(agentVersion ? agentVersion.environment : null);
    formControl.disable();
    return formControl;
  });

  codeFormControl = computed(() => {
    const agentVersion = this.agentVersion();
    const formControl = new FormControl<string>(agentVersion ? agentVersion.code : null);
    formControl.disable();
    return formControl;
  });

  onAgentVersionInfosLoading = false;

  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  onCopy(type: 'code' | 'environment_file'): void {
    let text = null;
    switch (type) {
      case 'code':
        text = this.agentVersion()?.code;
        break;
      case 'environment_file':
        text = this.agentVersion()?.environment;
        break;
    }
    if (text) {
      this.clipboardService.copy(text, {
        text: `${type}_copied_to_clipboard`,
        translateText: true,
      });
    }
  }

  editAbout(): void {
    this.versionInfosFormControl().enable();
  }

  saveAbout(): void {
    if (this.agentVersion().versionInfos?.contentAreEquals(this.versionInfosFormControl().value)) {
      this.versionInfosFormControl().disable();
      return;
    }

    this.onAgentVersionInfosLoading = true;
    this.agentService
      .saveAgentVersionInfos(this.agentVersion().id, this.versionInfosFormControl().value)
      .subscribe({
        next: (updatedAgentVersion) => {
          this.agentPageState.setAgentVersion(updatedAgentVersion);
          this.onAgentVersionInfosLoading = false;
          this.versionInfosFormControl().disable();
        },
        error: () => {
          this.onAgentVersionInfosLoading = false;
        },
      });
  }

  // onVersionInfosEditorButtonClick(): void {
  //   if (this.versionInfosDisabled) {
  //     this.versionInfosDisabled = false;
  //     this.versionInfosFormControl.enable();
  //     return;
  //   }
  //
  //   this.agentService
  //     .saveAgentVersionInfos(this.agentVersion().id, this.versionInfosFormControl.value)
  //     .subscribe((agentVersion) => {
  //       if (agentVersion) this.agentPageState.updateAgentVersion(agentVersion);
  //       this.versionInfosDisabled = true;
  //       this.versionInfosFormControl.disable();
  //     });
  // }

  // onVersionInfosChange(versionInfos: TeRichText): void {
  //   this.versionInfosFormControl?.setValue(versionInfos);
  // }
}
