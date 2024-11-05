import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabServerComponent } from './ca-lab-server.component';

describe('CaLabServerComponent', () => {
  let component: CaLabServerComponent;
  let fixture: ComponentFixture<CaLabServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabServerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
