import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
    if (this.handleTokenKey(event)) {
      event.preventDefault();
      return;
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

    this.handleSuggestionNavigation(event);
  }

  /** Returns true when the key was consumed by a token deletion or a token escape */
  private handleTokenKey(event: KeyboardEvent): boolean {
    // Handle Backspace/Delete on field token spans — delete the entire token
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return this.handleTokenDelete(event.key);
    }

    // Handle arrow keys to escape from inside field token spans
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      return this.handleTokenEscape(event.key);
    }

    return false;
  }

  private handleSuggestionNavigation(event: KeyboardEvent): void {
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
    // Replace @partial (field mode) or the partial word (function mode) with @key + trailing space
    const rest = this.getTextAfterPartial(text, this.triggerCaretOffset);
    const newText = beforeTrigger + '@' + entry.key + ' ' + rest;

    this._value = newText;
    this.emitCurrentValue();
    this.renderHighlighted(newText);

    const modelCaretPos = beforeTrigger.length + 1 + entry.key.length + 1;
    const displayCaretPos = this.modelOffsetToDisplayOffset(newText, modelCaretPos);
    this.setCaretAtOffset(displayCaretPos);

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
    // Replace @partial (field mode context, the @ trigger is removed too) or the partial word
    // (function mode) with fn(
    const insertion = fn.name + '(';
    const newText = beforeTrigger + insertion + this.getTextAfterPartial(text, this.triggerCaretOffset);

    this._value = newText;
    this.emitCurrentValue();
    this.renderHighlighted(newText);

    const caretPos = beforeTrigger.length + insertion.length;
    this.setCaretAtOffset(caretPos);

    this.closeSuggestions();
    this.editableDiv.nativeElement.focus();
  }

  // -- Partial word being completed at the trigger position --

  /** Text following the trigger and the partial the user already typed, in the current mode */
  private getTextAfterPartial(text: string, triggerOffset: number): string {
    if (this.autocompleteMode() === 'field') {
      // The @ trigger is part of what gets replaced
      const afterAt = text.substring(triggerOffset + 1);
      const partialMatch = afterAt.match(/^([a-zA-Z0-9_]*(?:\[\]\.[a-zA-Z0-9_]*)?)/);
      return afterAt.substring(partialMatch?.[0]?.length ?? 0);
    }

    const afterWord = text.substring(triggerOffset);
    const partialMatch = afterWord.match(/^([a-zA-Z_]\w*(?:\[\]\.\w*)?)/);
    return afterWord.substring(partialMatch?.[0]?.length ?? 0);
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

    const div = this.editableDiv.nativeElement;
    if (!div.contains(range.startContainer)) return false;

    const tokenSpan = this.findTokenSpanToDelete(key, range, div);
    if (!tokenSpan) return false;

    // Find model-space position of this token and remove it
    const modelOffset = this.getTokenModelOffset(div, tokenSpan);
    const modelTokenLen = this.getTokenModelLength(tokenSpan);
    const modelText = this._value;
    const newText = modelText.substring(0, modelOffset) + modelText.substring(modelOffset + modelTokenLen);

    this._value = newText;
    this.emitCurrentValue();
    this.renderHighlighted(newText);

    const displayOffset = this.modelOffsetToDisplayOffset(newText, modelOffset);
    this.setCaretAtOffset(displayOffset);

    return true;
  }

  private findTokenSpanToDelete(
    key: 'Backspace' | 'Delete',
    range: Range,
    div: HTMLDivElement
  ): HTMLElement | null {
    return (
      this.findEnclosingTokenSpan(range.startContainer, div) ??
      this.findAdjacentTokenSpanInText(key, range) ??
      this.findAdjacentTokenSpanInDiv(key, range, div)
    );
  }

  /** Check if cursor is inside a token span */
  private findEnclosingTokenSpan(container: Node, div: HTMLDivElement): HTMLElement | null {
    const parent =
      container.nodeType === Node.TEXT_NODE ? container.parentElement : (container as HTMLElement);
    return parent?.classList?.contains('td-field-token') && div.contains(parent) ? parent : null;
  }

  /** Check if cursor is right after (Backspace) or right before (Delete) a token */
  private findAdjacentTokenSpanInText(key: 'Backspace' | 'Delete', range: Range): HTMLElement | null {
    const container = range.startContainer;
    if (container.nodeType !== Node.TEXT_NODE) return null;

    if (key === 'Backspace' && range.startOffset === 0) {
      return this.asTokenSpan(container.previousSibling);
    }
    if (key === 'Delete' && range.startOffset === (container.textContent?.length ?? 0)) {
      return this.asTokenSpan(container.nextSibling);
    }
    return null;
  }

  /** Also handle when cursor is at a direct child level of the div */
  private findAdjacentTokenSpanInDiv(
    key: 'Backspace' | 'Delete',
    range: Range,
    div: HTMLDivElement
  ): HTMLElement | null {
    if (range.startContainer !== div) return null;

    const childIndex = range.startOffset;
    if (key === 'Backspace' && childIndex > 0) {
      return this.asTokenSpan(div.childNodes[childIndex - 1]);
    }
    if (key === 'Delete' && childIndex < div.childNodes.length) {
      return this.asTokenSpan(div.childNodes[childIndex]);
    }
    return null;
  }

  // -- Token span helpers --

  private asTokenSpan(node: Node | null): HTMLElement | null {
    return node instanceof HTMLElement && node.classList.contains('td-field-token') ? node : null;
  }

  /** Model-space length of a token span: its prefix (@ or @@) plus its key */
  private getTokenModelLength(tokenSpan: HTMLElement): number {
    const key = tokenSpan.getAttribute('data-key') ?? '';
    return (tokenSpan.hasAttribute('data-outer') ? 2 : 1) + key.length;
  }

  /** Model-space offset of a token span among the children of the editable div */
  private getTokenModelOffset(div: HTMLDivElement, tokenSpan: HTMLElement): number {
    let modelOffset = 0;
    for (const child of Array.from(div.childNodes)) {
      if (child === tokenSpan) break;
      const childToken = this.asTokenSpan(child);
      modelOffset += childToken
        ? this.getTokenModelLength(childToken)
        : (child.textContent ?? '').replace(/\u200B/g, '').length;
    }
    return modelOffset;
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

    this.ensureTextNodeAroundToken(tokenSpan, key);
    this.setCaretOutsideToken(sel, tokenSpan, key);
    return true;
  }

  /** Ensure there's a text node to land on outside the token */
  private ensureTextNodeAroundToken(tokenSpan: HTMLElement, key: 'ArrowLeft' | 'ArrowRight'): void {
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
  }

  /** Move caret outside the token */
  private setCaretOutsideToken(
    sel: Selection,
    tokenSpan: HTMLElement,
    key: 'ArrowLeft' | 'ArrowRight'
  ): void {
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
    const displayOffset = this.getRangeDisplayOffset(div, range);

    // Convert display offset to model offset by walking child nodes
    return { modelText, displayOffset: this.displayOffsetToModelOffset(div, displayOffset) };
  }

  /** Display-space offset of the range start, walking the text nodes of the editable div */
  private getRangeDisplayOffset(div: HTMLDivElement, range: Range): number {
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
    return displayOffset;
  }

  private displayOffsetToModelOffset(div: HTMLDivElement, displayOffset: number): number {
    let modelOffset = 0;
    let displayConsumed = 0;
    for (const child of Array.from(div.childNodes)) {
      const displayLen = child.textContent?.length ?? 0;
      const childToken = this.asTokenSpan(child);
      const modelLen = childToken ? this.getTokenModelLength(childToken) : displayLen;
      if (displayConsumed + displayLen >= displayOffset) {
        // A token is atomic: the caret lands after the whole token
        return modelOffset + (childToken ? modelLen : displayOffset - displayConsumed);
      }
      displayConsumed += displayLen;
      modelOffset += modelLen;
    }

    return modelOffset;
  }

  // -- Convert model offset to display offset for caret restoration --

  private modelOffsetToDisplayOffset(modelText: string, modelOffset: number): number {
    const specMap = this.fieldSpecMap();
    const outerSpecMap = this.outerFieldSpecMap();
    let displayOffset = 0;
    let i = 0;

    while (i < modelOffset && i < modelText.length) {
      const token = this.matchTokenLengthsAt(modelText, i, specMap, outerSpecMap);
      if (token) {
        displayOffset += token.displayTokenLen;
        i += token.modelTokenLen;
        continue;
      }
      displayOffset++;
      i++;
    }

    return displayOffset;
  }

  /** Model and display lengths of the token starting at `index`, or null when there is none */
  private matchTokenLengthsAt(
    modelText: string,
    index: number,
    specMap: Map<string, TdParamSpecEntry>,
    outerSpecMap: Map<string, TdParamSpecEntry>
  ): { modelTokenLen: number; displayTokenLen: number } | null {
    if (modelText[index] !== '@') return null;

    const isOuter = modelText[index + 1] === '@';
    const prefix = isOuter ? '@@' : '@';
    const remainder = modelText.substring(index);
    const match = remainder.match(/^@@?([a-zA-Z_][a-zA-Z0-9_]*(?:\[\]\.[a-zA-Z_][a-zA-Z0-9_]*)?)/);
    if (!match) return null;

    const key = match[1];
    const lookupMap = isOuter ? outerSpecMap : specMap;
    const entry = lookupMap.get(key);
    const displayName = entry?.spec.human_name || key;
    return {
      modelTokenLen: prefix.length + key.length,
      displayTokenLen: prefix.length + displayName.length,
    };
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
      const skipChars = fieldTrigger.isOuter ? 2 : 1;
      const mode = fieldTrigger.isOuter ? 'outerField' : 'field';
      this.openTrigger(mode, fieldTrigger.index, textBeforeCaret.substring(fieldTrigger.index + skipChars));
      return;
    }

    // Try function trigger (word prefix, including 0 chars)
    const funcMatch = textBeforeCaret.match(/(?:^|[^@a-zA-Z_])([a-zA-Z_]\w*)$/);
    if (funcMatch) {
      const word = funcMatch[1];
      this.openTrigger('function', caretOffset - word.length, word);
      return;
    }

    // No word being typed — show all suggestions (0 char trigger)
    const charBefore = caretOffset > 0 ? text[caretOffset - 1] : null;
    if (charBefore == null || /[\s(,+\-*/%=<>!&|]/.test(charBefore)) {
      this.openTrigger('function', caretOffset, '');
      return;
    }

    this.closeSuggestions();
  }

  private openTrigger(
    mode: 'field' | 'outerField' | 'function',
    triggerCaretOffset: number,
    filter: string
  ): void {
    this.autocompleteMode.set(mode);
    this.triggerCaretOffset = triggerCaretOffset;
    this.currentFilter.set(filter);
    this.hoveredIndex.set(0);
    if (!this.overlayRef) this.openSuggestions();
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
