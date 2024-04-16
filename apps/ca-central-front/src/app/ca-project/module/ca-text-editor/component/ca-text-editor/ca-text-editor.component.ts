import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
  SecurityContext,
  Self,
  ViewChild
} from '@angular/core';
import {CaQuillJson} from '../../model/ca-text-editor.class';
import {NgControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {CaTextEditorState} from '../../state/ca-text-editor.state';
import QuillType from 'quill';
import {CaTextEditorsManagerState} from '../../state/ca-text-editors-manager.state';
import {CaTextEditorConfig} from '../../model/ca-text-editor-config.class';
import {CaQuillScrollContainer, CaQuillSetup} from '../../model/ca-quill-setup.class';
import {ClStringHelper} from '@monorepo/core-lib';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';
import {FlFormFieldDirective, FlHtmlHelper, FlOverlayRef} from '@monorepo/front-core-lib';


/**
 * HTML --> Get HTML and generate HTML
 * JSON --> Get JSON as Delta and generate JSON
 */
type CaTextEditorMode = 'HTML' | 'JSON'

/**
 * Rich text editor (currently using quill)
 *
 * It supports NgModels
 */
@Component({
  selector: 'ca-text-editor',
  templateUrl: './ca-text-editor.component.html',
  styleUrls: ['./ca-text-editor.component.scss'],
  providers: [CaTextEditorState],
})
export class CaTextEditorComponent extends FlFormFieldDirective<string> implements OnInit, OnDestroy {

  @Input() config: CaTextEditorConfig;

  @Input() mode: CaTextEditorMode = 'HTML';

  @Input() placeholder: string;

  // if true the text editor is focused on creation
  @Input() autoFocus: boolean = false;

  @Input() theme: 'VISIBLE_BUTTON' | 'OVERRIDE_BUTTON' = 'OVERRIDE_BUTTON';

  @HostBinding('class.ql-no-padding')
  @Input() noPadding: boolean = false;

  @HostBinding('class.ql-no-horizontal-padding')
  @Input() noHorizontalPadding: boolean = false;

  @HostBinding('class.ql-no-vertical-padding')
  @Input() noVerticalPadding: boolean = false;

  /**
   * If auto it finds the parent scrollable element (use cdkScrollable),
   * otherwise it uses the child .ql-editor as scrollable
   */
  @Input() scrollContainer: CaQuillScrollContainer = 'auto';

  @Input() baseDelta?: any;

  @Output() textChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('editor', {static: true}) editorElement: ElementRef<HTMLElement>;

  @HostBinding('class.ql-dense')
  @Input() dense: boolean = false;

  @Input() anchor?: string;

  private quill: QuillType;

  private blockAddButtonOverlay?: FlOverlayRef;

  // as the onInit is async, this assure that onInit was called before subcomponents onInit
  isReady: boolean = false;

  constructor(@Optional() @Self() ngControl: NgControl,
              private sanitizer: DomSanitizer,
              @Inject(DOCUMENT) private document: Document,
              private scrollDispatcher: ScrollDispatcher,
              private elementRef: ElementRef<HTMLElement>,
              private state: CaTextEditorState,
              private managerState: CaTextEditorsManagerState,
              private renderer: Renderer2,
              // eslint-disable-next-line @typescript-eslint/ban-types
              @Inject(PLATFORM_ID) private platformId: Object) {
    super(ngControl);
    managerState.registerTextEditor(elementRef.nativeElement, state);
    renderer.addClass(this.elementRef.nativeElement, CaTextEditorsManagerState.textEditorElementClass);
  }

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      if (this.baseDelta == null || this.baseDelta.ops == null) {
        return;
      }
      const deltaOps = this.baseDelta.ops;
      //TODO: check if this is the best way to do this
      for (const [i, op] of deltaOps.entries()) {
        if (op.attributes?.header) {
          deltaOps[i].attributes = {header: op.attributes.header.level};
        }
      }
      const converter: any = new QuillDeltaToHtmlConverter(deltaOps);

      (this.elementRef.nativeElement.firstChild as any).style.width = '0';
      const html = converter.convert();
      //create a div that contains the html, the div have 2 class ql-bubble and ql-editor
      const divBubble = this.renderer.createElement('div');
      this.renderer.addClass(divBubble, 'ql-bubble');
      divBubble.style.width = '100%';
      const divEditor = this.renderer.createElement('div');
      this.renderer.addClass(divEditor, 'ql-editor');
      this.renderer.setProperty(divEditor, 'innerHTML', html);
      this.renderer.appendChild(divBubble, divEditor);
      this.elementRef.nativeElement.insertBefore(divBubble, this.elementRef.nativeElement.firstChild);
      return;
    }


    let modules: any = {
      toolbar: this.config.getToolbarConfig(),
      clipboard: {
        matchVisual: false
      }
    };
    modules = Object.assign(modules, this.config.getExtraModules());

    const Quill = (await import('quill')).default;
    // create and configure quill
    this.quill = new Quill(this.editorElement.nativeElement,
      {
        theme: this.config.getTheme(this.theme),
        modules: modules,
        // prevent the tooltip to go outside the editor
        bounds: this.elementRef.nativeElement,
        placeholder: this.placeholder,
        scrollingContainer: CaQuillSetup.getScrollingContainer(this.scrollContainer, this.scrollDispatcher,
          this.document.documentElement, this.elementRef),
        strict: true
      }
    );

    this.quill.clipboard.addMatcher('IMG', (node, delta) => CaQuillSetup.addMatcher(node, delta, this.state, this.config));

    this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta): any => {
      if (ClStringHelper.isHttpLink(node.nodeValue)) {
        delta = CaQuillSetup.addMatcherLink(this.state.getCurrentSelectionIndex(), node.nodeValue, delta, this.state);
      }
      return delta;
    });


    this.state.init(this.quill, this.config, this.editorElement.nativeElement, this.disabled);

    // init the HTML with the value set
    this.setQuillValue(this.value);

    // init the disabled
    this.onDisableChange(this.disabled);

    if (this.autoFocus && !this.disabled) {
      this.quill.focus();
    }

    this.quill.on('text-change', () => this.setAndEmitValue(this.getQuillValue()));

    if (isPlatformBrowser(this.platformId) && this.anchor != null) {
      const anchorElement = this.elementRef.nativeElement.querySelector(`#${this.anchor}`);
      anchorElement.scrollIntoView(true);
    }

    this.isReady = true;
  }

  callChangeEvent(value: string): void {
    this.textChange.next(value);
  }

  writeValue(value: any): void {
    if (this.quill) {
      this.setQuillValue(value);
    }
    // if the quill editor does not exist only set the value
    this.value = value;
  }

  onDisableChange(disable: boolean): void {
    if (this.quill) {
      if (disable) {
        this.quill.disable();
      } else {
        this.quill.enable();
      }
    }
    this.state.setDisabled(disable);
  }

  outsideClick(event: MouseEvent): void {
    // we consider all elements with parent marked as text-editor-overlay to be in the text editor element
    const parent = FlHtmlHelper.getParent(event.target as HTMLElement, {className: 'text-editor-overlay'});
    if (parent) return;
    this.state.outsideClick(event);
    this.blockAddButtonOverlay?.dispose();
  }

  ngOnDestroy(): void {
    this.closeBlockAddButtonOverlay();
    this.managerState.unregisterTextEditor(this.editorElement.nativeElement);
  }


  private getQuillValue(): any {
    if (this.mode === 'HTML') {
      return this.quill.root.innerHTML;
    } else {
      return this.quill.getContents();
    }
  }

  // manually set the quill value with silent mode so no event are triggered
  private setQuillValue(value: any): void {
    if (this.mode === 'HTML') {
      this.setHTML(value);
    } else {
      this.setJsonDelta(value).then(() => {
      });
    }
  }

  private setHTML(html: string): void {
    // sanitize the html to prevent xss and set inner html
    this.quill.root.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, html);
  }

  private async setJsonDelta(json: CaQuillJson): Promise<void> {
    const delta: any = json?.ops != null ? json.ops : [];
    this.quill.setContents(delta, 'silent');
  }


  private closeBlockAddButtonOverlay(): void {
    this.blockAddButtonOverlay?.dispose();
  }
}
