import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectNoteTemplateDynamicFieldComponent } from './li-select-note-template-dynamic-field.component';

describe('LiSelectNoteTemplateDynamicFieldComponent', () => {
  let component: LiSelectNoteTemplateDynamicFieldComponent;
  let fixture: ComponentFixture<LiSelectNoteTemplateDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectNoteTemplateDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectNoteTemplateDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
