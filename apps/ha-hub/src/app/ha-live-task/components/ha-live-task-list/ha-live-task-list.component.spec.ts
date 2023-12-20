import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaLiveTaskListComponent } from './ha-live-task-list.component';

describe('HaLiveTaskListComponent', () => {
  let component: HaLiveTaskListComponent;
  let fixture: ComponentFixture<HaLiveTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HaLiveTaskListComponent]
    });
    fixture = TestBed.createComponent(HaLiveTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
