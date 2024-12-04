import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabQuickConfigureProcessDialogComponent } from './lab-quick-configure-process-dialog.component';

describe('LabQuickConfigureProcessDialogComponent', () => {
  let component: LabQuickConfigureProcessDialogComponent;
  let fixture: ComponentFixture<LabQuickConfigureProcessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabQuickConfigureProcessDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabQuickConfigureProcessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
