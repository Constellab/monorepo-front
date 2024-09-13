import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabFolderSelectComponent} from './lab-folder-select.component';

describe('LabFolderSelectComponent', () => {
  let component: LabFolderSelectComponent;
  let fixture: ComponentFixture<LabFolderSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabFolderSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabFolderSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
