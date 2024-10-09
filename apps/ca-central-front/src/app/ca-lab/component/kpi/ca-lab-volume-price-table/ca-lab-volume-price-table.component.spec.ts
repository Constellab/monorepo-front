import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabVolumePriceTableComponent } from './ca-lab-volume-price-table.component';

describe('LabVolumePriceTableComponent', () => {
  let component: CaLabVolumePriceTableComponent;
  let fixture: ComponentFixture<CaLabVolumePriceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabVolumePriceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabVolumePriceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
