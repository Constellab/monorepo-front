import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAdminOthersPageComponent } from './ca-admin-others-page.component';

describe('CaAdminServersPageComponent', () => {
  let component: CaAdminOthersPageComponent;
  let fixture: ComponentFixture<CaAdminOthersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminOthersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminOthersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
