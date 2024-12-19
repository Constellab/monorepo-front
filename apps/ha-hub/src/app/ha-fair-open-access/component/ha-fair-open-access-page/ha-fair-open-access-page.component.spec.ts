import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaFairOpenAccessPageComponent } from './ha-fair-open-access-page.component';

describe('HaFairOpenAccessPageComponent', () => {
  let component: HaFairOpenAccessPageComponent;
  let fixture: ComponentFixture<HaFairOpenAccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaFairOpenAccessPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaFairOpenAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
