import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaServerStandardPriceComponent } from './ca-server-standard-price.component';

describe('CaServerInfoPriceComponent', () => {
  let component: CaServerStandardPriceComponent;
  let fixture: ComponentFixture<CaServerStandardPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerStandardPriceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaServerStandardPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
