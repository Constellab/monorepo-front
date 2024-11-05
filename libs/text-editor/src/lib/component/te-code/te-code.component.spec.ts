import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeCodeComponent } from './te-code.component';

describe('TeCodeComponent', () => {
  let component: TeCodeComponent;
  let fixture: ComponentFixture<TeCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeCodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
