import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdTypeIconComponent } from './td-type-icon.component';

describe('TdTypeIconComponent', () => {
  let component: TdTypeIconComponent;
  let fixture: ComponentFixture<TdTypeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdTypeIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TdTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
