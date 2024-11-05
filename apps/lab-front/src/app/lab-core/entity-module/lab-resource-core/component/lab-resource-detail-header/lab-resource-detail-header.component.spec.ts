import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabResourceDetailHeaderComponent } from './lab-resource-detail-header.component';

describe('LabResourceDetailHeaderComponent', () => {
  let component: LabResourceDetailHeaderComponent;
  let fixture: ComponentFixture<LabResourceDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceDetailHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
