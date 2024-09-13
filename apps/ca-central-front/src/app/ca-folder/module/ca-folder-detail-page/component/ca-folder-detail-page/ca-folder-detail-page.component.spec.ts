import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderDetailPageComponent} from './ca-folder-detail-page.component';

describe('CaFolderDetailPageComponent', () => {
  let component: CaFolderDetailPageComponent;
  let fixture: ComponentFixture<CaFolderDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaFolderDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
