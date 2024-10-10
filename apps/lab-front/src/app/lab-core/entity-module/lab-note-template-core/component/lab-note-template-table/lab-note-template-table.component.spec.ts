import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabNoteTemplateTableComponent } from './lab-note-template-table.component';

describe('LabNoteTemplateTableComponent', () => {
  let component: LabNoteTemplateTableComponent;
  let fixture: ComponentFixture<LabNoteTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNoteTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
