import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAdminMailsPageComponent } from './ca-admin-mails-page.component';

describe('CaAdminMailsPageComponent', () => {
  let component: CaAdminMailsPageComponent;
  let fixture: ComponentFixture<CaAdminMailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminMailsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminMailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
