import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiValidateObjectDialogComponent } from './li-validate-object-dialog.component';

describe('LabValidateObjectComponent', () => {
  let component: LiValidateObjectDialogComponent;
  let fixture: ComponentFixture<LiValidateObjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiValidateObjectDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiValidateObjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
