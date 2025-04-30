import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAdminStoragePriceComponent } from './ca-admin-storage-price.component';

describe('CaAdminStoragePriceComponent', () => {
  let component: CaAdminStoragePriceComponent;
  let fixture: ComponentFixture<CaAdminStoragePriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminStoragePriceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminStoragePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
