import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiViewConfigFavoriteComponent } from './li-view-config-favorite.component';

describe('LiViewConfigFavoriteComponent', () => {
  let component: LiViewConfigFavoriteComponent;
  let fixture: ComponentFixture<LiViewConfigFavoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiViewConfigFavoriteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiViewConfigFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
