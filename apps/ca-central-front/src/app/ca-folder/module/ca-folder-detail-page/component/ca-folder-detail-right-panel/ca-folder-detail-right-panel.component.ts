import { Component, ComponentRef, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CaFolderDescriptionComponent } from '../ca-folder-description/ca-folder-description.component';
import { CaFolderReportPreviewComponent } from '../ca-folder-report-preview/ca-folder-report-preview.component';
import {
  CaFolderExperimentPreviewComponent
} from '../ca-folder-experiment-preview/ca-folder-experiment-preview.component';
import { CaFolderChatRightPanelComponent } from '../ca-folder-chat-right-panel/ca-folder-chat-right-panel.component';
import { CaFolderSettingsComponent } from '../ca-folder-settings/ca-folder-settings.component';
import { CaFolderDetailRightPanel } from '../../state/ca-folder-right-panel.state';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';
import {
  CaConstellabDocumentPreviewComponent
} from '../ca-constellab-document-preview/ca-constellab-document-preview.component';

/**
 * Right panel of the folder detail page
 */
@Component({
  selector: 'ca-folder-detail-right-panel',
  templateUrl: './ca-folder-detail-right-panel.component.html',
  styleUrls: ['./ca-folder-detail-right-panel.component.scss']
})
export class CaFolderDetailRightPanelComponent implements OnInit, OnDestroy {


  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  private viewComponentRef: ComponentRef<any>;

  constructor(@Inject(FL_PORTAL_DATA) private data: CaFolderDetailRightPanel) {
  }

  ngOnInit(): void {
    this.createComponent(this.data);
  }

  private createComponent(rightPanelState: CaFolderDetailRightPanel): void {
    switch (rightPanelState.type) {
      case 'description':
        const descComponent = this.container.createComponent(CaFolderDescriptionComponent);
        descComponent.instance.folderId = rightPanelState.objectId;
        descComponent.instance.folderName = rightPanelState.objectName;
        this.viewComponentRef = descComponent;
        break;
      case 'report':
        const reportComponent = this.container.createComponent(CaFolderReportPreviewComponent);
        reportComponent.instance.reportId = rightPanelState.objectId;
        this.viewComponentRef = reportComponent;
        break;
      case 'experiment':
        const expComponent = this.container.createComponent(CaFolderExperimentPreviewComponent);
        expComponent.instance.experimentId = rightPanelState.objectId;
        this.viewComponentRef = expComponent;
        break;
      case 'constellab-document':
        const docComponent = this.container.createComponent(CaConstellabDocumentPreviewComponent);
        docComponent.instance.documentId = rightPanelState.objectId;
        this.viewComponentRef = docComponent;
        break;
      case 'chat':
        const chatComponent = this.container.createComponent(CaFolderChatRightPanelComponent);
        chatComponent.instance.folderId = rightPanelState.objectId;
        this.viewComponentRef = chatComponent;
        break;
      case 'settings':
        this.viewComponentRef = this.container.createComponent(CaFolderSettingsComponent);
        break;
      default:
        console.log('Unknown right panel type', rightPanelState.type);
    }
  }

  private destroyViewComponentRef(): void {
    this.viewComponentRef?.destroy();
    this.viewComponentRef = null;
  }

  ngOnDestroy(): void {
    this.destroyViewComponentRef();
  }


}
