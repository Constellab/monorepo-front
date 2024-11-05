import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabNavigableEntityInlineComponent } from './lab-navigable-entity-inline.component';

describe('LabNavigableEntityInlineComponent', () => {
  let component: LabNavigableEntityInlineComponent;
  let fixture: ComponentFixture<LabNavigableEntityInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabNavigableEntityInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabNavigableEntityInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
