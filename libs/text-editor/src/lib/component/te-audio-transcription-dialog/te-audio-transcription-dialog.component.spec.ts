import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';

import { MockTranslatePipe } from '../te-test-helpers';
import { TeAudioTranscriptionDialogComponent } from './te-audio-transcription-dialog.component';

describe('TeAudioTranscriptionDialogComponent', () => {
  let component: TeAudioTranscriptionDialogComponent;
  let fixture: ComponentFixture<TeAudioTranscriptionDialogComponent>;

  beforeEach(async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: () => Promise.reject(new Error('mock')) },
      configurable: true,
    });

    await TestBed.configureTestingModule({
      declarations: [TeAudioTranscriptionDialogComponent, MockTranslatePipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { transcribeAudio: () => ({ subscribe: () => {} }) } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: FlSnackBarService, useValue: { openErrorMessage: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeAudioTranscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
