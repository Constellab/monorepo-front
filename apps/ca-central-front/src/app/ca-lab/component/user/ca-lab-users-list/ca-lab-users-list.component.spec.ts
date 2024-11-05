import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabUsersListComponent } from './ca-lab-users-list.component';

describe('LabUsersListComponent', () => {
  let component: CaLabUsersListComponent;
  let fixture: ComponentFixture<CaLabUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabUsersListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
