import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabManageEntityTagsDialogComponent } from './lab-manage-entity-tags-dialog.component';

describe('LabAddTagToEntityDialogComponent', () => {
  let component: LabManageEntityTagsDialogComponent;
  let fixture: ComponentFixture<LabManageEntityTagsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabManageEntityTagsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabManageEntityTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
