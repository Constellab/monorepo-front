import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaLabBackupOptionsComponent} from './ca-lab-backup-options.component';

describe('CaLabBackupOptionsComponent', () => {
  let component: CaLabBackupOptionsComponent;
  let fixture: ComponentFixture<CaLabBackupOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
