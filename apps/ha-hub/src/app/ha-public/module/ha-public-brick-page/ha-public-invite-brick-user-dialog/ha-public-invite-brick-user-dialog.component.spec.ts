import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaPublicInviteBrickUserDialogComponent } from './ha-public-invite-brick-user-dialog.component';

describe('HaPublicInviteBrickUserDialogComponent', () => {
  let component: HaPublicInviteBrickUserDialogComponent;
  let fixture: ComponentFixture<HaPublicInviteBrickUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HaPublicInviteBrickUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaPublicInviteBrickUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
