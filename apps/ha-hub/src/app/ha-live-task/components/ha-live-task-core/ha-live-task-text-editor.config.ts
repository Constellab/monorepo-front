import {
  FlDialogService,
  FlQuillConfig, FlTextEditorBlockAddButton,
  FlTextEditorConfig,
  FlTextEditorImageLoader,
  FlTextEditorSnowButton, FlTextEditorState
} from '@monorepo/front-core-lib';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';

export class HaLiveTaskTextEditorConfig extends FlTextEditorConfig implements FlTextEditorImageLoader{
  private liveTaskId: string;

  constructor(private liveTaskService: HaLiveTaskService,
              private dialogService: FlDialogService,
              liveTaskId?: string) {
    super();
    if(liveTaskId)
      this.liveTaskId = liveTaskId;
  }

  getToolbarConfig(): any {
    return FlQuillConfig.completeToolbarConfig;
  }

  getSnowButtons(): FlTextEditorSnowButton[] {
    return [];
  }

  getBlockAddButtons(state: FlTextEditorState): FlTextEditorBlockAddButton[] {
    return [
      {
        icon: 'image', type: 'fileExplorer',
        onAction: file => this.insertImageFromFile(file, state)
      },
      this.getCodeBlockAddButton(state),
      this.getHintBlockAddButton(state),
      this.getVideoAddButton(state, this.dialogService),
      this.getFormulaAddButton(state, this.dialogService)
    ];
  }

  insertImageFromFile(file: File, textEditorState: FlTextEditorState): void {
    const index = textEditorState.getCurrentSelectionIndex();
    this.liveTaskService.uploadImage(file, this.liveTaskId).subscribe(
      fileUrl => {
        textEditorState.insertImageFromUrl(fileUrl, index)
      }
    );
  }

  public getImageUrl(filename: string): string {
    return this.liveTaskService.getImageUrl(filename);
  }

  onPasteImage(imgFile: File, state: FlTextEditorState): any {
    this.insertImageFromFile(imgFile, state);
    return {ops: []};
  }
}
