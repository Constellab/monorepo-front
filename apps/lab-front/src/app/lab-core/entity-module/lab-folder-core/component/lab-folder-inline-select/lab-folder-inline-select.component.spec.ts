import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabFolderInlineSelectComponent} from './lab-folder-inline-select.component';

describe('LabFolderInlineSelectComponent', () => {
  let component: LabFolderInlineSelectComponent;
  let fixture: ComponentFixture<LabFolderInlineSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabFolderInlineSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabFolderInlineSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
