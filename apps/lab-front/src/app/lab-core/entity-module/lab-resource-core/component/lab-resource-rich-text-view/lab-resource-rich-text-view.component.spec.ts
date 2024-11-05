import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabResourceRichTextViewComponent } from './lab-resource-rich-text-view.component';

describe('LabResourceRichTextViewComponent', () => {
  let component: LabResourceRichTextViewComponent;
  let fixture: ComponentFixture<LabResourceRichTextViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceRichTextViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceRichTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
