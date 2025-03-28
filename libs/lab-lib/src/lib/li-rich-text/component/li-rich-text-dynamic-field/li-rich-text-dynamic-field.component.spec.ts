import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiRichTextDynamicFieldComponent } from './li-rich-text-dynamic-field.component';

describe('LiRichTextDynamicFieldComponent', () => {
  let component: LiRichTextDynamicFieldComponent;
  let fixture: ComponentFixture<LiRichTextDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiRichTextDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiRichTextDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
