import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlDockerUpFormComponent } from './lml-docker-up-form.component';

describe('CaLabDockerUpFormComponent', () => {
  let component: LmlDockerUpFormComponent;
  let fixture: ComponentFixture<LmlDockerUpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlDockerUpFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlDockerUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
