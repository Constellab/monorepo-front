import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaLiveTaskVersionDetailComponent } from './ha-live-task-version-detail.component';

describe('HaLiveTaskVersionDetailComponent', () => {
  let component: HaLiveTaskVersionDetailComponent;
  let fixture: ComponentFixture<HaLiveTaskVersionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaLiveTaskVersionDetailComponent]
    });
    fixture = TestBed.createComponent(HaLiveTaskVersionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
