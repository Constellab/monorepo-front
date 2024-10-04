import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderSearchComponent} from './ca-folder-search.component';

describe('CaFolderSearchComponent', () => {
  let component: CaFolderSearchComponent;
  let fixture: ComponentFixture<CaFolderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
