import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabSelectCommunityLiveTaskComponent} from './lab-select-community-live-task.component';

describe('LabSelectProcessTypeDialogComponent', () => {
  let component: LabSelectCommunityLiveTaskComponent;
  let fixture: ComponentFixture<LabSelectCommunityLiveTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabSelectCommunityLiveTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSelectCommunityLiveTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
