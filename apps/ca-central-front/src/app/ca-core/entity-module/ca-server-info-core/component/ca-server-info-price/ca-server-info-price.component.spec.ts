import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerInfoPriceComponent} from './ca-server-info-price.component';

describe('CaServerInfoPriceComponent', () => {
  let component: CaServerInfoPriceComponent;
  let fixture: ComponentFixture<CaServerInfoPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerInfoPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaServerInfoPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
