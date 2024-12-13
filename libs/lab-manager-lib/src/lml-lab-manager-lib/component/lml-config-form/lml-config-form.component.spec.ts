import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlConfigFormComponent } from './lml-config-form.component';

describe('CaLabConfigFormComponent', () => {
  let component: LmlConfigFormComponent;
  let fixture: ComponentFixture<LmlConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlConfigFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
