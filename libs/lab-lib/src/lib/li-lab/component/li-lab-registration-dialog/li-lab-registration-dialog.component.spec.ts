import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiLabRegistrationDialogComponent } from './li-lab-registration-dialog.component';

describe('LiLabRegistrationDialogComponent', () => {
  let component: LiLabRegistrationDialogComponent;
  let fixture: ComponentFixture<LiLabRegistrationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiLabRegistrationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiLabRegistrationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
