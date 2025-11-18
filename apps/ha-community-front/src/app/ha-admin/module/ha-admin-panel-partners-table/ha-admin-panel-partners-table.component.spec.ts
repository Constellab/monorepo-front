import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminPanelPartnersTableComponent } from './ha-admin-panel-partners-table.component';

describe('HaAdminPanelPartnersTableComponent', () => {
  let component: HaAdminPanelPartnersTableComponent;
  let fixture: ComponentFixture<HaAdminPanelPartnersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAdminPanelPartnersTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAdminPanelPartnersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
