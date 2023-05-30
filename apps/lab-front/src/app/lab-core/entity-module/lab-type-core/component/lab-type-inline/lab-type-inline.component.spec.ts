import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabTypeInlineComponent} from './lab-type-inline.component';

describe('LabTypeInlineComponent', () => {
  let component: LabTypeInlineComponent;
  let fixture: ComponentFixture<LabTypeInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTypeInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabTypeInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
