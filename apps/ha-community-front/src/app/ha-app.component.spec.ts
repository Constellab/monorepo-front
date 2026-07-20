import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HaAppComponent } from './ha-app.component';

describe('HaAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HaAppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
