import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabBackupHistoryComponent} from './ca-lab-backup-history.component';

describe('CaLabBackupHistoryComponent', () => {
  let component: CaLabBackupHistoryComponent;
  let fixture: ComponentFixture<CaLabBackupHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
