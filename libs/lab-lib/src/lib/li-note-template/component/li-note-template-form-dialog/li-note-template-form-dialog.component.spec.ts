import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiNoteTemplateFormDialogComponent } from './li-note-template-form-dialog.component';

describe('LiNoteTemplateFormDialogComponent', () => {
  let component: LiNoteTemplateFormDialogComponent;
  let fixture: ComponentFixture<LiNoteTemplateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteTemplateFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNoteTemplateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
