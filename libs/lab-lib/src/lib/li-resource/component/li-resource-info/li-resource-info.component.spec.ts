import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceInfoComponent } from './li-resource-info.component';

describe('LiResourceInfoComponent', () => {
  let component: LiResourceInfoComponent;
  let fixture: ComponentFixture<LiResourceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
