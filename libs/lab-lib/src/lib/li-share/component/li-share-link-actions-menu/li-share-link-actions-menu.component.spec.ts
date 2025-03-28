import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiShareLinkActionsMenuComponent } from './li-share-link-actions-menu.component';

describe('LiShareLinkActionsMenuComponent', () => {
  let component: LiShareLinkActionsMenuComponent;
  let fixture: ComponentFixture<LiShareLinkActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiShareLinkActionsMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiShareLinkActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
