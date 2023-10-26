import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaAdminCloudProviderRegionFormDialogComponent} from './ca-admin-cloud-provider-region-form-dialog.component';

describe('CaCloudProviderRegionFormDialogComponent', () => {
  let component: CaAdminCloudProviderRegionFormDialogComponent;
  let fixture: ComponentFixture<CaAdminCloudProviderRegionFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaAdminCloudProviderRegionFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaAdminCloudProviderRegionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
