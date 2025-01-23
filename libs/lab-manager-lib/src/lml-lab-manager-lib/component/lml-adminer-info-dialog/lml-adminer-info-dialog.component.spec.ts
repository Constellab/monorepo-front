import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlAdminerInfoDialogComponent } from './lml-adminer-info-dialog.component';

describe('LmlAdminerInfoDialogComponent', () => {
  let component: LmlAdminerInfoDialogComponent;
  let fixture: ComponentFixture<LmlAdminerInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlAdminerInfoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmlAdminerInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
