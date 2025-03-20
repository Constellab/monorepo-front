import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminPanelBricksSearchFormComponent } from './ha-admin-panel-bricks-search-form.component';

describe('HaAdminPanelBricksSearchFormComponent', () => {
  let component: HaAdminPanelBricksSearchFormComponent;
  let fixture: ComponentFixture<HaAdminPanelBricksSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAdminPanelBricksSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAdminPanelBricksSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
