import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaLiveTaskInvitePageComponent } from './ha-live-task-invite-page.component';

describe('HaStoryInvitePageComponent', () => {
  let component: HaLiveTaskInvitePageComponent;
  let fixture: ComponentFixture<HaLiveTaskInvitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HaLiveTaskInvitePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaLiveTaskInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
