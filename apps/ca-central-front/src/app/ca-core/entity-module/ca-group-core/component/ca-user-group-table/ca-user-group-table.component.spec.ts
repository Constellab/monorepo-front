import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaUserGroupTableComponent} from './ca-user-group-table.component';

describe('CaUserGroupTableComponent', () => {
  let component: CaUserGroupTableComponent;
  let fixture: ComponentFixture<CaUserGroupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaUserGroupTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaUserGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
