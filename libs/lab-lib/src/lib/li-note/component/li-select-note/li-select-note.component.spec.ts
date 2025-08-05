import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectNoteComponent } from './li-select-note.component';

describe('LiSelectNoteComponent', () => {
  let component: LiSelectNoteComponent;
  let fixture: ComponentFixture<LiSelectNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
