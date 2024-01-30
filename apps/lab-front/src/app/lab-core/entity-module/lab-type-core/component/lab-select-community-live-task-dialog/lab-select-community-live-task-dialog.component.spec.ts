import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabSelectCommunityLiveTaskDialogComponent} from './lab-select-community-live-task-dialog.component';

describe('LabSelectProcessTypeDialogComponent', () => {
  let component: LabSelectCommunityLiveTaskDialogComponent;
  let fixture: ComponentFixture<LabSelectCommunityLiveTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabSelectCommunityLiveTaskDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSelectCommunityLiveTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
