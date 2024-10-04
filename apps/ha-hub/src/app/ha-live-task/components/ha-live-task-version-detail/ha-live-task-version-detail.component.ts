import { Component, computed, Input, OnInit, Signal } from '@angular/core';
import { HaLiveTaskService } from '../../../ha-core/ha-service/ha-live-task.service';
import { HaLiveTaskVersion } from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {
  FlClipboardService,
  FlCodeEditorLanguage,
  FlDebouncer,
} from '@monorepo/front-core-lib';
import {
  TeBasicConfig,
  TeRichText,
  TeRichTextContent,
} from '@monorepo/text-editor';
import { HaBrickVersion } from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import { HaLiveTaskPageState } from '../../state/ha-live-task-page.state';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

// TODO @vfoex composant a cleaner, beaucoup trop gros, beaucoup trop d'attribute

@Component({
  selector: 'ha-live-task-version-detail',
  templateUrl: './ha-live-task-version-detail.component.html',
  styleUrls: ['./ha-live-task-version-detail.component.scss'],
})
export class HaLiveTaskVersionDetailComponent implements OnInit {
  @Input() isOverview?: boolean;
  versionInfosDisabled = true;
  textEditorConfig: TeBasicConfig;

  paramsFormControl: FormControl<string> = new FormControl<string>(null);
  paramsDebouncer: FlDebouncer<string>;
  paramsFormControlSubscription: Subscription;

  environmentFormControl: FormControl<string> = new FormControl<string>(null);
  environmentDebouncer: FlDebouncer<string>;
  environmentFormControlSubscription: Subscription;

  codeFormControl: FormControl<string> =  new FormControl<string>(null);
  codeDebouncer: FlDebouncer<string>;
  codeFormControlSubscription: Subscription;

  lastLtVersion: number = null;

  canEdit: Signal<boolean> = this.liveTaskPageState.canEditLt;
  isEditable: Signal<boolean> =
    this.liveTaskPageState.liveTaskVersionIsEditable;
  brickDependencies: Signal<HaBrickVersion[]> =
    this.liveTaskPageState.getBrickDependencies();
  isLiveTaskVersionLoading: Signal<boolean> =
    this.liveTaskPageState.isLiveTaskVersionLoading;
  versionInfosFormControl: FormControl<TeRichTextContent> =
    new FormControl<TeRichTextContent>(null);
  liveTaskVersion: Signal<HaLiveTaskVersion> = computed(() => {
    if (!this.liveTaskPageState.liveTaskVersion()) return null;
    const liveTaskVersion = this.liveTaskPageState.liveTaskVersion();
    if (liveTaskVersion?.version == this.lastLtVersion) return liveTaskVersion;
    this.lastLtVersion = liveTaskVersion.version;
    this.codeDebouncer = null;
    this.paramsDebouncer = null;
    this.environmentDebouncer = null;

    if (this.versionInfosFormControl) {
      this.versionInfosFormControl.setValue(liveTaskVersion?.versionInfos);
      this.versionInfosFormControl.disable();
    } else {
      const formControl = new FormControl<TeRichTextContent>(null);
      if (liveTaskVersion?.versionInfos) {
        formControl.patchValue(liveTaskVersion.versionInfos);
        formControl.disable();
      }
      this.versionInfosFormControl = formControl;
    }

    this.codeFormControlSubscription?.unsubscribe();
    this.codeFormControlSubscription = null;
    this.paramsFormControlSubscription?.unsubscribe();
    this.paramsFormControlSubscription = null;
    this.environmentFormControlSubscription?.unsubscribe();
    this.environmentFormControlSubscription = null;


    this.codeDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.codeDebouncer
      .getDebouncedValue()
      .subscribe((value) => this.onCodeChange(value));
    this.codeFormControl.patchValue(liveTaskVersion.code);

    this.paramsDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.paramsDebouncer
      .getDebouncedValue()
      .subscribe((value) => this.onParamsChange(value));
    this.paramsFormControl.patchValue(liveTaskVersion.params);

    this.environmentFormControl.patchValue(liveTaskVersion.environment);
    this.environmentDebouncer = new FlDebouncer(
      FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME
    );
    this.environmentDebouncer
      .getDebouncedValue()
      .subscribe((value) => this.onEnvironmentChange(value));

    this.codeFormControlSubscription = this.codeFormControl.valueChanges.subscribe((code) => {
      if(this.canEdit() && this.isEditable())
        this.codeDebouncer.setValue(code);
    });

    this.paramsFormControlSubscription = this.paramsFormControl.valueChanges.subscribe((params) => {
      if(this.canEdit() && this.isEditable())
        this.paramsDebouncer.setValue(params);
    });

    this.environmentFormControlSubscription = this.environmentFormControl.valueChanges.subscribe((environment) => {
      if(this.canEdit() && this.isEditable())
        this.environmentDebouncer.setValue(environment);
    });

    if (!this.isEditable() || !this.canEdit()) {
      this.environmentFormControl.disable();
      this.paramsFormControl.disable();
      this.codeFormControl.disable();
    }

    return liveTaskVersion;
  });
  isVersionInfosEmpty: Signal<boolean> = computed(() => {
    return TeRichText.isEmpty(this.liveTaskVersion()?.versionInfos);
  });

  languageCode: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.liveTaskVersion()?.type as string)?.includes('PYTHON')
      ? 'python'
      : 'r';
  });

  languageEnvironment: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.liveTaskVersion()?.environment as string)?.includes('PIP')
      ? null
      : 'yaml';
  });

  constructor(
    private liveTaskService: HaLiveTaskService,
    private liveTaskPageState: HaLiveTaskPageState,
    private clipboardService: FlClipboardService
  ) {}

  ngOnInit(): void {
    this.textEditorConfig = new TeBasicConfig();

    if (this.liveTaskVersion()?.params != null) {
      this.paramsFormControl.setValue(this.liveTaskVersion().params);
    }

    if (!this.isEditable() || !this.canEdit()) {
      this.environmentFormControl.disable();
      this.paramsFormControl.disable();
    }
  }

  onEnvironmentChange(environment: string): void {
    if (
      environment === this.liveTaskVersion()?.environment ||
      !this.canEdit() ||
      this.liveTaskVersion() == null || this.lastLtVersion !== this.liveTaskVersion().version
    )
      return;
    this.liveTaskService
      .saveLiveTaskVersionEnvironment(this.liveTaskVersion()?.id, environment)
      .subscribe((liveTaskVersion) => {
        this.liveTaskPageState.setLiveTaskVersion(liveTaskVersion);
      });
  }

  onParamsChange(params: string): void {
    const paramsArray = params?.split('\n');
    if (
      params === this.liveTaskVersion()?.params ||
      paramsArray?.find((p) => p.trim().length > 0) == null ||
      !this.isEditable() || !this.canEdit() ||
      this.liveTaskVersion() == null || this.lastLtVersion !== this.liveTaskVersion().version
    ) {
      return;
    }
    this.liveTaskService
      .saveLiveTaskVersionParams(this.liveTaskVersion()?.id, paramsArray)
      .subscribe((liveTaskVersion) => {
        this.liveTaskPageState.setLiveTaskVersion(liveTaskVersion);
      });
  }

  onCodeChange(code: string): void {

    if (
      code === this.liveTaskVersion()?.code || this.isLiveTaskVersionLoading() ||
      !this.isEditable() || !this.canEdit() ||
      this.liveTaskVersion() == null || this.lastLtVersion !== this.liveTaskVersion().version
    )
      return;

    this.liveTaskService
      .saveLiveTaskVersionCode(this.liveTaskVersion()?.id, code)
      .subscribe((liveTaskVersion) => {
        this.liveTaskPageState.setLiveTaskVersion(liveTaskVersion);
      });
  }

  onCopy(type: 'parameters' | 'code' | 'environment_file'): void {
    // TODO @vfoex use clipboard service
    let text = null;
    switch (type) {
      case 'parameters':
        text = this.liveTaskVersion()?.params;
        break;
      case 'code':
        text = this.liveTaskVersion()?.code;
        break;
      case 'environment_file':
        text = this.liveTaskVersion()?.environment;
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

    this.liveTaskService
      .saveLiveTaskVersionInfos(
        this.liveTaskVersion().id,
        this.versionInfosFormControl.value as TeRichTextContent
      )
      .subscribe((liveTaskVersion) => {
        if (liveTaskVersion)
          this.liveTaskPageState.updateLiveTaskVersion(liveTaskVersion);
        this.versionInfosDisabled = true;
        this.versionInfosFormControl.disable();
      });
  }

  onVersionInfosChange(versionInfos: TeRichTextContent): void {
    this.versionInfosFormControl?.setValue(versionInfos);
  }
}
