import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagFiltersComponent } from './li-tag-filters.component';

describe('LiTagFiltersComponent', () => {
  let component: LiTagFiltersComponent;
  let fixture: ComponentFixture<LiTagFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTagFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
