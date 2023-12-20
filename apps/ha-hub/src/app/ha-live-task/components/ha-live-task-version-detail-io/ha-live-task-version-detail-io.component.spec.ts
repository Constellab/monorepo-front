import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaLiveTaskVersionDetailIoComponent } from './ha-live-task-version-detail-io.component';

describe('HaLiveTaskVersionDetailIoComponent', () => {
  let component: HaLiveTaskVersionDetailIoComponent;
  let fixture: ComponentFixture<HaLiveTaskVersionDetailIoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaLiveTaskVersionDetailIoComponent]
    });
    fixture = TestBed.createComponent(HaLiveTaskVersionDetailIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
