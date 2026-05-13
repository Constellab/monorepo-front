import { Component, computed, inject, input, OnDestroy, output, signal } from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { Observable } from 'rxjs';

import { FlAiVoiceRecorder } from '../../model/fl-ai-voice-recorder.class';
import { FlAiService } from '../../service/fl-ai.service';

/**
 * Voice button that records audio, transcribes it, then calls the provided
 * onSubmit callback with the transcription text. Emits the callback result.
 *
 * Flow: click mic → recording → click stop → transcribe → onSubmit(text) → emit result
 */
@Component({
  selector: 'fl-ai-voice-button',
  templateUrl: './fl-ai-voice-button.component.html',
  styleUrl: './fl-ai-voice-button.component.scss',
  standalone: false,
})
export class FlAiVoiceButtonComponent implements OnDestroy {
  private snackBar = inject(FlSnackBarService);

  onSubmit = input.required<(text: string) => Observable<unknown>>();
  disabled = input(false);
  tooltip = input<string>('flAi.start_recording');

  submitted = output<unknown>();

  recorder = new FlAiVoiceRecorder(inject(FlAiService), this.snackBar);
  isSubmitting = signal(false);

  isLoading = computed(() => this.recorder.isTranscribing() || this.isSubmitting());
  isDisabled = computed(() => this.disabled() || this.isLoading());

  constructor() {
    this.recorder.onTranscriptionSuccess = (text) => this.callOnSubmit(text);
  }

  ngOnDestroy(): void {
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
