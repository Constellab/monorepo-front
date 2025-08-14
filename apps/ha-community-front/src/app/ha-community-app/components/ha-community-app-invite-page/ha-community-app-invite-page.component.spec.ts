import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCommunityAppInvitePageComponent } from './ha-community-app-invite-page.component';

describe('HaStoryInvitePageComponent', () => {
  let component: HaCommunityAppInvitePageComponent;
  let fixture: ComponentFixture<HaCommunityAppInvitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaCommunityAppInvitePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCommunityAppInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
