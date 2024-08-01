import {Component, computed, Input, OnDestroy, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {FlCodeEditorLanguage, FlDebouncer, FlSnackBarService} from '@monorepo/front-core-lib';
import {FormControl} from '@ngneat/reactive-forms';
import {TranslateService} from '@ngx-translate/core';
import {TeBasicConfig, TeRichTextContent} from '@monorepo/text-editor';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {HaLiveTaskPageState} from '../../state/ha-live-task-page.state';

@Component({
  selector: 'ha-live-task-version-detail',
  templateUrl: './ha-live-task-version-detail.component.html',
  styleUrls: ['./ha-live-task-version-detail.component.scss']
})
export class HaLiveTaskVersionDetailComponent implements OnInit, OnDestroy {

  @Input() sectionTitle?: string;
  versionInfosDisabled = true;
  textEditorConfig: TeBasicConfig;
  paramsFormControl: FormControl<string> = new FormControl<string>(null);
  paramsDebouncer: FlDebouncer<string>;

  environmentFormControl: FormControl<string> = new FormControl<string>(null);
  environmentDebouncer: FlDebouncer<string>;

  liveTaskVersion: Signal<HaLiveTaskVersion> = computed(() => {
    if (!this.liveTaskPageState.liveTaskVersion()) return null;
    const liveTaskVersion = this.liveTaskPageState.liveTaskVersion();
    if (this.versionInfosFormControl) {
      this.versionInfosFormControl.setValue(liveTaskVersion?.versionInfos);
      this.versionInfosFormControl.disable();
    } else {
      const formControl = new FormControl<TeRichTextContent>(null);
      if (liveTaskVersion?.versionInfos) {
        formControl.setValue(liveTaskVersion.versionInfos);
        formControl.disable();
      }
      this.versionInfosFormControl = formControl
    }
    return liveTaskVersion;
  });
  canEdit: Signal<boolean> = this.liveTaskPageState.canEditLt;
  isEditable: Signal<boolean> = this.liveTaskPageState.liveTaskVersionIsEditable;
  brickDependencies: Signal<HaBrickVersion[]> = this.liveTaskPageState.getBrickDependencies();
  isLiveTaskVersionLoading: Signal<boolean> = this.liveTaskPageState.isLiveTaskVersionLoading;
  codeFormControl: Signal<FormControl<string>> = computed(() => {
    const formControl = new FormControl<string>(null);
    if (this.liveTaskVersion()?.code) {
      formControl.setValue(this.liveTaskVersion().code);
    }

    if (!this.isEditable() || !this.canEdit()) {
      formControl.disable();
    }
    return formControl;
  });
  codeDebouncer: Signal<FlDebouncer<string>> = computed(() => {
    const debouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    debouncer.getDebouncedValue().subscribe(value => this.onCodeChange(value));
    this.codeFormControl().value$.subscribe(code => {
      debouncer.setValue(code);
    });
    return debouncer;
  });
  versionInfosFormControl: FormControl<TeRichTextContent> = new FormControl<TeRichTextContent>(null);
  languageCode: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.liveTaskVersion()?.type as string)?.includes('PYTHON') ? 'python' : 'r';
  });

  languageEnvironment: Signal<FlCodeEditorLanguage> = computed(() => {
    return (this.liveTaskVersion()?.environment as string)?.includes('PIP') ? null : 'yaml';
  });


  constructor(private liveTaskService: HaLiveTaskService,
              private snackBarService: FlSnackBarService,
              private translateService: TranslateService,
              private liveTaskPageState: HaLiveTaskPageState) {
  }

  ngOnInit(): void {
    if(this.sectionTitle == null){
      this.translateService.get('detail_of_the_version').subscribe(value => {
        this.sectionTitle = value;
      });
    }
    this.textEditorConfig = new TeBasicConfig();

    if (this.liveTaskVersion()?.params != null) {
      this.paramsFormControl.setValue(this.liveTaskVersion().params.join('\n'));
    }

    this.paramsDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.paramsDebouncer.getDebouncedValue().subscribe(value => this.onParamsChange(value));
    this.paramsFormControl.value$.subscribe(params => {
      this.paramsDebouncer.setValue(params);
    });

    this.environmentFormControl.setValue(this.liveTaskVersion()?.environment);
    this.environmentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.environmentDebouncer.getDebouncedValue().subscribe(value => this.onEnvironmentChange(value));
    this.environmentFormControl.value$.subscribe(environment => {
      this.environmentDebouncer.setValue(environment);
    });

    if (!this.isEditable() || !this.canEdit()) {
      this.environmentFormControl.disable();
      this.paramsFormControl.disable();
    }
  }

  onEnvironmentChange(environment: string): void {
    if (environment === this.liveTaskVersion()?.environment) return;
    this.liveTaskService.saveLiveTaskVersionEnvironment(this.liveTaskVersion().id, environment).subscribe(liveTaskVersion => {
      this.liveTaskPageState.setLiveTaskVersion(liveTaskVersion);
    });
  }

  onParamsChange(params: string): void {
    const paramsArray = params?.split('\n');
    if (params === this.liveTaskVersion()?.params?.join('\n') || paramsArray?.find(p => p.trim().length > 0) == null || !this.isEditable) {
      return;
    }
    this.liveTaskService.saveLiveTaskVersionParams(this.liveTaskVersion().id, paramsArray).subscribe(liveTaskVersion => {
      this.liveTaskPageState.setLiveTaskVersion(liveTaskVersion);
    });
  }

  onCodeChange(code: string): void {
    if (code === this.liveTaskVersion()?.code || !this.isEditable) return;
    this.liveTaskService.saveLiveTaskVersionCode(this.liveTaskVersion().id, code).subscribe(liveTaskVersion => {
      this.liveTaskPageState.setLiveTaskVersion(liveTaskVersion);
    });
  }

  onCopy(type: 'parameters' | 'code' | 'environment_file'): void {
    if (this.liveTaskVersion && this.liveTaskVersion().params)
      navigator.clipboard.writeText(this.liveTaskVersion()?.params?.join('\n')).then(() => {
        this.snackBarService.openSuccessMessage({text: `${type}_copied_to_clipboard`, translateText: true});
      }).catch(() => {
        this.snackBarService.openErrorMessage('Error copying code to clipboard');
      });
  }

  onVersionInfosEditorButtonClick(): void {
    if (this.versionInfosDisabled) {
      this.versionInfosDisabled = false;
      this.versionInfosFormControl.enable();
      return;
    }

    this.liveTaskService.saveLiveTaskVersionInfos(
      this.liveTaskVersion().id, this.versionInfosFormControl.value as TeRichTextContent).subscribe((liveTaskVersion) => {
      if (liveTaskVersion)
        this.liveTaskPageState.updateLiveTaskVersion(liveTaskVersion);
      this.versionInfosDisabled = true;
      this.versionInfosFormControl.disable();
    })
  }

  onVersionInfosChange(versionInfos: TeRichTextContent): void {
    this.versionInfosFormControl?.setValue(versionInfos);
  }


  ngOnDestroy(): void {
    this.codeDebouncer().complete();
  }

}
