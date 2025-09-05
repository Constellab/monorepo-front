import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaNotLoggedInHomeComponent } from './ha-not-logged-in-home.component';

describe('HaNotLoggedInHomeComponent', () => {
  let component: HaNotLoggedInHomeComponent;
  let fixture: ComponentFixture<HaNotLoggedInHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaNotLoggedInHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaNotLoggedInHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
