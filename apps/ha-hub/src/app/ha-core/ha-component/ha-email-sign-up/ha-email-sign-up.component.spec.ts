import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaEmailSignUpComponent } from './ha-email-sign-up.component';

describe('HaEmailSignUpComponent', () => {
  let component: HaEmailSignUpComponent;
  let fixture: ComponentFixture<HaEmailSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaEmailSignUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaEmailSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
