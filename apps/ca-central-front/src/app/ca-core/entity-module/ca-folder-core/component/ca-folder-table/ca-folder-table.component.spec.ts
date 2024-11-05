import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderTableComponent } from './ca-folder-table.component';

describe('CaFolderTableComponent', () => {
  let component: CaFolderTableComponent;
  let fixture: ComponentFixture<CaFolderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
