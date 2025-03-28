import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNoteTableComponent } from './li-note-table.component';

describe('LiNoteTableComponent', () => {
  let component: LiNoteTableComponent;
  let fixture: ComponentFixture<LiNoteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiNoteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
