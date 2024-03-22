import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoLiveTaskListItemComponent} from './co-live-task-list-item.component';

describe('CoLiveTaskListItemComponent', () => {
  let component: CoLiveTaskListItemComponent;
  let fixture: ComponentFixture<CoLiveTaskListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoLiveTaskListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoLiveTaskListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
