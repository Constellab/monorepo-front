import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaProjectStorageLocationUsageComponent} from './ca-project-storage-location-usage.component';

describe('CaProjectStorageUsageDetailComponent', () => {
  let component: CaProjectStorageLocationUsageComponent;
  let fixture: ComponentFixture<CaProjectStorageLocationUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaProjectStorageLocationUsageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaProjectStorageLocationUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
