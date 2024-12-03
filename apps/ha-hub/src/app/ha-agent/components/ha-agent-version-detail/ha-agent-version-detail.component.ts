import { Component, computed, effect, Input, OnInit, Signal } from '@angular/core';
import { HaAgentService } from '../../../ha-core/ha-service/ha-agent.service';
import { HaAgentVersion } from '../../../ha-core/ha-model/ha-entities/ha-agent-version.class';
import { FlClipboardService, FlCodeEditorLanguage, FlDebouncer } from '@monorepo/front-core-lib';
import { TeBasicConfig, TeRichText } from '@monorepo/text-editor';
import { HaBrickVersion } from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaAgentPageState } from '../../state/ha-agent-page.state';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ha-agent-version-detail',
  templateUrl: './ha-agent-version-detail.component.html',
  styleUrls: ['./ha-agent-version-detail.component.scss'],
})
export class HaAgentVersionDetailComponent implements OnInit {
  @Input() isOverview?: boolean;
  versionInfosDisabled = true;

  textEditorConfig: TeBasicConfig;

  paramsFormControl: FormControl<Record<string, any>> = new FormControl<Record<string, any>>(null);

  environmentFormControl: FormControl<string> = new FormControl<string>(null);
  environmentDebouncer: FlDebouncer<string>;
  environmentFormControlSubscription: Subscription;

  codeFormControl: FormControl<string> = new FormControl<string>(null);
  codeDebouncer: FlDebouncer<string>;
  codeFormControlSubscription: Subscription;

  lastAgentVersion: number = null;

  versionInfosFormControl: FormControl<TeRichText> = new FormControl(null);

  canEdit: Signal<boolean> = this.agentPageState.canEditAgent;
  isEditable: Signal<boolean> = this.agentPageState.agentVersionIsEditable;
  brickDependencies: Signal<HaBrickVersion[]> = this.agentPageState.getBrickDependencies();
  isAgentVersionLoading: Signal<boolean> = this.agentPageState.isAgentVersionLoading;
  agentVersion: Signal<HaAgentVersion> = this.agentPageState.agentVersion;
  isVersionInfosEmpty: Signal<boolean> = computed(() => {
    const versionInfos = this.agentVersion()?.versionInfos;
    return versionInfos == null || versionInfos.isEmpty();
  });

  languageCode: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.agentVersion()?.type as string)?.includes('PYTHON') ? 'python' : 'r';
  });

  languageEnvironment: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.agentVersion()?.environment as string)?.includes('PIP') ? null : 'yaml';
  });

  constructor(
    private agentService: HaAgentService,
    private agentPageState: HaAgentPageState,
    private clipboardService: FlClipboardService
  ) {
    effect(() => {
      if (this.agentVersion()) {
        if (this.agentVersion().version == this.lastAgentVersion) return;

        this.lastAgentVersion = this.agentVersion().version;

        this.codeDebouncer = null;
        this.environmentDebouncer = null;

        if (this.versionInfosFormControl) {
          this.versionInfosFormControl.setValue(this.agentVersion().versionInfos);
          this.versionInfosFormControl.disable();
        } else {
          const formControl = new FormControl<TeRichText>(null);
          if (this.agentVersion().versionInfos) {
            formControl.patchValue(this.agentVersion().versionInfos);
            formControl.disable();
          }
          this.versionInfosFormControl = formControl;
        }

        this.codeFormControlSubscription?.unsubscribe();
        this.codeFormControlSubscription = null;
        this.environmentFormControlSubscription?.unsubscribe();
        this.environmentFormControlSubscription = null;

        this.codeDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
        this.codeDebouncer.getDebouncedValue().subscribe((value) => this.onCodeChange(value));
        this.codeFormControl.patchValue(this.agentVersion().code);

        this.paramsFormControl.patchValue(this.agentVersion().params);

        this.environmentFormControl.patchValue(this.agentVersion().environment);
        this.environmentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
        this.environmentDebouncer.getDebouncedValue().subscribe((value) => this.onEnvironmentChange(value));

        this.codeFormControlSubscription = this.codeFormControl.valueChanges.subscribe((code) => {
          if (this.canEdit() && this.isEditable()) this.codeDebouncer.setValue(code);
        });

        this.environmentFormControlSubscription = this.environmentFormControl.valueChanges.subscribe(
          (environment) => {
            if (this.canEdit() && this.isEditable()) this.environmentDebouncer.setValue(environment);
          }
        );

        if (!this.isEditable() || !this.canEdit()) {
          this.environmentFormControl.disable();
          this.paramsFormControl.disable();
          this.codeFormControl.disable();
        }
      }
    });
  }

  ngOnInit(): void {
    this.textEditorConfig = new TeBasicConfig();

    if (this.agentVersion()?.params != null) {
      this.paramsFormControl.setValue(this.agentVersion().params);
    }

    if (!this.isEditable() || !this.canEdit()) {
      this.environmentFormControl.disable();
      this.paramsFormControl.disable();
    }
  }

  onEnvironmentChange(environment: string): void {
    if (
      environment === this.agentVersion()?.environment ||
      !this.canEdit() ||
      this.agentVersion() == null ||
      this.lastAgentVersion !== this.agentVersion().version
    )
      return;
    this.agentService
      .saveAgentVersionEnvironment(this.agentVersion()?.id, environment)
      .subscribe((agentVersion) => {
        this.agentPageState.setAgentVersion(agentVersion);
      });
  }

  onCodeChange(code: string): void {
    if (
      code === this.agentVersion()?.code ||
      this.isAgentVersionLoading() ||
      !this.isEditable() ||
      !this.canEdit() ||
      this.agentVersion() == null ||
      this.lastAgentVersion !== this.agentVersion().version
    )
      return;

    this.agentService.saveAgentVersionCode(this.agentVersion()?.id, code).subscribe((agentVersion) => {
      this.agentPageState.setAgentVersion(agentVersion);
    });
  }

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

  onVersionInfosEditorButtonClick(): void {
    if (this.versionInfosDisabled) {
      this.versionInfosDisabled = false;
      this.versionInfosFormControl.enable();
      return;
    }

    this.agentService
      .saveAgentVersionInfos(this.agentVersion().id, this.versionInfosFormControl.value)
      .subscribe((agentVersion) => {
        if (agentVersion) this.agentPageState.updateAgentVersion(agentVersion);
        this.versionInfosDisabled = true;
        this.versionInfosFormControl.disable();
      });
  }

  onVersionInfosChange(versionInfos: TeRichText): void {
    this.versionInfosFormControl?.setValue(versionInfos);
  }

  protected readonly Object = Object;
}
