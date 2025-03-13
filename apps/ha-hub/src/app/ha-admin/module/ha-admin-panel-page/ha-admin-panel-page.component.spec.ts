import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminPanelPageComponent } from './ha-admin-panel-page.component';

describe('HaAdminPageComponent', () => {
  let component: HaAdminPanelPageComponent;
  let fixture: ComponentFixture<HaAdminPanelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAdminPanelPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaAdminPanelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
