import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderDetailComponent } from './ca-folder-detail.component';

describe('CaFolderCardDetailComponent', () => {
  let component: CaFolderDetailComponent;
  let fixture: ComponentFixture<CaFolderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaFolderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
