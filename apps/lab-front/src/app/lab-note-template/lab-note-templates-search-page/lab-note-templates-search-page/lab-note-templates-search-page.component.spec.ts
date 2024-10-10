import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteTemplatesSearchPageComponent } from './lab-note-templates-search-page.component';

describe('LabNoteTemplatesPageComponent', () => {
  let component: LabNoteTemplatesSearchPageComponent;
  let fixture: ComponentFixture<LabNoteTemplatesSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabNoteTemplatesSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabNoteTemplatesSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
