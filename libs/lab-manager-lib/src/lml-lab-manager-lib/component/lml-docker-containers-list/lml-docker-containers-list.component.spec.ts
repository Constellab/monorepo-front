import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlDockerContainersListComponent } from './lml-docker-containers-list.component';

describe('CaLabDockerContainersListComponent', () => {
  let component: LmlDockerContainersListComponent;
  let fixture: ComponentFixture<LmlDockerContainersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlDockerContainersListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlDockerContainersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
