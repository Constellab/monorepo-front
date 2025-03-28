import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNoteSearchComponent } from './li-note-search.component';

describe('LiNoteSearchComponent', () => {
  let component: LiNoteSearchComponent;
  let fixture: ComponentFixture<LiNoteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiNoteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
