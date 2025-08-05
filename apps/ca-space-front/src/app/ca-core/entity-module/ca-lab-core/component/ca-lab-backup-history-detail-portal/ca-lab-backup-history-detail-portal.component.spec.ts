import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabBackupHistoryDetailPortalComponent } from './ca-lab-backup-history-detail-portal.component';

describe('CaLabBackupHistoryDetailPortalComponent', () => {
  let component: CaLabBackupHistoryDetailPortalComponent;
  let fixture: ComponentFixture<CaLabBackupHistoryDetailPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupHistoryDetailPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupHistoryDetailPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
