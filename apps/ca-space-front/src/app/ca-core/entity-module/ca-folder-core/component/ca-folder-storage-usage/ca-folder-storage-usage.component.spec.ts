import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderStorageUsageComponent } from './ca-folder-storage-usage.component';

describe('CaFolderStorageSizeComponent', () => {
  let component: CaFolderStorageUsageComponent;
  let fixture: ComponentFixture<CaFolderStorageUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderStorageUsageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderStorageUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
