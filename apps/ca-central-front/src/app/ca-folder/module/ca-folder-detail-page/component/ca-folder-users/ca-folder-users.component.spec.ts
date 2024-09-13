import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderUsersComponent} from './ca-folder-users.component';

describe('CaFolderUsersComponent', () => {
  let component: CaFolderUsersComponent;
  let fixture: ComponentFixture<CaFolderUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
