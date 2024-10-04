import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderStorageSettingsComponent} from './ca-folder-storage-settings.component';

describe('CaFolderStorageSettingsComponent', () => {
  let component: CaFolderStorageSettingsComponent;
  let fixture: ComponentFixture<CaFolderStorageSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderStorageSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderStorageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
