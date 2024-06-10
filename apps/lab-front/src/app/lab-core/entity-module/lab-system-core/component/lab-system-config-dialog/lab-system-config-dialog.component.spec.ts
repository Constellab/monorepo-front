import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabSystemConfigDialogComponent} from './lab-system-config-dialog.component';

describe('LabPipPackagesDialogComponent', () => {
  let component: LabSystemConfigDialogComponent;
  let fixture: ComponentFixture<LabSystemConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSystemConfigDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabSystemConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
