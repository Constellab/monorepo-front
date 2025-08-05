import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiResourceRichTextViewComponent } from './li-resource-rich-text-view.component';

describe('LiResourceRichTextViewComponent', () => {
  let component: LiResourceRichTextViewComponent;
  let fixture: ComponentFixture<LiResourceRichTextViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceRichTextViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceRichTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
