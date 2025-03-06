import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdConfigureSpecsFormComponent } from './td-configure-specs-form.component';

describe('TdConfigureSpecsFormComponent', () => {
  let component: TdConfigureSpecsFormComponent;
  let fixture: ComponentFixture<TdConfigureSpecsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdConfigureSpecsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TdConfigureSpecsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
