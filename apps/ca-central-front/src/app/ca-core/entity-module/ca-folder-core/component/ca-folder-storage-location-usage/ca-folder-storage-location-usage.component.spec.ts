import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderStorageLocationUsageComponent} from './ca-folder-storage-location-usage.component';

describe('CaFolderStorageUsageDetailComponent', () => {
  let component: CaFolderStorageLocationUsageComponent;
  let fixture: ComponentFixture<CaFolderStorageLocationUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderStorageLocationUsageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderStorageLocationUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
