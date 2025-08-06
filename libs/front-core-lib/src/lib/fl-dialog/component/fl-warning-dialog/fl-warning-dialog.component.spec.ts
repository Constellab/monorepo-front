import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlWarningDialogComponent } from './fl-warning-dialog.component';

describe('FlWarningDialogComponent', () => {
  let component: FlWarningDialogComponent;
  let fixture: ComponentFixture<FlWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlWarningDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
