import {
  Component,
  ElementRef,
  Inject,
  makeStateKey,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  StateKey,
  TransferState
} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {HaDocumentation} from '../../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {HaDocumentationService} from '../../../../ha-core/ha-service/ha-documentation.service';
import {FlConfirmDialogInput, FlDebouncer, FlDialogService, FlFormDialogInput} from '@monorepo/front-core-lib';
import {HaAuthenticatedUserService} from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import {Observable} from 'rxjs';
import {HaDocTextEditorConfig} from '../ha-doc-text-editor-config.class';
import {HaNodeDTO} from '../../../../ha-core/ha-model/ha-entities/ha-node.class';
import {
  HaPublicSidenavCreateFormDialogComponent
} from '../ha-public-sidenav-create-form-dialog/ha-public-sidenav-create-form-dialog.component';

import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {HaMetadataService} from '../../../../ha-core/ha-service/ha-metadata.service';
import {ClRichText, ClRichTextI} from '@monorepo/core-lib';
import {FormControl} from '@angular/forms';

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

  formCtrl = new FormControl<ClRichTextI>(null);

  titles: any[] = [];

  isAdminOrBrickUser: Observable<boolean>;
  isLoading: boolean = false;
  textEditorConfig: HaDocTextEditorConfig;
  docNotFound: boolean = false;

  anchor: string = null;

  private contentDebouncer: FlDebouncer<ClRichTextI>;
  private lastUrl: string = null;
  private DOC_KEY: StateKey<object>;

  constructor(private brickService: HaBrickService,
              private documentationService: HaDocumentationService,
              private authUserService: HaAuthenticatedUserService,
              private dialogService: FlDialogService,
              private route: ActivatedRoute,
              private router: Router,
              private transferState: TransferState,
              @Inject(PLATFORM_ID) private platformId: object,
              private metadataService: HaMetadataService,
              private elementRef: ElementRef<HTMLElement>) {
  }


  ngOnInit(): void {
    this.DOC_KEY = makeStateKey<object>('doc');

    this.route.parent.parent.url.subscribe(url => this.init(url[0].path, url[1].path));

    //create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.contentDebouncer.getDebouncedValue().subscribe(value => this.saveContent(value));

    this.route.fragment.subscribe(anchor => {
      this.anchor = anchor;
    });
  }

  private init(brickName: string, brickVersion: string): void {
    if(this.brickName != null) this.lastBrickName = this.brickName;
    this.brickName = brickName;
    this.brickVersion = brickVersion;
    this.brickService.getByName(this.brickName).subscribe(brick => {
      this.isAdminOrBrickUser = this.authUserService.isAdminOrBrickUser(brick);
    });
    this.getActiveDoc();
  }

  private getActiveDoc(): void {
    this.route.url.subscribe((url: UrlSegment[]) => {
      if ((this.lastBrickName != this.brickName || url.toString() != this.lastUrl) && this.lastUrl != '') {
        if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOC_KEY)) {
          const doc: HaDocumentation = this.transferState.get(this.DOC_KEY, null) as HaDocumentation;
          if (doc) {
            this.onDocLoaded(doc);
          } else {
            this.docNotFound = true;
          }
          this.transferState.remove(this.DOC_KEY);
        } else {
          this.getDocumentationByPath(url);
        }
      }
      this.lastUrl = url.toString();
    });
  }

  private getDocumentationByPath(url: UrlSegment[]): void {
    this.isLoading = true;
    this.documentation = null;
    this.docNotFound = false;
    const path: string = url.join('/') + '/';
    this.brickService.getDocByPath(this.brickName, path, this.brickVersion).subscribe(doc => {
      if (doc) {
        if (isPlatformServer(this.platformId)) {
          if (this.transferState.hasKey(this.DOC_KEY)) {
            this.documentation = this.transferState.get(this.DOC_KEY, null) as HaDocumentation;
          } else {
            this.transferState.set(this.DOC_KEY, doc);
          }
        }
        this.onDocLoaded(doc);
      } else {
        this.docNotFound = true;
      }
    });
  }

  private onDocLoaded(doc: HaDocumentation): void {
    this.docNotFound = false;
    this.documentation = doc;

    this.formCtrl.patchValue(doc.content);
    this.formCtrl.disable();
    this.titles = [];

    if (doc.content) {
      const richText = new ClRichText(doc.content);
      this.titles = richText.getHeaders([2, 3]);
    }

    this.textEditorConfig =
      new HaDocTextEditorConfig(this.brickName, this.brickVersion, this.documentation.title,
        this.documentationService, this.dialogService, this.documentation.id);

    this.isLoading = false;

    this.metadataService.setPageTitle('ha.documentation.brick.title',
      true, {brickTitle: this.brickName, docTitle: this.documentation.title});
    this.metadataService.addMetaTag('description', 'ha.documentation.brick.description',
      true, {brickTitle: this.brickName, docTitle: this.documentation.title});
  }

  onContentUpdate(content: ClRichTextI): void {
    this.contentDebouncer.setValue(content);
    if (this.formCtrl.value) {
      const richText = new ClRichText(content);
      this.titles = richText.getHeaders([2, 3]);
    }
  }

  private saveContent(value: ClRichTextI): void {
    if (this.documentation == null) return;
    this.isAdminOrBrickUser.subscribe(isAdmin => {
      if (isAdmin) {
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

  private openSmallDialog(input: any): void {
    this.dialogService.openSmallDialog(HaPublicSidenavCreateFormDialogComponent, {data: input}).afterClosed().subscribe(
      (res: HaDocumentation) => {
        if (res != null) {
          this.router.navigate(['..', res.path], {relativeTo: this.route});
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.contentDebouncer.complete();
  }

}
