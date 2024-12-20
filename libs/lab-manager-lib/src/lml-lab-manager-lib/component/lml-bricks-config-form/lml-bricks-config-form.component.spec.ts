import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlBricksConfigFormComponent } from './lml-bricks-config-form.component';

describe('CaLabConfigFormComponent', () => {
  let component: LmlBricksConfigFormComponent;
  let fixture: ComponentFixture<LmlBricksConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlBricksConfigFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlBricksConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
