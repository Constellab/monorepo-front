import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceDetailComponent } from './li-resource-detail.component';

describe('LabResourceDetailVComponent', () => {
  let component: LiResourceDetailComponent;
  let fixture: ComponentFixture<LiResourceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
