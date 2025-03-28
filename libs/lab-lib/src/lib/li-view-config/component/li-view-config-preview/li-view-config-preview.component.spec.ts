import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiViewConfigPreviewComponent } from './li-view-config-preview.component';

describe('LiViewConfigPreviewComponent', () => {
  let component: LiViewConfigPreviewComponent;
  let fixture: ComponentFixture<LiViewConfigPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiViewConfigPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiViewConfigPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
