import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTransformResourcePortalComponent } from './li-transform-resource-portal.component';

describe('LiTransformResourceDialogComponent', () => {
  let component: LiTransformResourcePortalComponent;
  let fixture: ComponentFixture<LiTransformResourcePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTransformResourcePortalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTransformResourcePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
