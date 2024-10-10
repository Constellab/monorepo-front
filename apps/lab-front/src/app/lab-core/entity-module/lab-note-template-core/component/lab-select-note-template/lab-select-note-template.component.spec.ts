import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSelectNoteTemplateComponent } from './lab-select-note-template.component';

describe('LabSelectNoteTemplateComponent', () => {
  let component: LabSelectNoteTemplateComponent;
  let fixture: ComponentFixture<LabSelectNoteTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectNoteTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectNoteTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
