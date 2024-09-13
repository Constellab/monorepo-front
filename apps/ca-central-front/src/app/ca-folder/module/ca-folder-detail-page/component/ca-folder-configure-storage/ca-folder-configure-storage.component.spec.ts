import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderConfigureStorageComponent} from './ca-folder-configure-storage.component';

describe('CaFolderConfigureStorageComponent', () => {
  let component: CaFolderConfigureStorageComponent;
  let fixture: ComponentFixture<CaFolderConfigureStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderConfigureStorageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderConfigureStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
