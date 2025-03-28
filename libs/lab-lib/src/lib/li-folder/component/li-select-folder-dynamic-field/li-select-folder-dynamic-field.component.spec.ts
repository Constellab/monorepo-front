import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSelectFolderDynamicFieldComponent } from './li-select-folder-dynamic-field.component';

describe('LiSelectFolderDynamicFieldComponent', () => {
  let component: LiSelectFolderDynamicFieldComponent;
  let fixture: ComponentFixture<LiSelectFolderDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiSelectFolderDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSelectFolderDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
