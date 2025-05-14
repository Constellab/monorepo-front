import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderUserTableComponent } from './ca-folder-user-table.component';

describe('CaFolderUserTableComponent', () => {
  let component: CaFolderUserTableComponent;
  let fixture: ComponentFixture<CaFolderUserTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaFolderUserTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
