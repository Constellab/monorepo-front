import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderStorageUsageSectionComponent } from './ca-folder-storage-usage-section.component';

describe('CaFolderStorageUsageSectionComponent', () => {
  let component: CaFolderStorageUsageSectionComponent;
  let fixture: ComponentFixture<CaFolderStorageUsageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderStorageUsageSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderStorageUsageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
