import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabBackupsStatusesComponent } from './ca-lab-backups-statuses.component';

describe('CaLabBackupOptionsComponent', () => {
  let component: CaLabBackupsStatusesComponent;
  let fixture: ComponentFixture<CaLabBackupsStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupsStatusesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupsStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
