import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceOriginOptionsComponent } from './li-resource-origin-options.component';

describe('BioxResourceOriginOptionsComponent', () => {
  let component: LiResourceOriginOptionsComponent;
  let fixture: ComponentFixture<LiResourceOriginOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceOriginOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceOriginOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
