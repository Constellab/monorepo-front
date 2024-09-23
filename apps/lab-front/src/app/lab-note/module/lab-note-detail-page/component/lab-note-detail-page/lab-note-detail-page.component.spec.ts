import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteDetailPageComponent } from './lab-note-detail-page.component';

describe('LabNoteDetailPageComponent', () => {
  let component: LabNoteDetailPageComponent;
  let fixture: ComponentFixture<LabNoteDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
