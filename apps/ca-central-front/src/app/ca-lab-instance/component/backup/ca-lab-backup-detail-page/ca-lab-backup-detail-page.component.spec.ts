import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabBackupDetailPageComponent} from './ca-lab-backup-detail-page.component';

describe('CaLabBackupDetailPageComponent', () => {
  let component: CaLabBackupDetailPageComponent;
  let fixture: ComponentFixture<CaLabBackupDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
