import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabFoldersListComponent } from './ca-lab-folders-list.component';

describe('CaLabCaFoldersListComponent', () => {
  let component: CaLabFoldersListComponent;
  let fixture: ComponentFixture<CaLabFoldersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabFoldersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabFoldersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
