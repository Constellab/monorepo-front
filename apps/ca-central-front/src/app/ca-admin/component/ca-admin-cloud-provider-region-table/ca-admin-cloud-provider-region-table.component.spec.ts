import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAdminCloudProviderRegionTableComponent } from './ca-admin-cloud-provider-region-table.component';

describe('CaCloudProviderRegionTableComponent', () => {
  let component: CaAdminCloudProviderRegionTableComponent;
  let fixture: ComponentFixture<CaAdminCloudProviderRegionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminCloudProviderRegionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminCloudProviderRegionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
