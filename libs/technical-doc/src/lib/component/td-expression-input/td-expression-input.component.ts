import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

const FIELD_TOKEN_REGEX = /@([a-zA-Z_][a-zA-Z0-9_]*)/g;

@Component({
  selector: 'td-expression-input',
  templateUrl: './td-expression-input.component.html',
  styleUrl: './td-expression-input.component.scss',
  standalone: false,
})
export class TdExpressionInputComponent extends FlFormFieldDirective<string> implements OnDestroy {
  private portalService = inject(FlPortalService);
  private viewContainerRef = inject(ViewContainerRef);

  fieldNames = input<string[]>([]);

  @ViewChild('editableDiv', { static: true }) editableDiv: ElementRef<HTMLDivElement>;
  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>;
  @ViewChild('suggestionsTemplate', { static: true }) suggestionsTemplate: TemplateRef<any>;

  readonly currentFilter = signal<string | null>(null);
  readonly hoveredIndex = signal(0);

  readonly filteredSuggestions = computed(() => {
    const filterText = this.currentFilter();
    if (filterText == null) return [];
    const lower = filterText.toLowerCase();
    return this.fieldNames().filter((name) => name.toLowerCase().startsWith(lower));
  });

  private overlayRef: FlOverlayRef | null = null;
  private triggerCaretOffset: number | null = null;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    super(ngControl);
  }

  writeValue(obj: string): void {
    const text = obj ?? '';
    this._value = text;
    this.renderHighlighted(text);
  }

  onDisableChange(): void {}

  callChangeEvent(): void {}

  onInput(): void {
    const text = this.getPlainText();
    const caretOffset = this.getCaretOffset();

    this._value = text;
    this.emitCurrentValue();
    this.markAsTouched();

    this.renderHighlighted(text);

    if (caretOffset != null) {
      this.setCaretAtOffset(caretOffset);
    }

    this.checkForTrigger(text, caretOffset);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.overlayRef) {
      event.preventDefault();
      return;
    }

    if (!this.overlayRef) return;

    const suggestions = this.filteredSuggestions();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.hoveredIndex.set((this.hoveredIndex() + 1) % Math.max(suggestions.length, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.hoveredIndex.set(
          (this.hoveredIndex() - 1 + Math.max(suggestions.length, 1)) % Math.max(suggestions.length, 1)
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (suggestions.length > 0) {
          this.selectSuggestion(suggestions[this.hoveredIndex()]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closeSuggestions();
        break;
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') ?? '';
    document.execCommand('insertText', false, text);
  }

  onBlur(): void {
    this.markAsTouched();
  }

  selectSuggestion(fieldName: string): void {
    const text = this.getPlainText();

    if (this.triggerCaretOffset == null) {
      this.closeSuggestions();
      return;
    }

    const beforeTrigger = text.substring(0, this.triggerCaretOffset);
    // Skip the '@' itself, then match the partial identifier after it
    const afterAt = text.substring(this.triggerCaretOffset + 1);
    const partialMatch = afterAt.match(/^([a-zA-Z0-9_]*)/);
    const partialLength = partialMatch?.[0]?.length ?? 0;

    const newText =
      beforeTrigger + '@' + fieldName + text.substring(this.triggerCaretOffset + 1 + partialLength);

    this._value = newText;
    this.emitCurrentValue();
    this.renderHighlighted(newText);

    const caretPos = beforeTrigger.length + 1 + fieldName.length;
    this.setCaretAtOffset(caretPos);

    this.closeSuggestions();
    this.editableDiv.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.closeSuggestions();
  }

  // -- Plain text extraction --

  private getPlainText(): string {
    return this.editableDiv.nativeElement.textContent ?? '';
  }

  // -- Highlighting --

  private renderHighlighted(text: string): void {
    const div = this.editableDiv.nativeElement;
    if (!text) {
      div.innerHTML = '';
      return;
    }
    div.innerHTML = this.buildHighlightedHtml(text);
  }

  private buildHighlightedHtml(text: string): string {
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped.replace(FIELD_TOKEN_REGEX, '<span class="td-field-token">@$1</span>');
  }

  // -- Caret utilities using TreeWalker --

  private getCaretOffset(): number | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    const range = sel.getRangeAt(0);
    const div = this.editableDiv.nativeElement;
    if (!div.contains(range.startContainer)) return null;

    let offset = 0;
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (node === range.startContainer) {
        return offset + range.startOffset;
      }
      offset += node.textContent?.length ?? 0;
    }

    return offset;
  }

  private setCaretAtOffset(targetOffset: number): void {
    const div = this.editableDiv.nativeElement;
    const sel = window.getSelection();
    if (!sel) return;

    let remaining = targetOffset;
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
    let node: Text | null;

    while ((node = walker.nextNode() as Text | null)) {
      const len = node.textContent?.length ?? 0;
      if (remaining <= len) {
        const range = document.createRange();
        range.setStart(node, remaining);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      remaining -= len;
    }

    // If offset exceeds content, place caret at the end
    const range = document.createRange();
    range.selectNodeContents(div);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // -- Autocomplete trigger --

  private checkForTrigger(text: string, caretOffset: number | null): void {
    if (caretOffset == null) {
      this.closeSuggestions();
      return;
    }

    const textBeforeCaret = text.substring(0, caretOffset);
    const triggerIndex = this.findTriggerIndex(textBeforeCaret);

    if (triggerIndex == null) {
      this.closeSuggestions();
      return;
    }

    const filterText = textBeforeCaret.substring(triggerIndex + 1);
    this.triggerCaretOffset = triggerIndex;
    this.currentFilter.set(filterText);
    this.hoveredIndex.set(0);

    if (!this.overlayRef) {
      this.openSuggestions();
    }
  }

  private findTriggerIndex(textBeforeCaret: string): number | null {
    for (let i = textBeforeCaret.length - 1; i >= 0; i--) {
      const ch = textBeforeCaret[i];
      if (ch === '@') return i;
      if (!/[a-zA-Z0-9_]/.test(ch)) return null;
    }
    return null;
  }

  private openSuggestions(): void {
    const config = this.portalService.configureRelativePortal(
      this.container.nativeElement,
      ['bottom', 'top'],
      { disposeOnOutsideClick: true }
    );

    this.overlayRef = this.portalService.createPortalTemplate(
      this.suggestionsTemplate,
      config,
      this.viewContainerRef
    );

    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null;
      this.currentFilter.set(null);
      this.triggerCaretOffset = null;
    });
  }

  private closeSuggestions(): void {
    this.overlayRef?.dispose();
  }
}
