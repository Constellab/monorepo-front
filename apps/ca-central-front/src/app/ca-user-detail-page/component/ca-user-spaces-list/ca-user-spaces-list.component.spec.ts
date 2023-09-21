import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaUserSpacesListComponent} from './ca-user-spaces-list.component';

describe('CaUserSpacesListComponent', () => {
  let component: CaUserSpacesListComponent;
  let fixture: ComponentFixture<CaUserSpacesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaUserSpacesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaUserSpacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
