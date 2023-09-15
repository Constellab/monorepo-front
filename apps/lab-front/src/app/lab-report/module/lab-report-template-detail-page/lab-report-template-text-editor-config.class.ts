import {
  FlDialogService,
  FlQuillConfig,
  FlTextEditorBlockAddButton,
  FlTextEditorConfig,
  FlTextEditorImageLoader,
  FlTextEditorSnowButton,
  FlTextEditorState
} from '@monorepo/front-core-lib';
import {LabReportTemplateService} from '../../../lab-core/entity-service/lab-report-template.service';

/**
 * Config for the text editor in the report
 */
export class LabReportTemplateTextEditorConfig extends FlTextEditorConfig implements FlTextEditorImageLoader {
  constructor(private reportTemplateService: LabReportTemplateService,
              private dialogService: FlDialogService) {
    super();
  }

  getToolbarConfig(): any {
    return FlQuillConfig.completeToolbarConfig;
  }

  getBlockAddButtons(state: FlTextEditorState): FlTextEditorBlockAddButton[] {
    return [
      {
        icon: 'image', type: 'fileExplorer',
        onAction: file => this.insertImageFromFile(file, state)
      },
      this.getCodeBlockAddButton(state),
      this.getHintBlockAddButton(state),
      this.getFormulaAddButton(state, this.dialogService),
    ];
  }

  getSnowButtons(): FlTextEditorSnowButton[] {
    return [];
  }

  public getImageUrl(filename: string): string {
    return this.reportTemplateService.getImageUrl(filename);
  }

  onPasteImage(imgFile: File, state: FlTextEditorState): any {
    return this.insertImageFromFile(imgFile, state);
  }

  private insertImageFromFile(file: File, textEditorState: FlTextEditorState): void {
    const index = textEditorState.getCurrentSelectionIndex();
    this.reportTemplateService.uploadImage(file).subscribe(
      fileUrl => textEditorState.insertImageFromUrl(fileUrl, index)
    );
  }


}
