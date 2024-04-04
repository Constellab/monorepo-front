import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabPipPackagesDialogComponent} from './lab-pip-packages-dialog.component';

describe('LabPipPackagesDialogComponent', () => {
  let component: LabPipPackagesDialogComponent;
  let fixture: ComponentFixture<LabPipPackagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabPipPackagesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPipPackagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
