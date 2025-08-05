import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiNoteTemplateSearchFormComponent } from './li-note-template-search-form.component';

describe('LiNoteTemplateSearchFormComponent', () => {
  let component: LiNoteTemplateSearchFormComponent;
  let fixture: ComponentFixture<LiNoteTemplateSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNoteTemplateSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNoteTemplateSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
