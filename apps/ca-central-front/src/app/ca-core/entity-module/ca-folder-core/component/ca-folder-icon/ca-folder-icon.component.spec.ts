import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderIconComponent } from './ca-folder-icon.component';

describe('CaFolderIconComponent', () => {
  let component: CaFolderIconComponent;
  let fixture: ComponentFixture<CaFolderIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
