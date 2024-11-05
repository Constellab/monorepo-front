import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAdminServerStandardListComponent } from './ca-admin-server-standard-list.component';

describe('CaAdminServerStandardListComponent', () => {
  let component: CaAdminServerStandardListComponent;
  let fixture: ComponentFixture<CaAdminServerStandardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminServerStandardListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminServerStandardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
