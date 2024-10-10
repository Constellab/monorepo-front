import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabNoteTemplateSearchFormComponent } from './lab-note-template-search-form.component';

describe('LabNoteTemplateSearchFormComponent', () => {
  let component: LabNoteTemplateSearchFormComponent;
  let fixture: ComponentFixture<LabNoteTemplateSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteTemplateSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNoteTemplateSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
