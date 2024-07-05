import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoUserProfilePictureComponent } from './co-user-profile-picture.component';

describe('UserProfilePictureComponent', () => {
  let component: CoUserProfilePictureComponent;
  let fixture: ComponentFixture<CoUserProfilePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoUserProfilePictureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoUserProfilePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
