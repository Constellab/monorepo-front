import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {
  HaDocumentation,
  HaDocumentationContentFormDTO
} from '../../../../ha-core/ha-model/ha-entities/ha-documentation.class';
import {HaBrickService} from '../../../../ha-core/ha-service/ha-brick.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {HaDocumentationService} from '../../../../ha-core/ha-service/ha-documentation.service';
import {
  FlConfirmDialogInput,
  FlDebouncer,
  FlDialogService,
  FlFormDialogInput,
  FlMenuDynamic,
  FlMenuDynamicService,
  FlOverlayRef,
  FlPortalService
} from '@monorepo/front-core-lib';
import {HaAuthenticatedUserService} from '../../../../ha-core/ha-service/ha-authenticated-user.service';
import {CmRichText, CmRichTextI} from '@monorepo/common-model';
import {Observable} from 'rxjs';
import {HaDocTextEditorConfig} from '../ha-doc-text-editor-config.class';
import {HaNodeDTO} from '../../../../ha-core/ha-model/ha-entities/ha-node.class';
import {
  HaPublicSidenavCreateFormDialogComponent
} from '../ha-public-sidenav-create-form-dialog/ha-public-sidenav-create-form-dialog.component';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

@Component({
  selector: 'ha-public-doc-page',
  templateUrl: './ha-public-doc.component.html',
  styleUrls: ['./ha-public-doc.component.scss'],
})
export class HaPublicDocComponent implements OnInit, OnDestroy {

  @Output() newItemEvent: EventEmitter<string> = new EventEmitter<string>();

  private contentDebouncer: FlDebouncer<CmRichTextI>;
  documentation: HaDocumentation;
  brickName: string;
  brickVersion: string;
  formGp: FormGroup<Partial<HaDocumentationContentFormDTO>>;
  titles: any[] = [];
  richText: CmRichText;
  lastUrl: string = null;
  isAdmin: Observable<boolean> = this.authUserService.isAdmin();
  isCheck: boolean = false;
  isLoading: boolean = false;
  textEditorConfig: HaDocTextEditorConfig;
  docNotFound: boolean = false;
  isDisabled: boolean = true;
  menuOpen: boolean;
  openedMenu: FlOverlayRef;
  DOC_KEY: StateKey<object>;

  constructor(
    private brickService: HaBrickService,
    private documentationService: HaDocumentationService,
    private authUserService: HaAuthenticatedUserService,
    private dialogService: FlDialogService,
    private portalService: FlPortalService,
    private contextMenuService: FlMenuDynamicService,
    private route: ActivatedRoute,
    private router: Router,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object) {
  }


  ngOnInit(): void {
    this.DOC_KEY = makeStateKey<object>('doc');
    this.buildForm();

    if (this.router.url.includes('tech-doc') || this.router.url.includes('product-doc')) {
      this.init(this.router.url.includes('tech-doc') ? 'gws_core' : 'gws_academy', 'latest');
    } else {
      this.route.parent.parent.url.subscribe(url => {
        this.init(url[0].path, url[1].path);
      });
    }

    //create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.contentDebouncer.getDebouncedValue().subscribe(
      value => {
        if (this.isCheck) {
          this.saveContent(value);
        }
      }
    );
  }

  private init(brickName: string, brickVersion: string): void{
    this.brickName = brickName;
    this.brickVersion = brickVersion;
    this.getActiveDoc();
  }

  private getActiveDoc(): void {

    this.route.url.subscribe((url: UrlSegment[]) => {
      if (url.toString() != this.lastUrl && this.lastUrl != '') {
        if(isPlatformBrowser(this.platformId) && this.transferState.hasKey(this.DOC_KEY)){
          const doc: HaDocumentation = this.transferState.get(this.DOC_KEY, null) as HaDocumentation;
          if(doc)
            this.actionOnDoc(url.length == 0, doc);
          else
            this.docNotFound = true;
          this.transferState.remove(this.DOC_KEY);
        } else {
          this.getDocumentationByPath(url, url.length == 0);
        }
      }
      this.lastUrl = url.toString();
    });
  }

  buildForm(): void {
    this.formGp = new FormBuilder().group({
      id: [null],
      content: [null],
    });
  }

  private getDocumentationByPath(url: UrlSegment[], isFirstDoc: boolean): void {
    this.isLoading = true;
    this.titles = [];
    this.documentation = null;
    this.isCheck = false;
    this.docNotFound = false;
    let path: string;
    if(!isFirstDoc)
      path = url.join('/') + '/';
    this.brickService.getDocByPath(this.brickName, path, this.brickVersion).subscribe(doc => {
      if(doc){
        if(isPlatformServer(this.platformId)){
          if(this.transferState.hasKey(this.DOC_KEY)){
            this.documentation = this.transferState.get(this.DOC_KEY, null) as HaDocumentation;
          } else {
            this.transferState.set(this.DOC_KEY, doc);
          }
        }
        this.actionOnDoc(isFirstDoc, doc);
      } else {
        this.docNotFound = true;
      }
    });
  }

  private actionOnDoc(isFirstDoc: boolean, doc: any): void {
    if (isFirstDoc) {
      this.router.navigate([`${this.router.url}/${doc.completePath}`]).then();
    }
    this.docNotFound = false;
    this.isCheck = true;
    this.isDisabled = true;
    this.documentation = doc;

    this.setFormGroupValue(doc);
    this.titles = [];

    if (doc.content) {
      this.richText = new CmRichText(doc.content);

      this.titles = this.richText.getHeaders([2, 3]);
      this.formGp.controls.content.disable();
    }

    this.textEditorConfig =
      new HaDocTextEditorConfig(this.brickName, this.brickVersion, this.documentation.title,
        this.documentationService, this.dialogService);

    this.isLoading = false;
  }

  onContentUpdate(content: any): void {
    this.contentDebouncer.setValue(content);
    if (this.formGp.value.content) {
      this.richText = new CmRichText(this.formGp.value.content as CmRichTextI)
      this.titles = this.richText.getHeaders([2, 3]);
    }
  }

  private setFormGroupValue(doc: HaDocumentationContentFormDTO): void {
    this.formGp.patchValue(doc)
  }

  private saveContent(value: CmRichTextI): void {

    this.formGp.value.content = value as CmRichTextI;
    this.isAdmin.subscribe(isAdmin => {
      if (isAdmin) {
        this.documentationService.updateContent(this.formGp.value as HaDocumentationContentFormDTO).subscribe();
      }
    });

  }

  onClickMenu(event: MouseEvent): void {
    this.isAdmin.subscribe(isAdmin => {
      if (isAdmin) {
        event.preventDefault();
        event.stopPropagation();
        if (this.menuOpen) {
          this.openedMenu.overlayRef.detach();
        }
        this.openedMenu =
          this.contextMenuService.openDynamicMenuFromMouseEvent(this.getContextMenuConfig(), event);
        this.menuOpen = true;
      }
    });
  }

  openResourceDelete(): void {
    const input: FlConfirmDialogInput = {
      title: 'confirm_deletion',
      content: 'confirm_deletion_message',
      translateTitleAndContent: true,
      observable: this.documentationService.deleteById(this.documentation.id),
      successMessage: 'documentation_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(res => {

      if (res.choice) {
        this.newItemEvent.emit('delete');
      }
    });
  }

  private getContextMenuConfig(): FlMenuDynamic[] {
    if (this.isDisabled) {
      return [
        {
          type: 'button',
          text: {text: 'edit', translateText: true},
          icon: 'edit_note',
          onClick: () => this.changeTextEditorState()
        },
        {
          type: 'button',
          text: {text: 'edit_title', translateText: true},
          icon: 'edit',
          onClick: () => this.prepareEditDialog()
        },
        {
          type: 'button',
          text: {text: 'delete', translateText: true},
          icon: 'delete',
          onClick: () => this.openResourceDelete(),
        }
      ];
    }
    return [
      {
        type: 'button',
        text: {text: 'view', translateText: true},
        icon: 'visibility',
        onClick: () => this.changeTextEditorState()
      },
      {
        type: 'button',
        text: {text: 'edit_title', translateText: true},
        icon: 'edit',
        onClick: () => this.prepareEditDialog()
      },
      {
        type: 'button',
        text: {text: 'delete', translateText: true},
        icon: 'delete',
        onClick: () => this.openResourceDelete()
      }
    ];
  }

  private changeTextEditorState(): void {
    if(this.formGp.controls.content.disabled)
      this.formGp.controls.content.enable();
    else
      this.formGp.controls.content.disable();
  }

  private prepareEditDialog(): void {
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
          this.newItemEvent.emit('rename');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.contentDebouncer.complete();
  }

}
