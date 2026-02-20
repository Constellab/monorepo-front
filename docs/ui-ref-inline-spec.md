# UI Reference Inline Element — Implementation Spec

## Overview

This spec describes a new **inline custom element** for the text editor (`te-ui-ref-inline`) that allows product documentation to reference specific UI elements (buttons, dialogs, tabs, etc.) in the application. When a reader clicks the reference, it navigates to the correct app/page and performs an action (highlight an element, open a dialog, switch a tab, scroll to a section).

It also describes a **directive** (`flDocRef`) to tag UI elements in the application templates so they can be reliably targeted.

---

## Part 1: Data Model

### File: `libs/text-editor/src/lib/model/te-ui-ref.class.ts`

```typescript
/**
 * Actions that can be performed on a referenced UI element
 */
export type TeUiRefAction = 'highlight' | 'click' | 'scroll-to';

/**
 * The applications that can be targeted by a UI reference
 */
export type TeUiRefApp = 'ca-space' | 'lab' | 'ha-community';

/**
 * Data stored in the te-ui-ref-inline custom element via data-jsondata attribute.
 */
export interface TeUiRefData {
  /**
   * Display label shown to the reader (e.g. "Create Folder")
   */
  label: string;

  /**
   * The target application. Required for cross-app navigation.
   */
  app: TeUiRefApp;

  /**
   * Route path within the app (e.g. "/app/settings").
   * If omitted, the action targets the current page.
   */
  route?: string;

  /**
   * Query parameters to set on navigation (e.g. { tab: "1" })
   */
  queryParams?: Record<string, string>;

  /**
   * The action to perform once on the page.
   * - 'highlight': scroll to and visually highlight the element
   * - 'click': simulate a click (useful to open dialogs)
   * - 'scroll-to': scroll to an anchor in the page
   */
  action: TeUiRefAction;

  /**
   * Value of the flDocRef directive on the target element.
   * Used with 'highlight' and 'click' actions.
   * The directive renders as data-doc-ref="<value>" in the DOM.
   */
  docRef?: string;

  /**
   * URL fragment for scroll-to action (e.g. "advanced-settings")
   */
  anchor?: string;
}

export const teUiRefTagName = 'te-ui-ref-inline';
```

### How it is stored in EditorJS JSON

The element appears inline in paragraph/list text, just like `te-formula-inline` or `te-variable-inline`. EditorJS stores it as a custom HTML tag with a `data-jsondata` attribute:

```json
{
  "type": "paragraph",
  "data": {
    "text": "Click on <te-ui-ref-inline data-jsondata=\"{&quot;label&quot;:&quot;Create Folder&quot;,&quot;app&quot;:&quot;ca-space&quot;,&quot;route&quot;:&quot;/app/folders&quot;,&quot;action&quot;:&quot;highlight&quot;,&quot;docRef&quot;:&quot;create-folder-btn&quot;}\"></te-ui-ref-inline> to start."
  }
}
```

This follows the exact same pattern as `te-variable-inline` and `te-formula-inline`. No schema changes are needed.

---

## Part 2: Inline Component (Angular Custom Element)

### File: `libs/text-editor/src/lib/component/te-ui-ref-inline/te-ui-ref-inline.component.ts`

```typescript
import { Component, HostBinding, HostListener, inject, OnInit } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { TeElementInlineDirective } from '../../model/te-element.directive';
import { TeUiRefData } from '../../model/te-ui-ref.class';
import { TeUiRefFormDialogComponent } from '../te-ui-ref-form-dialog/te-ui-ref-form-dialog.component';

/**
 * Inline custom element that renders a clickable UI reference in the text editor.
 *
 * In edit mode: clicking opens a form dialog to configure the reference.
 * In read-only mode: clicking triggers navigation + action (highlight, click, scroll).
 */
@Component({
  selector: 'te-ui-ref-inline',
  templateUrl: './te-ui-ref-inline.component.html',
  styleUrl: './te-ui-ref-inline.component.scss',
  standalone: false,
})
export class TeUiRefInlineComponent
  extends TeElementInlineDirective<TeUiRefData>
  implements OnInit
{
  private dialogService = inject(FlDialogService);

  @HostBinding('attr.contenteditable') contenteditable = 'false';

  @HostListener('click') onClick(): void {
    if (this.disabled) {
      this.executeAction();
    } else {
      this.openFormDialog();
    }
  }

  ngOnInit(): void {
    if (!this.disabled && this.newElement) {
      this.openFormDialog();
    }
  }

  get tooltip(): string {
    if (!this.data) return '';
    const parts: string[] = [];
    if (this.data.app) parts.push(this.data.app);
    if (this.data.route) parts.push(this.data.route);
    if (this.data.docRef) parts.push(`#${this.data.docRef}`);
    return parts.join(' ');
  }

  openFormDialog(): void {
    this.dialogService
      .openSmallDialog(TeUiRefFormDialogComponent, { data: this.data })
      .afterClosed()
      .subscribe((value: TeUiRefData) => {
        if (value) {
          this.setData(value);
        }
      });
  }

  /**
   * In read-only mode, dispatch a custom DOM event that a parent directive
   * or service can listen to and handle (navigate + highlight/click/scroll).
   *
   * We use a CustomEvent so the text-editor library stays decoupled from
   * app-specific routing logic.
   */
  private executeAction(): void {
    if (!this.data) return;
    this.elementRef.nativeElement.dispatchEvent(
      new CustomEvent('te-ui-ref-action', {
        bubbles: true,
        detail: this.data,
      })
    );
  }
}
```

### File: `libs/text-editor/src/lib/component/te-ui-ref-inline/te-ui-ref-inline.component.html`

```html
<span [matTooltip]="tooltip" class="ui-ref-label">
  @if (!data) {
    {{ 'teTextEditor.ui_ref' | translate }}
  } @else {
    <mat-icon class="ui-ref-icon">open_in_new</mat-icon>
    {{ data.label }}
  }
</span>
```

### File: `libs/text-editor/src/lib/component/te-ui-ref-inline/te-ui-ref-inline.component.scss`

```scss
:host {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background-color: var(--primary-color-light, #e3f2fd);
  color: var(--primary-color, #1976d2);
  border-radius: 4px;
  padding: 0 4px;
  font-size: inherit;
  line-height: inherit;
  vertical-align: baseline;
}

// In read-only mode, show pointer cursor (the element is clickable)
:host(.disabled) {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    background-color: var(--primary-color-lighter, #bbdefb);
  }
}

// In edit mode, show pointer cursor too (opens the form dialog)
:host:not(.disabled) {
  cursor: pointer;
  border: 1px dashed var(--primary-color, #1976d2);
}

.ui-ref-icon {
  font-size: 14px;
  width: 14px;
  height: 14px;
  line-height: 14px;
}

.ui-ref-label {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
```

---

## Part 3: Form Dialog for Editing the Reference

### File: `libs/text-editor/src/lib/component/te-ui-ref-form-dialog/te-ui-ref-form-dialog.component.ts`

```typescript
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TeUiRefAction, TeUiRefApp, TeUiRefData } from '../../model/te-ui-ref.class';

@Component({
  selector: 'te-ui-ref-form-dialog',
  templateUrl: './te-ui-ref-form-dialog.component.html',
  styleUrl: './te-ui-ref-form-dialog.component.scss',
  standalone: false,
})
export class TeUiRefFormDialogComponent implements OnInit {
  formGroup: FormGroup;

  apps: TeUiRefApp[] = ['ca-space', 'lab', 'ha-community'];
  actions: TeUiRefAction[] = ['highlight', 'click', 'scroll-to'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeUiRefFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeUiRefData
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      label: [this.data?.label ?? '', Validators.required],
      app: [this.data?.app ?? 'ca-space', Validators.required],
      route: [this.data?.route ?? ''],
      action: [this.data?.action ?? 'highlight', Validators.required],
      docRef: [this.data?.docRef ?? ''],
      anchor: [this.data?.anchor ?? ''],
    });
  }

  save(): void {
    if (this.formGroup.valid) {
      const value: TeUiRefData = this.formGroup.value;
      // Clean empty optional fields
      if (!value.route) delete value.route;
      if (!value.docRef) delete value.docRef;
      if (!value.anchor) delete value.anchor;
      if (!value.queryParams) delete value.queryParams;
      this.dialogRef.close(value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
```

### File: `libs/text-editor/src/lib/component/te-ui-ref-form-dialog/te-ui-ref-form-dialog.component.html`

```html
<fl-dialog-header [title]="'teTextEditor.ui_ref_edit' | translate"></fl-dialog-header>

<fl-dialog-content>
  <form [formGroup]="formGroup" class="form-container">
    <mat-form-field appearance="outline">
      <mat-label>{{ 'teTextEditor.ui_ref_label' | translate }}</mat-label>
      <input matInput formControlName="label" />
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'teTextEditor.ui_ref_app' | translate }}</mat-label>
      <mat-select formControlName="app">
        @for (app of apps; track app) {
          <mat-option [value]="app">{{ app }}</mat-option>
        }
      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'teTextEditor.ui_ref_route' | translate }}</mat-label>
      <input matInput formControlName="route" placeholder="/app/settings" />
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'teTextEditor.ui_ref_action' | translate }}</mat-label>
      <mat-select formControlName="action">
        @for (action of actions; track action) {
          <mat-option [value]="action">{{ action }}</mat-option>
        }
      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'teTextEditor.ui_ref_doc_ref' | translate }}</mat-label>
      <input matInput formControlName="docRef" placeholder="create-folder-btn" />
      <mat-hint>{{ 'teTextEditor.ui_ref_doc_ref_hint' | translate }}</mat-hint>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>{{ 'teTextEditor.ui_ref_anchor' | translate }}</mat-label>
      <input matInput formControlName="anchor" placeholder="advanced-settings" />
    </mat-form-field>
  </form>
</fl-dialog-content>

<fl-dialog-actions>
  <button mat-stroked-button (click)="cancel()">
    {{ 'teTextEditor.cancel' | translate }}
  </button>
  <button mat-flat-button color="primary" (click)="save()" [disabled]="formGroup.invalid">
    {{ 'teTextEditor.save' | translate }}
  </button>
</fl-dialog-actions>
```

### File: `libs/text-editor/src/lib/component/te-ui-ref-form-dialog/te-ui-ref-form-dialog.component.scss`

```scss
.form-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

---

## Part 4: Inline Tool (EditorJS Integration)

### File: `libs/text-editor/src/lib/inline-tool/te-ui-ref-inline-tool.class.ts`

```typescript
import { SanitizerConfig } from '@editorjs/editorjs';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { TeUiRefData, teUiRefTagName } from '../model/te-ui-ref.class';
import { TeHelper } from '../model/te.helper';
import { TeComponentInlineTool } from './te-component-inline-tool.class';

export class TeUiRefInlineToolClass extends TeComponentInlineTool<TeUiRefData> {
  static override get title(): string {
    return flRootInjector.get(FlTranslateService).translate('teTextEditor.ui_ref');
  }

  public static get sanitize(): SanitizerConfig {
    return {
      [teUiRefTagName]: {
        'data-jsondata': true,
      },
    } as SanitizerConfig;
  }

  getInlineElementTag(): string {
    return teUiRefTagName;
  }

  renderInlineButton(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(
      this.options.api.styles.inlineToolButton,
      'g-text-editor-inline-button'
    );
    button.innerHTML = TeHelper.getMatIconElement('open_in_new');
    this.inlineButton = button;
    return button;
  }

  getDefaultData(range: Range): TeUiRefData {
    const fragment = range.extractContents();
    const selectText = TeHelper.extractTextFromDocumentFragment(fragment);

    return {
      label: selectText,
      app: 'ca-space',
      action: 'highlight',
    };
  }

  getWrapper(): HTMLElement | undefined {
    return document.createElement(teUiRefTagName);
  }
}
```

---

## Part 5: Registration

### Changes to `libs/text-editor/src/lib/te-text-editor.module.ts`

Add the new components to declarations and register the custom element:

```typescript
// New imports at the top
import { TeUiRefInlineComponent } from './component/te-ui-ref-inline/te-ui-ref-inline.component';
import { TeUiRefFormDialogComponent } from './component/te-ui-ref-form-dialog/te-ui-ref-form-dialog.component';
import { teUiRefTagName } from './model/te-ui-ref.class';

// In @NgModule declarations array, add:
//   TeUiRefInlineComponent,
//   TeUiRefFormDialogComponent,

// In the constructor, inside the `if (isPlatformBrowser(platformId))` block, add:
//   customElements.define(
//     teUiRefTagName,
//     createCustomElement(TeUiRefInlineComponent, { injector: injector })
//   );
```

### Changes to `libs/text-editor/src/lib/model/te-config.class.ts`

Add the new inline tool to the `TeCompleteConfig`:

```typescript
// New import at the top
import { TeUiRefInlineToolClass } from '../inline-tool/te-ui-ref-inline-tool.class';
import { teInlineToolFactory } from '../inline-tool/te-inline-tool.factory';

// In TeCompleteConfig.getTools(), add to the tools object:
//   uiRef: teInlineToolFactory(TeUiRefInlineToolClass),

// In TeCompleteConfig.getFullInlineToolbar(), add 'uiRef' to the returned array
// (before 'cleanStyle')
```

### Changes to `libs/text-editor/src/index.ts`

Add new exports:

```typescript
export * from './lib/model/te-ui-ref.class';
export * from './lib/component/te-ui-ref-inline/te-ui-ref-inline.component';
export * from './lib/component/te-ui-ref-form-dialog/te-ui-ref-form-dialog.component';
export * from './lib/inline-tool/te-ui-ref-inline-tool.class';
```

### Changes to `libs/text-editor/src/lib/te-text-editor.i18n.ts`

Add to both FR and EN translation objects:

```typescript
// EN
ui_ref: 'UI Reference',
ui_ref_edit: 'Edit UI Reference',
ui_ref_label: 'Display label',
ui_ref_app: 'Application',
ui_ref_route: 'Route',
ui_ref_action: 'Action',
ui_ref_doc_ref: 'Element reference (flDocRef)',
ui_ref_doc_ref_hint: 'Value of the flDocRef directive on the target element',
ui_ref_anchor: 'Anchor',

// FR
ui_ref: 'Référence UI',
ui_ref_edit: 'Modifier la référence UI',
ui_ref_label: "Libellé d'affichage",
ui_ref_app: 'Application',
ui_ref_route: 'Route',
ui_ref_action: 'Action',
ui_ref_doc_ref: "Référence de l'élément (flDocRef)",
ui_ref_doc_ref_hint: "Valeur de la directive flDocRef sur l'élément cible",
ui_ref_anchor: 'Ancre',
```

---

## Part 6: The `flDocRef` Directive (Tagging UI Elements)

This directive is placed in `front-core-lib` so all apps can use it. Its only job is to set a `data-doc-ref` attribute on the host element, making it targetable by the UI reference system.

### File: `libs/front-core-lib/src/lib/fl-core-directive/fl-doc-ref/fl-doc-ref.directive.ts`

```typescript
import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Directive to tag a UI element so it can be targeted by product documentation
 * UI references (te-ui-ref-inline).
 *
 * Usage:
 *   <button flDocRef="create-folder-btn" (click)="createFolder()">Create Folder</button>
 *
 * This renders as:
 *   <button data-doc-ref="create-folder-btn" ...>Create Folder</button>
 *
 * The te-ui-ref-inline element references this value in its `docRef` field.
 */
@Directive({
  selector: '[flDocRef]',
  standalone: false,
})
export class FlDocRefDirective {
  @HostBinding('attr.data-doc-ref')
  @Input()
  flDocRef: string;
}
```

### Registration

Add to `libs/front-core-lib/src/lib/fl-core-directive/fl-core-directive.module.ts`:

```typescript
// Import
import { FlDocRefDirective } from './fl-doc-ref/fl-doc-ref.directive';

// Add to declarations and exports arrays
```

Add to `libs/front-core-lib/src/lib/fl-core-directive/public-api.ts`:

```typescript
export * from './fl-doc-ref/fl-doc-ref.directive';
```

### Usage in app templates

```html
<!-- In ca-space-front component templates -->
<button flDocRef="create-folder-btn" (click)="createFolder()">
  {{ 'folder.create' | translate }}
</button>

<button flDocRef="save-settings-btn" (click)="save()">
  {{ 'common.save' | translate }}
</button>

<!-- Dialog triggers -->
<button flDocRef="share-dialog-trigger" (click)="openShareDialog()">
  {{ 'folder.share' | translate }}
</button>
```

---

## Part 7: Action Handler (Consuming the `te-ui-ref-action` Event)

The text-editor library dispatches a `CustomEvent('te-ui-ref-action')` when a `te-ui-ref-inline` element is clicked in read-only mode. Each application provides its own handler since routing is app-specific.

### File: `libs/front-core-lib/src/lib/fl-core-directive/fl-ui-ref-action/fl-ui-ref-action.directive.ts`

This directive is placed on the text editor container. It listens for the bubbling custom event and resolves the action.

```typescript
import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

import { FlUiRefActionService } from './fl-ui-ref-action.service';
import { TeUiRefData } from '@monorepo/text-editor';

/**
 * Directive to place on a container that holds a read-only text editor.
 * It intercepts te-ui-ref-action events and delegates to FlUiRefActionService.
 */
@Directive({
  selector: '[flUiRefAction]',
  standalone: false,
})
export class FlUiRefActionDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private uiRefActionService = inject(FlUiRefActionService);

  private handler = (event: CustomEvent<TeUiRefData>) => {
    event.stopPropagation();
    this.uiRefActionService.execute(event.detail);
  };

  ngOnInit(): void {
    this.el.nativeElement.addEventListener('te-ui-ref-action', this.handler);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('te-ui-ref-action', this.handler);
  }
}
```

### File: `libs/front-core-lib/src/lib/fl-core-directive/fl-ui-ref-action/fl-ui-ref-action.service.ts`

Abstract service. Each app provides its own implementation to resolve app URLs.

```typescript
import { Injectable } from '@angular/core';

import { TeUiRefApp, TeUiRefData } from '@monorepo/text-editor';

/**
 * Abstract service for resolving and executing UI reference actions.
 * Each app must provide an implementation that knows how to resolve
 * the base URL for each TeUiRefApp.
 */
@Injectable()
export abstract class FlUiRefActionService {
  /**
   * Resolve the base URL for a target app.
   * Returns undefined if the target is the current app (use router).
   */
  protected abstract getAppBaseUrl(app: TeUiRefApp): string | undefined;

  /**
   * Returns true if the given app is the current app (use Angular router).
   */
  protected abstract isCurrentApp(app: TeUiRefApp): boolean;

  /**
   * Execute a UI reference action.
   */
  execute(data: TeUiRefData): void {
    if (this.isCurrentApp(data.app)) {
      this.executeInCurrentApp(data);
    } else {
      this.executeInExternalApp(data);
    }
  }

  private executeInCurrentApp(data: TeUiRefData): void {
    // Navigate within the SPA, then perform the action
    // This part needs the Angular Router — injected by the concrete implementation
    // For now, fall back to the external app approach (full page load)
    this.executeInExternalApp(data);
  }

  private executeInExternalApp(data: TeUiRefData): void {
    const baseUrl = this.getAppBaseUrl(data.app);
    if (!baseUrl) return;

    let url = baseUrl;
    if (data.route) url += data.route;

    // Encode the action in query params so the target page can pick it up
    const params = new URLSearchParams(data.queryParams ?? {});
    if (data.docRef) params.set('_docRef', data.docRef);
    if (data.action) params.set('_docAction', data.action);
    if (data.anchor) params.set('_docAnchor', data.anchor);

    const qs = params.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;

    window.open(url, '_blank');
  }
}
```

### File: `libs/front-core-lib/src/lib/fl-core-directive/fl-doc-ref-highlight/fl-doc-ref-highlight.directive.ts`

A directive that runs on app init to check for `_docRef` / `_docAction` query params and execute the action on the target element.

```typescript
import { Directive, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Place this directive on a root-level container (e.g. app component).
 * On init, it checks for _docRef/_docAction query params and performs
 * the requested action (highlight, click, scroll-to) on the target element.
 */
@Directive({
  selector: '[flDocRefHighlight]',
  standalone: false,
})
export class FlDocRefHighlightDirective implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const docRef = params['_docRef'];
      const action = params['_docAction'] ?? 'highlight';
      const anchor = params['_docAnchor'];

      if (!docRef && !anchor) return;

      // Wait for the page to render
      setTimeout(() => this.performAction(docRef, action, anchor), 1500);

      // Clean up the query params
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { _docRef: null, _docAction: null, _docAnchor: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  private performAction(docRef: string, action: string, anchor: string): void {
    if (action === 'scroll-to' && anchor) {
      const el = document.querySelector(`#${anchor}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!docRef) return;

    const el = document.querySelector(`[data-doc-ref="${docRef}"]`);
    if (!el) return;

    switch (action) {
      case 'highlight':
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('fl-doc-ref-highlight');
        setTimeout(() => el.classList.remove('fl-doc-ref-highlight'), 4000);
        break;

      case 'click':
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).click();
        break;
    }
  }
}
```

### Highlight CSS (add to global styles)

Add to `libs/front-core-lib/src/style/fl-global.scss`:

```scss
// ---- Doc reference highlight animation ----
.fl-doc-ref-highlight {
  position: relative;
  z-index: 100;
  animation: fl-doc-ref-pulse 0.75s ease-in-out 4;
}

@keyframes fl-doc-ref-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 25, 118, 210), 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--primary-color-rgb, 25, 118, 210), 0);
  }
}
```

---

## Part 8: App-Specific Service Implementations

Each app provides its own `FlUiRefActionService` implementation.

### Example: `ha-community-front`

```typescript
// In ha-community-front/src/app/ha-core/ha-service/ha-ui-ref-action.service.ts
import { Injectable } from '@angular/core';

import { FlUiRefActionService } from '@monorepo/front-core-lib/fl-core-directive';
import { TeUiRefApp } from '@monorepo/text-editor';

import { HaEnvironmentHelper } from '../ha-model/ha-config/ha-environment.helper';

@Injectable()
export class HaUiRefActionService extends FlUiRefActionService {
  protected getAppBaseUrl(app: TeUiRefApp): string | undefined {
    switch (app) {
      case 'ca-space':
        return HaEnvironmentHelper.getConstellabFrontUrl();
      case 'ha-community':
        return HaEnvironmentHelper.getCommunityFrontUrl();
      case 'lab':
        return undefined; // Lab URLs are per-instance, not resolvable from community
      default:
        return undefined;
    }
  }

  protected isCurrentApp(app: TeUiRefApp): boolean {
    return app === 'ha-community';
  }
}
```

Register in the app module providers:

```typescript
{ provide: FlUiRefActionService, useClass: HaUiRefActionService }
```

---

## Summary of All New Files

| File | Type | Location |
|------|------|----------|
| `te-ui-ref.class.ts` | Data model | `libs/text-editor/src/lib/model/` |
| `te-ui-ref-inline.component.ts/html/scss` | Angular custom element | `libs/text-editor/src/lib/component/te-ui-ref-inline/` |
| `te-ui-ref-form-dialog.component.ts/html/scss` | Edit dialog | `libs/text-editor/src/lib/component/te-ui-ref-form-dialog/` |
| `te-ui-ref-inline-tool.class.ts` | EditorJS inline tool | `libs/text-editor/src/lib/inline-tool/` |
| `fl-doc-ref.directive.ts` | Tagging directive | `libs/front-core-lib/src/lib/fl-core-directive/fl-doc-ref/` |
| `fl-ui-ref-action.directive.ts` | Event listener directive | `libs/front-core-lib/src/lib/fl-core-directive/fl-ui-ref-action/` |
| `fl-ui-ref-action.service.ts` | Abstract action service | `libs/front-core-lib/src/lib/fl-core-directive/fl-ui-ref-action/` |
| `fl-doc-ref-highlight.directive.ts` | Highlight on page load | `libs/front-core-lib/src/lib/fl-core-directive/fl-doc-ref-highlight/` |

## Files to Modify

| File | Change |
|------|--------|
| `te-text-editor.module.ts` | Add declarations + custom element registration |
| `te-config.class.ts` | Add `uiRef` inline tool to `TeCompleteConfig` |
| `te-text-editor.i18n.ts` | Add EN/FR translations |
| `text-editor/src/index.ts` | Add exports |
| `fl-core-directive.module.ts` | Add `FlDocRefDirective` |
| `fl-core-directive/public-api.ts` | Add exports |
| `fl-global.scss` | Add highlight animation CSS |
| App-specific modules | Provide `FlUiRefActionService` implementation |

---

## How It All Fits Together

### Authoring flow (in the EditorJS editor)

1. Writer selects text (e.g. "Create Folder")
2. Clicks the "UI Reference" button in the inline toolbar (open_in_new icon)
3. A `<te-ui-ref-inline>` element is created with default data
4. The form dialog opens automatically (`newElement = true`)
5. Writer fills in: app=`ca-space`, route=`/app/folders`, action=`highlight`, docRef=`create-folder-btn`
6. The data is serialized as JSON in the `data-jsondata` attribute

### Reading flow (in read-only mode)

1. Reader sees a styled inline chip: `[open_in_new] Create Folder`
2. Reader clicks it
3. The component dispatches a `te-ui-ref-action` CustomEvent
4. The `flUiRefAction` directive catches it and calls `FlUiRefActionService.execute()`
5. The service resolves the target app's base URL
6. A new tab opens at `https://constellab.com/app/folders?_docRef=create-folder-btn&_docAction=highlight`
7. On the target page, `FlDocRefHighlightDirective` picks up the query params
8. It finds `<button data-doc-ref="create-folder-btn">`, scrolls to it, and applies the pulse animation

### AI doc generation flow

The Claude doc generator (`update-product-doc.md`) can be updated to:
1. When reading HTML templates, detect `flDocRef="..."` directives
2. Automatically generate `<te-ui-ref-inline>` elements in the EditorJS JSON with the correct `docRef`, `app`, and `route` values
