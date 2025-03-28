import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceTableComponent } from './li-resource-table.component';

describe('FileResourceTableComponent', () => {
  let component: LiResourceTableComponent;
  let fixture: ComponentFixture<LiResourceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
