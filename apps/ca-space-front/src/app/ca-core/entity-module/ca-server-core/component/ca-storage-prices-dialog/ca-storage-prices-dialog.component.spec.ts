import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaStoragePricesDialogComponent } from './ca-storage-prices-dialog.component';

describe('CaStoragePricesDialogComponent', () => {
  let component: CaStoragePricesDialogComponent;
  let fixture: ComponentFixture<CaStoragePricesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaStoragePricesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaStoragePricesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
