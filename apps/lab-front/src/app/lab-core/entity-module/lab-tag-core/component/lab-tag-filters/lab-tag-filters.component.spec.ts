import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabTagFiltersComponent} from './lab-tag-filters.component';

describe('LabTagFiltersComponent', () => {
  let component: LabTagFiltersComponent;
  let fixture: ComponentFixture<LabTagFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTagFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabTagFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
