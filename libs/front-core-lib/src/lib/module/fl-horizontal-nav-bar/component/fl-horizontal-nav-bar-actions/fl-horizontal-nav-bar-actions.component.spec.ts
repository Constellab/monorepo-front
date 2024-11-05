import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlHorizontalNavBarActionsComponent } from './fl-horizontal-nav-bar-actions.component';

describe('FlHorizontalNavBarActionsComponent', () => {
  let component: FlHorizontalNavBarActionsComponent;
  let fixture: ComponentFixture<FlHorizontalNavBarActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlHorizontalNavBarActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlHorizontalNavBarActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
