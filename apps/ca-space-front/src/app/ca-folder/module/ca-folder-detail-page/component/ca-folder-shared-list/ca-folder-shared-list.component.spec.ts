import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderSharedListComponent } from './ca-folder-shared-list.component';

describe('CaFolderSharedGroupsListComponent', () => {
  let component: CaFolderSharedListComponent;
  let fixture: ComponentFixture<CaFolderSharedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderSharedListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaFolderSharedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
