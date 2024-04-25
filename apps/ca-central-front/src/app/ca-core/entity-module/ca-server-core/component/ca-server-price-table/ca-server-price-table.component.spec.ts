import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerPriceTableComponent} from './ca-server-price-table.component';

describe('CaServerPriceTableComponent', () => {
  let component: CaServerPriceTableComponent;
  let fixture: ComponentFixture<CaServerPriceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerPriceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaServerPriceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
