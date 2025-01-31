import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlPasswordHiddenComponent } from './fl-password-hidden.component';

describe('FlPasswordHiddenComponent', () => {
  let component: FlPasswordHiddenComponent;
  let fixture: ComponentFixture<FlPasswordHiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlPasswordHiddenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlPasswordHiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
