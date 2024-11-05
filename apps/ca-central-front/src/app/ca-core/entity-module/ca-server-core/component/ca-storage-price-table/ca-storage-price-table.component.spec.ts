import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaStoragePriceTableComponent } from './ca-storage-price-table.component';

describe('CaStoragePriceTableComponent', () => {
  let component: CaStoragePriceTableComponent;
  let fixture: ComponentFixture<CaStoragePriceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaStoragePriceTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaStoragePriceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
