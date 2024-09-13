import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderDetailInfoComponent } from './ca-folder-detail-info.component';

describe('CaFolderDetailInfoComponent', () => {
  let component: CaFolderDetailInfoComponent;
  let fixture: ComponentFixture<CaFolderDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderDetailInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
