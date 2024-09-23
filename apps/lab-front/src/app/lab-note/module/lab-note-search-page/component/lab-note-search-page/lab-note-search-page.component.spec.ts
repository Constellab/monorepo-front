import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteSearchPageComponent } from './lab-note-search-page.component';

describe('LabNoteSearchPageComponent', () => {
  let component: LabNoteSearchPageComponent;
  let fixture: ComponentFixture<LabNoteSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteSearchPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
