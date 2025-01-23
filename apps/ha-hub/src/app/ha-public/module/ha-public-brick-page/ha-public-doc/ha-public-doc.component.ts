import { Component, computed, effect, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { HaDocumentation } from '../../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import { HaBrickService } from '../../../../ha-core/ha-service/ha-brick.service';
import { HaDocumentationService } from '../../../../ha-core/ha-service/ha-documentation.service';
import { FlConfirmDialogInput, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import { Observable } from 'rxjs';
import { HaDocTextEditorConfig } from '../ha-doc-text-editor-config.class';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TeBlock,
  TeBlockFigureData,
  TeRichText,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
} from '@monorepo/text-editor';
import { HaFile } from '../../../../ha-core/entity-module/ha-file-core/model/ha-file';
import { HaHttpRedirectionService } from '../../../../ha-core/ha-service/ha-http-redirection.service';
import { HaRouterService } from '../../../../ha-core/ha-service/ha-router.service';
import { HaBrickPageState } from '../../../state/ha-brick-page.state';
import { HaBrick } from '../../../../ha-core/ha-model/ha-entities/ha-brick.class';
import { HaCommunityPage } from '../../../../ha-core/utils/ha-community.page';
import { HaJsonLdState } from '../../../../ha-core/ha-state/ha-json-ld.state';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { TeTextEditorModule } from '@monorepo/text-editor';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { Ha404Component } from '../../ha404/ha404.component';
import { HaTextEditorRightSidePanelComponent } from '../../../../ha-core/entity-module/ha-util-component-core/component/ha-text-editor-right-side-panel/ha-text-editor-right-side-panel.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-public-doc',
  templateUrl: './ha-public-doc.component.html',
  styleUrls: ['./ha-public-doc.component.scss'],
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
    HaTextEditorRightSidePanelComponent,
    TranslatePipe,
  ],
})
export class HaPublicDocComponent extends HaCommunityPage implements OnInit, OnDestroy {
  private brickService: HaBrickService = inject(HaBrickService);
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

  docFiles: Signal<HaFile[]> = this.brickPageState.getDocFiles();

  docFileUrlPrefix: Signal<string> = this.brickPageState.getDocFileUrlPrefix();

  formCtrl = new FormControl<TeRichText>(null);

  textEditorConfig: HaDocTextEditorConfig;

  anchor: string = null;

  currentDocTitle = '';

  historyOverlayRef: FlOverlayRef;

  constructor() {
    super();

    effect(
      () => {
        const doc = this.documentation();
        if (doc) {
          const docFigureBlocks: TeBlock<TeBlockFigureData>[] = doc.content.getFiguresBlocks();
          const docImages: string[] = [];
          docFigureBlocks.forEach((figureBlock) => {
            docImages.push(this.documentationService.getImageUrl(doc.id, figureBlock.data.filename));
          });

          this.jsonLdState.setArticleJsonLdContent(doc.title, docImages, doc.createdAt, [doc.createdBy]);
        }
      },
      { allowSignalWrites: true }
    );
  }

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
  }
}
