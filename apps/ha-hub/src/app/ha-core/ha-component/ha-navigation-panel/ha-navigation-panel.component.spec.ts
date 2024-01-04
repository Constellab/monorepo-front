import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaNavigationPanelComponent } from './ha-navigation-panel.component';

describe('HaNavigationPanelComponent', () => {
  let component: HaNavigationPanelComponent;
  let fixture: ComponentFixture<HaNavigationPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HaNavigationPanelComponent]
    });
    fixture = TestBed.createComponent(HaNavigationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
