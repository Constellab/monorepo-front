import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiViewConfigTableComponent } from './li-view-config-table.component';

describe('LiViewConfigTableComponent', () => {
  let component: LiViewConfigTableComponent;
  let fixture: ComponentFixture<LiViewConfigTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiViewConfigTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiViewConfigTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
