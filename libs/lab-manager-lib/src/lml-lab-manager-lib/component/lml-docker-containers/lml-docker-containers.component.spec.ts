import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlDockerContainersComponent } from './lml-docker-containers.component';

describe('CaLabDockerContainersComponent', () => {
  let component: LmlDockerContainersComponent;
  let fixture: ComponentFixture<LmlDockerContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlDockerContainersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlDockerContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
