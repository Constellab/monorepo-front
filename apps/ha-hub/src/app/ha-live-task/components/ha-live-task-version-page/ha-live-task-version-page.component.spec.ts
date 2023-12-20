import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaLiveTaskVersionPageComponent } from './ha-live-task-version-page.component';

describe('HaLiveTaskVersionPageComponent', () => {
  let component: HaLiveTaskVersionPageComponent;
  let fixture: ComponentFixture<HaLiveTaskVersionPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaLiveTaskVersionPageComponent]
    });
    fixture = TestBed.createComponent(HaLiveTaskVersionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
