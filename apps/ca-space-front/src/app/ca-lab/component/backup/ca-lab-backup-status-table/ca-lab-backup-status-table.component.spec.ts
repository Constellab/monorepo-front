import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabBackupStatusTableComponent } from './ca-lab-backup-status-table.component';

describe('CaLabBackupStatusTableComponent', () => {
  let component: CaLabBackupStatusTableComponent;
  let fixture: ComponentFixture<CaLabBackupStatusTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupStatusTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
