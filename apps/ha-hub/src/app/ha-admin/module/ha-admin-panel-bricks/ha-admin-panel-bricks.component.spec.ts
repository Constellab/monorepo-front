import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminPanelBricksComponent } from './ha-admin-panel-bricks.component';

describe('HaAdminPanelBricksComponent', () => {
  let component: HaAdminPanelBricksComponent;
  let fixture: ComponentFixture<HaAdminPanelBricksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAdminPanelBricksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAdminPanelBricksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
