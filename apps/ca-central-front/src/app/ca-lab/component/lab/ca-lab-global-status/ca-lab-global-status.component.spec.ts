import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabGlobalStatusComponent } from './ca-lab-global-status.component';

describe('CaLabGlobalStatusComponent', () => {
  let component: CaLabGlobalStatusComponent;
  let fixture: ComponentFixture<CaLabGlobalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabGlobalStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabGlobalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
