import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabFolderSelectPortalComponent} from './lab-folder-select-portal.component';

describe('LabFolderSelectPortalComponent', () => {
  let component: LabFolderSelectPortalComponent;
  let fixture: ComponentFixture<LabFolderSelectPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabFolderSelectPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabFolderSelectPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
