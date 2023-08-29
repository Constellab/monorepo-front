import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaProjectActivityPageComponent} from './ca-project-activity-page.component';

describe('CaProjectActivityPageComponent', () => {
  let component: CaProjectActivityPageComponent;
  let fixture: ComponentFixture<CaProjectActivityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaProjectActivityPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaProjectActivityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
