import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaFolderActionsMenuComponent} from './ca-folder-actions-menu.component';

describe('CaFolderActionsMenuComponent', () => {
  let component: CaFolderActionsMenuComponent;
  let fixture: ComponentFixture<CaFolderActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaFolderActionsMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
