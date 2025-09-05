import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickUserInvitePageComponent } from './ha-brick-user-invite-page.component';

describe('HaBrickUserInvitePageComponent', () => {
  let component: HaBrickUserInvitePageComponent;
  let fixture: ComponentFixture<HaBrickUserInvitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickUserInvitePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaBrickUserInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
