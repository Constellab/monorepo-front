import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaCloudProviderRegionMultilinesComponent } from './ca-cloud-provider-region-multilines.component';

describe('CaCloudProviderRegionMultilinesComponent', () => {
  let component: CaCloudProviderRegionMultilinesComponent;
  let fixture: ComponentFixture<CaCloudProviderRegionMultilinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCloudProviderRegionMultilinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaCloudProviderRegionMultilinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
