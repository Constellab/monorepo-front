import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaActivitySearchFormComponent} from './ca-activity-search-form.component';

describe('CaActivitySearchFormComponent', () => {
  let component: CaActivitySearchFormComponent;
  let fixture: ComponentFixture<CaActivitySearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaActivitySearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaActivitySearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
