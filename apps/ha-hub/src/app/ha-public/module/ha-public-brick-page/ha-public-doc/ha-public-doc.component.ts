import {Component, Inject, makeStateKey, OnDestroy, OnInit, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {HaDocumentation} from '../../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {HaDocumentationService} from '../../../../ha-core/ha-service/ha-documentation.service';
import {
  FlConfirmDialogInput,
  FlDebouncer,
  FlDialogService,
  FlFormDialogInput,
  FlOverlayRef, FlPortalService
} from '@monorepo/front-core-lib';
import {HaAuthenticatedUserService} from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import {Observable} from 'rxjs';
import {HaDocTextEditorConfig} from '../ha-doc-text-editor-config.class';
import {HaNodeDTO} from '../../../../ha-core/ha-model/ha-entities/ha-node.class';
import {
  HaPublicSidenavCreateFormDialogComponent
} from '../ha-public-sidenav-create-form-dialog/ha-public-sidenav-create-form-dialog.component';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HaMetadataService} from '../../../../ha-core/ha-service/ha-metadata.service';
import {FormControl} from '@angular/forms';
import {
  TeRichText,
  TeRichTextContent,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData
} from '@monorepo/text-editor';
import {BlockToolData} from '@editorjs/editorjs/types/tools';
import {HaFile} from '../../../../ha-core/entity-module/ha-file-core/model/ha-file';
import {HaHttpRedirectionService} from '../../../../ha-core/ha-service/ha-http-redirection.service';
import {HaRouterService} from '../../../../ha-core/ha-service/ha-router.service';
import {ClStringHelper} from '@monorepo/core-lib';


@Component({
  selector: 'ha-public-doc-page',
  templateUrl: './ha-public-doc.component.html',
  styleUrls: ['./ha-public-doc.component.scss'],
})
export class HaPublicDocComponent implements OnInit, OnDestroy {

  documentation: HaDocumentation;
  brickName: string;
  lastBrickName: string;
  brickVersion: string;

  formCtrl = new FormControl<TeRichTextContent>(null);

  titles: BlockToolData[] = [];

  isCreatorOrBrickUser$: Observable<boolean>;
  isLoading: boolean = false;
  textEditorConfig: HaDocTextEditorConfig;
  docNotFound: boolean = false;

  anchor: string = null;

  currentDocTitle = '';
  lastDocId: string;
  currentUrl: string;
  docFiles: HaFile[];

  historyOverlayRef: FlOverlayRef;

  private contentDebouncer: FlDebouncer<TeRichTextContent>;
  private DOC_KEY: StateKey<object>;

  constructor(private brickService: HaBrickService,
              private documentationService: HaDocumentationService,
              private authUserService: HaAuthenticatedUserService,
              private dialogService: FlDialogService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId: object,
              private metadataService: HaMetadataService,
              private httpRedirectionService: HaHttpRedirectionService,
              private portalService: FlPortalService) {
  }


  ngOnInit(): void {
    this.DOC_KEY = makeStateKey<object>('doc');

    this.activatedRoute.parent.parent.url.subscribe(url => {
      this.init(url[0].path, url[1].path);
    });

    //create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.contentDebouncer.getDebouncedValue().subscribe(value => this.saveContent(value));

    this.activatedRoute.fragment.subscribe(anchor => {
      this.anchor = anchor;
    });
  }

  private init(brickName: string, brickVersion: string): void {
    if(this.brickName != null) this.lastBrickName = this.brickName;
    this.brickName = brickName;
    this.brickVersion = brickVersion;
    this.brickService.getByName(this.brickName).subscribe(brick => {
      this.isCreatorOrBrickUser$ = this.authUserService.isBrickCreatorOrBrickUser(brick);
    });
    this.getActiveDoc();
  }

  onTitleChange(title: string): void {
    if (title.length == 0 || title.length > 50) return;
    this.documentationService.update({id: this.documentation.id, title: title}).subscribe(documentation => {
      if (documentation) {
        this.documentation = documentation;
        this.httpRedirectionService.redirectTo(HaRouterService.getDocumentationRoute(
          this.brickName, this.brickVersion, this.documentation.completePath, this.documentation.id
        ));
      }
    });
  }

  private getActiveDoc(): void {
    this.activatedRoute.url.subscribe((url: UrlSegment[]) => {
      if(url.length == 1 && url[0]?.path == 'getting-started'){
        this.redirectToGettingStartedDoc();
        return;
      }

      this.currentUrl = url.join('/');
      const docId = url[url.length - 1].path;
      if (this.lastDocId == docId) return;
      this.lastDocId = docId;

      if (!ClStringHelper.isUUID(docId)) {
        const completePath = url.map(segment => segment.path).join('/');
        this.documentationService.getByCompletePath(this.brickName, this.brickVersion, completePath).subscribe({
          next: doc => {
            if (doc) {
              const docUrl = HaRouterService.getDocumentationRoute(this.brickName, this.brickVersion, doc.completePath, doc.id);
              if (docUrl != this.currentUrl) {
                this.httpRedirectionService.redirectTo(docUrl);
              }
            } else {
              this.docNotFound = true;
            }
          },
          error: () => {
            this.docNotFound = true;
          }
        });
        return;
      }

      this.documentationService.getById(docId).subscribe(doc => {
        if (doc) {
          this.onDocLoaded(doc);
        } else {
          this.docNotFound = true;
        }
      });

      if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOC_KEY)) {
        const doc: HaDocumentation = this.transferState.get(this.DOC_KEY, null) as HaDocumentation;
        if (doc) {
          this.onDocLoaded(doc);
        } else {
          this.docNotFound = true;
        }
        this.transferState.remove(this.DOC_KEY);
      } else {
        this.setDocumentation(docId);
      }
    });
  }

  private redirectToGettingStartedDoc(): void {
    this.brickService.getBrickGettingStarted(this.brickName, this.brickVersion).subscribe(doc => {
      if (doc) {

        this.httpRedirectionService.redirectTo(HaRouterService.getDocumentationRoute(
          this.brickName, this.brickVersion, doc.completePath, doc.id
        ));
      }
    });
  }

  private onDocLoaded(doc: HaDocumentation): void {
    this.docNotFound = false;
    this.documentation = doc;

    this.currentDocTitle = doc.title;

    this.formCtrl.patchValue(doc.content);
    this.formCtrl.disable();
    this.titles = TeRichText.getTitles(doc.content, [2, 3]);


    if (doc.content) {
      // TODO: Get titles
    }

    this.getDocFiles();

    this.textEditorConfig =
      new HaDocTextEditorConfig(this.documentationService, this.documentation.id);

    this.isLoading = false;

    this.metadataService.setPageTitle('ha.documentation.brick.title',
      true, {brickTitle: this.brickName, docTitle: this.documentation.title});
    this.metadataService.addMetaTag('description', 'ha.documentation.brick.description',
      true, {brickTitle: this.brickName, docTitle: this.documentation.title});
  }

  private getDocFiles(): void {
    this.documentationService.getDocFiles(this.documentation.id).subscribe(files => {
      this.docFiles = files;
    });
  }

  onContentUpdate(content: TeRichTextContent): void {
    this.contentDebouncer.setValue(content);
    if (this.formCtrl.value) {
      // TODO : Get titles
    }
  }

  private saveContent(value: TeRichTextContent): void {
    if (this.documentation == null) return;
    this.isCreatorOrBrickUser$.subscribe(hasRight => {
      if (hasRight) {
        this.documentationService.updateContent(this.documentation.id, value).subscribe();
      }
    });
  }


  openResourceDelete(): void {
    // TODO : improve message and delete doc once it's done
    const input: FlConfirmDialogInput = {
      title: 'confirm_deletion',
      content: 'confirm_deletion_message',
      translateTitleAndContent: true,
      observable: this.documentationService.deleteById(this.documentation.id),
      successMessage: 'documentation_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe();
  }

  changeTextEditorState(): void {
    if (this.formCtrl.disabled)
      this.formCtrl.enable();
    else
      this.formCtrl.disable();
  }

  prepareEditDialog(): void {
    this.createEditDialog(this.documentation);
  }

  private createEditDialog(object: HaDocumentation): void {
    const node: HaNodeDTO = new HaNodeDTO();
    node.id = object.id;
    node.path = object.path;
    node.title = object.title;

    const input: FlFormDialogInput<HaNodeDTO> = {
      mode: 'update',
      object: node
    };

    this.openSmallDialog(input);
  }

  private setDocumentation(docId: string): void {
    this.isLoading = true;
    this.documentation = null;
    this.docNotFound = false;
    this.documentationService.getById(docId).subscribe({
      next: doc => {
        if (doc) {
          if (isPlatformServer(this.platformId)) {
            if (this.transferState.hasKey(this.DOC_KEY)) {
              this.documentation = this.transferState.get(this.DOC_KEY, null) as HaDocumentation;
            } else {
              this.transferState.set(this.DOC_KEY, doc);
            }
          }
          this.onDocLoaded(doc);
          if (this.documentation.completePath + this.documentation.id != this.currentUrl) {
            this.httpRedirectionService.redirectTo(HaRouterService.getDocumentationRoute(
              this.brickName, this.brickVersion, this.documentation.completePath, this.documentation.id
            ));
          }
        } else {
          this.docNotFound = true;
        }
      },
      error: () => {
        this.docNotFound = true;
        this.isLoading = false;
      }
    });
  }

  downloadFile(docId: string, file: HaFile): string {
    // download file from server (not from the client)
    return this.documentationService.getDocFilePath(docId, file.name);
  }

  private openSmallDialog(input: any): void {
    this.dialogService.openSmallDialog(HaPublicSidenavCreateFormDialogComponent, {data: input}).afterClosed().subscribe(
      (res: HaDocumentation) => {
        if (res != null) {
          this.router.navigate(['..', res.path], {relativeTo: this.activatedRoute});
        }
      }
    );
  }

  titleCurrentValue(): string{
    return this.currentDocTitle;
  }

  openHistoryPanel(): void {
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    } else {
      this.historyOverlayRef =
        this.portalService.createPortal(TeTextEditorHistoryPortalComponent, this.portalService.getRightSidePortalConfig(false), {
          service: this.documentationService,
          entityId: this.documentation.id,
          textEditorConfig: this.textEditorConfig
        } as TeTextEditorHistoryPortalData);
      this.historyOverlayRef.detachments().subscribe(() => {
        this.historyOverlayRef = null;
      });
    }
  }

  ngOnDestroy(): void {
    this.contentDebouncer.complete();
  }

}
