import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabBackupHistoryTableComponent } from './ca-lab-backup-history-table.component';

describe('CaLabBackupHistoryTableComponent', () => {
  let component: CaLabBackupHistoryTableComponent;
  let fixture: ComponentFixture<CaLabBackupHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupHistoryTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
