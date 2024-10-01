import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabDockerUpFormComponent } from './ca-lab-docker-up-form.component';

describe('CaLabDockerUpFormComponent', () => {
  let component: CaLabDockerUpFormComponent;
  let fixture: ComponentFixture<CaLabDockerUpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaLabDockerUpFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaLabDockerUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
