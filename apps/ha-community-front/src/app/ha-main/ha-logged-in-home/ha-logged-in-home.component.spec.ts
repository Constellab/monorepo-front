import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaLoggedInHomeComponent } from './ha-logged-in-home.component';

describe('HaHomeComponent', () => {
  let component: HaLoggedInHomeComponent;
  let fixture: ComponentFixture<HaLoggedInHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaLoggedInHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaLoggedInHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
