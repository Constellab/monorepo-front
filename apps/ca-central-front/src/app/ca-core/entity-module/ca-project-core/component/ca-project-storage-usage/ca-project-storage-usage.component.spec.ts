import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaProjectStorageUsageComponent} from './ca-project-storage-usage.component';

describe('CaProjectStorageSizeComponent', () => {
  let component: CaProjectStorageUsageComponent;
  let fixture: ComponentFixture<CaProjectStorageUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaProjectStorageUsageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaProjectStorageUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
