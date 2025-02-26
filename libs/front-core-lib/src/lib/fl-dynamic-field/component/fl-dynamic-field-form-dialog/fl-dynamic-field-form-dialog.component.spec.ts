import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlDynamicFieldFormDialogComponent } from './fl-dynamic-field-form-dialog.component';

describe('FlDynamicFieldFormDialogComponent', () => {
  let component: FlDynamicFieldFormDialogComponent;
  let fixture: ComponentFixture<FlDynamicFieldFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlDynamicFieldFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlDynamicFieldFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
