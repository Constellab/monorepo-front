import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlCheckCredentialsDialogComponent } from './fl-check-credentials-dialog.component';

describe('FlLoginFormDialogComponent', () => {
  let component: FlCheckCredentialsDialogComponent;
  let fixture: ComponentFixture<FlCheckCredentialsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlCheckCredentialsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlCheckCredentialsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
