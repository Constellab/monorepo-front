import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TeAudioTranscriptionConfig } from '../../block-tune/te-audio-transcription-block-tune.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TeRichText } from '../../model/lib';

/**
 * Dialog to record an audio to write text in the rich text editor
 */
@Component({
    selector: 'te-audio-transcription-dialog',
    templateUrl: './te-audio-transcription-dialog.component.html',
    styleUrl: './te-audio-transcription-dialog.component.scss',
    standalone: false
})
export class TeAudioTranscriptionDialogComponent implements OnInit, OnDestroy {
  private mediaRecorder: MediaRecorder;
  audioChunks: any[] = [];

  micDisabled = false;
  isRecording = false;
  transcriptionLoading = false;

  // if true, after record stop, the audio will be transcribed
  private enableTranscribe = false;

  private config: TeAudioTranscriptionConfig = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  async ngOnInit(): Promise<void> {
    await this.startRecording();
  }

  async startRecording(): Promise<void> {
    let stream: MediaStream;

    try {
      // Request permission to access the user's microphone
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      this.micDisabled = true;
      return;
    }

    // Create a MediaRecorder instance
    this.mediaRecorder = new MediaRecorder(stream);

    // Clear any previous recordings
    this.audioChunks = [];

    // Event handler for when data is available
    this.mediaRecorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
      if (this.enableTranscribe) {
        this.transcribe();
        this.enableTranscribe = false;
      }
    };

    this.mediaRecorder.onstop = async () => {
      this.isRecording = false;
    };

    // Start recording
    this.mediaRecorder.start();
    this.isRecording = true;
  }

  stopRecordingAndTranscribe(): void {
    this.transcriptionLoading = true;
    this.enableTranscribe = true;
    this.stopRecording();
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      // Stop the recording
      this.mediaRecorder.stop();
    }
  }

  uploadAudioFile(file: File): void {
    this.transcriptionLoading = true;
    this.callTranscribe(file);
  }

  private transcribe(): void {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });

    // Optional: Convert the Blob to a File (useful if you need to send it via FormData)
    const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    this.callTranscribe(audioFile);
  }

  private callTranscribe(file: File): void {
    this.config.transcribeAudio(file).subscribe({
      next: (result) => this.transcribeSuccess(result),
      error: () => (this.transcriptionLoading = false),
    });
  }

  private transcribeSuccess(result: TeRichText): void {
    this.transcriptionLoading = false;

    if (result.isEmpty()) {
      this.snackBarService.openErrorMessage({ text: 'teTextEditor.no_text_detected', translateText: true });
      return;
    }
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.stopRecording();
  }
}
