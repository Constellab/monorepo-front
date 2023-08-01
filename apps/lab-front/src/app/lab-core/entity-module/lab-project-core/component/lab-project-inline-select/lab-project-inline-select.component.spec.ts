import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabProjectInlineSelectComponent} from './lab-project-inline-select.component';

describe('LabProjectInlineSelectComponent', () => {
  let component: LabProjectInlineSelectComponent;
  let fixture: ComponentFixture<LabProjectInlineSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabProjectInlineSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabProjectInlineSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
