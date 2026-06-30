import { Component, computed, inject, input, NgZone, OnDestroy, output, signal } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { FlAiVoiceRecorder } from '../../model/fl-ai-voice-recorder.class';
import { FlAiService } from '../../service/fl-ai.service';
import {
  FlAiInputDialogComponent,
  FlAiInputDialogData,
} from '../fl-ai-input-dialog/fl-ai-input-dialog.component';

/**
 * AI helper menu button with two options:
 * - Dictate (voice recording → transcribe → onSubmit)
 * - Type instruction (opens text dialog → onSubmit)
 */
@Component({
  selector: 'fl-ai-menu-button',
  templateUrl: './fl-ai-menu-button.component.html',
  styleUrl: './fl-ai-menu-button.component.scss',
  standalone: false,
})
export class FlAiMenuButtonComponent implements OnDestroy {
  private dialogService = inject(FlDialogService);
  private snackBar = inject(FlSnackBarService);

  onSubmit = input.required<(text: string) => Observable<unknown>>();
  disabled = input(false);
  tooltip = input<string>('flAi.ai_assistant');

  dialogTitle = input<FlTranslatableText>(undefined);
  dialogDescription = input<string>(undefined);
  dialogPlaceholder = input<FlTranslatableText>(undefined);

  submitted = output<unknown>();

  private zone = inject(NgZone);

  recorder = new FlAiVoiceRecorder(inject(FlAiService), this.snackBar);
  isSubmitting = signal(false);

  isLoading = computed(() => this.recorder.isTranscribing() || this.isSubmitting());
  isDisabled = computed(() => this.disabled() || this.isLoading());

  // Capture-phase Escape handler: runs before the CDK overlay's bubble-phase handler,
  // so while dictating we can cancel the recording and stop the event before it closes
  // a surrounding dialog.
  private readonly onEscapeCapture = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.recorder.isRecording()) return;
    event.preventDefault();
    event.stopPropagation();
    this.zone.run(() => this.recorder.cancelRecording());
  };

  constructor() {
    this.recorder.onTranscriptionSuccess = (text) => this.callOnSubmit(text);
    document.addEventListener('keydown', this.onEscapeCapture, { capture: true });
  }

  openDialog(): void {
    const data: FlAiInputDialogData = {
      title: this.dialogTitle(),
      description: this.dialogDescription(),
      placeholder: this.dialogPlaceholder(),
      onSubmit: (text: string) => this.onSubmit()(text),
    };

    this.dialogService
      .openSmallDialog(FlAiInputDialogComponent, { data })
      .afterClosed()
      .subscribe((result: unknown | undefined) => {
        if (result) {
          this.submitted.emit(result);
        }
      });
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onEscapeCapture, { capture: true });
    this.recorder.destroy();
  }

  private callOnSubmit(text: string): void {
    this.isSubmitting.set(true);
    this.onSubmit()(text).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        this.submitted.emit(result);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackBar.openErrorMessage({ text: 'flAi.submit_error', translateText: true });
      },
    });
  }
}
