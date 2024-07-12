import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrProcessInfoComponent } from './pr-process-info.component';

describe('PrNodeInfoComponent', () => {
  let component: PrProcessInfoComponent;
  let fixture: ComponentFixture<PrProcessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrProcessInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrProcessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
