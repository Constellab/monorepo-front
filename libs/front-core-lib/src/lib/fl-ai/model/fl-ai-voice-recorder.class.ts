import { signal } from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { FlAiService } from '../service/fl-ai.service';

const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Encapsulates MediaRecorder + transcription logic.
 * Used by both FlAiInputDialogComponent and FlAiVoiceButtonComponent.
 */
export class FlAiVoiceRecorder {
  readonly isRecording = signal(false);
  readonly isTranscribing = signal(false);
  readonly micDisabled = signal(false);

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(
    private aiService: FlAiService,
    private snackBar: FlSnackBarService
  ) {}

  async startRecording(): Promise<void> {
    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      this.micDisabled.set(true);
      return;
    }

    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.isRecording.set(false);
      this.transcribe();
    };

    this.mediaRecorder.start();
    this.isRecording.set(true);
  }

  stopRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  toggleRecording(): void {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  destroy(): void {
    if (this.mediaRecorder) {
      if (this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      this.mediaRecorder.stream?.getTracks().forEach((track) => track.stop());
      this.mediaRecorder = null;
    }
  }

  /**
   * Called internally after recording stops.
   * Override `onTranscriptionSuccess` and `onTranscriptionError` to handle results.
   */
  onTranscriptionSuccess: (text: string) => void = () => {};
  onTranscriptionError: () => void = () => {};

  private transcribe(): void {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });

    if (audioBlob.size > MAX_AUDIO_SIZE) {
      this.snackBar.openErrorMessage({ text: 'flAi.audio_too_large', translateText: true });
      return;
    }

    const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

    this.isTranscribing.set(true);
    this.aiService.transcribeAudio(audioFile).subscribe({
      next: (result) => {
        this.isTranscribing.set(false);
        this.onTranscriptionSuccess(result.text);
      },
      error: () => {
        this.isTranscribing.set(false);
        this.snackBar.openErrorMessage({ text: 'flAi.transcription_error', translateText: true });
        this.onTranscriptionError();
      },
    });
  }
}
