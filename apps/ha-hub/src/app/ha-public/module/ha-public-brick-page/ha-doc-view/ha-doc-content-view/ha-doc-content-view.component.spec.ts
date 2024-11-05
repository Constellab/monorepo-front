import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaDocContentViewComponent } from './ha-doc-content-view.component';

describe('CaReportContentViewComponent', () => {
  let component: HaDocContentViewComponent;
  let fixture: ComponentFixture<HaDocContentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaDocContentViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaDocContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
