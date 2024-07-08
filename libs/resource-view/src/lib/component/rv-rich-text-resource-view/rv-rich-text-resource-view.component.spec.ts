import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvRichTextResourceViewComponent } from './rv-rich-text-resource-view.component';

describe('RvReportResourceViewComponent', () => {
  let component: RvRichTextResourceViewComponent;
  let fixture: ComponentFixture<RvRichTextResourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RvRichTextResourceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RvRichTextResourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
