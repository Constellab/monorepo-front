import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabConfigBrickComponent } from './ca-lab-config-brick.component';

describe('LabConfigBrickComponent', () => {
  let component: CaLabConfigBrickComponent;
  let fixture: ComponentFixture<CaLabConfigBrickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabConfigBrickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabConfigBrickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
