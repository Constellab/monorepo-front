import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabPriceSimulatorComponent } from './ca-lab-price-simulator.component';

describe('CaPriceSimulatorComponent', () => {
  let component: CaLabPriceSimulatorComponent;
  let fixture: ComponentFixture<CaLabPriceSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaLabPriceSimulatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabPriceSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
