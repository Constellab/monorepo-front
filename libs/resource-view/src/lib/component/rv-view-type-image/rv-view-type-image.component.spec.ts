import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RvViewTypeImageComponent } from './rv-view-type-image.component';

describe('RvViewTypeImageComponent', () => {
  let component: RvViewTypeImageComponent;
  let fixture: ComponentFixture<RvViewTypeImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RvViewTypeImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvViewTypeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
