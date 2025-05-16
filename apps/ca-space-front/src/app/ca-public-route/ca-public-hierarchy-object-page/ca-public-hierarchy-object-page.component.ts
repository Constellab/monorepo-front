import { Component, inject, OnDestroy, OnInit, viewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlServerError } from '../../../../../../libs/front-core-lib/src/lib/fl-api';
import { FlCoreComponentModule } from '../../../../../../libs/front-core-lib/src/lib/fl-core-component/fl-core-component.module';
import { FlLoaderModule } from '../../../../../../libs/front-core-lib/src/lib/fl-loader/fl-loader.module';
import { FlSectionModule } from '../../../../../../libs/front-core-lib/src/lib/fl-section/fl-section.module';
import { CaSpaceInterceptor } from '../../ca-core/interceptor/ca-space-interceptor.service';
import {
  CaRootFolderUserRole,
  CaRootFolderUserRoleObj,
} from '../../ca-core/model/entities/folder/ca-folder-user.class';
import {
  CaHierarchyObject,
  CaHierarchyObjectType,
} from '../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaDocumentService } from '../../ca-core/service-api/ca-document.service';
import { CaHierarchyObjectTokenService } from '../../ca-core/service-api/ca-hierarchy-object-token.service';
import { CaConstellabDocumentDetailComponent } from '../../ca-folder/module/ca-document-core/component/ca-constellab-document-detail/ca-constellab-document-detail.component';
import { CaDocumentPreviewComponent } from '../../ca-folder/module/ca-document-core/component/ca-document-preview/ca-document-preview.component';
import { CaNoteDetailComponent } from '../../ca-folder/module/ca-note-detail-page/component/ca-note-detail/ca-note-detail.component';
import { CaScenarioDetailComponent } from '../../ca-folder/module/ca-scenario-core/component/ca-scenario-detail/ca-scenario-detail.component';

@Component({
  selector: 'ca-public-hierarchy-object-page',
  imports: [FlSectionModule, FlLoaderModule, FlCoreComponentModule],
  templateUrl: './ca-public-hierarchy-object-page.component.html',
  styleUrl: './ca-public-hierarchy-object-page.component.scss',
})
export class CaPublicHierarchyObjectPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);

  private hierarchyObjectTokenService = inject(CaHierarchyObjectTokenService);
  private spaceInterceptor = inject(CaSpaceInterceptor);
  private documentService = inject(CaDocumentService);

  // force the user role to be viewer
  private readonly userRole = new CaRootFolderUserRoleObj(CaRootFolderUserRole.VIEWER);

  isLoading = true;
  error: string | null = null;
  hierarchyObject: CaHierarchyObject;

  container = viewChild('container', { read: ViewContainerRef });
  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params['token']));
  }

  private init(token: string): void {
    this.spaceInterceptor.setHierarchyObjectToken(token);
    this.hierarchyObjectTokenService.getHierarchyObjectByToken(token).subscribe({
      next: (hierarchyObject) => this.getHierarchyObjectSuccess(hierarchyObject, token),
      error: (error) => this.onError(error),
    });
  }

  private getHierarchyObjectSuccess(hierarchyObject: CaHierarchyObject, token: string): void {
    this.hierarchyObject = hierarchyObject;
    this.isLoading = false;
    this.container().clear();

    switch (hierarchyObject.objectType) {
      case CaHierarchyObjectType.CONSTELLAB_DOCUMENT:
        this.generateConstellabDocument(hierarchyObject.id, token);
        break;
      case CaHierarchyObjectType.DOCUMENT:
        this.generateDocumentPreview(hierarchyObject, token);
        break;
      case CaHierarchyObjectType.NOTE:
        this.generateNote(hierarchyObject.id, token);
        break;
      case CaHierarchyObjectType.SCENARIO:
        this.generateScenario(hierarchyObject.id);
        break;
      default:
        console.error('Unsupported hierarchy object type ' + hierarchyObject.objectType);
        break;
    }
  }

  private generateConstellabDocument(documentId: string, token: string): void {
    const component = this.container().createComponent(CaConstellabDocumentDetailComponent);
    component.setInput('documentId', documentId);
    component.setInput('userRole', this.userRole);
    component.setInput('hierarchyObjectToken', token);
  }

  private generateDocumentPreview(hierarchyObject: CaHierarchyObject, token: string): void {
    const component = this.container().createComponent(CaDocumentPreviewComponent);
    component.setInput('documentId', hierarchyObject.id);
    component.setInput('userRole', this.userRole);
    component.setInput('hierarchyObjectToken', token);
  }

  private generateNote(noteId: string, token: string): void {
    const component = this.container().createComponent(CaNoteDetailComponent);
    component.setInput('noteId', noteId);
    component.setInput('userRole', this.userRole);
    component.setInput('hierarchyObjectToken', token);
  }

  private generateScenario(scenarioId: string): void {
    const component = this.container().createComponent(CaScenarioDetailComponent);
    component.setInput('scenarioId', scenarioId);
    component.setInput('userRole', this.userRole);
  }

  private onError(error: FlServerError): void {
    this.isLoading = false;
    this.error = error.message;
  }

  ngOnDestroy(): void {
    this.spaceInterceptor.clearHierarchyObjectToken();
    this.container().clear();
  }
}
