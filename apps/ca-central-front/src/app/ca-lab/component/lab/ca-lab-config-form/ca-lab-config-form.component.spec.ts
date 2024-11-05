import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabConfigFormComponent } from './ca-lab-config-form.component';

describe('CaLabConfigFormComponent', () => {
  let component: CaLabConfigFormComponent;
  let fixture: ComponentFixture<CaLabConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabConfigFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
