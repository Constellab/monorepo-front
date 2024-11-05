import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaActivitySearchComponent } from './ca-activity-search.component';

describe('CaActivitySearchComponent', () => {
  let component: CaActivitySearchComponent;
  let fixture: ComponentFixture<CaActivitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaActivitySearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaActivitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
