import { ChangeDetectionStrategy,Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { FlAiVoiceRecorder } from '../../model/fl-ai-voice-recorder.class';
import { FlAiService } from '../../service/fl-ai.service';

export interface FlAiInputDialogData<T = unknown> {
  title?: FlTranslatableText;
  description?: string;
  placeholder?: FlTranslatableText;
  onSubmit: (text: string) => Observable<T>;
}

@Component({
  selector: 'fl-ai-input-dialog',
  templateUrl: './fl-ai-input-dialog.component.html',
  styleUrl: './fl-ai-input-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlAiInputDialogComponent implements OnDestroy {
  private dialogRef = inject(MatDialogRef<FlAiInputDialogComponent>);
  private snackBar = inject(FlSnackBarService);

  data: FlAiInputDialogData = inject(MAT_DIALOG_DATA);
  recorder = new FlAiVoiceRecorder(inject(FlAiService), this.snackBar);

  title: FlTranslatableText = this.data.title ?? 'flAi.input_title';
  description: string | null = this.data.description ?? null;
  placeholder: FlTranslatableText = this.data.placeholder ?? 'flAi.input_placeholder';

  textInput = signal('');
  isSubmitting = signal(false);

  isLoading = computed(() => this.recorder.isTranscribing() || this.isSubmitting());
  canGenerate = computed(() => this.textInput().trim().length > 0 && !this.isLoading());

  constructor() {
    this.recorder.onTranscriptionSuccess = (text) => this.textInput.set(text);

    // Take over Escape handling: while dictating, Escape cancels the recording and
    // keeps the dialog open; otherwise it closes the dialog as usual.
    this.dialogRef.disableClose = true;
    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key !== 'Escape') return;
      if (this.recorder.isRecording()) {
        this.recorder.cancelRecording();
      } else {
        this.dialogRef.close();
      }
    });
    // Preserve the default backdrop-click-to-close behaviour disabled above.
    this.dialogRef.backdropClick().subscribe(() => this.dialogRef.close());
  }

  generate(): void {
    const text = this.textInput().trim();
    if (!text) return;

    this.isSubmitting.set(true);
    this.data.onSubmit(text).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        this.dialogRef.close(result);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackBar.openErrorMessage({ text: 'flAi.submit_error', translateText: true });
      },
    });
  }

  onTextInput(event: Event): void {
    this.textInput.set((event.target as HTMLTextAreaElement).value);
  }

  ngOnDestroy(): void {
    this.recorder.destroy();
  }
}
