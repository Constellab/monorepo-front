import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderSearchFormComponent } from './ca-folder-search-form.component';

describe('CaFolderSearchFormComponent', () => {
  let component: CaFolderSearchFormComponent;
  let fixture: ComponentFixture<CaFolderSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
