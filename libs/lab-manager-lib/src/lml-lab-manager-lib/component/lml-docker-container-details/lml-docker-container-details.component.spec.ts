import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LmlDockerContainerDetailsComponent } from './lml-docker-container-details.component';

describe('CaLabDockerContainerDetailsComponent', () => {
  let component: LmlDockerContainerDetailsComponent;
  let fixture: ComponentFixture<LmlDockerContainerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlDockerContainerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LmlDockerContainerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
