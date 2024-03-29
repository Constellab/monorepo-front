import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaServerPricesDialogComponent} from './ca-server-prices-dialog.component';

describe('CaServerPricesDialogComponent', () => {
  let component: CaServerPricesDialogComponent;
  let fixture: ComponentFixture<CaServerPricesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerPricesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaServerPricesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
