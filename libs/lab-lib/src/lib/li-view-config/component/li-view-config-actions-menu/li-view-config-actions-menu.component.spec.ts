import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiViewConfigActionsMenuComponent } from './li-view-config-actions-menu.component';

describe('LiViewConfigActionsMenuComponent', () => {
  let component: LiViewConfigActionsMenuComponent;
  let fixture: ComponentFixture<LiViewConfigActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiViewConfigActionsMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiViewConfigActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
