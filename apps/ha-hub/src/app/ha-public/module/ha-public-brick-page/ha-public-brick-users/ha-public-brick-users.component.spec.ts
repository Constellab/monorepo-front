import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaPublicBrickUsersComponent } from './ha-public-brick-users.component';

describe('HaPublicBrickUsersComponent', () => {
  let component: HaPublicBrickUsersComponent;
  let fixture: ComponentFixture<HaPublicBrickUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaPublicBrickUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaPublicBrickUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
