import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CaAppComponent } from './ca-app.component';

describe('CaAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaAppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CaAppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
