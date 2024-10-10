import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabNoteTemplateSearchComponent } from './lab-note-template-search.component';

describe('LabNoteTemplateSearchComponent', () => {
  let component: LabNoteTemplateSearchComponent;
  let fixture: ComponentFixture<LabNoteTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteTemplateSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNoteTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
