import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaAdminOtherComponent } from './ca-admin-other.component';

describe('CaAdminOtherComponent', () => {
  let component: CaAdminOtherComponent;
  let fixture: ComponentFixture<CaAdminOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaAdminOtherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
