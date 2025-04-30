import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaPublicBrickUserInvitePageComponent } from './ha-public-brick-user-invite-page.component';

describe('HaPublicBrickUserInvitePageComponent', () => {
  let component: HaPublicBrickUserInvitePageComponent;
  let fixture: ComponentFixture<HaPublicBrickUserInvitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaPublicBrickUserInvitePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaPublicBrickUserInvitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
