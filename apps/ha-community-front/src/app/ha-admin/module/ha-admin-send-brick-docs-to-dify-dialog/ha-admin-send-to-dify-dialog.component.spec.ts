import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAdminSendToDifyDialogComponent } from './ha-admin-send-to-dify-dialog.component';

describe('HaAdminSendBrickDocsToDifyDialogComponent', () => {
  let component: HaAdminSendToDifyDialogComponent;
  let fixture: ComponentFixture<HaAdminSendToDifyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaAdminSendToDifyDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAdminSendToDifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
