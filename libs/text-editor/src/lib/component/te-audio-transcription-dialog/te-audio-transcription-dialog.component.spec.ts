import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeAudioTranscriptionDialogComponent } from './te-audio-transcription-dialog.component';

describe('TeAudioTranscriptionDialogComponent', () => {
  let component: TeAudioTranscriptionDialogComponent;
  let fixture: ComponentFixture<TeAudioTranscriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeAudioTranscriptionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeAudioTranscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
