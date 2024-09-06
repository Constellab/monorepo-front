import { Component, ComponentRef, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CaProjectDescriptionComponent } from '../ca-project-description/ca-project-description.component';
import { CaProjectReportPreviewComponent } from '../ca-project-report-preview/ca-project-report-preview.component';
import {
  CaProjectExperimentPreviewComponent
} from '../ca-project-experiment-preview/ca-project-experiment-preview.component';
import { CaProjectCommentsComponent } from '../ca-project-comments/ca-project-comments.component';
import { CaProjectSettingsComponent } from '../ca-project-settings/ca-project-settings.component';
import { CaProjectDetailRightPanel } from '../../state/ca-folder-right-panel.state';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';
import {
  CaConstellabDocumentPreviewComponent
} from '../ca-constellab-document-preview/ca-constellab-document-preview.component';

/**
 * Right panel of the project detail page
 */
@Component({
  selector: 'ca-project-detail-right-panel',
  templateUrl: './ca-project-detail-right-panel.component.html',
  styleUrls: ['./ca-project-detail-right-panel.component.scss']
})
export class CaProjectDetailRightPanelComponent implements OnInit, OnDestroy {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  private viewComponentRef: ComponentRef<any>;

  constructor(@Inject(FL_PORTAL_DATA) private data: CaProjectDetailRightPanel) {
  }

  ngOnInit(): void {
    this.createComponent(this.data);
  }

  private createComponent(rightPanelState: CaProjectDetailRightPanel): void {
    switch (rightPanelState.type) {
      case 'description':
        this.viewComponentRef = this.container.createComponent(CaProjectDescriptionComponent);
        break;
      case 'report':
        const reportComponent = this.container.createComponent(CaProjectReportPreviewComponent);
        reportComponent.instance.reportId = rightPanelState.objectId;
        this.viewComponentRef = reportComponent;
        break;
      case 'experiment':
        const expComponent = this.container.createComponent(CaProjectExperimentPreviewComponent);
        expComponent.instance.experimentId = rightPanelState.objectId;
        this.viewComponentRef = expComponent;
        break;
      case 'constellab-document':
        const docComponent = this.container.createComponent(CaConstellabDocumentPreviewComponent);
        docComponent.instance.documentId = rightPanelState.objectId;
        this.viewComponentRef = docComponent;
        break;
      case 'chat':
        const chatComponent = this.container.createComponent(CaProjectCommentsComponent);
        chatComponent.instance.folderId = rightPanelState.objectId;
        this.viewComponentRef = chatComponent;
        break;
      case 'settings':
        this.viewComponentRef = this.container.createComponent(CaProjectSettingsComponent);
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
