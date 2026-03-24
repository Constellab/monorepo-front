import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectCredentialsDialogComponent } from './li-select-credentials-dialog.component';

describe('LiSelectCredentialsDialogComponent', () => {
  let component: LiSelectCredentialsDialogComponent;
  let fixture: ComponentFixture<LiSelectCredentialsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSelectCredentialsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectCredentialsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
