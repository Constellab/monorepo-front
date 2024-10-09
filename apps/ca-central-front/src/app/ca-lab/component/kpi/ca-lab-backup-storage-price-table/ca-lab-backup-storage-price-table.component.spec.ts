import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabBackupStoragePriceTableComponent } from './ca-lab-backup-storage-price-table.component';

describe('LabBackupStoragePriceTableComponent', () => {
  let component: CaLabBackupStoragePriceTableComponent;
  let fixture: ComponentFixture<CaLabBackupStoragePriceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupStoragePriceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabBackupStoragePriceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
