import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabResourceInfoDialogComponent } from './lab-resource-info-dialog.component';

describe('LabResourceInfoDialogComponent', () => {
  let component: LabResourceInfoDialogComponent;
  let fixture: ComponentFixture<LabResourceInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabResourceInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResourceInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
