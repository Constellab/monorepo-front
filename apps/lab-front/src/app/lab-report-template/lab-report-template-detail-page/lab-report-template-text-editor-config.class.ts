import {LabReportTemplateService} from '../../lab-core/entity-service/lab-report-template.service';
import {
  TeCompleteConfig,
  TeFigureBlockConfig,
  teInlineToolFactory,
  TeTools,
  TeUploadedImage,
  TeVariableInlineToolClass
} from '@monorepo/text-editor';
import {Observable} from 'rxjs';
import {ApplicationRef, EnvironmentInjector} from '@angular/core';


export class LabReportTemplateTextEditorImageConfig implements TeFigureBlockConfig {
  constructor(private reportTemplateService: LabReportTemplateService) {
  }

  imageUploader(file: File): Observable<TeUploadedImage> {
    return this.reportTemplateService.uploadImage(file);
  }

  getImageUrl(filename: string): string {
    return this.reportTemplateService.getImageUrl(filename);
  }


}

/**
 * Config for the text editor in the report to support view in the editor
 */
export class LabReportTemplateTextEditorConfig extends TeCompleteConfig {

  constructor(private reportTemplateService: LabReportTemplateService) {
    super();
  }


  /**
   * Get the complete config and add the view block and configure the image block
   * @param envInjector
   * @param applicationRef
   */
  getTools(envInjector: EnvironmentInjector, applicationRef: ApplicationRef): TeTools {
    const tools = super.getTools(envInjector, applicationRef);

    // configure and add the image block
    const imageConfig = new LabReportTemplateTextEditorImageConfig(this.reportTemplateService);
    tools.figure = this.getImageConfig(imageConfig, envInjector, applicationRef);

    tools.variable = teInlineToolFactory(TeVariableInlineToolClass, envInjector, applicationRef);

    return tools;
  }


  getInlineToolbar(): string[] {
    const toolbar = super.getInlineToolbar();
    toolbar.push('variable');
    return toolbar;
  }
}


/**
 * Config for the text editor in the report
 //  */
// export class LabReportTemplateTextEditorConfig extends FlTextEditorConfig implements FlTextEditorImageLoader {
//   constructor(private reportTemplateService: LabReportTemplateService,
//               private dialogService: FlDialogService) {
//     super();
//   }
//
//   getToolbarConfig(): any {
//     return FlQuillConfig.completeToolbarConfig;
//   }
//
//   getBlockAddButtons(state: CaTextEditorState): FlTextEditorBlockAddButton[] {
//     return [
//       {
//         icon: 'image', type: 'fileExplorer',
//         onAction: file => this.insertImageFromFile(file, state)
//       },
//       this.getCodeBlockAddButton(state),
//       this.getHintBlockAddButton(state),
//       this.getFormulaAddButton(state, this.dialogService),
//     ];
//   }
//
//   getSnowButtons(): FlTextEditorSnowButton[] {
//     return [];
//   }
//
//   public getImageUrl(filename: string): string {
//     return this.reportTemplateService.getImageUrl(filename);
//   }
//
//   onPasteImage(imgFile: File, state: CaTextEditorState): any {
//     return this.insertImageFromFile(imgFile, state);
//   }
//
//   private insertImageFromFile(file: File, textEditorState: CaTextEditorState): void {
//     const index = textEditorState.getCurrentSelectionIndex();
//     this.reportTemplateService.uploadImage(file).subscribe(
//       fileUrl => textEditorState.insertImageFromUrl(fileUrl, index)
//     );
//   }
//
//
// }
