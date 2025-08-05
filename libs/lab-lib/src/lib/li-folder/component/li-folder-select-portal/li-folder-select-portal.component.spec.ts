import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiFolderSelectPortalComponent } from './li-folder-select-portal.component';

describe('LiFolderSelectPortalComponent', () => {
  let component: LiFolderSelectPortalComponent;
  let fixture: ComponentFixture<LiFolderSelectPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiFolderSelectPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiFolderSelectPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
