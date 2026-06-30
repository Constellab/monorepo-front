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
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TdParamSpecEntry, TdParamSpecParamSet, TdParamSpecTypeEnum } from '../../model/td-config-spec.class';
import {
  tdBuildFieldSpecMap,
  TdParsedExpression,
} from '../td-expression-display/td-expression-display.helper';
import { TD_EXPRESSION_FUNCTIONS, TdExpressionFunction } from './td-expression-input.model';

@Component({
  selector: 'td-expression-input',
  templateUrl: './td-expression-input.component.html',
  styleUrl: './td-expression-input.component.scss',
  standalone: false,
})
export class TdExpressionInputComponent extends FlFormFieldDirective<string> implements OnDestroy {
  private portalService = inject(FlPortalService);
  private viewContainerRef = inject(ViewContainerRef);
  private translateService = inject(FlTranslateService);

  fieldSpecs = input<TdParamSpecEntry[]>([]);
  outerFieldSpecs = input<TdParamSpecEntry[]>([]);

  @ViewChild('editableDiv', { static: true }) editableDiv: ElementRef<HTMLDivElement>;
  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>;
  @ViewChild('suggestionsTemplate', { static: true }) suggestionsTemplate: TemplateRef<any>;
  @ViewChild('tooltipTemplate', { static: true }) tooltipTemplate: TemplateRef<any>;

  readonly currentFilter = signal<string | null>(null);
  readonly hoveredIndex = signal(0);
  readonly autocompleteMode = signal<'field' | 'outerField' | 'function' | null>(null);
  readonly tooltipSpec = signal<TdParamSpecEntry | null>(null);

  readonly fieldSpecMap = computed(() => tdBuildFieldSpecMap(this.fieldSpecs()));
  readonly outerFieldSpecMap = computed(() => tdBuildFieldSpecMap(this.outerFieldSpecs()));

  private readonly flatFieldSuggestions = computed(() => {
    const result: TdParamSpecEntry[] = [];
    for (const entry of this.fieldSpecs()) {
      if (entry.spec.type === TdParamSpecTypeEnum.PARAM_SET) {
        const paramSet = (entry.spec as TdParamSpecParamSet).additional_info.param_set;
        for (const [colKey, colSpec] of Object.entries(paramSet)) {
          result.push({
            key: `${entry.key}[].${colKey}`,
            spec: {
              ...colSpec,
              human_name: `${entry.spec.human_name || entry.key}[].${colSpec.human_name || colKey}`,
            },
          });
        }
      } else {
        result.push(entry);
      }
    }
    return result;
  });

  readonly filteredFieldSuggestions = computed(() => {
    const filterText = this.currentFilter();
    if (filterText == null) return [];
    if (filterText === '') return this.flatFieldSuggestions();
    const lower = filterText.toLowerCase();
    return this.flatFieldSuggestions().filter((s) => {
      const keyMatch = s.key.toLowerCase().includes(lower);
      const nameMatch = (s.spec.human_name || '').toLowerCase().includes(lower);
      const descMatch = (s.spec.short_description || '').toLowerCase().includes(lower);
      return keyMatch || nameMatch || descMatch;
    });
  });

  readonly filteredOuterFieldSuggestions = computed(() => {
    const filterText = this.currentFilter();
    if (filterText == null) return [];
    const specs = this.outerFieldSpecs();
    if (specs.length === 0) return [];
    if (filterText === '') return specs;
    const lower = filterText.toLowerCase();
    return specs.filter((s) => {
      const keyMatch = s.key.toLowerCase().includes(lower);
      const nameMatch = (s.spec.human_name || '').toLowerCase().includes(lower);
      const descMatch = (s.spec.short_description || '').toLowerCase().includes(lower);
      return keyMatch || nameMatch || descMatch;
    });
  });

  private readonly expressionFunctions = computed<TdExpressionFunction[]>(() => {
    return TD_EXPRESSION_FUNCTIONS.map((f) => ({
      name: f.name,
      signature: f.signature,
      description: this.translateService.translate(f.descriptionKey),
    }));
  });

  readonly filteredFunctionSuggestions = computed(() => {
    const filterText = this.currentFilter();
    const fns = this.expressionFunctions();
    if (filterText == null) return [];
    if (filterText === '') return fns;
    const lower = filterText.toLowerCase();
    return fns.filter((f) => {
      const nameMatch = f.name.toLowerCase().startsWith(lower);
      const descMatch = f.description.toLowerCase().startsWith(lower);
      return nameMatch || descMatch;
    });
  });

  readonly totalSuggestionCount = computed(
    () =>
      this.filteredOuterFieldSuggestions().length +
      this.filteredFieldSuggestions().length +
      this.filteredFunctionSuggestions().length
  );

  private overlayRef: FlOverlayRef | null = null;
  private tooltipOverlayRef: FlOverlayRef | null = null;
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
    this.closeTooltip();
    const { modelText, displayOffset } = this.getCaretInfo();

    this._value = modelText;
    this.emitCurrentValue();
    this.markAsTouched();

    this.renderHighlighted(modelText);

    if (displayOffset != null) {
      const newDisplayOffset = this.modelOffsetToDisplayOffset(modelText, displayOffset);
      this.setCaretAtOffset(newDisplayOffset);
    }

    this.checkForTrigger(modelText, displayOffset);
  }

  onKeydown(event: KeyboardEvent): void {
    // Handle Backspace/Delete on field token spans — delete the entire token
    if (event.key === 'Backspace' || event.key === 'Delete') {
      const handled = this.handleTokenDelete(event.key);
      if (handled) {
        event.preventDefault();
        return;
      }
    }

    // Handle arrow keys to escape from inside field token spans
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const escaped = this.handleTokenEscape(event.key);
      if (escaped) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.closeSuggestions();
      return;
    }

    if (event.key === 'Enter' && !this.overlayRef) {
      event.preventDefault();
      return;
    }

    if (!this.overlayRef) return;

    const total = this.totalSuggestionCount();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.hoveredIndex.set((this.hoveredIndex() + 1) % Math.max(total, 1));
        this.scrollToHovered();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.hoveredIndex.set((this.hoveredIndex() - 1 + Math.max(total, 1)) % Math.max(total, 1));
        this.scrollToHovered();
        break;
      case 'Enter':
        event.preventDefault();
        if (total > 0) {
          this.selectByGlobalIndex(this.hoveredIndex());
        }
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

  selectFieldSuggestion(entry: TdParamSpecEntry, event?: MouseEvent): void {
    // Prevent the mousedown from stealing focus from the editable div
    event?.preventDefault();
    const text = this._value;

    if (this.triggerCaretOffset == null) {
      this.closeSuggestions();
      return;
    }

    const beforeTrigger = text.substring(0, this.triggerCaretOffset);

    if (this.autocompleteMode() === 'field') {
      // Replace @partial with @key + trailing space
      const afterAt = text.substring(this.triggerCaretOffset + 1);
      const partialMatch = afterAt.match(/^([a-zA-Z0-9_]*(?:\[\]\.[a-zA-Z0-9_]*)?)/);
      const partialLength = partialMatch?.[0]?.length ?? 0;
      const rest = text.substring(this.triggerCaretOffset + 1 + partialLength);
      const newText = beforeTrigger + '@' + entry.key + ' ' + rest;

      this._value = newText;
      this.emitCurrentValue();
      this.renderHighlighted(newText);

      const modelCaretPos = beforeTrigger.length + 1 + entry.key.length + 1;
      const displayCaretPos = this.modelOffsetToDisplayOffset(newText, modelCaretPos);
      this.setCaretAtOffset(displayCaretPos);
    } else {
      // Function mode context but user picked a field — insert @key + trailing space
      const afterWord = text.substring(this.triggerCaretOffset);
      const partialMatch = afterWord.match(/^([a-zA-Z_]\w*(?:\[\]\.\w*)?)/);
      const partialLength = partialMatch?.[0]?.length ?? 0;
      const rest = text.substring(this.triggerCaretOffset + partialLength);
      const newText = beforeTrigger + '@' + entry.key + ' ' + rest;

      this._value = newText;
      this.emitCurrentValue();
      this.renderHighlighted(newText);

      const modelCaretPos = beforeTrigger.length + 1 + entry.key.length + 1;
      const displayCaretPos = this.modelOffsetToDisplayOffset(newText, modelCaretPos);
      this.setCaretAtOffset(displayCaretPos);
    }

    this.closeSuggestions();
    this.editableDiv.nativeElement.focus();
  }

  selectOuterFieldSuggestion(entry: TdParamSpecEntry, event?: MouseEvent): void {
    // Prevent the mousedown from stealing focus from the editable div
    event?.preventDefault();
    const text = this._value;
    if (this.triggerCaretOffset == null) {
      this.closeSuggestions();
      return;
    }

    const beforeTrigger = text.substring(0, this.triggerCaretOffset);
    const afterDoubleAt = text.substring(this.triggerCaretOffset + 2);
    const partialMatch = afterDoubleAt.match(/^([a-zA-Z0-9_]*)/);
    const partialLength = partialMatch?.[0]?.length ?? 0;
    const rest = text.substring(this.triggerCaretOffset + 2 + partialLength);
    const newText = beforeTrigger + '@@' + entry.key + ' ' + rest;

    this._value = newText;
    this.emitCurrentValue();
    this.renderHighlighted(newText);

    const modelCaretPos = beforeTrigger.length + 2 + entry.key.length + 1;
    const displayCaretPos = this.modelOffsetToDisplayOffset(newText, modelCaretPos);
    this.setCaretAtOffset(displayCaretPos);

    this.closeSuggestions();
    this.editableDiv.nativeElement.focus();
  }

  selectFunctionSuggestion(fn: TdExpressionFunction, event?: MouseEvent): void {
    // Prevent the mousedown from stealing focus from the editable div
    event?.preventDefault();
    const text = this._value;

    if (this.triggerCaretOffset == null) {
      this.closeSuggestions();
      return;
    }

    const beforeTrigger = text.substring(0, this.triggerCaretOffset);

    if (this.autocompleteMode() === 'field') {
      // Field mode context but user picked a function — replace @partial with fn(
      const afterAt = text.substring(this.triggerCaretOffset + 1);
      const partialMatch = afterAt.match(/^([a-zA-Z0-9_]*(?:\[\]\.[a-zA-Z0-9_]*)?)/);
      const partialLength = partialMatch?.[0]?.length ?? 0;
      // Remove the @ trigger too
      const insertion = fn.name + '(';
      const newText = beforeTrigger + insertion + text.substring(this.triggerCaretOffset + 1 + partialLength);

      this._value = newText;
      this.emitCurrentValue();
      this.renderHighlighted(newText);

      const caretPos = beforeTrigger.length + insertion.length;
      this.setCaretAtOffset(caretPos);
    } else {
      // Function mode — replace partial word with fn(
      const afterWord = text.substring(this.triggerCaretOffset);
      const partialMatch = afterWord.match(/^([a-zA-Z_]\w*(?:\[\]\.\w*)?)/);
      const partialLength = partialMatch?.[0]?.length ?? 0;

      const insertion = fn.name + '(';
      const newText = beforeTrigger + insertion + text.substring(this.triggerCaretOffset + partialLength);

      this._value = newText;
      this.emitCurrentValue();
      this.renderHighlighted(newText);

      const caretPos = beforeTrigger.length + insertion.length;
      this.setCaretAtOffset(caretPos);
    }

    this.closeSuggestions();
    this.editableDiv.nativeElement.focus();
  }

  onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.classList?.contains('td-field-token')) {
      this.closeTooltip();
      return;
    }
    const key = target.getAttribute('data-key');
    if (!key) return;
    const isOuter = target.hasAttribute('data-outer');
    const entry = isOuter ? this.outerFieldSpecMap().get(key) : this.fieldSpecMap().get(key);
    if (!entry || this.tooltipOverlayRef) return;

    this.tooltipSpec.set(entry);
    const config = this.portalService.configureRelativePortal(target, ['top', 'bottom'], {
      disposeOnOutsideClick: false,
    });
    this.tooltipOverlayRef = this.portalService.createPortalTemplate(
      this.tooltipTemplate,
      config,
      this.viewContainerRef
    );
    this.tooltipOverlayRef.detachments().subscribe(() => {
      this.tooltipOverlayRef = null;
      this.tooltipSpec.set(null);
    });
  }

  onMouseOut(event: MouseEvent): void {
    const related = event.relatedTarget as HTMLElement;
    if (related?.classList?.contains('td-field-token')) return;
    this.closeTooltip();
  }

  ngOnDestroy(): void {
    this.closeSuggestions();
    this.closeTooltip();
  }

  // -- Backspace/Delete on token spans --

  private handleTokenDelete(key: 'Backspace' | 'Delete'): boolean {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    const range = sel.getRangeAt(0);
    if (!range.collapsed) return false;

    const container = range.startContainer;
    const div = this.editableDiv.nativeElement;
    if (!div.contains(container)) return false;

    let tokenSpan: HTMLElement | null = null;

    // Check if cursor is inside a token span
    const parent =
      container.nodeType === Node.TEXT_NODE ? container.parentElement : (container as HTMLElement);
    if (parent?.classList?.contains('td-field-token') && div.contains(parent)) {
      tokenSpan = parent;
    }

    // Check if cursor is right after (Backspace) or right before (Delete) a token
    if (!tokenSpan && container.nodeType === Node.TEXT_NODE) {
      if (key === 'Backspace' && range.startOffset === 0) {
        const prev = container.previousSibling;
        if (prev instanceof HTMLElement && prev.classList.contains('td-field-token')) {
          tokenSpan = prev;
        }
      } else if (key === 'Delete' && range.startOffset === (container.textContent?.length ?? 0)) {
        const next = container.nextSibling;
        if (next instanceof HTMLElement && next.classList.contains('td-field-token')) {
          tokenSpan = next;
        }
      }
    }

    // Also handle when cursor is at a direct child level of the div
    if (!tokenSpan && container === div) {
      const childIndex = range.startOffset;
      if (key === 'Backspace' && childIndex > 0) {
        const prev = div.childNodes[childIndex - 1];
        if (prev instanceof HTMLElement && prev.classList.contains('td-field-token')) {
          tokenSpan = prev;
        }
      } else if (key === 'Delete' && childIndex < div.childNodes.length) {
        const next = div.childNodes[childIndex];
        if (next instanceof HTMLElement && next.classList.contains('td-field-token')) {
          tokenSpan = next;
        }
      }
    }

    if (!tokenSpan) return false;

    // Find model-space position of this token and remove it
    const tokenKey = tokenSpan.getAttribute('data-key') ?? '';
    let modelOffset = 0;
    for (const child of Array.from(div.childNodes)) {
      if (child === tokenSpan) break;
      if (child.nodeType === Node.TEXT_NODE) {
        modelOffset += (child.textContent ?? '').replace(/\u200B/g, '').length;
      } else if (child instanceof HTMLElement && child.classList.contains('td-field-token')) {
        const childIsOuter = (child as HTMLElement).hasAttribute('data-outer');
        modelOffset += (childIsOuter ? 2 : 1) + (child.getAttribute('data-key') ?? '').length;
      } else {
        modelOffset += (child.textContent ?? '').replace(/\u200B/g, '').length;
      }
    }

    const isOuter = tokenSpan.hasAttribute('data-outer');
    const modelTokenLen = (isOuter ? 2 : 1) + tokenKey.length;
    const modelText = this._value;
    const newText = modelText.substring(0, modelOffset) + modelText.substring(modelOffset + modelTokenLen);

    this._value = newText;
    this.emitCurrentValue();
    this.renderHighlighted(newText);

    const displayOffset = this.modelOffsetToDisplayOffset(newText, modelOffset);
    this.setCaretAtOffset(displayOffset);

    return true;
  }

  // -- Arrow key token escape --

  private handleTokenEscape(key: 'ArrowLeft' | 'ArrowRight'): boolean {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    const range = sel.getRangeAt(0);
    const container = range.startContainer;
    const div = this.editableDiv.nativeElement;

    // Check if cursor is inside a field token span
    const tokenSpan =
      container.nodeType === Node.TEXT_NODE ? container.parentElement : (container as HTMLElement);

    if (!tokenSpan?.classList?.contains('td-field-token')) return false;
    if (!div.contains(tokenSpan)) return false;

    // Ensure there's a text node to land on outside the token
    if (key === 'ArrowRight') {
      if (!tokenSpan.nextSibling || tokenSpan.nextSibling.nodeType !== Node.TEXT_NODE) {
        const textNode = document.createTextNode('\u200B');
        tokenSpan.after(textNode);
      }
    } else {
      if (!tokenSpan.previousSibling || tokenSpan.previousSibling.nodeType !== Node.TEXT_NODE) {
        const textNode = document.createTextNode('\u200B');
        tokenSpan.before(textNode);
      }
    }

    // Move caret outside the token
    const newRange = document.createRange();
    if (key === 'ArrowRight') {
      const next = tokenSpan.nextSibling as Text;
      newRange.setStart(next, 1);
    } else {
      const prev = tokenSpan.previousSibling as Text;
      newRange.setStart(prev, prev.textContent?.length ?? 0);
    }
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    return true;
  }

  // -- Plain text extraction (model-space: uses keys, not human names) --

  private getPlainText(): string {
    const div = this.editableDiv.nativeElement;
    let result = '';
    for (const node of Array.from(div.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        result += (node.textContent ?? '').replace(/\u200B/g, '');
      } else if (node instanceof HTMLElement && node.classList.contains('td-field-token')) {
        const prefix = (node as HTMLElement).hasAttribute('data-outer') ? '@@' : '@';
        result += prefix + node.getAttribute('data-key');
      } else {
        result += (node.textContent ?? '').replace(/\u200B/g, '');
      }
    }
    return result;
  }

  // -- Combined caret info extraction --

  private getCaretInfo(): { modelText: string; displayOffset: number | null } {
    const sel = window.getSelection();
    const div = this.editableDiv.nativeElement;
    const modelText = this.getPlainText();

    if (!sel || sel.rangeCount === 0) {
      return { modelText, displayOffset: null };
    }

    const range = sel.getRangeAt(0);
    if (!div.contains(range.startContainer)) {
      return { modelText, displayOffset: null };
    }

    // Compute display offset (in display-space characters)
    let displayOffset = 0;
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT);
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (node === range.startContainer) {
        displayOffset += range.startOffset;
        break;
      }
      displayOffset += node.textContent?.length ?? 0;
    }

    // Convert display offset to model offset by walking child nodes
    let modelOffset = 0;
    let displayConsumed = 0;
    for (const child of Array.from(div.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const len = child.textContent?.length ?? 0;
        if (displayConsumed + len >= displayOffset) {
          modelOffset += displayOffset - displayConsumed;
          return { modelText, displayOffset: modelOffset };
        }
        displayConsumed += len;
        modelOffset += len;
      } else if (child instanceof HTMLElement && child.classList.contains('td-field-token')) {
        const displayLen = child.textContent?.length ?? 0;
        const key = child.getAttribute('data-key') ?? '';
        const isOuter = child.hasAttribute('data-outer');
        const modelLen = key.length + (isOuter ? 2 : 1);
        if (displayConsumed + displayLen >= displayOffset) {
          modelOffset += modelLen;
          return { modelText, displayOffset: modelOffset };
        }
        displayConsumed += displayLen;
        modelOffset += modelLen;
      } else {
        const len = child.textContent?.length ?? 0;
        if (displayConsumed + len >= displayOffset) {
          modelOffset += displayOffset - displayConsumed;
          return { modelText, displayOffset: modelOffset };
        }
        displayConsumed += len;
        modelOffset += len;
      }
    }

    return { modelText, displayOffset: modelOffset };
  }

  // -- Convert model offset to display offset for caret restoration --

  private modelOffsetToDisplayOffset(modelText: string, modelOffset: number): number {
    const specMap = this.fieldSpecMap();
    const outerSpecMap = this.outerFieldSpecMap();
    let displayOffset = 0;
    let i = 0;

    while (i < modelOffset && i < modelText.length) {
      if (modelText[i] === '@') {
        const isOuter = modelText[i + 1] === '@';
        const prefix = isOuter ? '@@' : '@';
        const remainder = modelText.substring(i);
        const match = remainder.match(/^@@?([a-zA-Z_][a-zA-Z0-9_]*(?:\[\]\.[a-zA-Z_][a-zA-Z0-9_]*)?)/);
        if (match) {
          const key = match[1];
          const lookupMap = isOuter ? outerSpecMap : specMap;
          const entry = lookupMap.get(key);
          const displayName = entry?.spec.human_name || key;
          const modelTokenLen = prefix.length + key.length;
          const displayTokenLen = prefix.length + displayName.length;

          if (i + modelTokenLen <= modelOffset) {
            displayOffset += displayTokenLen;
            i += modelTokenLen;
          } else {
            displayOffset += displayTokenLen;
            i += modelTokenLen;
          }
          continue;
        }
      }
      displayOffset++;
      i++;
    }

    return displayOffset;
  }

  // -- Highlighting --

  private renderHighlighted(text: string): void {
    const div = this.editableDiv.nativeElement;
    if (!text) {
      div.innerHTML = '';
      return;
    }
    div.innerHTML = new TdParsedExpression(text, this.fieldSpecMap(), this.outerFieldSpecMap()).buildHtml();
  }

  // -- Caret utilities using TreeWalker --

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

    // Try field trigger (@ or @@)
    const fieldTrigger = this.findFieldTriggerIndex(textBeforeCaret);
    if (fieldTrigger != null) {
      this.autocompleteMode.set(fieldTrigger.isOuter ? 'outerField' : 'field');
      this.triggerCaretOffset = fieldTrigger.index;
      const skipChars = fieldTrigger.isOuter ? 2 : 1;
      this.currentFilter.set(textBeforeCaret.substring(fieldTrigger.index + skipChars));
      this.hoveredIndex.set(0);
      if (!this.overlayRef) this.openSuggestions();
      return;
    }

    // Try function trigger (word prefix, including 0 chars)
    const funcMatch = textBeforeCaret.match(/(?:^|[^@a-zA-Z_])([a-zA-Z_]\w*)$/);
    if (funcMatch) {
      const word = funcMatch[1];
      this.autocompleteMode.set('function');
      this.triggerCaretOffset = caretOffset - word.length;
      this.currentFilter.set(word);
      this.hoveredIndex.set(0);
      if (!this.overlayRef) this.openSuggestions();
      return;
    }

    // No word being typed — show all suggestions (0 char trigger)
    const charBefore = caretOffset > 0 ? text[caretOffset - 1] : null;
    if (charBefore == null || /[\s(,+\-*/%=<>!&|]/.test(charBefore)) {
      this.autocompleteMode.set('function');
      this.triggerCaretOffset = caretOffset;
      this.currentFilter.set('');
      this.hoveredIndex.set(0);
      if (!this.overlayRef) this.openSuggestions();
      return;
    }

    this.closeSuggestions();
  }

  private findFieldTriggerIndex(textBeforeCaret: string): { index: number; isOuter: boolean } | null {
    for (let i = textBeforeCaret.length - 1; i >= 0; i--) {
      const ch = textBeforeCaret[i];
      if (ch === '@') {
        const isOuter = i > 0 && textBeforeCaret[i - 1] === '@';
        return { index: isOuter ? i - 1 : i, isOuter };
      }
      if (!/[a-zA-Z0-9_.[\]]/.test(ch)) return null;
    }
    return null;
  }

  private selectByGlobalIndex(globalIndex: number): void {
    const fields = this.filteredFieldSuggestions();
    if (globalIndex < fields.length) {
      this.selectFieldSuggestion(fields[globalIndex]);
      return;
    }
    let adjusted = globalIndex - fields.length;
    const outerFields = this.filteredOuterFieldSuggestions();
    if (adjusted < outerFields.length) {
      this.selectOuterFieldSuggestion(outerFields[adjusted]);
      return;
    }
    adjusted -= outerFields.length;
    const fns = this.filteredFunctionSuggestions();
    if (adjusted < fns.length) {
      this.selectFunctionSuggestion(fns[adjusted]);
    }
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
      this.autocompleteMode.set(null);
      this.triggerCaretOffset = null;
    });
  }

  private scrollToHovered(): void {
    if (!this.overlayRef) return;
    const panel = this.overlayRef.getPanelElement();
    const item = panel?.querySelectorAll('.td-suggestion-item')[this.hoveredIndex()];
    item?.scrollIntoView({ block: 'nearest' });
  }

  private closeSuggestions(): void {
    this.overlayRef?.dispose();
  }

  private closeTooltip(): void {
    this.tooltipOverlayRef?.dispose();
  }
}
