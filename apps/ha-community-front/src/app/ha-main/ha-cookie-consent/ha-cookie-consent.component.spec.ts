import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCookieConsentComponent } from './ha-cookie-consent.component';

describe('HaCookieConsentComponent', () => {
  let component: HaCookieConsentComponent;
  let fixture: ComponentFixture<HaCookieConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaCookieConsentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCookieConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
