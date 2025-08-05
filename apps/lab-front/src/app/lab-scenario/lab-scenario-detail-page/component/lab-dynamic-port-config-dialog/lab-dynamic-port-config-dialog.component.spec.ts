import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabDynamicPortConfigDialogComponent } from './lab-dynamic-port-config-dialog.component';

describe('LabDynamicPortConfigDialogComponent', () => {
  let component: LabDynamicPortConfigDialogComponent;
  let fixture: ComponentFixture<LabDynamicPortConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabDynamicPortConfigDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabDynamicPortConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
