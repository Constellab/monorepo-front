import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaBucketLocationInlineComponent} from './ca-bucket-location-inline.component';

describe('CaBucketLocationInlineComponent', () => {
  let component: CaBucketLocationInlineComponent;
  let fixture: ComponentFixture<CaBucketLocationInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaBucketLocationInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaBucketLocationInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
