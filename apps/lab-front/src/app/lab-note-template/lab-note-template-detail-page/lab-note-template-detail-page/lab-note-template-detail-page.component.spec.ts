import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteTemplateDetailPageComponent } from './lab-note-template-detail-page.component';

describe('LabNoteTemplateDetailPageComponent', () => {
  let component: LabNoteTemplateDetailPageComponent;
  let fixture: ComponentFixture<LabNoteTemplateDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteTemplateDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNoteTemplateDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
