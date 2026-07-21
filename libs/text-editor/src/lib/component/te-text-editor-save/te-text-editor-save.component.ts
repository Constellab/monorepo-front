import { ChangeDetectionStrategy,Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FlDebouncer } from '@monorepo/front-core-lib/fl-core';
import { debounceTime, filter, Observable, Subscription, switchMap, tap } from 'rxjs';

import { TeRichText } from '../../model/lib';
import { TeTextEditorComponent } from '../te-text-editor/te-text-editor.component';

/**
 * Component to automatically save the content of a text editor.
 * It shows a save status text and call the provided save function when the content changes.
 *
 * Example in html :
 * <te-text-editor-save [textEditor]="textEditor"></te-text-editor-save>
 * <te-text-editor#textEditor></te-text-editor>
 *
 * Or using viewChild in the parent component to get the text editor reference.
 * <te-text-editor-save [textEditor]="textEditor"></te-text-editor-save>
 * textEditor = viewChild(TeTextEditorComponent);
 */
@Component({
  selector: 'te-text-editor-save',
  templateUrl: './te-text-editor-save.component.html',
  styleUrl: './te-text-editor-save.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeTextEditorSaveComponent implements OnInit, OnDestroy {
  /**
   * Text editor component to monitor for changes.
   */
  textEditor = input.required<TeTextEditorComponent>();

  /**
   * Function to save the content of the text editor.
   */
  @Input({ required: true }) saveFunc: (value: TeRichText) => Observable<any>;

  @Input() debounceTime: number = FlDebouncer.LONG_AUTO_SAVE_DEBOUNCE_TIME;

  saveIsLoading: boolean = false;

  private textEditor$ = toObservable(this.textEditor);
  private subscription: Subscription;

  ngOnInit(): void {
    // subscribe in init to let the debounceTime input be set before subscribing
    this.subscription = this.textEditor$
      .pipe(
        filter((textEditor) => textEditor != null),
        switchMap((textEditor) => textEditor.textChange),
        tap(() => (this.saveIsLoading = true)),
        debounceTime(this.debounceTime)
      )
      .subscribe((value) => this.saveDocument(value));
  }

  private saveDocument(value: TeRichText): void {
    this.saveFunc(value).subscribe({ complete: () => this.saveDocumentSuccess() });
  }

  private saveDocumentSuccess(): void {
    this.saveIsLoading = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
