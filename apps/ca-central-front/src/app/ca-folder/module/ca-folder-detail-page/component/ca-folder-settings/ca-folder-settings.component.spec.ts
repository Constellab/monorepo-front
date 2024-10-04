import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderSettingsComponent} from './ca-folder-settings.component';

describe('CaFolderSettingsComponent', () => {
  let component: CaFolderSettingsComponent;
  let fixture: ComponentFixture<CaFolderSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
