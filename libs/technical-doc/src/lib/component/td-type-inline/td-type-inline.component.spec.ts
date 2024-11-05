import { ComponentFixture, TestBed } from '@angular/core/testing';

import { tdTypeInlineComponent } from './td-type-inline.component';

describe('TdTypeChipComponent', () => {
  let component: tdTypeInlineComponent;
  let fixture: ComponentFixture<tdTypeInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [tdTypeInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(tdTypeInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
