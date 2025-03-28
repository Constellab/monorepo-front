import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceViewSpecCardComponent } from './li-resource-view-spec-card.component';

describe('LiResourceViewSpecCardComponent', () => {
  let component: LiResourceViewSpecCardComponent;
  let fixture: ComponentFixture<LiResourceViewSpecCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewSpecCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceViewSpecCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
