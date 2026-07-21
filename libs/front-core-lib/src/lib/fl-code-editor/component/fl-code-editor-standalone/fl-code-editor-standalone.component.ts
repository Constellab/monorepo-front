import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { julia } from '@codemirror/legacy-modes/mode/julia';
import { perl } from '@codemirror/legacy-modes/mode/perl';
import { r } from '@codemirror/legacy-modes/mode/r';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { FlCodeEditorLanguage } from '@monorepo/front-core-lib/fl-code-editor';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { basicSetup } from 'codemirror';
import { Subject, takeUntil } from 'rxjs';

/**
 * Python IDE editor component using CodeMirror.
 * This component is standalone and is dynamically import to have it own bundle that
 * is only loaded when needed.
 */
@Component({
  selector: 'fl-code-editor-standalone',
  imports: [],
  templateUrl: './fl-code-editor-standalone.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./fl-code-editor-standalone.component.scss'],
})
export class FlCodeEditorStandaloneComponent implements OnInit, OnDestroy {
  private themeService = inject(FlThemeService);
  private platformId = inject(PLATFORM_ID);

  @Input({ required: true }) language: FlCodeEditorLanguage;

  @Input({ required: true }) formCtrl: FormControl;

  @Input() focus: boolean = false;

  @ViewChild('editor', { static: true }) editor: ElementRef<HTMLElement>;

  private editorState: EditorState;
  private editorView: any;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initEditor();
      this.listenToFormControlChanges();
    }
  }

  private initEditor(): void {
    this.editorState = EditorState.create({
      doc: this.formCtrl.getRawValue(),
      extensions: [
        keymap.of([...defaultKeymap, indentWithTab]),
        basicSetup,
        this.getLanguage(this.language),
        // use to update the form control value when text changes
        EditorView.updateListener.of((update) => this.onChange(update.state.doc.toString())),
        EditorView.darkTheme.of(this.themeService.isDarkTheme()),
        this.getTheme(),
        EditorState.readOnly.of(this.formCtrl.disabled),
        //indentUnit.of("")
      ],
    });

    this.editorView = new EditorView({
      state: this.editorState,
      parent: this.editor.nativeElement,
    });

    if (this.focus) {
      this.editorView.focus();
    }
  }

  private onChange(value: string): void {
    const currentFormValue = this.formCtrl.getRawValue();
    if (value !== currentFormValue) {
      this.formCtrl.patchValue(value);
    }
  }

  private listenToFormControlChanges(): void {
    this.formCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const currentValue = this.editorView.state.doc.toString();
      if (value !== currentValue) {
        this.editorView.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value || '',
          },
        });
      }
    });
  }

  private getLanguage(language: FlCodeEditorLanguage): Extension {
    switch (language) {
      case 'python':
        return python();
      case 'json':
        return json();
      case 'shell':
        return StreamLanguage.define(shell);
      case 'r':
        return StreamLanguage.define(r);
      case 'yaml':
        return StreamLanguage.define(yaml);
      case 'julia':
        return StreamLanguage.define(julia);
      case 'perl':
        return StreamLanguage.define(perl);
      default:
        throw new Error(`Language ${language} is not supported`);
    }
  }

  private getTheme(): Extension {
    const isDarkTheme = this.themeService.isDarkTheme();
    const themeDetails = this.themeService.getCurrentThemeDetail();
    const config = {
      name: 'materialDark',
      dark: isDarkTheme,
      background: themeDetails.background,
      foreground: themeDetails.foreground,
      // selection: '#d3267d',
      // cursor: '#FFCC00',
      // dropdownBackground: '#263238',
      // dropdownBorder: '#FFFFFF10',
      // activeLine: '#d3267d',
      // matchingBracket: '#263238',
      keyword: '#F92672',
      storage: '#89DDFF',
      variable: themeDetails.foreground,
      parameter: '#A6E22E',
      function: '#82AAFF',
      string: isDarkTheme ? '#E6DB74' : themeDetails.accent,
      constant: '#89DDFF',
      type: '#A6E22E',
      class: '#A6E22E',
      number: '#66D9EF',
      comment: '#75715E',
      heading: '#89DDFF',
      invalid: themeDetails.warn,
      regexp: '#C3E88D',
    };

    const materialDarkHighlightStyle = HighlightStyle.define([
      { tag: t.keyword, color: config.keyword },
      {
        tag: [t.name, t.deleted, t.character, t.macroName],
        color: config.variable,
      },
      { tag: [t.propertyName], color: config.function },
      {
        tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
        color: config.string,
      },
      {
        tag: [t.function(t.variableName), t.labelName],
        color: config.function,
      },
      {
        tag: [t.color, t.constant(t.name), t.standard(t.name)],
        color: config.constant,
      },
      { tag: [t.definition(t.name), t.separator], color: config.variable },
      { tag: [t.className], color: config.class },
      {
        tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
        color: config.number,
      },
      { tag: [t.typeName], color: config.type, fontStyle: config.type },
      { tag: [t.operator, t.operatorKeyword], color: config.keyword },
      { tag: [t.url, t.escape, t.regexp, t.link], color: config.regexp },
      { tag: [t.meta, t.comment], color: config.comment },
      { tag: t.strong, fontWeight: 'bold' },
      { tag: t.emphasis, fontStyle: 'italic' },
      { tag: t.link, textDecoration: 'underline' },
      { tag: t.heading, fontWeight: 'bold', color: config.heading },
      {
        tag: [t.atom, t.bool, t.special(t.variableName)],
        color: config.variable,
      },
      { tag: t.invalid, color: config.invalid },
      { tag: t.strikethrough, textDecoration: 'line-through' },
    ]);

    return [syntaxHighlighting(materialDarkHighlightStyle)];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.editorView) this.editorView.destroy();
  }
}
