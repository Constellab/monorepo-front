import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabUsersTableComponent} from './ca-lab-users-table.component';

describe('LabUsersTableComponent', () => {
  let component: CaLabUsersTableComponent;
  let fixture: ComponentFixture<CaLabUsersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabUsersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabUsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
