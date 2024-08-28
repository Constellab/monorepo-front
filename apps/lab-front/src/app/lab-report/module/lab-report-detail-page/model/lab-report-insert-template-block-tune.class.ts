import { TeBlockTune, TeHelper } from '@monorepo/text-editor';
import { MenuConfig } from '@editorjs/editorjs/types/tools';
import { FlDialogService } from '@monorepo/front-core-lib';
import { LabReportContent } from '../../../../lab-core/model/entities/lab-report.entity';
import {
  LabReportInsertTemplateDialogComponent,
  LabReportInsertTemplateDialogData
} from '../component/lab-report-insert-template-dialog/lab-report-insert-template-dialog.component';

export class LabReportInsertTemplateBlockTuneConfig {
  reportId: string;
}

/**
 * Block tune add the option to insert a document template in the report rich text
 */
export class LabReportInsertTemplateBlockTune extends TeBlockTune {
  render(): HTMLElement | MenuConfig {
    const button = TeHelper.generateTuneButton(
      TeHelper.getTranslateService().translate('biox.report_insert_document_template'),
      'description'
    );
    button.addEventListener('click', () => {
      this.openAudioDialog(this.config.block.id);
    });
    return button;
  }

  private openAudioDialog(blockId: string): void {
    const dialogService = this.envInjector.get(FlDialogService);
    const data: LabReportInsertTemplateDialogData = {
      reportId: this.getConfig().reportId,
      blockIndex: this.config.api.blocks.getBlockIndex(blockId)
    };
    dialogService.openSmallDialog(LabReportInsertTemplateDialogComponent, {
      data: data
    }).afterClosed().subscribe((result) => this.onClosedDialog(result));
  }

  private onClosedDialog(content: LabReportContent): void {
    if (content) {
      this.config.api.blocks.render(content);
    }
  }

  private getConfig(): LabReportInsertTemplateBlockTuneConfig {
    return this.additionalData;
  }


}
