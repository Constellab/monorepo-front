import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderActionMenuComponent } from './ca-folder-action-menu.component';

describe('CaFolderActionMenuComponent', () => {
  let component: CaFolderActionMenuComponent;
  let fixture: ComponentFixture<CaFolderActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderActionMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
