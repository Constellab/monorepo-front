import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaStoragePriceFormDialogComponent} from './ca-storage-price-form-dialog.component';

describe('CaStoragePriceFormDialogComponent', () => {
  let component: CaStoragePriceFormDialogComponent;
  let fixture: ComponentFixture<CaStoragePriceFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaStoragePriceFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaStoragePriceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
