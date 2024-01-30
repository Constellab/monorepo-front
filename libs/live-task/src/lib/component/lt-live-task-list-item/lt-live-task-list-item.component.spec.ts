import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LtLiveTaskListItemComponent} from './lt-live-task-list-item.component';

describe('LtLiveTaskListItemComponent', () => {
  let component: LtLiveTaskListItemComponent;
  let fixture: ComponentFixture<LtLiveTaskListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LtLiveTaskListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LtLiveTaskListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
