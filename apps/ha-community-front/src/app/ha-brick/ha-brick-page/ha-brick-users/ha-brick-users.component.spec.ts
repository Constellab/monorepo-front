import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaBrickUsersComponent } from './ha-brick-users.component';

describe('HaBrickUsersComponent', () => {
  let component: HaBrickUsersComponent;
  let fixture: ComponentFixture<HaBrickUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaBrickUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaBrickUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
