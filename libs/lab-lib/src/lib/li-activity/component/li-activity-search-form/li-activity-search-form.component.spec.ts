import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiActivitySearchFormComponent } from './li-activity-search-form.component';

describe('LiActivitySearchFormComponent', () => {
  let component: LiActivitySearchFormComponent;
  let fixture: ComponentFixture<LiActivitySearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiActivitySearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiActivitySearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
