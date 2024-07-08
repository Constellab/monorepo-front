import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabRichTextDynamicFieldComponent } from './lab-rich-text-dynamic-field.component';

describe('LabRichTextDynamicFieldComponent', () => {
  let component: LabRichTextDynamicFieldComponent;
  let fixture: ComponentFixture<LabRichTextDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabRichTextDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabRichTextDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
