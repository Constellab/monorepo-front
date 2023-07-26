import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabResourceDetailMinimizedViewsComponent} from './lab-resource-detail-minimized-views.component';

describe('LabResourceDetailMinimzedViewsComponent', () => {
  let component: LabResourceDetailMinimizedViewsComponent;
  let fixture: ComponentFixture<LabResourceDetailMinimizedViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceDetailMinimizedViewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceDetailMinimizedViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
