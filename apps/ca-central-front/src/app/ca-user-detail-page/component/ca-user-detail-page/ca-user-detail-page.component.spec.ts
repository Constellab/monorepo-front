import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaUserDetailPageComponent} from './ca-user-detail-page.component';

describe('UserCompleteInfoPageComponent', () => {
  let component: CaUserDetailPageComponent;
  let fixture: ComponentFixture<CaUserDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaUserDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaUserDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
