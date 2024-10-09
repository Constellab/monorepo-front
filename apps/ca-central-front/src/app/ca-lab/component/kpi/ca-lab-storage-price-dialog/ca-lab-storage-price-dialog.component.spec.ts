import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabStoragePriceDialogComponent } from './ca-lab-storage-price-dialog.component';

describe('CaLabStoragePriceDetailComponent', () => {
  let component: CaLabStoragePriceDialogComponent;
  let fixture: ComponentFixture<CaLabStoragePriceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabStoragePriceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabStoragePriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
