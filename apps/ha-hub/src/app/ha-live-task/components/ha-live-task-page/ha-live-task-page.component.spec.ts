import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaLiveTaskPageComponent } from './ha-live-task-page.component';

describe('HaLiveTaskPageComponent', () => {
  let component: HaLiveTaskPageComponent;
  let fixture: ComponentFixture<HaLiveTaskPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaLiveTaskPageComponent]
    });
    fixture = TestBed.createComponent(HaLiveTaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
