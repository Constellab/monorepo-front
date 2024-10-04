import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteInsertTemplateDialogComponent } from './lab-note-insert-template-dialog.component';

describe('LabNoteInsertTemplateDialogComponent', () => {
  let component: LabNoteInsertTemplateDialogComponent;
  let fixture: ComponentFixture<LabNoteInsertTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteInsertTemplateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabNoteInsertTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
