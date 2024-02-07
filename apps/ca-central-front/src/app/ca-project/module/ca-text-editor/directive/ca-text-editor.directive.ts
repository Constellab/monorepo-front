import {
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  SecurityContext
} from '@angular/core';
import Quill from 'quill';

import {ScrollDispatcher} from '@angular/cdk/overlay';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import hljs from 'highlight.js/lib/core';
import {CaTextEditorState} from '../state/ca-text-editor.state';
import {CaTextEditorConfig} from '../model/ca-text-editor-config.class';
import {CaQuillJson} from '../model/ca-text-editor.class';
import {CaTextEditorsManagerState} from '../state/ca-text-editors-manager.state';
import {CaQuillScrollContainer, CaQuillSetup} from '../model/ca-quill-setup.class';
import {FlPortalService} from '@monorepo/front-core-lib';

type CaTextEditorMode = 'HTML' | 'JSON'

@Directive({
  selector: '[caTextEditor]',
  providers: [CaTextEditorState]
})
export class CaTextEditorDirective implements OnInit, OnDestroy {

  @Input() config: CaTextEditorConfig;
  @Input() mode: CaTextEditorMode = 'HTML';

  /**
   * If auto it finds the parent scrollable element (use cdkScrollable),
   * otherwise it uses the child .ql-editor as scrollable
   */
  @Input() scrollContainer: CaQuillScrollContainer = 'auto';
  @Input() value: string | CaQuillJson;
  @HostBinding('class.ql-dense')
  @Input() dense: boolean = false;

  private quill: Quill;

  private testBrowser: boolean;

  constructor(@Inject(DOCUMENT) private document: Document,
              private state: CaTextEditorState,
              private elementRef: ElementRef,
              private scrollDispatcher: ScrollDispatcher,
              private sanitizer: DomSanitizer,
              private portalService: FlPortalService,
              private managerState: CaTextEditorsManagerState,
              renderer: Renderer2,
              // eslint-disable-next-line @typescript-eslint/ban-types
              @Inject(PLATFORM_ID) platformId: Object) {
    managerState.registerTextEditor(elementRef.nativeElement, state);
    renderer.addClass(this.elementRef.nativeElement, 'ql-directive');
    renderer.addClass(this.elementRef.nativeElement, CaTextEditorsManagerState.textEditorElementClass);
    this.testBrowser = isPlatformBrowser(platformId);
  }

  async ngOnInit(): Promise<void> {

    if (!this.testBrowser) return;

    const quillImport = await import('quill') as any;

    // create and configure quill
    this.quill = new quillImport.default(this.elementRef.nativeElement,
      {
        theme: 'bubble',
        modules: {
          syntax: {
            highlight: (text: string) => hljs.highlight(text, {language: 'python'}).value
          }, // Include syntax module
          toolbar: this.config.getToolbarConfig()
        },
        placeholder: '',
        scrollingContainer: CaQuillSetup.getScrollingContainer(this.scrollContainer, this.scrollDispatcher,
          this.document.documentElement, this.elementRef),
        readOnly: true
      }
    );
    this.quill.clipboard.addMatcher('IMG', (node, delta) => CaQuillSetup.addMatcher(node, delta, this.state, this.config));
    this.quill.disable();
    this.state.init(this.quill, this.config, this.elementRef.nativeElement, true);

    if (this.mode === 'HTML') {
      this.quill.root.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, (this.value as string));
    } else {
      const delta: any = (this.value as CaQuillJson)?.ops != null ? (this.value as CaQuillJson).ops : [];
      this.quill.setContents(delta, 'silent');
      this.removeLastUselessElement();
    }
  }

  /***
   * Remove the last <p><br></p> element in the text editor
   * @private
   */
  private removeLastUselessElement(): void {
    const elements: any[] = this.quill.getContents().ops;
    const lastElement: any = elements[elements.length - 1] ?? null;
    const preLastElement: any = elements[elements.length - 2] ?? null;

    if (lastElement && lastElement.insert && lastElement.insert == '\n' &&
      preLastElement && preLastElement.insert && preLastElement.insert.figure) {
      elements.pop();
      const editorElement: HTMLDivElement = this.elementRef.nativeElement.querySelector('.ql-editor');
      editorElement.removeChild(editorElement.childNodes[editorElement.childElementCount - 1]);
    }

  }

  ngOnDestroy(): void {
    const editorElement: HTMLDivElement = this.elementRef.nativeElement.querySelector('.ql-editor');
    if (editorElement) {
      this.managerState.unregisterTextEditor(editorElement);
    }
  }

  // retrieve the first parent that is scrollable
}
