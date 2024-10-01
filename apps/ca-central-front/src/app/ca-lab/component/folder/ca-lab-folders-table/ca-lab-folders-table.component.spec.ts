import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabFoldersTableComponent } from './ca-lab-folders-table.component';

describe('CaLabCaFoldersTableComponent', () => {
  let component: CaLabFoldersTableComponent;
  let fixture: ComponentFixture<CaLabFoldersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabFoldersTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabFoldersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
