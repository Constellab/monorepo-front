import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlPoweredByConstellabComponent } from './fl-powered-by-constellab.component';

describe('FlPoweredByConstellabComponent', () => {
  let component: FlPoweredByConstellabComponent;
  let fixture: ComponentFixture<FlPoweredByConstellabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlPoweredByConstellabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlPoweredByConstellabComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
