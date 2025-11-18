import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminPanelPartnersSearchFormComponent } from './ha-admin-panel-partners-search-form.component';

describe('HaAdminPanelPartnersSearchFormComponent', () => {
  let component: HaAdminPanelPartnersSearchFormComponent;
  let fixture: ComponentFixture<HaAdminPanelPartnersSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAdminPanelPartnersSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAdminPanelPartnersSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
