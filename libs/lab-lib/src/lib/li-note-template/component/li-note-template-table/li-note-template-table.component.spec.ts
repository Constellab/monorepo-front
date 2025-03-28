import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNoteTemplateTableComponent } from './li-note-template-table.component';

describe('LiNoteTemplateTableComponent', () => {
  let component: LiNoteTemplateTableComponent;
  let fixture: ComponentFixture<LiNoteTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNoteTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
