import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaCurrentSpaceInvitDialogComponent } from './ca-current-space-invit-dialog.component';

describe('CaSpaceInvitListComponent', () => {
  let component: CaCurrentSpaceInvitDialogComponent;
  let fixture: ComponentFixture<CaCurrentSpaceInvitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceInvitDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceInvitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
