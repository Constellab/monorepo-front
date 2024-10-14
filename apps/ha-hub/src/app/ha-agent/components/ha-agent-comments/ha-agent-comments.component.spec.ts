import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaAgentCommentsComponent } from './ha-agent-comments.component';

describe('HaAgentCommentsComponent', () => {
  let component: HaAgentCommentsComponent;
  let fixture: ComponentFixture<HaAgentCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAgentCommentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAgentCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
