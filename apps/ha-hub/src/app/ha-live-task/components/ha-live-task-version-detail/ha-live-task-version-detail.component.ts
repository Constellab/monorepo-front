import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {FlCodeEditorLanguage, FlDebouncer, FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {FormControl} from '@ngneat/reactive-forms';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {HaCardBackground} from '../../../ha-core/ha-component/ha-card/ha-card.component';
import {TranslateService} from '@ngx-translate/core';

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

  codeFormControl: FormControl<string> = new FormControl<string>(null);
  codeDebouncer: FlDebouncer<string>;

  environmentFormControl: FormControl<string> = new FormControl<string>(null);
  environmentDebouncer: FlDebouncer<string>;

  constructor(private liveTaskService: HaLiveTaskService,
              private snackBarService: FlSnackBarService,
              private dialogService: FlDialogService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    if(this.sectionTitle == null){
      this.translateService.get('detail_of_the_version').subscribe(value => {
        this.sectionTitle = value;
      });
    }

    this.textEditorConfig = new HaLiveTaskTextEditorConfig(this.liveTaskService, this.dialogService, this.liveTaskVersion?.liveTask?.id);
    this.versionInfosFormControl.setValue(this.liveTaskVersion?.versionInfos);
    this.versionInfosFormControl.disable();

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
  }

  onEnvironmentChange(environment: string): void {
    if (environment === this.liveTaskVersion.environment) return;
    this.liveTaskService.saveLiveTaskVersionEnvironment(this.liveTaskVersion.id, environment).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.liveTaskVersionChangeEvent.emit(this.liveTaskVersion);
    });
  }

  onCodeChange(code: string): void {
    if (code === this.liveTaskVersion.code) return;
    this.liveTaskService.saveLiveTaskVersionCode(this.liveTaskVersion.id, code).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.liveTaskVersionChangeEvent.emit(this.liveTaskVersion);
    });
  }

  onCopy(type: 'code' | 'environment_file'): void {
    navigator.clipboard.writeText(this.liveTaskVersion.code).then(() => {
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

    this.liveTaskService.saveLiveTaskVersionInfos(this.liveTaskVersion.id, this.liveTaskVersion.versionInfos).subscribe((liveTaskVersion) => {
      if (liveTaskVersion) {
        this.liveTaskVersion = liveTaskVersion;
      }
      this.versionInfosDisabled = true;
      this.versionInfosFormControl.disable();
    })
  }

  onVersionInfosChange(versionInfos: Record<string, any>): void {
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
