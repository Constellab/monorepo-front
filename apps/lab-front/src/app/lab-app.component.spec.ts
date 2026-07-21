import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LabAppComponent } from './lab-app.component';

describe('LabAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabAppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LabAppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
