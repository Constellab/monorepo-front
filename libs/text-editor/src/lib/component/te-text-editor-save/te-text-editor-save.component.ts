import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, Subscription, tap } from 'rxjs';
import { FlDebouncer } from '@monorepo/front-core-lib';
import { TeRichText } from '../../model/lib';

/**
 * Component to automatically save the content of a text editor.
 * It shows a save status text and call the provided save function when the content changes.
 */
@Component({
  selector: 'te-text-editor-save',
  templateUrl: './te-text-editor-save.component.html',
  styleUrl: './te-text-editor-save.component.scss',
})
export class TeTextEditorSaveComponent implements OnInit, OnDestroy {
  /**
   * Form control of the text editor content.
   */
  @Input({ required: true }) formCtrl: FormControl;

  /**
   * Function to save the content of the text editor.
   */
  @Input({ required: true }) saveFunc: (value: TeRichText) => Observable<any>;

  @Input() debounceTime: number = FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME;

  saveIsLoading: boolean = false;

  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.formCtrl.valueChanges
      .pipe(
        tap(() => (this.saveIsLoading = true)),
        debounceTime(FlDebouncer.LONG_AUTO_SAVE_DEBOUNCE_TIME)
      )
      .subscribe((value) => this.saveDocument(value));
  }

  private saveDocument(value: TeRichText): void {
    this.saveFunc(value).subscribe(() => this.saveDocumentSuccess());
  }

  private saveDocumentSuccess(): void {
    this.saveIsLoading = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
