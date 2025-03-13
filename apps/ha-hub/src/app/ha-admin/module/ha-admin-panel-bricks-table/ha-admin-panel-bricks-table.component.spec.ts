import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminPanelBricksTableComponent } from './ha-admin-panel-bricks-table.component';

describe('HaAdminPanelBricksTableComponent', () => {
  let component: HaAdminPanelBricksTableComponent;
  let fixture: ComponentFixture<HaAdminPanelBricksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAdminPanelBricksTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAdminPanelBricksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
