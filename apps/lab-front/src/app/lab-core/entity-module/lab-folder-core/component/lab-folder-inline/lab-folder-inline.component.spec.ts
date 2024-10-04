import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabFolderInlineComponent } from './lab-folder-inline.component';

describe('LabFolderInlineComponent', () => {
  let component: LabFolderInlineComponent;
  let fixture: ComponentFixture<LabFolderInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabFolderInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabFolderInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
