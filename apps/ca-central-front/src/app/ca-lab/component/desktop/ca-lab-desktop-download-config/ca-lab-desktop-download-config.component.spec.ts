import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDesktopDownloadConfigComponent } from './ca-lab-desktop-download-config.component';

describe('CaLabDesktopDownloadConfigComponent', () => {
  let component: CaLabDesktopDownloadConfigComponent;
  let fixture: ComponentFixture<CaLabDesktopDownloadConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabDesktopDownloadConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabDesktopDownloadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
