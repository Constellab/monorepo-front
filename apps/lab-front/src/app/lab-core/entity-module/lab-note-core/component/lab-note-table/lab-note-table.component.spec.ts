import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNoteTableComponent } from './lab-note-table.component';

describe('LabNoteTableComponent', () => {
  let component: LabNoteTableComponent;
  let fixture: ComponentFixture<LabNoteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabNoteTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabNoteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
