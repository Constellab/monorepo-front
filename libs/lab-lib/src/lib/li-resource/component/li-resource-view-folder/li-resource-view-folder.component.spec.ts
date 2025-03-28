import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceViewFolderComponent } from './li-resource-view-folder.component';

describe('LabResourceFolderComponent', () => {
  let component: LiResourceViewFolderComponent;
  let fixture: ComponentFixture<LiResourceViewFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewFolderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceViewFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
