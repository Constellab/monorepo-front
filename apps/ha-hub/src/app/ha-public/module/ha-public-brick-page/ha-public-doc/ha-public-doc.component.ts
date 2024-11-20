import { Component, computed, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { HaDocumentation } from '../../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { HaDocumentationService } from '../../../../ha-core/ha-service/ha-documentation.service';
import {
  FlConfirmDialogInput,
  FlDialogService,
  FlFormDialogInput,
  FlOverlayRef,
  FlPortalService,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaDocTextEditorConfig } from '../ha-doc-text-editor-config.class';
import { HaNodeDTO } from '../../../../ha-core/ha-model/ha-entities/ha-node.class';
import { HaPublicSidenavCreateFormDialogComponent } from '../ha-public-sidenav-create-form-dialog/ha-public-sidenav-create-form-dialog.component';
import { HaMetadataService } from '../../../../ha-core/ha-service/ha-metadata.service';
import { FormControl } from '@angular/forms';
import {
  TeRichText,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
} from '@monorepo/text-editor';
import { HaFile } from '../../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaHttpRedirectionService } from '../../../../ha-core/ha-service/ha-http-redirection.service';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';

@Component({
  selector: 'ha-public-doc',
  templateUrl: './ha-public-doc.component.html',
  styleUrls: ['./ha-public-doc.component.scss'],
})
export class HaPublicDocComponent implements OnInit {
  versionPath: Signal<string> = this.brickPageState.getBrickVersionPath();

  brick: Signal<HaBrick> = this.brickPageState.brick;

  documentation: Signal<HaDocumentation> = computed(() => {
    const doc = this.brickPageState.doc();
    if (doc) {
      this.onDocLoaded(doc);
    }
    return doc;
  });

  userHasEditRight: Signal<boolean> = this.brickPageState.getUserHasEditRight();

  isDocLoading: Signal<boolean> = this.brickPageState.isDocLoading;

  docNotFound: Signal<boolean> = this.brickPageState.isDocError;

  docFiles: Signal<HaFile[]> = this.brickPageState.getDocFiles();

  docFileUrlPrefix: Signal<string> = this.brickPageState.getDocFileUrlPrefix();

  formCtrl = new FormControl<TeRichText>(null);

  textEditorConfig: HaDocTextEditorConfig;

  anchor: string = null;

  currentDocTitle = '';

  historyOverlayRef: FlOverlayRef;

  constructor(
    private brickService: HaBrickService,
    private documentationService: HaDocumentationService,
    private dialogService: FlDialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private metadataService: HaMetadataService,
    private httpRedirectionService: HaHttpRedirectionService,
    private portalService: FlPortalService,
    private brickPageState: HaBrickPageState
  ) {}

  saveContent = (value: TeRichText): Observable<HaDocumentation> =>
    this.documentationService.updateContent(this.documentation().id, value);

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((anchor) => {
      this.anchor = anchor;
    });

    this.activatedRoute.url.subscribe((url: UrlSegment[]) => {
      if (url.length == 1 && url[0]?.path == 'getting-started') {
        this.redirectToGettingStartedDoc();
        return;
      }

      const docId = url[url.length - 1].path;

      this.brickPageState.initDoc(docId, url);
    });
  }

  onTitleChange(title: string): void {
    if (title.length == 0 || title.length > 50) return;
    this.documentationService
      .update({ id: this.documentation().id, title: title })
      .subscribe((documentation) => {
        if (documentation) {
          this.brickPageState.setDoc(documentation);
          this.httpRedirectionService.redirectTo(
            HaRouterService.getDocumentationRoute(
              this.brick().name,
              this.versionPath(),
              documentation.completePath,
              documentation.id
            )
          );
        }
      });
  }

  openResourceDelete(): void {
    // TODO : improve message and delete doc once it's done
    const input: FlConfirmDialogInput = {
      title: 'confirm_deletion',
      content: 'confirm_deletion_message',
      observable: this.documentationService.deleteById(this.documentation().id),
      successMessage: 'documentation_deleted',
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe();
  }

  changeTextEditorState(): void {
    if (this.formCtrl.disabled) this.formCtrl.enable();
    else this.formCtrl.disable();
  }

  prepareEditDialog(): void {
    this.createEditDialog(this.documentation());
  }

  downloadFile(docId: string, file: HaFile): string {
    // download file from server (not from the client)
    return this.documentationService.getDocFilePath(docId, file.name);
  }

  titleCurrentValue(): string {
    return this.currentDocTitle;
  }

  openHistoryPanel(): void {
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    } else {
      this.historyOverlayRef = this.portalService.createPortal(
        TeTextEditorHistoryPortalComponent,
        this.portalService.getRightSidePortalConfig(false),
        {
          service: this.documentationService,
          entityId: this.documentation().id,
          textEditorConfig: this.textEditorConfig,
          isEditable: this.userHasEditRight(),
        } as TeTextEditorHistoryPortalData
      );
      this.historyOverlayRef.detachments().subscribe(() => {
        this.historyOverlayRef = null;
      });
    }
  }

  private redirectToGettingStartedDoc(): void {
    this.brickService.getBrickGettingStarted(this.brick().name, this.versionPath()).subscribe((doc) => {
      if (doc) {
        this.httpRedirectionService.redirectTo(
          HaRouterService.getDocumentationRoute(
            this.brick().name,
            this.versionPath(),
            doc.completePath,
            doc.id
          )
        );
      }
    });
  }

  private onDocLoaded(doc: HaDocumentation): void {
    this.currentDocTitle = doc.title;

    this.formCtrl.patchValue(doc.content);
    this.formCtrl.disable();

    this.textEditorConfig = new HaDocTextEditorConfig(this.documentationService, doc.id);

    this.metadataService.setPageTitle('ha.documentation.brick.title', true, {
      brickTitle: this.brick().name,
      docTitle: doc.title,
    });
    this.metadataService.addMetaTag('description', 'ha.documentation.brick.description', true, {
      brickTitle: this.brick().name,
      docTitle: doc.title,
    });
  }

  private createEditDialog(object: HaDocumentation): void {
    const node: HaNodeDTO = new HaNodeDTO();
    node.id = object.id;
    node.path = object.path;
    node.title = object.title;

    const input: FlFormDialogInput<HaNodeDTO> = {
      mode: 'update',
      object: node,
    };

    this.openSmallDialog(input);
  }

  private openSmallDialog(input: any): void {
    this.dialogService
      .openSmallDialog(HaPublicSidenavCreateFormDialogComponent, {
        data: input,
      })
      .afterClosed()
      .subscribe((res: HaDocumentation) => {
        if (res != null) {
          this.router.navigate(['..', res.path], {
            relativeTo: this.activatedRoute,
          });
        }
      });
  }
}
