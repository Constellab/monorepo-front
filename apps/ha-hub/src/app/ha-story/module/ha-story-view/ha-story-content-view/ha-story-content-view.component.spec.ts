import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HaStoryContentViewComponent} from './ha-story-content-view.component';

describe('CaReportContentViewComponent', () => {
  let component: HaStoryContentViewComponent;
  let fixture: ComponentFixture<HaStoryContentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HaStoryContentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaStoryContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
