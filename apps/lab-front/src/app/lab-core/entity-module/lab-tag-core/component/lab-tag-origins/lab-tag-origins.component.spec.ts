import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTagOriginsComponent } from './lab-tag-origins.component';

describe('LabTagOriginsComponent', () => {
  let component: LabTagOriginsComponent;
  let fixture: ComponentFixture<LabTagOriginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTagOriginsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabTagOriginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
