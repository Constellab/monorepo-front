import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectNoteTemplateComponent } from './li-select-note-template.component';

describe('LiSelectNoteTemplateComponent', () => {
  let component: LiSelectNoteTemplateComponent;
  let fixture: ComponentFixture<LiSelectNoteTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectNoteTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectNoteTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
