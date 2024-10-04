import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteFormDialogComponent } from './lab-note-form-dialog.component';

describe('LabNoteFormDialogComponent', () => {
  let component: LabNoteFormDialogComponent;
  let fixture: ComponentFixture<LabNoteFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
