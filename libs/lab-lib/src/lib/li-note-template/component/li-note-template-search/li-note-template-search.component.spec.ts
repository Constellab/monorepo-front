import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNoteTemplateSearchComponent } from './li-note-template-search.component';

describe('LiNoteTemplateSearchComponent', () => {
  let component: LiNoteTemplateSearchComponent;
  let fixture: ComponentFixture<LiNoteTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteTemplateSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNoteTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
