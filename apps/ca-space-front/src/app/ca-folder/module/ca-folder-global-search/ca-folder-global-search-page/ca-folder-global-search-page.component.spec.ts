import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderGlobalSearchPageComponent } from './ca-folder-global-search-page.component';

describe('CaFolderGlobalSearchPageComponent', () => {
  let component: CaFolderGlobalSearchPageComponent;
  let fixture: ComponentFixture<CaFolderGlobalSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaFolderGlobalSearchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderGlobalSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
