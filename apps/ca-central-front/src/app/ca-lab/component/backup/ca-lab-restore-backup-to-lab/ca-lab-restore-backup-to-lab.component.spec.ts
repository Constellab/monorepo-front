import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabRestoreBackupToLabComponent } from './ca-lab-restore-backup-to-lab.component';

describe('CaLabRestoreBackupToLabComponent', () => {
  let component: CaLabRestoreBackupToLabComponent;
  let fixture: ComponentFixture<CaLabRestoreBackupToLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabRestoreBackupToLabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabRestoreBackupToLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
