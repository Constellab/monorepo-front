import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabSelectTagValueComponent} from './lab-select-tag-value.component';

describe('LabSelectTagValueComponent', () => {
  let component: LabSelectTagValueComponent;
  let fixture: ComponentFixture<LabSelectTagValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabSelectTagValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabSelectTagValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
