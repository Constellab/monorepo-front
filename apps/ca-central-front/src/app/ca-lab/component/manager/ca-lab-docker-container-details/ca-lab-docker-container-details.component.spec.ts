import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabDockerContainerDetailsComponent } from './ca-lab-docker-container-details.component';

describe('CaLabDockerContainerDetailsComponent', () => {
  let component: CaLabDockerContainerDetailsComponent;
  let fixture: ComponentFixture<CaLabDockerContainerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabDockerContainerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabDockerContainerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
