import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNoteInlineComponent } from './li-note-inline.component';

describe('LiNoteInlineComponent', () => {
  let component: LiNoteInlineComponent;
  let fixture: ComponentFixture<LiNoteInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNoteInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
