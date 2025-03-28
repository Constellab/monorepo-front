import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectNoteTemplateDialogComponent } from './li-select-note-template-dialog.component';

describe('LiSelectNoteTemplateDialogComponent', () => {
  let component: LiSelectNoteTemplateDialogComponent;
  let fixture: ComponentFixture<LiSelectNoteTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectNoteTemplateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectNoteTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
