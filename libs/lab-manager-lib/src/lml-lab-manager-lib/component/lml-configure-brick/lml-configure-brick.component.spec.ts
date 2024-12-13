import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlConfigureBrickComponent } from './lml-configure-brick.component';

describe('LabConfigBrickComponent', () => {
  let component: LmlConfigureBrickComponent;
  let fixture: ComponentFixture<LmlConfigureBrickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlConfigureBrickComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlConfigureBrickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
