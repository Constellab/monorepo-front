import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdTypeInlineComponent } from './td-type-inline.component';

describe('TdTypeChipComponent', () => {
  let component: TdTypeInlineComponent;
  let fixture: ComponentFixture<TdTypeInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdTypeInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TdTypeInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
