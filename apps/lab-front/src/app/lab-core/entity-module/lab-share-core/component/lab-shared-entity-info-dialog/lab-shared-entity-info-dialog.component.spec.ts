import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabSharedEntityInfoDialogComponent } from './lab-shared-entity-info-dialog.component';

describe('LabSharedEntityInfoDialogComponent', () => {
  let component: LabSharedEntityInfoDialogComponent;
  let fixture: ComponentFixture<LabSharedEntityInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSharedEntityInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSharedEntityInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
