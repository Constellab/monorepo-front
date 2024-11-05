import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabResourceViewSpecCardComponent } from './lab-resource-view-spec-card.component';

describe('LabResourceViewSpecCardComponent', () => {
  let component: LabResourceViewSpecCardComponent;
  let fixture: ComponentFixture<LabResourceViewSpecCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceViewSpecCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceViewSpecCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
