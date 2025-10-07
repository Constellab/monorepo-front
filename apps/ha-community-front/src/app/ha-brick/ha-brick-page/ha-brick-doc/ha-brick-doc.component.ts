import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import {
  TeBlock,
  TeBlockFigureData,
  TeRichText,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
  TeTextEditorModule,
} from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { Ha404Component } from '../../../ha-404/ha-404/ha-404.component';
import {
  HaAdminSendToDifyDialogComponent,
  HaAdminSendToDifyDialogInput,
} from '../../../ha-admin/module/ha-admin-send-brick-docs-to-dify-dialog/ha-admin-send-to-dify-dialog.component';
import { HaBrick } from '../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaDocumentation } from '../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import { HaEntityType } from '../../../ha-core/ha-model/ha-entities/ha-entity-type';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaIsAdminDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-is-admin/ha-is-admin.directive';
import { HaDocumentationService } from '../../../ha-core/ha-service/ha-documentation.service';
import { HaHttpRedirectionService } from '../../../ha-core/ha-service/ha-http-redirection.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaJsonLdState } from '../../../ha-core/ha-state/ha-json-ld.state';
import { HaBrickPageState } from '../../state/ha-brick-page.state';
import { HaDocTextEditorConfig } from '../ha-doc-text-editor-config.class';

@Component({
  selector: 'ha-brick-doc',
  templateUrl: './ha-brick-doc.component.html',
  styleUrls: ['./ha-brick-doc.component.scss'],
  imports: [
    FlFormModule,
    TeTextEditorModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    FlLoaderModule,
    Ha404Component,
    TranslatePipe,
    HaIsAdminDirective,
  ],
})
export class HaBrickDocComponent extends HaCommunityPageDirective implements OnInit, OnDestroy {
  private documentationService: HaDocumentationService = inject(HaDocumentationService);
  private dialogService: FlDialogService = inject(FlDialogService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private httpRedirectionService: HaHttpRedirectionService = inject(HaHttpRedirectionService);
  private portalService: FlPortalService = inject(FlPortalService);
  private brickPageState: HaBrickPageState = inject(HaBrickPageState);
  private jsonLdState: HaJsonLdState = inject(HaJsonLdState);

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

  formCtrl = new FormControl<TeRichText>(null);

  textEditorConfig: HaDocTextEditorConfig;

  anchor: string = null;

  currentDocTitle = '';

  historyOverlayRef: FlOverlayRef;

  urlSubscription: Subscription;

  constructor() {
    super();
    effect(() => {
      const brick = this.brick();
      if (brick == null) {
        return;
      }
      if (this.urlSubscription != null) {
        this.urlSubscription?.unsubscribe();
      }
      this.urlSubscription = this.activatedRoute.url.subscribe((url: UrlSegment[]) => {
        const docId = url[url.length - 1].path;
        this.brickPageState.initDoc(docId, url, brick);
      });
    });

    effect(() => {
      const doc = this.documentation();
      if (doc) {
        const docFigureBlocks: TeBlock<TeBlockFigureData>[] = doc.content.getFiguresBlocks();
        const docImages: string[] = [];
        docFigureBlocks.forEach((figureBlock) => {
          docImages.push(this.documentationService.getImageUrl(doc.id, figureBlock.data.filename));
        });

        this.jsonLdState.setArticleJsonLdContent(doc.title, docImages, doc.createdAt, [doc.createdBy]);
      }
    });
  }

  saveContent = (value: TeRichText): Observable<HaDocumentation> =>
    this.documentationService.updateContent(this.documentation().id, value);

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((anchor) => {
      this.anchor = anchor;
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

  downloadDocMarkdown(docId: string): void {
    const zipFileUrl = this.documentationService.urlToDownloadDocMarkdown(docId);
    FlFileHelper.downloadUrl(zipFileUrl);
  }

  openSendDocToDify(docId: string): void {
    const data: HaAdminSendToDifyDialogInput = {
      entityType: HaEntityType.DOC,
      entityId: docId,
    };

    this.dialogService.openSmallDialog(HaAdminSendToDifyDialogComponent, { data: data });
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

    super.setMetaTags(
      {
        text: 'ha.documentation.brick.title',
        translateParam: { param: { brickTitle: this.brick().name, docTitle: doc.title } },
      },
      {
        text: 'ha.documentation.brick.description',
        translateParam: { param: { brickTitle: this.brick().name, docTitle: doc.title } },
      },
      this.brick().imageLink,
      HaRouterService.getFullRoute(this.router.url)
    );
  }

  ngOnDestroy(): void {
    this.jsonLdState.clearJsonLdContent();
    this.urlSubscription?.unsubscribe();
  }
}
