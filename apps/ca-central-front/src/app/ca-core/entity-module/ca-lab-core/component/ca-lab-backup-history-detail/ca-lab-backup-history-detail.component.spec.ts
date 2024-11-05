import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabBackupHistoryDetailComponent } from './ca-lab-backup-history-detail.component';

describe('CaLabBackupHistoryDetailComponent', () => {
  let component: CaLabBackupHistoryDetailComponent;
  let fixture: ComponentFixture<CaLabBackupHistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupHistoryDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
