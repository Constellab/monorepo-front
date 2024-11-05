import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabProcessEditStyleDialogComponent } from './lab-process-edit-style-dialog.component';

describe('LabProcessEditStyleDialogComponent', () => {
  let component: LabProcessEditStyleDialogComponent;
  let fixture: ComponentFixture<LabProcessEditStyleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProcessEditStyleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabProcessEditStyleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
