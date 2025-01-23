import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlLoginFooterComponent } from './fl-login-footer.component';

describe('FlLoginFooterComponent', () => {
  let component: FlLoginFooterComponent;
  let fixture: ComponentFixture<FlLoginFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlLoginFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlLoginFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
