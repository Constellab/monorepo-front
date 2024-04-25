import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerPriceFormDialogComponent} from './ca-server-price-form-dialog.component';

describe('CaServerPriceFormDialogComponent', () => {
  let component: CaServerPriceFormDialogComponent;
  let fixture: ComponentFixture<CaServerPriceFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerPriceFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaServerPriceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
