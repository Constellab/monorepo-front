import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceDetailMinimizedViewsComponent } from './li-resource-detail-minimized-views.component';

describe('LabResourceDetailMinimzedViewsComponent', () => {
  let component: LiResourceDetailMinimizedViewsComponent;
  let fixture: ComponentFixture<LiResourceDetailMinimizedViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceDetailMinimizedViewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceDetailMinimizedViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
