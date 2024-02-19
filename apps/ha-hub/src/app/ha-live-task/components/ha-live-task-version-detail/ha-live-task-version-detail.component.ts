import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {FlCodeEditorLanguage, FlDebouncer, FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {FormControl} from '@ngneat/reactive-forms';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {HaCardBackground} from '../../../ha-core/ha-component/ha-card/ha-card.component';
import {TranslateService} from '@ngx-translate/core';
import {TeRichTextContent} from '@monorepo/text-editor';

@Component({
  selector: 'ha-live-task-version-detail',
  templateUrl: './ha-live-task-version-detail.component.html',
  styleUrls: ['./ha-live-task-version-detail.component.scss']
})
export class HaLiveTaskVersionDetailComponent implements OnInit, OnDestroy {

  @Input() liveTaskVersion: HaLiveTaskVersion;
  @Input() isCreator: boolean;
  @Input() isEditable: boolean;
  @Input() sectionTitle?: string;
  @Output() liveTaskVersionChangeEvent = new EventEmitter<HaLiveTaskVersion>();
  versionInfosDisabled = true;
  textEditorConfig: HaLiveTaskTextEditorConfig;
  versionInfosFormControl: FormControl<Record<string, any>> = new FormControl<Record<string, any>>(null);
  paramsFormControl: FormControl<string> = new FormControl<string>(null);
  paramsDebouncer: FlDebouncer<string>;
  codeFormControl: FormControl<string> = new FormControl<string>(null);
  codeDebouncer: FlDebouncer<string>;
  environmentFormControl: FormControl<string> = new FormControl<string>(null);
  environmentDebouncer: FlDebouncer<string>;

  constructor(private liveTaskService: HaLiveTaskService,
              private snackBarService: FlSnackBarService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    if(this.sectionTitle == null){
      this.translateService.get('detail_of_the_version').subscribe(value => {
        this.sectionTitle = value;
      });
    }
    this.textEditorConfig = new HaLiveTaskTextEditorConfig(this.liveTaskService, this.liveTaskVersion.liveTask.id);
    this.versionInfosFormControl.setValue(this.liveTaskVersion?.versionInfos);
    this.versionInfosFormControl.disable();

    if (this.liveTaskVersion?.params != null) {
      this.paramsFormControl.setValue(this.liveTaskVersion.params.join('\n'));
    }

    this.paramsDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.paramsDebouncer.getDebouncedValue().subscribe(value => this.onParamsChange(value));
    this.paramsFormControl.value$.subscribe(params => {
      this.paramsDebouncer.setValue(params);
    });

    this.codeFormControl.setValue(this.liveTaskVersion?.code);
    this.codeDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.codeDebouncer.getDebouncedValue().subscribe(value => this.onCodeChange(value));
    this.codeFormControl.value$.subscribe(code => {
      this.codeDebouncer.setValue(code);
    });

    this.environmentFormControl.setValue(this.liveTaskVersion?.environment);
    this.environmentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.environmentDebouncer.getDebouncedValue().subscribe(value => this.onEnvironmentChange(value));
    this.environmentFormControl.value$.subscribe(environment => {
      this.environmentDebouncer.setValue(environment);
    });
    if(!this.isEditable || !this.isCreator){
      this.codeFormControl.disable();
      this.environmentFormControl.disable();
      this.paramsFormControl.disable();
    }
  }

  onEnvironmentChange(environment: string): void {
    if (environment === this.liveTaskVersion.environment) return;
    this.liveTaskService.saveLiveTaskVersionEnvironment(this.liveTaskVersion.id, environment).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.liveTaskVersionChangeEvent.emit(this.liveTaskVersion);
    });
  }

  onParamsChange(params: string): void {
    const paramsArray = params.split('\n');
    if (params === this.liveTaskVersion?.params?.join('\n') || paramsArray.find(p => p.trim().length > 0) == null || !this.isEditable) {
      return;
    }
    this.liveTaskService.saveLiveTaskVersionParams(this.liveTaskVersion.id, paramsArray).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.liveTaskVersionChangeEvent.emit(this.liveTaskVersion);
    });
  }

  onCodeChange(code: string): void {
    if (code === this.liveTaskVersion.code || !this.isEditable) return;
    this.liveTaskService.saveLiveTaskVersionCode(this.liveTaskVersion.id, code).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.liveTaskVersionChangeEvent.emit(this.liveTaskVersion);
    });
  }

  onCopy(type: 'parameters' | 'code' | 'environment_file'): void {
    if (this.liveTaskVersion && this.liveTaskVersion.params)
    navigator.clipboard.writeText(this.liveTaskVersion?.params?.join('\n')).then(() => {
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
      this.liveTaskVersion.id, this.liveTaskVersion.versionInfos).subscribe((liveTaskVersion) => {
      if (liveTaskVersion)
        this.liveTaskVersion = liveTaskVersion;
      this.versionInfosDisabled = true;
      this.versionInfosFormControl.disable();
    })
  }

  onVersionInfosChange(versionInfos: TeRichTextContent): void {
    this.liveTaskVersion.versionInfos = versionInfos;
  }

  getLanguageEnvironment(): FlCodeEditorLanguage{
    return (this.liveTaskVersion?.environment as string).includes('PIP') ? null : 'yaml';
  }

  getLanguageCode(): FlCodeEditorLanguage{
    return (this.liveTaskVersion?.type as string).includes('PYTHON') ? 'python' : 'r';
  }

  ngOnDestroy(): void {
    this.codeDebouncer.complete();
  }

  protected readonly HaCardBackground = HaCardBackground;
}
