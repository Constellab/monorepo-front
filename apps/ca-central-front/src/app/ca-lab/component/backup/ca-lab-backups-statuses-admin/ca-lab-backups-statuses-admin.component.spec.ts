import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabBackupsStatusesAdminComponent } from './ca-lab-backups-statuses-admin.component';

describe('CaLabBackupsStatusesAdminComponent', () => {
  let component: CaLabBackupsStatusesAdminComponent;
  let fixture: ComponentFixture<CaLabBackupsStatusesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabBackupsStatusesAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabBackupsStatusesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
