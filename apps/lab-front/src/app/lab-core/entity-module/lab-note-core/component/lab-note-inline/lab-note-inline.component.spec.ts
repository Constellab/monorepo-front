import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabNoteInlineComponent } from './lab-note-inline.component';

describe('LabNoteInlineComponent', () => {
  let component: LabNoteInlineComponent;
  let fixture: ComponentFixture<LabNoteInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNoteInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
