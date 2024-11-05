import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAdminLabsPageComponent } from './ca-admin-labs-page.component';

describe('CaAdminLabsPageComponent', () => {
  let component: CaAdminLabsPageComponent;
  let fixture: ComponentFixture<CaAdminLabsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminLabsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminLabsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
