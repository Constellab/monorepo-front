import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabResourceUpdateProjectDialogComponent} from './lab-resource-update-project-dialog.component';

describe('LabResourceUpdateProjectDialogComponent', () => {
  let component: LabResourceUpdateProjectDialogComponent;
  let fixture: ComponentFixture<LabResourceUpdateProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabResourceUpdateProjectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabResourceUpdateProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
